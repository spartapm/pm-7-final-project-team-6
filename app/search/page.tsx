"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { SiteShell } from "@/components/chrome";
import { useStore } from "@/lib/store";

function SearchInner() {
  const q = (useSearchParams().get("q") || "").trim();
  const { articles } = useStore();
  const needle = q.toLowerCase();
  const hits = q
    ? articles.filter((a) => {
        const hay = [
          a.title,
          a.dek,
          a.category,
          a.lead,
          a.heroQuote,
          ...a.sections.map((s) => `${s.heading} ${s.body}`),
        ]
          .join(" ")
          .toLowerCase();
        return hay.includes(needle);
      })
    : [];

  return (
    <SiteShell>
      <div className="section">
        <div className="wrap">
          <h3>검색 결과 {q ? `· “${q}”` : ""}</h3>
          {hits.length === 0 ? (
            <div className="empty">검색 결과가 없습니다. 제목·본문 키워드로 다시 검색해 보세요.</div>
          ) : (
            <div className="cards">
              {hits.map((a) => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </SiteShell>
  );
}

export default function SearchPage() {
  return (
    <Suspense>
      <SearchInner />
    </Suspense>
  );
}
