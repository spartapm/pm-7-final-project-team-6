"use client";

import Link from "next/link";
import { MouseEvent } from "react";
import { IconBookmark } from "./icons";
import { formatDotDate } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";

export function ArticleCard({ article, staticPreview }: { article: Article; staticPreview?: boolean }) {
  const { toggleSave, isSaved, showToast } = useStore();
  const saved = isSaved(article.id);

  const onBookmark = (e: MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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

  const visitDate = formatDotDate(Date.now());

  if (article.cover && !staticPreview) {
    return (
      <div className="card cover-card">
        <Link href={`/articles/${article.id}`} aria-label={article.title}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={article.cover} alt={article.title} />
        </Link>
        <span className="cover-date">{visitDate}</span>
        {saveBtn}
      </div>
    );
  }

  const face = (
    <div className={`editorial-face ${article.cardTone}`}>
      <span className="tag">TREND</span>
      <div className="editorial-copy">
        <div className="eyebrow">{article.cardEyebrow}</div>
        <div className="line">{article.cardLine}</div>
      </div>
      <div className="editorial-foot">
        <p>{article.dek}</p>
        <div className="card-meta">
          {article.label ? <span className="badge">{article.label}</span> : null}
          <span>{visitDate}</span>
        </div>
      </div>
    </div>
  );

  if (staticPreview) {
    return (
      <div className="card editorial-card static">
        {face}
      </div>
    );
  }

  return (
    <div className="card editorial-card">
      <Link href={`/articles/${article.id}`} className="card-hit">
        {face}
      </Link>
      {saveBtn}
    </div>
  );
}
