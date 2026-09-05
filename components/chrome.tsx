"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { FormEvent, useEffect, useRef, useState } from "react";
import { GNB, MENU_ITEMS } from "@/lib/data";
import { progressOf, useStore } from "@/lib/store";
import { IconProfile, IconSearch } from "./icons";

export function TopBar() {
  const { loggedIn, todos } = useStore();
  const router = useRouter();
  const { done, total, pct } = progressOf(todos);
  const idle = total === 0 || pct === 0;

  return (
    <header className="topbar">
      <nav className="gnb">
        {GNB.map((g) =>
          g.href ? (
            <Link key={g.label} href={g.href}>
              {g.label}
            </Link>
          ) : (
            <span key={g.label} className="muted">
              {g.label}
            </span>
          ),
        )}
      </nav>
      {loggedIn ? (
        <div className="gauge-wrap">
          <span className="label">
            나의 투두{" "}
            <b className="frac">
              {done}/{total}
            </b>
          </span>
          <div className={`track${idle ? " idle" : ""}`} title={`${pct}%`}>
            <i style={{ width: `${pct}%` }} />
          </div>
          <button className="gauge-go" type="button" aria-label="나의 투두" onClick={() => router.push("/me")}>
            ›
          </button>
        </div>
      ) : (
        <div className="gauge-wrap">
          <button className="btn ghost login-mini" type="button" onClick={() => router.push("/login")}>
            로그인
          </button>
        </div>
      )}
    </header>
  );
}

export function SubNav({ onHero = false }: { onHero?: boolean }) {
  const { loggedIn, logout, showToast } = useStore();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
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
        <button className="chip" type="button" onClick={() => showToast("콘텐츠 보기 필터는 MVP 범위 밖입니다")}>
          콘텐츠 보기 <span>▾</span>
        </button>
        <button className="letter" type="button" onClick={() => showToast("트렌드 레터는 MVP 범위 밖입니다")}>
          트렌드 레터
        </button>
      </div>
      <Link href="/" className="logo">
        Careet
      </Link>
      <div className="sub-right">
        <form className="search" onSubmit={onSearch}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="검색어를 입력해 보세요"
            aria-label="검색"
          />
          <button type="submit" className="ghost" aria-label="검색 실행">
            <IconSearch />
          </button>
        </form>
        <div ref={ref} style={{ position: "relative" }}>
          <button
            className="icon-btn"
            type="button"
            aria-label="프로필"
            onClick={() => {
              if (!loggedIn) {
                router.push("/login");
                return;
              }
              setOpen((v) => !v);
            }}
          >
            <IconProfile />
          </button>
          {open && loggedIn ? (
            <div className="profile-pop">
              {MENU_ITEMS.map((item) =>
                item.href ? (
                  <Link key={item.id} href={item.href} onClick={() => setOpen(false)}>
                    {item.label}
                  </Link>
                ) : (
                  <button key={item.id} type="button" onClick={() => showToast("MVP 범위 밖의 메뉴입니다")}>
                    {item.label}
                  </button>
                ),
              )}
              <Link href="/admin/write" onClick={() => setOpen(false)}>
                아티클 작성
              </Link>
              <div className="sep" />
              <button
                type="button"
                onClick={() => {
                  logout();
                  setOpen(false);
                  router.push("/login");
                }}
              >
                로그아웃
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <strong>Careet</strong>
        트렌드를 읽으세요. 새로움을 만드세요.
        <br />
        team-6 MVP · 투두 실행 레이어 추가분
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
