import { GA_MEASUREMENT_ID } from "./ga-id";
import { DONE_ID, FOLDER_SUGGESTIONS, UNSORTED_ID } from "./zip";
import type { UserTodo } from "./types";

export { GA_MEASUREMENT_ID };

export type FolderNameSource = "direct_input" | "recommended";

export const RECOMMENDED_LABEL: Record<(typeof FOLDER_SUGGESTIONS)[number], string> = {
  "SNS 콘텐츠 소재": "sns_content",
  "시즌·프로모션 캘린더": "season_promotion_calendar",
  "캠페인 기획 아이디어": "campaign_idea",
  "경쟁사 벤치마킹": "competitor_benchmarking",
};

type GaParam = string | number | boolean;
type GaParams = Record<string, GaParam>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

let tipCardOpen = false;
const autoCardViews = new Set<string>();
const scrollCompletes = new Set<string>();

export function setTipCardOpen(open: boolean) {
  tipCardOpen = open;
}

export function isTipCardOpen() {
  return tipCardOpen;
}

export function markAutoCardView(contentId: string) {
  if (autoCardViews.has(contentId)) return false;
  autoCardViews.add(contentId);
  return true;
}

export function markScrollComplete(contentId: string) {
  if (scrollCompletes.has(contentId)) return false;
  scrollCompletes.add(contentId);
  return true;
}

export function resetArticleAnalytics(contentId: string) {
  autoCardViews.delete(contentId);
  scrollCompletes.delete(contentId);
}

export function charLen(value: string) {
  return [...value].length;
}

export function analyticsFolderId(folderId?: string, done?: boolean) {
  const id = folderId || (done ? DONE_ID : UNSORTED_ID);
  if (id === DONE_ID) return "default_done";
  if (id === UNSORTED_ID) return "default_unsorted";
  return id;
}

export function sourceTipId(tipId: string) {
  return tipId.startsWith("saved_") ? tipId.slice("saved_".length) : tipId;
}

export function recommendedLabel(name: string) {
  const hit = FOLDER_SUGGESTIONS.find((s) => s === name);
  return hit ? RECOMMENDED_LABEL[hit] : undefined;
}

export function folderCountAfter(customCount: number) {
  return customCount + 2;
}

export function savedTipParams(tip: UserTodo): GaParams {
  const params: GaParams = {
    tip_id: tip.id,
    source_tip_id: sourceTipId(tip.id),
    folder_id: analyticsFolderId(tip.folderId, tip.done),
  };
  if (tip.sourceArticleId) params.content_id = tip.sourceArticleId;
  return params;
}

function compact(params: GaParams): GaParams {
  const out: GaParams = {};
  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) continue;
    if (typeof value === "string" && value.length === 0) continue;
    out[key] = value;
  }
  return out;
}

function withGtag(fn: (gtag: NonNullable<Window["gtag"]>) => void) {
  if (typeof window === "undefined") return;
  if (window.gtag) {
    fn(window.gtag);
    return;
  }
  let tries = 0;
  const timer = window.setInterval(() => {
    tries += 1;
    if (window.gtag) {
      window.clearInterval(timer);
      fn(window.gtag);
      return;
    }
    if (tries > 50) window.clearInterval(timer);
  }, 100);
}

export function track(event: string, params: GaParams = {}, opts?: { beacon?: boolean }) {
  const payload = compact(params);
  if (opts?.beacon) payload.transport_type = "beacon";
  if (process.env.NODE_ENV === "development") {
    console.debug("[ga]", event, payload);
  }
  withGtag((gtag) => {
    gtag("event", event, payload);
  });
}

async function hashUserId(accountId: string) {
  if (typeof crypto !== "undefined" && crypto.subtle) {
    const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(accountId));
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 32);
  }
  let hash = 2166136261;
  for (let i = 0; i < accountId.length; i += 1) {
    hash ^= accountId.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return `u${(hash >>> 0).toString(16)}`;
}

export function setGaUserId(accountId: string | null) {
  if (!accountId) {
    withGtag((gtag) => {
      gtag("set", { user_id: "" });
      gtag("config", GA_MEASUREMENT_ID, { user_id: "" });
    });
    return;
  }
  void hashUserId(accountId).then((userId) => {
    withGtag((gtag) => {
      gtag("set", { user_id: userId });
      gtag("config", GA_MEASUREMENT_ID, { user_id: userId });
    });
  });
}

export function isAnalyticsTip(id: string) {
  return Boolean(id) && !id.startsWith("tour-");
}
