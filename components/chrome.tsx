"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useEffect, useRef, useState } from "react";
import { CATEGORIES, GNB, MENU_ITEMS } from "@/lib/data";
import { progressOf, useStore } from "@/lib/store";
import { IconProfile, IconSearch } from "./icons";

export function TopBar() {
  const { todos, hydrated } = useStore();
  const router = useRouter();
  const { done, total, pct } = progressOf(todos);
  const idle = !hydrated || total === 0 || pct === 0;

  return (
    <header className="topbar">
      <nav className="gnb">
        {GNB.map((g) => (
          <Link key={g.label} href={g.href}>
            {g.label}
          </Link>
        ))}
      </nav>
      <button className="gauge-wrap" type="button" onClick={() => router.push("/me")}>
        <span className="label">
          나의 투두{" "}
          <b className="frac">{hydrated ? `${done}/${total}` : ""}</b>
        </span>
        <div className={`track${idle ? " idle" : ""}`} title={`${pct}%`}>
          <i style={{ width: `${pct}%` }} />
        </div>
        <span className="gauge-go" aria-hidden>
          ›
        </span>
      </button>
    </header>
  );
}

function SubNavInner({ onHero = false }: { onHero?: boolean }) {
  const { loggedIn, logout, email, prefs, isEditor, subscribeLetter, unsubscribeLetter } = useStore();
  const [open, setOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState(false);
  const [letterOpen, setLetterOpen] = useState(false);
  const [letterEmail, setLetterEmail] = useState("");
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const viewRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();
  const cat = useSearchParams().get("cat") || "";

  useEffect(() => {
    setOpen(false);
    setViewOpen(false);
  }, [pathname, cat]);

  useEffect(() => {
    setLetterEmail(prefs.letterEmail || email);
  }, [prefs.letterEmail, email]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (!ref.current?.contains(t)) setOpen(false);
      if (!viewRef.current?.contains(t)) setViewOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const onSearch = (e: FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;
    router.push(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className={`subnav${onHero ? " on-hero" : ""}`}>
      <div className="sub-left">
        <div ref={viewRef} className="chip-wrap">
          <button className="chip" type="button" onClick={() => setViewOpen((v) => !v)}>
            {cat || "콘텐츠 보기"} <span>▾</span>
          </button>
          {viewOpen ? (
            <div className="view-pop">
              <Link href="/" className={!cat ? "on" : undefined} onClick={() => setViewOpen(false)}>
                전체
              </Link>
              {CATEGORIES.map((c) => (
                <Link
                  key={c}
                  href={`/?cat=${encodeURIComponent(c)}`}
                  className={cat === c ? "on" : undefined}
                  onClick={() => setViewOpen(false)}
                >
                  {c}
                </Link>
              ))}
            </div>
          ) : null}
        </div>
        <button className="letter" type="button" onClick={() => setLetterOpen(true)}>
          트렌드 레터{prefs.letter ? " · 구독중" : ""}
        </button>
      </div>
      <Link href="/" className="logo">
        Careet
      </Link>
      <div className="sub-right">
        <form className="search" onSubmit={onSearch}>
          <button type="submit" className="ghost" aria-label="검색 실행">
            <IconSearch />
          </button>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어를 입력해 보세요"
            aria-label="검색"
          />
        </form>
        <div ref={ref} style={{ position: "relative" }}>
          <button
            className="icon-btn"
            type="button"
            aria-label="프로필"
            onClick={() => setOpen((v) => !v)}
          >
            <IconProfile />
          </button>
          {open ? (
            <div className="profile-pop">
              {MENU_ITEMS.map((item) =>
                !loggedIn && item.id === "edit" ? (
                  <span key={item.id} className="locked">
                    {item.label}
                  </span>
                ) : (
                  <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ),
              )}
              {isEditor ? (
                <Link href="/admin/write" onClick={() => setOpen(false)}>
                  아티클 작성
                </Link>
              ) : null}
              <div className="sep" />
              {loggedIn ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setOpen(false);
                    router.push("/");
                  }}
                >
                  로그아웃
                </button>
              ) : (
                <Link href="/login" onClick={() => setOpen(false)}>
                  로그인
                </Link>
              )}
            </div>
          ) : null}
        </div>
      </div>
      {letterOpen ? (
        <div
          className="dim"
          onClick={(e) => {
            if (e.target === e.currentTarget) setLetterOpen(false);
          }}
        >
          <div className="modal letter-modal" onClick={(e) => e.stopPropagation()}>
            <h2>트렌드 레터</h2>
            <p>매주 마이크로 트렌드와 실행 투두를 메일로 받습니다. 첫 구독 시 50P가 적립됩니다.</p>
            <label className="letter-label">
              수신 이메일
              <input
                type="email"
                value={letterEmail}
                onChange={(e) => setLetterEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </label>
            <div className="row">
              {prefs.letter ? (
                <button className="btn ghost" type="button" onClick={() => unsubscribeLetter()}>
                  구독 해지
                </button>
              ) : null}
              <button
                className="btn primary"
                type="button"
                onClick={() => {
                  subscribeLetter(letterEmail);
                  setLetterOpen(false);
                }}
              >
                {prefs.letter ? "이메일 변경" : "구독하기"}
              </button>
            </div>
            <button className="ghost letter-close" type="button" onClick={() => setLetterOpen(false)}>
              닫기
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export function SubNav({ onHero = false }: { onHero?: boolean }) {
  return (
    <Suspense
      fallback={
        <div className={`subnav${onHero ? " on-hero" : ""}`}>
          <div className="sub-left">
            <button className="chip" type="button">
              콘텐츠 보기 <span>▾</span>
            </button>
            <button className="letter" type="button">
              트렌드 레터
            </button>
          </div>
          <Link href="/" className="logo">
            Careet
          </Link>
        </div>
      }
    >
      <SubNavInner onHero={onHero} />
    </Suspense>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <strong>Careet</strong>
        트렌드를 읽으세요. 새로움을 만드세요.
        <br />
        캐릿 · 아티클에서 투두까지
      </div>
    </footer>
  );
}

export function ToastHost() {
  const { toast } = useStore();
  if (!toast) return null;
  return <div className="toast">{toast}</div>;
}

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="site">
      <TopBar />
      <SubNav />
      {children}
      <Footer />
    </div>
  );
}
