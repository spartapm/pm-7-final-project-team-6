"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { COUPON_CATALOG } from "@/lib/data";
import { useStore } from "@/lib/store";

export default function CouponsPage() {
  const router = useRouter();
  const { hydrated, loggedIn, prefs, redeemCoupon, showToast } = useStore();
  const [code, setCode] = useState("");

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/login");
  }, [hydrated, loggedIn, router]);

  if (!loggedIn) return null;

  const submit = (e: FormEvent) => {
    e.preventDefault();
    const err = redeemCoupon(code);
    if (err) showToast(err);
    else setCode("");
  };

  return (
    <SiteShell>
      <div className="catalog">
        <div className="wrap narrow">
          <p className="kicker">계정</p>
          <h1>쿠폰 등록</h1>
          <p className="lede">코드를 입력하면 포인트·플러스·할인 혜택이 계정에 붙습니다.</p>
          <form className="coupon-form" onSubmit={submit}>
            <input
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="쿠폰 코드"
              aria-label="쿠폰 코드"
            />
            <button className="btn primary" type="submit">
              등록
            </button>
          </form>
          <p className="hint-codes">체험 코드: {COUPON_CATALOG.map((c) => c.code).join(" · ")}</p>
          <h2 className="subhead">등록한 쿠폰</h2>
          {prefs.coupons.length === 0 ? (
            <div className="empty">아직 등록한 쿠폰이 없습니다.</div>
          ) : (
            <ul className="coupon-list">
              {prefs.coupons.map((c) => (
                <li key={c.id}>
                  <b>{c.code}</b>
                  <span>{c.title}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </SiteShell>
  );
}
