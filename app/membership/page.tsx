"use client";

import { SiteShell } from "@/components/chrome";
import { useStore } from "@/lib/store";

export default function MembershipPage() {
  const { hydrated, prefs, name, upgradePlan, showToast } = useStore();

  if (!hydrated) return null;

  const plus = prefs.plan === "plus";

  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap narrow">
          <p className="kicker">계정</p>
          <h1>멤버십 관리</h1>
          <p className="lede">{name}님의 현재 플랜입니다. 플러스는 2,000P 또는 PLUS30 쿠폰으로 올릴 수 있습니다.</p>
          <div className={`plan-card${plus ? " plus" : ""}`}>
            <span>{plus ? "Careet Plus" : "Careet Free"}</span>
            <h2>{plus ? "캐릿 플러스" : "무료 멤버십"}</h2>
            <ul>
              <li>아티클 · 나의 투두 · 밑줄 노트</li>
              <li>트렌드 레터 구독</li>
              <li className={plus ? "" : "off"}>전광판 주간 브리프 PDF</li>
              <li className={plus ? "" : "off"}>쿠폰 멤버십 할인</li>
            </ul>
            {plus ? (
              <p className="ok">플러스가 적용 중입니다.</p>
            ) : (
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  const err = upgradePlan();
                  if (err) showToast(err);
                }}
              >
                2,000P로 플러스 업그레이드 · 보유 {prefs.points.toLocaleString()}P
              </button>
            )}
          </div>
        </div>
      </div>
    </SiteShell>
  );
}
