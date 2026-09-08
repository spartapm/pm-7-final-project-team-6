"use client";

import Link from "next/link";
import { SiteShell } from "@/components/chrome";

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="catalog about">
        <div className="wrap">
          <p className="kicker">캐릿</p>
          <h1>트렌드를 읽고, 바로 실행합니다</h1>
          <p className="lede">
            캐릿은 1020 트렌드를 실무 언어로 풀어 주는 미디어입니다. 이 웹은 아티클에서 나온 행동을
            ‘나의 투두’로 옮겨, 읽고 끝내지 않고 한 주 안에 착수하게 만듭니다.
          </p>
          <div className="about-grid">
            <section>
              <h2>읽는 층</h2>
              <p>
                요즘어 사전, 뉴스클리핑, 이슈 캘린더, 마이크로 트렌드 전광판으로 키워드를 먼저 잡고
                본문으로 들어갑니다. 콘텐츠 보기에서 카테고리를 고를 수 있습니다.
              </p>
            </section>
            <section>
              <h2>실행 층</h2>
              <p>
                아티클 오른쪽 레일에서 투두를 담고, 밑줄 노트에 문장을 남기고, 북마크로 다시 찾습니다.
                상단 게이지가 나의 투두 진척을 보여 줍니다.
              </p>
            </section>
            <section>
              <h2>계정</h2>
              <p>
                이메일 로그인(데모는 demo) 후 멤버십·쿠폰·포인트를 쓰고, 트렌드 레터를 구독할 수
                있습니다. 투두·노트·저장은 이 브라우저에 남고, 에디터 계정만 클라우드와 맞춥니다.
              </p>
            </section>
          </div>
          <div className="about-links">
            <Link href="/dictionary">요즘어 사전</Link>
            <Link href="/clipping">뉴스클리핑</Link>
            <Link href="/calendar">이슈 캘린더</Link>
            <Link href="/billboard">전광판</Link>
            <Link href="/login">로그인</Link>
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
