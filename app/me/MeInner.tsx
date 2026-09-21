"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { SiteShell } from "@/components/chrome";
import { TipZip } from "@/components/TipZip";
import { IconClose } from "@/components/icons";
import { formatDotDate } from "@/lib/format";
import { progressOf, useStore } from "@/lib/store";

type Tab = "read" | "saved" | "todos" | "notes";

function asTab(v: string | null): Tab {
  if (v === "read" || v === "saved" || v === "notes") return v;
  return "todos";
}

export default function MeInner() {
  const router = useRouter();
  const params = useSearchParams();
  const {
    hydrated,
    name,
    email,
    role,
    todos,
    notes,
    articles,
    readIds,
    savedIds,
    deleteNote,
  } = useStore();
  const [tab, setTab] = useState<Tab>(asTab(params.get("tab")));
  const { total } = progressOf(todos);
  const readList = articles.filter((a) => readIds.includes(a.id));
  const savedList = articles.filter((a) => savedIds.includes(a.id));

  useEffect(() => {
    setTab(asTab(params.get("tab")));
  }, [params]);

  const go = (next: Tab) => {
    setTab(next);
    router.replace(next === "todos" ? "/me" : `/me?tab=${next}`);
  };

  if (!hydrated) return null;

  const displayName = name || "김캐릿";
  const displayRole = role || "트렌드 담당자";
  const displayEmail = email || "careet@example.com";

  return (
    <SiteShell>
      <div className="me">
        <div className="wrap">
          <div className="me-head">
            <div>
              <h1>
                {`${displayRole} ${displayName}님`}
              </h1>
              <div className="sub">{displayEmail}</div>
              <div className="sub" style={{ marginTop: 8 }}>
                <i className="dot" />
                이메일 로그인 중
              </div>
            </div>
            <div className="stats">
              <button className={`stat${tab === "read" ? " on" : ""}`} type="button" onClick={() => go("read")}>
                <div className="orb">{readIds.length}개</div>
                <span>읽은 콘텐츠</span>
              </button>
              <button className={`stat${tab === "saved" ? " on" : ""}`} type="button" onClick={() => go("saved")}>
                <div className="orb">{savedIds.length}개</div>
                <span>저장한 콘텐츠</span>
              </button>
              <button className={`stat${tab === "todos" ? " on" : ""}`} type="button" onClick={() => go("todos")}>
                <div className="orb">{total}개</div>
                <span>일잘 TIP</span>
              </button>
              <button className={`stat${tab === "notes" ? " on" : ""}`} type="button" onClick={() => go("notes")}>
                <div className="orb">{notes.length}개</div>
                <span>밑줄 노트</span>
              </button>
            </div>
          </div>

          {tab === "todos" ? <TipZip /> : null}

          {tab === "read" ? (
            <div className="todo-board">
              <h2>읽은 콘텐츠</h2>
              {readList.length === 0 ? (
                <div className="empty">아직 읽은 콘텐츠가 없습니다</div>
              ) : (
                <div className="cards">{readList.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
              )}
            </div>
          ) : null}

          {tab === "saved" ? (
            <div className="todo-board">
              <h2>저장한 콘텐츠</h2>
              {savedList.length === 0 ? (
                <div className="empty">북마크로 담은 콘텐츠가 없습니다</div>
              ) : (
                <div className="cards">{savedList.map((a) => <ArticleCard key={a.id} article={a} />)}</div>
              )}
            </div>
          ) : null}

          {tab === "notes" ? (
            <div className="todo-board">
              <h2>밑줄 노트</h2>
              {notes.length === 0 ? (
                <div className="empty">
                  <strong>밑줄 노트가 없습니다</strong>
                  아티클에서 인용구를 밑줄로 담을 수 있어요.
                </div>
              ) : (
                notes.map((n) => (
                  <div key={n.id} className="todo-item">
                    <div />
                    <div>
                      <div className="title">{n.text}</div>
                      <div className="meta">
                        원문: {n.articleTitle} · {formatDotDate(n.createdAt)}
                      </div>
                    </div>
                    <Link className="ghost" href={`/articles/${n.articleId}`}>
                      보기
                    </Link>
                    <button className="ghost" type="button" aria-label="삭제" onClick={() => deleteNote(n.id)}>
                      <IconClose />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : null}
        </div>
      </div>
    </SiteShell>
  );
}
