"use client";

import Link from "next/link";
import { IconBookmark } from "./icons";
import type { Article } from "@/lib/types";

export function ArticleCard({ article, staticPreview }: { article: Article; staticPreview?: boolean }) {
  if (article.cover && !staticPreview) {
    return (
      <Link href={`/articles/${article.id}`} className="card cover-card">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={article.cover} alt={article.title} />
      </Link>
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
          <span className="meta-spacer" aria-hidden>
            <IconBookmark />
          </span>
        </div>
      </div>
    </>
  );

  if (staticPreview) return <div className="card">{inner}</div>;
  return (
    <Link href={`/articles/${article.id}`} className="card">
      {inner}
    </Link>
  );
}
