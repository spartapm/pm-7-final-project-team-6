"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { useStore } from "@/lib/store";

export default function PointsPage() {
  const router = useRouter();
  const { hydrated, loggedIn, prefs, claimDailyPoints, showToast } = useStore();

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/login");
  }, [hydrated, loggedIn, router]);

  if (!loggedIn) return null;

  const today = new Date().toISOString().slice(0, 10);
  const claimed = prefs.lastPointClaim === today;

  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap narrow">
          <p className="kicker">계정</p>
          <h1>포인트 받기</h1>
          <p className="lede">출석 100P, 트렌드 레터 첫 구독 50P, TREND2026 쿠폰 500P로 모을 수 있습니다.</p>
          <div className="points-hero">
            <span>보유 포인트</span>
            <strong>{prefs.points.toLocaleString()}P</strong>
          </div>
          <button
            className="btn primary"
            type="button"
            disabled={claimed}
            onClick={() => {
              const err = claimDailyPoints();
              if (err) showToast(err);
            }}
          >
            {claimed ? "오늘은 이미 받았습니다" : "오늘 출석하고 100P 받기"}
          </button>
          <ul className="point-ways">
            <li>매일 1회 출석 · 100P</li>
            <li>트렌드 레터 첫 구독 · 50P</li>
            <li>쿠폰 TREND2026 · 500P</li>
            <li>캐릿 플러스 업그레이드 · 2,000P 사용</li>
          </ul>
        </div>
      </div>
    </SiteShell>
  );
}
