"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { SiteShell } from "@/components/chrome";
import { TodoLayer } from "@/components/TodoLayer";
import { useStore } from "@/lib/store";
import type { ArticleVisual } from "@/lib/types";

function ArticleVisualBlock({ visual, caption, compact }: { visual: ArticleVisual; caption?: string; compact?: boolean }) {
  return (
    <figure className={`article-visual tone-${visual.tone}${compact ? " compact" : ""}`}>
      <span>{visual.kicker}</span>
      <strong>{visual.title}</strong>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}

export default function ArticlePage() {
  const { id } = useParams<{ id: string }>();
  const { articles, markRead } = useStore();
  const article = articles.find((a) => a.id === id);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (article) markRead(article.id);
  }, [article, markRead]);

  if (!article) {
    return (
      <SiteShell>
        <div className="placeholder">
          <h1>콘텐츠를 찾을 수 없습니다</h1>
          <Link href="/">홈으로</Link>
        </div>
      </SiteShell>
    );
  }

  return (
    <SiteShell>
      <div className="article-page">
        <div className="article" style={{ zoom: scale }}>
          <Link href="/" className="back">
            ‹ 홈으로
          </Link>
          <span className="cat-pill">{article.category}</span>
          {article.bodyImages?.length ? (
            <div className="article-figs">
              {article.bodyImages.map((src) => (
                <figure key={src} className="article-fig">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={src} alt="" />
                </figure>
              ))}
            </div>
          ) : (
            <>
              <h1>{article.titleBreak}</h1>
              <p className="byline">
                {article.date} · {article.author}
              </p>
            </>
          )}
          {article.sections.length > 0 ? (
            <div className="toc">
              <div className="toc-h">목차</div>
              <div className="toc-b">
                {article.sections.map((s) => (
                  <a key={s.id} href={`#${s.id}`}>
                    {s.heading}
                  </a>
                ))}
              </div>
            </div>
          ) : null}
          {article.lead ? <p className="lead">{article.lead}</p> : null}
          {article.heroQuote ? (
            <div className="quote">
              <i />
              <div>
                <p>“{article.heroQuote}”</p>
              </div>
            </div>
          ) : null}
          {article.id === "chaekeup" ? (
            <div className="def-box">
              <b>책없쾌</b> 책임 없는 쾌락의 줄임말. 돈·시간·감정을 많이 쓰지 않고도 기분 전환이 되는 경험.
            </div>
          ) : null}
          {article.sections.map((s) => (
            <section key={s.id} id={s.id}>
              <h2>{s.heading}</h2>
              {s.visual ? <ArticleVisualBlock visual={s.visual} caption={s.caption} /> : null}
              <p className="body">{s.body}</p>
              {s.visuals?.length ? (
                <div className={`article-visual-grid cols-${Math.min(s.visuals.length, 3)}`}>
                  {s.visuals.map((v) => (
                    <ArticleVisualBlock key={v.title} visual={v} compact />
                  ))}
                </div>
              ) : null}
            </section>
          ))}
        </div>
      </div>
      <TodoLayer
        article={article}
        scale={scale}
        onCycleScale={() => setScale((s) => (s === 1 ? 1.12 : s === 1.12 ? 1.24 : 1))}
      />
    </SiteShell>
  );
}
