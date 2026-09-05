"use client";

import { SiteShell } from "@/components/chrome";

export default function AboutPage() {
  return (
    <SiteShell>
      <div className="placeholder wrap">
        <h1>캐릿 소개</h1>
        <p>
          캐릿은 1020 트렌드를 읽고 실무에 바로 쓰는 미디어입니다.
          <br />
          이번 MVP는 아티클에서 나온 행동을 ‘나의 투두’로 옮겨 실행까지 연결합니다.
        </p>
      </div>
    </SiteShell>
  );
}
