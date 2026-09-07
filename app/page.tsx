"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer, SubNav, TopBar } from "@/components/chrome";
import { HOME_CARD_IDS } from "@/lib/data";
import { useStore } from "@/lib/store";

function HomeInner() {
  const cat = useSearchParams().get("cat") || "";
  const { articles } = useStore();
  const published = articles.filter((a) => a.published);
  const featured = articles.find((a) => a.id === "chaekeup") ?? articles[0];
  const filtered = cat ? published.filter((a) => a.category === cat) : published;
  const extras = filtered.filter((a) => !["chaekeup", ...HOME_CARD_IDS].includes(a.id as never));
  const cards = cat
    ? []
    : HOME_CARD_IDS.map((id) => filtered.find((a) => a.id === id)).filter(Boolean);
  const grid = cat ? filtered : [...extras, ...cards.filter(Boolean)];

  return (
    <div className="site">
      <TopBar />
      <section className="hero">
        <SubNav onHero />
        <div className="hero-body">
          <div className="hero-quote">
            <p>쾌락은 필요하지만 정신적, 경제적, 시간적 부담을 느끼긴 싫어요</p>
          </div>
          <div className="hero-visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img className="pink-photo" src="/hero-pink.png" alt="PINK VIBES ONLY" />
          </div>
          {featured ? (
            <Link className="hero-side" href={`/articles/${featured.id}`}>
              <span className="trend-chip"># 라이프스타일 트렌드</span>
              <h2>
                과몰입의 시대는 끝났다.
                <br />
                새로운 라이프스타일, 책없쾌.
              </h2>
            </Link>
          ) : null}
        </div>
      </section>
      <section className="section">
        <div className="wrap">
          <h3>{cat ? `${cat} 콘텐츠` : "최신 콘텐츠"}</h3>
          {grid.length === 0 ? (
            <div className="empty">
              <strong>이 카테고리의 콘텐츠가 없습니다</strong>
              다른 카테고리를 선택해 보세요.
            </div>
          ) : (
            <div className="cards">
              {grid.map((a) => (a ? <ArticleCard key={a.id} article={a} /> : null))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense>
      <HomeInner />
    </Suspense>
  );
}
