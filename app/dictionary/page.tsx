"use client";

import Link from "next/link";
import { SiteShell } from "@/components/chrome";
import { DICTIONARY } from "@/lib/data";

export default function DictionaryPage() {
  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap">
          <p className="kicker">캐릿</p>
          <h1>요즘어 사전</h1>
          <p className="lede">
            캐릿 콘텐츠에서 나온 요즘 말을 풀어 둡니다. 단어를 누르면 원문 아티클로 이동합니다.
          </p>
          <div className="dict-list">
            {DICTIONARY.map((d) => (
              <Link key={d.term} href={`/articles/${d.articleId}`} className="dict-card">
                <div className="dict-term">
                  <b>{d.term}</b>
                  <span>{d.reading}</span>
                </div>
                <em>{d.cat}</em>
                <p>{d.def}</p>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
