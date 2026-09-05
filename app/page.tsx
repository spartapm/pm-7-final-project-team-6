"use client";

import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { Footer, SubNav, TopBar } from "@/components/chrome";
import { HOME_CARD_IDS } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function HomePage() {
  const { articles } = useStore();
  const featured = articles.find((a) => a.id === "chaekeup") ?? articles[0];
  const cards = HOME_CARD_IDS.map((id) => articles.find((a) => a.id === id)).filter(Boolean);
  const extras = articles.filter(
    (a) => a.published && !["chaekeup", ...HOME_CARD_IDS].includes(a.id as never),
  );

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
          <h3>최신 콘텐츠</h3>
          <div className="cards">
            {extras.map((a) => (
              <ArticleCard key={a.id} article={a} />
            ))}
            {cards.map((a) => (a ? <ArticleCard key={a.id} article={a} /> : null))}
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
