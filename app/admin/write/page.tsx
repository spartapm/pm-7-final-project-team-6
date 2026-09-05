"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ArticleCard } from "@/components/ArticleCard";
import { CATEGORIES, CRITERIA } from "@/lib/data";
import { formatDateTime } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { Article } from "@/lib/types";

const TITLE_MAX = 50;
const TODO_MAX = 50;

type Modal = "required" | "no-todo" | "one-todo" | "publish" | "done" | "archive" | null;

const emptyForm = {
  category: "트렌드",
  title: "",
  body: "",
  thumbnail: "",
  todos: ["", ""] as string[],
  criteria: [false, false, false] as [boolean, boolean, boolean],
};

export default function WritePage() {
  const router = useRouter();
  const { hydrated, loggedIn, saveDraft, drafts, deleteDraft, publishArticle, showToast } = useStore();
  const [form, setForm] = useState(emptyForm);
  const [draftId, setDraftId] = useState<string | undefined>();
  const [modal, setModal] = useState<Modal>(null);
  const [requiredMsg, setRequiredMsg] = useState("제목을 입력한 뒤 다시 시도해주세요");
  const [published, setPublished] = useState<Article | null>(null);
  const [lastSaved, setLastSaved] = useState<number | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLTextAreaElement>(null);
  const todoRef = useRef<HTMLDivElement>(null);

  const met = form.criteria.every(Boolean);
  const filledTodos = form.todos.map((t) => t.trim()).filter(Boolean);

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/login");
  }, [hydrated, loggedIn, router]);

  useEffect(() => {
    const locked = modal === "required" || modal === "publish" || modal === "no-todo" || modal === "one-todo" || modal === "done";
    if (!locked) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") e.preventDefault();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [modal]);

  const preview: Article = useMemo(
    () => ({
      id: "preview",
      category: form.category || "트렌드",
      title: form.title || "제목을 입력하세요",
      titleBreak: form.title || "제목을 입력하세요",
      dek: form.title || "MZ세대가 주목하는 2025 직장인 트렌드 키워드 5선",
      date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
      author: "캐릿 에디터팀",
      label: "유행중",
      cardTone: "lime",
      cardEyebrow: form.category || "트렌드",
      cardLine: "미리보기",
      heroQuote: "",
      lead: form.body,
      sections: [],
      todos: filledTodos.map((text, i) => ({ id: `p${i}`, text })),
      published: false,
      thumbnail: form.thumbnail,
    }),
    [form, filledTodos],
  );

  const setTodo = (i: number, v: string) => {
    const todos = [...form.todos];
    todos[i] = v.slice(0, TODO_MAX);
    setForm({ ...form, todos });
  };

  const wrap = (before: string, after = before) => {
    const el = bodyRef.current;
    if (!el) return;
    const { selectionStart: s, selectionEnd: e, value } = el;
    const next = value.slice(0, s) + before + value.slice(s, e) + after + value.slice(e);
    setForm({ ...form, body: next });
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(s + before.length, e + before.length);
    });
  };

  const onFile = (file?: File) => {
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      showToast("최대 용량 10MB · JPG, PNG, WEBP만 지원됩니다");
      return;
    }
    const ok = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (!ok.includes(file.type)) {
      showToast("최대 용량 10MB · JPG, PNG, WEBP만 지원됩니다");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setForm((f) => ({ ...f, thumbnail: String(reader.result) }));
    reader.readAsDataURL(file);
  };

  const missingRequired = () => {
    if (!form.title.trim()) return "제목을 입력한 뒤 다시 시도해주세요";
    if (!form.thumbnail) return "썸네일을 업로드한 뒤 다시 시도해주세요";
    if (!form.body.trim()) return "본문을 입력한 뒤 다시 시도해주세요";
    return null;
  };

  const tryPublish = () => {
    const miss = missingRequired();
    if (miss) {
      setRequiredMsg(miss);
      setModal("required");
      return;
    }
    if (met && filledTodos.length === 0) {
      setModal("no-todo");
      return;
    }
    if (met && filledTodos.length === 1) {
      setModal("one-todo");
      return;
    }
    setModal("publish");
  };

  const doPublish = () => {
    const result = publishArticle({
      category: form.category,
      title: form.title,
      body: form.body,
      todos: filledTodos,
      criteria: form.criteria,
      thumbnail: form.thumbnail,
    });
    if ("error" in result) {
      showToast(result.error);
      setModal(null);
      return;
    }
    if (draftId) deleteDraft(draftId);
    setPublished(result);
    setModal("done");
  };

  const focusTodos = () => {
    setModal(null);
    todoRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  if (!loggedIn) return null;

  return (
    <div className="admin">
      <header className="admin-top">
        <div className="crumb">
          <b>캐릿</b>
          <span>/</span>
          <span>아티클 작성</span>
          <span className="admin-badge">ADMIN</span>
        </div>
        <div>
          에디터: 김지연
          {lastSaved ? <span className="note"> · 마지막 저장: {formatDateTime(lastSaved)}</span> : null}
        </div>
      </header>

      <div className="admin-grid">
        <div className="editor">
          <div className="field">
            <label>카테고리</label>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              {CATEGORIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label>제목</label>
            <input
              value={form.title}
              maxLength={TITLE_MAX}
              placeholder="MZ세대가 주목하는 2025 직장인 트렌드 키워드 5선"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <div className="hint">
              {form.title.length}/{TITLE_MAX}자
            </div>
          </div>
          <div className="field">
            <label>썸네일 이미지</label>
            <button className="upload" type="button" onClick={() => fileRef.current?.click()}>
              {form.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={form.thumbnail} alt="썸네일" />
              ) : (
                <>
                  클릭하여 이미지 업로드
                  <div className="hint" style={{ textAlign: "center" }}>
                    권장 비율 16:9 · JPG, PNG, WEBP · 최대 10MB · 미업로드 시 발행 불가
                  </div>
                </>
              )}
            </button>
            <input
              ref={fileRef}
              type="file"
              accept="image/png,image/jpeg,image/webp,image/gif"
              hidden
              onChange={(e) => onFile(e.target.files?.[0])}
            />
          </div>
          <div className="field">
            <label>본문 작성</label>
            <div className="with-bar">
              <div className="toolbar">
                <button type="button" onClick={() => wrap("# ", "")}>H1</button>
                <button type="button" onClick={() => wrap("## ", "")}>H2</button>
                <button type="button" onClick={() => wrap("**")}>B</button>
                <button type="button" onClick={() => wrap("_")}>I</button>
                <button type="button" onClick={() => wrap("- ", "")}>•≡</button>
                <button type="button" onClick={() => wrap("> ", "")}>인용구 블록</button>
              </div>
              <textarea
                ref={bodyRef}
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
                placeholder="독자가 읽고 바로 실행할 수 있는 본문을 작성하세요"
              />
            </div>
          </div>

          <div ref={todoRef} className={`criteria${met ? " ok" : " bad"}`}>
            <h4>
              투두 리스트
              <span className={met ? "pill-ok" : "pill-bad"}>
                {met ? "판별기준 충족" : `${form.criteria.filter(Boolean).length}/3 충족`}
              </span>
            </h4>
            <p className="note">3가지 판별기준을 모두 충족해야 투두 리스트를 입력할 수 있습니다</p>
            {CRITERIA.map((c, i) => (
              <label key={c}>
                <input
                  type="checkbox"
                  checked={form.criteria[i]}
                  onChange={(e) => {
                    const criteria = [...form.criteria] as [boolean, boolean, boolean];
                    criteria[i] = e.target.checked;
                    setForm({ ...form, criteria });
                  }}
                />
                {c}
              </label>
            ))}
            <p className="note">
              {met
                ? "독자가 콘텐츠를 읽고 바로 실행할 수 있는 구체적인 행동을 작성해주세요"
                : "판별기준 미충족으로 투두 리스트가 노출되지 않습니다"}
            </p>
            {form.todos.map((t, i) => (
              <div className="todo-edit" key={i}>
                <span>{i + 1}</span>
                <div style={{ flex: 1 }}>
                  <input
                    value={t}
                    disabled={!met}
                    placeholder={met ? (i === 0 ? "팀 미팅에서 업무 자율성 관련 아젠다 제안해보기" : "이번 주 내로 상사와 1:1 미팅 일정 잡기") : "투두가 입력되지 않았습니다"}
                    onChange={(e) => setTodo(i, e.target.value)}
                  />
                  <div className="hint">{t.length}/{TODO_MAX}자</div>
                </div>
                <button
                  className="ghost"
                  type="button"
                  onClick={() => setForm({ ...form, todos: form.todos.filter((_, j) => j !== i) })}
                >
                  ×
                </button>
              </div>
            ))}
            <button
              className="add-todo"
              type="button"
              disabled={!met}
              onClick={() => setForm({ ...form, todos: [...form.todos, ""] })}
            >
              + 투두 추가
            </button>
          </div>
        </div>

        <aside className="preview-col">
          <h3>실시간 미리보기</h3>
          <div className="prev-card">
            <ArticleCard article={preview} staticPreview />
          </div>
          <div className={`prev-todos${met && filledTodos.length ? "" : " disabled"}`}>
            <h4>업무에 적용해볼 만한 투두 리스트</h4>
            {met && filledTodos.length ? (
              filledTodos.map((t) => (
                <div key={t} className="todo-row">
                  <span className="check" />
                  <span>{t}</span>
                </div>
              ))
            ) : (
              <p className="note">아직 작성된 투두가 없습니다</p>
            )}
            <button className="panel-cta" type="button" disabled>
              나의 투두로 가기
            </button>
          </div>
        </aside>
      </div>

      <div className="admin-foot">
        <div className="admin-foot-left">
          <button className="btn ghost" type="button" onClick={() => setModal("archive")}>
            보관함
          </button>
          <button
            className="btn ghost"
            type="button"
            onClick={() => {
              const saved = saveDraft({ ...form, id: draftId });
              setDraftId(saved.id);
              setLastSaved(saved.updatedAt);
            }}
          >
            임시저장
          </button>
          {lastSaved ? <span className="note">마지막 저장: {formatDateTime(lastSaved)}</span> : null}
        </div>
        <button className="btn done" type="button" onClick={tryPublish}>
          발행하기
        </button>
      </div>

      {modal === "required" ? (
        <div className="dim">
          <div className="modal">
            <h2>미입력된 필수항목이 있습니다</h2>
            <p>{requiredMsg}</p>
            <button className="btn primary" type="button" onClick={() => setModal(null)}>
              확인
            </button>
          </div>
        </div>
      ) : null}

      {modal === "no-todo" ? (
        <div className="dim">
          <div className="modal">
            <h2>투두 리스트 없이 발행됩니다</h2>
            <p>독자 화면에 실행 리스트가 노출되지 않습니다.</p>
            <div className="row">
              <button className="btn" type="button" onClick={focusTodos}>취소</button>
              <button className="btn primary" type="button" onClick={doPublish}>확인</button>
            </div>
          </div>
        </div>
      ) : null}

      {modal === "one-todo" ? (
        <div className="dim">
          <div className="modal">
            <h2>2개 이상을 권장합니다</h2>
            <p>이대로 발행할까요?</p>
            <div className="row">
              <button className="btn" type="button" onClick={focusTodos}>취소</button>
              <button className="btn primary" type="button" onClick={doPublish}>확인</button>
            </div>
          </div>
        </div>
      ) : null}

      {modal === "publish" ? (
        <div className="dim">
          <div className="modal">
            <h2>발행하시겠습니까?</h2>
            <p>발행된 아티클은 홈 최신 콘텐츠에 바로 올라갑니다.</p>
            <div className="row">
              <button className="btn" type="button" onClick={() => setModal(null)}>취소</button>
              <button className="btn primary" type="button" onClick={doPublish}>발행하기</button>
            </div>
          </div>
        </div>
      ) : null}

      {modal === "done" && published ? (
        <div className="dim">
          <div className="modal">
            <h2>발행되었습니다</h2>
            <p>독자 화면에서 아티클과 투두를 확인해 보세요.</p>
            <div className="row">
              <button
                className="btn"
                type="button"
                onClick={() => {
                  setModal(null);
                  setForm(emptyForm);
                  setDraftId(undefined);
                  setPublished(null);
                }}
              >
                계속 작성
              </button>
              <button className="btn primary" type="button" onClick={() => router.push(`/articles/${published.id}`)}>
                아티클 보기
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {modal === "archive" ? (
        <div className="dim" onClick={() => setModal(null)}>
          <div className="modal archive-modal" onClick={(e) => e.stopPropagation()}>
            <h2>임시저장 글</h2>
            <p>총 {drafts.length}개</p>
            {drafts.length === 0 ? (
              <div className="empty">임시저장된 글이 없습니다</div>
            ) : (
              drafts.map((d) => (
                <div
                  key={d.id}
                  className="draft-item"
                  onClick={() => {
                    setForm({
                      category: d.category,
                      title: d.title,
                      body: d.body,
                      thumbnail: d.thumbnail,
                      todos: d.todos.length ? d.todos : ["", ""],
                      criteria: d.criteria,
                    });
                    setDraftId(d.id);
                    setLastSaved(d.updatedAt);
                    setModal(null);
                  }}
                >
                  <b>{d.title || "제목 없음"}</b>
                  <div className="note">{formatDateTime(d.updatedAt)}</div>
                </div>
              ))
            )}
            <button className="btn" type="button" onClick={() => setModal(null)}>닫기</button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
