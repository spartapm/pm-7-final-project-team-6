"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { IconBookmark, IconCheck, IconHighlight, IconList, IconPencil, IconShare, IconTop } from "./icons";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";
import { TODO_MAX } from "@/lib/types";

export function TodoLayer({
  article,
  scale,
  onCycleScale,
}: {
  article: Article;
  scale: number;
  onCycleScale: () => void;
}) {
  const router = useRouter();
  const {
    addTodoFromArticle,
    removeTodoFromArticle,
    isArticleTodoSaved,
    todos,
    toggleSave,
    isSaved,
    addNote,
    showToast,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [flash, setFlash] = useState<string | null>(null);
  const [composer, setComposer] = useState(false);
  const [draft, setDraft] = useState("");
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const hasTodos = article.todos.length > 0;
  const mine = todos.length;
  const saved = isSaved(article.id);

  const textOf = (todo: { id: string; text: string }) => edits[todo.id] ?? todo.text;

  const save = (todo: { id: string; text: string }) => {
    const next = { ...todo, text: textOf(todo) };
    if (isArticleTodoSaved(todo.id, next.text)) {
      removeTodoFromArticle(next);
      return;
    }
    addTodoFromArticle(article, next);
    setFlash(todo.id);
    window.setTimeout(() => setFlash(null), 1400);
  };

  const commitEdit = (todo: { id: string; text: string }, value: string) => {
    const next = value.trim();
    if (next) {
      setEdits((prev) => ({ ...prev, [todo.id]: next.slice(0, TODO_MAX) }));
    }
    setEditingId(null);
  };

  const saveNote = (text: string) => {
    const next = text.trim();
    if (!next) {
      showToast("남길 문장을 입력하거나 본문을 드래그하세요");
      return;
    }
    addNote({ articleId: article.id, articleTitle: article.title, text: next });
    setDraft("");
    setComposer(false);
  };

  const onHighlight = () => {
    setOpen(false);
    const selected = window.getSelection()?.toString().trim() || "";
    if (selected) {
      saveNote(selected);
      return;
    }
    setComposer(true);
  };

  return (
    <div className="article-tools">
      <div className="rail">
        <button className="rail-btn" type="button" aria-label="맨 위로" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          <IconTop />
        </button>
        <button
          className={`rail-btn type${scale > 1 ? " on" : ""}`}
          type="button"
          aria-label="글자 크기"
          onClick={onCycleScale}
        >
          가
        </button>
        <button
          className={`rail-btn${saved ? " on" : ""}`}
          type="button"
          aria-label="북마크"
          onClick={() => {
            toggleSave(article.id);
            showToast(saved ? "저장을 해제했습니다" : "콘텐츠를 저장했습니다");
          }}
        >
          <IconBookmark filled={saved} />
        </button>
        {hasTodos ? (
          <button
            className={`rail-btn todo-fab${open ? " open" : ""}`}
            type="button"
            aria-label="투두 리스트"
            onClick={() => {
              setComposer(false);
              setOpen((v) => !v);
            }}
          >
            <IconList />
            {!open && mine > 0 ? <span className="count">{mine}</span> : null}
          </button>
        ) : null}
        <button className="rail-btn" type="button" aria-label="형광펜" onClick={onHighlight}>
          <IconHighlight />
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
      </div>
      {composer ? (
        <aside className="panel note-composer">
          <div className="panel-h">
            <span>밑줄 노트</span>
            <button type="button" onClick={() => setComposer(false)} aria-label="닫기">
              ×
            </button>
          </div>
          <p className="note">본문을 드래그한 뒤 형광펜을 누르거나, 아래에 직접 적어 담을 수 있습니다.</p>
          <textarea
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="남기고 싶은 문장"
            rows={5}
          />
          <button className="panel-cta" type="button" onClick={() => saveNote(draft)}>
            노트에 담기
          </button>
        </aside>
      ) : open && hasTodos ? (
        <aside className="panel">
          <div className="panel-h">
            <span>업무에 적용해볼 만한 투두 리스트</span>
            <button type="button" onClick={() => setOpen(false)} aria-label="닫기">
              ×
            </button>
          </div>
          <div className="panel-list">
            {article.todos.map((t) => {
              const already = isArticleTodoSaved(t.id, textOf(t));
              return (
                <div key={t.id} className={`todo-row${already ? " saved" : ""}`}>
                  {flash === t.id ? <span className="save-pop">저장 완료!</span> : null}
                  <button className="check" type="button" onClick={() => save(t)} aria-label={already ? "담기 해제" : "담기"}>
                    {already ? <IconCheck /> : null}
                  </button>
                  {editingId === t.id && !already ? (
                    <input
                      className="todo-edit"
                      value={editingValue}
                      autoFocus
                      maxLength={TODO_MAX}
                      onChange={(e) => setEditingValue(e.target.value)}
                      onBlur={(e) => commitEdit(t, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") commitEdit(t, (e.target as HTMLInputElement).value);
                        if (e.key === "Escape") setEditingId(null);
                      }}
                    />
                  ) : (
                    <>
                      <label onClick={() => save(t)}>{textOf(t)}</label>
                      {already ? null : (
                        <button
                          className="todo-edit-btn"
                          type="button"
                          aria-label="문구 수정"
                          onClick={() => {
                            setEditingValue(textOf(t));
                            setEditingId(t.id);
                          }}
                        >
                          <IconPencil />
                        </button>
                      )}
                    </>
                  )}
                </div>
              );
            })}
          </div>
          <button
            className="panel-cta"
            type="button"
            onClick={() => router.push("/me")}
          >
            나의 투두로 가기
          </button>
        </aside>
      ) : (
        <div className="panel-slot" aria-hidden />
      )}
    </div>
  );
}
