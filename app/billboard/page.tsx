"use client";

import Link from "next/link";
import { SiteShell } from "@/components/chrome";
import { BILLBOARD } from "@/lib/data";

export default function BillboardPage() {
  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap">
          <p className="kicker">캐릿</p>
          <h1>마이크로 트렌드 전광판</h1>
          <p className="lede">커뮤니티에서 2~6주 반짝하는 신호를 순위대로 보여 줍니다. 키워드를 누르면 관련 글입니다.</p>
          <div className="board">
            {BILLBOARD.map((row) => (
              <Link key={row.word} href={`/articles/${row.articleId}`} className="board-row">
                <b className="rank">{row.rank}</b>
                <div className="board-main">
                  <strong>{row.word}</strong>
                  <span className={row.delta.startsWith("-") ? "down" : "up"}>{row.delta}</span>
                  <div className="heat">
                    <i style={{ width: `${row.heat}%` }} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
