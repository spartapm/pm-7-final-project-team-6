"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { SiteShell } from "@/components/chrome";
import { IconCheck, IconClose, IconEdit } from "@/components/icons";
import { formatDotDate } from "@/lib/format";
import { progressOf, useStore } from "@/lib/store";
import { TODO_MAX } from "@/lib/types";

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
    loggedIn,
    name,
    email,
    role,
    todos,
    notes,
    articles,
    readIds,
    savedIds,
    toggleTodo,
    editTodo,
    deleteTodo,
    addCustomTodo,
    deleteNote,
  } = useStore();
  const [tab, setTab] = useState<Tab>(asTab(params.get("tab")));
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [composer, setComposer] = useState(false);
  const [custom, setCustom] = useState("");
  const { done, total } = progressOf(todos);
  const sorted = useMemo(() => [...todos].sort((a, b) => b.addedAt - a.addedAt), [todos]);
  const readList = articles.filter((a) => readIds.includes(a.id));
  const savedList = articles.filter((a) => savedIds.includes(a.id));

  useEffect(() => {
    setTab(asTab(params.get("tab")));
  }, [params]);

  const go = (next: Tab) => {
    setTab(next);
    router.replace(next === "todos" ? "/me" : `/me?tab=${next}`);
  };

  const startEdit = (id: string, text: string) => {
    setEditing(id);
    setDraft(text);
  };
  const commit = (id: string) => {
    editTodo(id, draft);
    setEditing(null);
  };
  const commitCustom = () => {
    if (addCustomTodo(custom)) {
      setCustom("");
      setComposer(false);
    }
  };

  if (!hydrated) return null;

  return (
    <SiteShell>
      <div className="me">
        <div className="wrap">
          <div className="me-head">
            <div>
              <h1>
                {loggedIn ? `${role} ${name}님` : "나의 투두"}
              </h1>
              {loggedIn ? (
                <>
                  <div className="sub">{email}</div>
                  <div className="sub" style={{ marginTop: 8 }}>
                    <i className="dot" />
                    이메일 로그인 중
                  </div>
                </>
              ) : (
                <div className="sub">이 브라우저에만 저장됩니다. 다른 사람과 목록이 섞이지 않아요.</div>
              )}
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
                <span>나의 투두</span>
              </button>
              <button className={`stat${tab === "notes" ? " on" : ""}`} type="button" onClick={() => go("notes")}>
                <div className="orb">{notes.length}개</div>
                <span>밑줄 노트</span>
              </button>
            </div>
          </div>

          {tab === "todos" ? (
            <div className="todo-board">
              <h2>
                나의 투두 리스트 {total}개
              </h2>
              <p className="countline">
                {done}/{total} 완료
              </p>
              {sorted.length === 0 ? (
                <div className="empty">
                  <strong>나의 투두리스트를 추가해보세요</strong>
                  아티클 상세의 투두 패널에서 항목을 담을 수 있어요.
                </div>
              ) : (
                sorted.map((t) => (
                  <div key={t.id} className={`todo-item${t.done ? " done" : ""}`}>
                    <button className="check round" type="button" onClick={() => toggleTodo(t.id)} aria-label="완료">
                      {t.done ? <IconCheck /> : null}
                    </button>
                    <div>
                      {editing === t.id ? (
                        <input
                          value={draft}
                          autoFocus
                          maxLength={TODO_MAX}
                          onChange={(e) => setDraft(e.target.value)}
                          onBlur={() => commit(t.id)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") commit(t.id);
                            if (e.key === "Escape") setEditing(null);
                          }}
                        />
                      ) : (
                        <div className="title-row">
                          <div className="title">{t.text}</div>
                          <button className="ghost" type="button" aria-label="수정" onClick={() => startEdit(t.id, t.text)}>
                            <IconEdit />
                          </button>
                        </div>
                      )}
                      <div className="meta">
                        {t.sourceArticleId ? (
                          <>
                            원문:{" "}
                            <Link href={`/articles/${t.sourceArticleId}`}>{t.sourceTitle}</Link>
                            {" · "}
                            {formatDotDate(t.addedAt)}
                          </>
                        ) : (
                          <>
                            원문: {t.sourceTitle} · {formatDotDate(t.addedAt)}
                          </>
                        )}
                      </div>
                    </div>
                    <button className="ghost muted-x" type="button" aria-label="삭제" onClick={() => deleteTodo(t.id)}>
                      <IconClose />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : null}

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
      {tab === "todos" ? (
        <button
          className="me-fab"
          type="button"
          aria-label="투두 직접 추가"
          onClick={() => setComposer(true)}
        >
          +
        </button>
      ) : null}
      {composer ? (
        <div className="dim" onClick={(e) => e.target === e.currentTarget && setComposer(false)}>
          <div className="modal">
            <h2>투두 직접 추가</h2>
            <p>아티클에서 담지 않은 실행 항목을 이 브라우저의 나의 투두에 넣습니다.</p>
            <input
              value={custom}
              autoFocus
              maxLength={TODO_MAX}
              placeholder="이번 주 안에 할 일"
              onChange={(e) => setCustom(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") commitCustom();
                if (e.key === "Escape") setComposer(false);
              }}
            />
            <div className="hint">{custom.length}/{TODO_MAX}자</div>
            <div className="row">
              <button className="btn" type="button" onClick={() => setComposer(false)}>
                취소
              </button>
              <button className="btn primary" type="button" onClick={commitCustom}>
                추가
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </SiteShell>
  );
}
