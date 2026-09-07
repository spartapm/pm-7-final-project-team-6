"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MouseEvent } from "react";
import { IconBookmark } from "./icons";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";

export function ArticleCard({ article, staticPreview }: { article: Article; staticPreview?: boolean }) {
  const router = useRouter();
  const { loggedIn, toggleSave, isSaved, showToast } = useStore();
  const saved = isSaved(article.id);

  const onBookmark = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!loggedIn) {
      router.push("/login");
      return;
    }
    toggleSave(article.id);
    showToast(saved ? "저장을 해제했습니다" : "콘텐츠를 저장했습니다");
  };

  const saveBtn = staticPreview ? null : (
    <button
      className={`card-save${article.cover ? " on-cover" : ""}${saved ? " on" : ""}`}
      type="button"
      aria-label={saved ? "저장 해제" : "콘텐츠 저장"}
      onClick={onBookmark}
    >
      <IconBookmark filled={saved} />
    </button>
  );

  if (article.cover && !staticPreview) {
    return (
      <div className="card cover-card">
        <Link href={`/articles/${article.id}`}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.cover} alt={article.title} />
        </Link>
        {saveBtn}
      </div>
    );
  }

  const inner = (
    <>
      <div
        className={`thumb ${article.cardTone}${article.thumbnail ? " has-img" : ""}`}
        style={article.thumbnail ? { backgroundImage: `url(${article.thumbnail})` } : undefined}
      >
        <span className="tag">TREND</span>
        <div className="eyebrow">{article.cardEyebrow}</div>
        <div className="line">{article.cardLine}</div>
      </div>
      <div className="card-body">
        <p>{article.dek}</p>
        <div className="card-meta">
          {article.label ? <span className="badge">{article.label}</span> : null}
          <span>{article.date}</span>
          <span className="meta-spacer" aria-hidden />
        </div>
      </div>
    </>
  );

  if (staticPreview) return <div className="card">{inner}</div>;
  return (
    <div className="card">
      <Link href={`/articles/${article.id}`} className="card-hit">
        {inner}
      </Link>
      {saveBtn}
    </div>
  );
}
