"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconBookmark, IconCheck, IconList, IconShare, IconTop } from "./icons";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";

export function TodoLayer({ article }: { article: Article }) {
  const router = useRouter();
  const {
    loggedIn,
    addTodoFromArticle,
    isArticleTodoSaved,
    todos,
    toggleSave,
    isSaved,
    showToast,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const hasTodos = article.todos.length > 0;
  const mine = todos.length;
  const saved = isSaved(article.id);

  const save = (todo: { id: string; text: string }) => {
    if (!loggedIn) {
      showToast("로그인 후 투두를 담을 수 있어요");
      router.push("/login");
      return;
    }
    if (isArticleTodoSaved(todo.id, todo.text)) return;
    addTodoFromArticle(article, todo);
    setFlash(todo.id);
    window.setTimeout(() => setFlash(null), 1400);
  };

  return (
    <>
      <div className="rail">
        <button className="rail-btn" type="button" aria-label="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <IconTop />
        </button>
        <button
          className={`rail-btn${saved ? " on" : ""}`}
          type="button"
          aria-label="북마크"
          onClick={() => {
            if (!loggedIn) {
              router.push("/login");
              return;
            }
            toggleSave(article.id);
            showToast(saved ? "저장을 해제했습니다" : "콘텐츠를 저장했습니다");
          }}
        >
          <IconBookmark filled={saved} />
        </button>
        <button
          className="rail-btn"
          type="button"
          aria-label="공유"
          onClick={async () => {
            await navigator.clipboard.writeText(window.location.href).catch(() => undefined);
            showToast("링크를 복사했습니다");
          }}
        >
          <IconShare />
        </button>
        {hasTodos ? (
          <button
            className={`todo-fab${open ? " open" : ""}`}
            type="button"
            aria-label="투두 리스트"
            onClick={() => setOpen((v) => !v)}
          >
            <IconList />
            {!open && mine > 0 ? <span className="count">{mine}</span> : null}
          </button>
        ) : null}
      </div>
      {open && hasTodos ? (
        <aside className="panel">
          <div className="panel-h">
            <span>업무에 적용해볼 만한 투두 리스트</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="닫기">
              ×
            </button>
          </div>
          <div className="panel-list">
            {article.todos.map((t) => {
              const already = isArticleTodoSaved(t.id, t.text);
              return (
                <div key={t.id} className={`todo-row${already ? " saved" : ""}`}>
                  {flash === t.id ? <span className="save-pop">저장 완료!</span> : null}
                  <button className="check" type="button" onClick={() => save(t)} aria-label="담기">
                    {already ? <IconCheck /> : null}
                  </button>
                  <label onClick={() => save(t)}>{t.text}</label>
                </div>
              );
            })}
          </div>
          <button
            className="panel-cta"
            type="button"
            onClick={() => router.push(loggedIn ? "/me" : "/login")}
          >
            나의 투두로 가기
          </button>
        </aside>
      ) : null}
    </>
  );
}
