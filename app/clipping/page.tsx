"use client";

import Link from "next/link";
import { SiteShell } from "@/components/chrome";
import { CLIPPINGS } from "@/lib/data";

export default function ClippingPage() {
  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap">
          <p className="kicker">GNB</p>
          <h1>뉴스클리핑</h1>
          <p className="lede">에디터가 고른 한 주 브리프입니다. 제목을 누르면 관련 아티클로 이어집니다.</p>
          <div className="clip-list">
            {CLIPPINGS.map((c) => (
              <Link key={c.title} href={`/articles/${c.articleId}`} className="clip-card">
                <div className="clip-meta">
                  <span>{c.date}</span>
                  <span>{c.source}</span>
                </div>
                <h2>{c.title}</h2>
                <p>{c.summary}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
