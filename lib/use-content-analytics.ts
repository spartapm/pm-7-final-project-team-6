"use client";

import { useEffect, useRef, type RefObject } from "react";
import { isTipCardOpen, markScrollComplete, resetArticleAnalytics, track } from "./analytics";

const visits = new Map<string, number>();

function isExternalHref(href: string) {
  try {
    const url = new URL(href, window.location.href);
    return url.origin !== window.location.origin;
  } catch {
    return false;
  }
}

export function useContentAnalytics({
  contentId,
  hasTip,
  bodyRef,
}: {
  contentId: string;
  hasTip: boolean;
  bodyRef: RefObject<HTMLElement | null>;
}) {
  const exitFired = useRef(false);
  const scrollFired = useRef(false);
  const contentIdRef = useRef(contentId);
  const hasTipRef = useRef(hasTip);
  contentIdRef.current = contentId;
  hasTipRef.current = hasTip;

  const fireExit = (exitType: string) => {
    if (exitFired.current) return;
    const id = contentIdRef.current;
    if (!id) return;
    exitFired.current = true;
    const params: Record<string, string | boolean> = {
      content_id: id,
      exit_type: exitType,
    };
    if (hasTipRef.current) params.card_open_at_exit = isTipCardOpen();
    track("content_exit", params, { beacon: true });
    resetArticleAnalytics(id);
  };

  useEffect(() => {
    if (!contentId) return;
    exitFired.current = false;
    scrollFired.current = false;
    const gen = (visits.get(contentId) ?? 0) + 1;
    visits.set(contentId, gen);
    if (gen === 1) {
      track("content_view", { content_id: contentId, has_tip: hasTip });
    }

    const onPop = () => fireExit("back");
    const onHide = () => {
      if (document.visibilityState === "hidden") fireExit("close");
    };
    const onPageHide = () => fireExit("close");
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement | null)?.closest?.("a");
      if (!a) return;
      const href = a.getAttribute("href");
      if (!href) return;
      if (a.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      if (isExternalHref(href)) fireExit("external_navigation");
    };

    window.addEventListener("popstate", onPop);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onPageHide);
    document.addEventListener("click", onClick, true);

    return () => {
      window.removeEventListener("popstate", onPop);
      document.removeEventListener("visibilitychange", onHide);
      window.removeEventListener("pagehide", onPageHide);
      document.removeEventListener("click", onClick, true);
      window.setTimeout(() => {
        if (visits.get(contentId) !== gen) return;
        visits.delete(contentId);
        fireExit("internal_navigation");
      }, 80);
    };
  }, [contentId, hasTip]);

  useEffect(() => {
    if (!contentId) return;
    const root = bodyRef.current;
    const mark = root?.querySelector(".article-scroll-mark");
    const target = (mark as HTMLElement | null) ?? root;
    if (!target) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (scrollFired.current) return;
        if (!entries.some((entry) => entry.isIntersecting)) return;
        if (!markScrollComplete(contentId)) return;
        scrollFired.current = true;
        track("content_scroll_complete", { content_id: contentId });
      },
      { threshold: 0 },
    );
    io.observe(target);
    return () => io.disconnect();
  }, [bodyRef, contentId]);
}
