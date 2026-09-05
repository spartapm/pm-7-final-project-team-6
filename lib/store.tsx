"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { ARTICLES, SEED_TODOS } from "./data";
import { uid } from "./format";
import type { AppState, Article, Draft, Note } from "./types";
import { deleteAccount, pullAccount, pushAccount, type CloudStatus } from "./cloud";

const KEY = "careet:v2";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export function accountIdFor(email: string) {
  return `careet_${email.trim().toLowerCase()}`;
}

function mergeArticles(extras: Article[]): Article[] {
  const extra = extras.filter((a) => a?.id && !ARTICLES.some((b) => b.id === a.id));
  return [...extra, ...ARTICLES];
}

function empty(partial?: Partial<AppState>): AppState {
  return {
    accountId: "",
    loggedIn: false,
    loginAt: null,
    name: "김캐릿",
    email: "",
    role: "트렌드 담당자",
    todos: [],
    drafts: [],
    extraArticles: [],
    articles: ARTICLES,
    readIds: [],
    savedIds: [],
    notes: [],
    ...partial,
  };
}

function load(): AppState {
  const fallback = empty();
  if (typeof window === "undefined") return fallback;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<AppState>;
    const extras = parsed.extraArticles ?? [];
    const loginAt = parsed.loginAt ?? null;
    const expired = Boolean(parsed.loggedIn && loginAt && Date.now() - loginAt > SESSION_MS);
    return empty({
      ...parsed,
      extraArticles: extras,
      articles: mergeArticles(extras),
      loggedIn: expired ? false : Boolean(parsed.loggedIn),
      loginAt: expired ? null : loginAt,
    });
  } catch {
    return fallback;
  }
}

function cloudPayload(s: AppState) {
  return {
    id: s.accountId,
    name: s.name,
    email: s.email,
    role: s.role,
    loginAt: s.loginAt,
    todos: s.todos,
    drafts: s.drafts,
    extraArticles: s.extraArticles,
    readIds: s.readIds,
    savedIds: s.savedIds,
    notes: s.notes,
  };
}

type Store = AppState & {
  hydrated: boolean;
  cloudStatus: CloudStatus;
  toast: string | null;
  showToast: (msg: string) => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  withdraw: () => void;
  saveProfile: (input: { name: string; email: string; role: string }) => void;
  markRead: (id: string) => void;
  toggleSave: (id: string) => void;
  isSaved: (id: string) => boolean;
  addTodoFromArticle: (article: Article, todo: { id: string; text: string }) => boolean;
  isArticleTodoSaved: (todoId: string, text?: string) => boolean;
  toggleTodo: (id: string) => void;
  editTodo: (id: string, text: string) => void;
  deleteTodo: (id: string) => void;
  addNote: (note: Omit<Note, "id" | "createdAt">) => void;
  deleteNote: (id: string) => void;
  saveDraft: (draft: Omit<Draft, "id" | "updatedAt"> & { id?: string }) => Draft;
  deleteDraft: (id: string) => void;
  publishArticle: (input: {
    category: string;
    title: string;
    body: string;
    todos: string[];
    criteria: [boolean, boolean, boolean];
    thumbnail: string;
  }) => Article | { error: string };
};

const Ctx = createContext<Store | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(empty);
  const [hydrated, setHydrated] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [cloudStatus, setCloudStatus] = useState<CloudStatus>("off");
  const stateRef = useRef(state);
  stateRef.current = state;

  const showToast = useCallback((msg: string) => {
    setToast(msg);
    window.setTimeout(() => setToast(null), 1800);
  }, []);

  const applyPushStatus = useCallback((status: CloudStatus) => {
    setCloudStatus(status);
  }, []);

  const runPull = useCallback(
    async (accountId: string, seed?: AppState) => {
      if (!accountId) return;
      const res = await pullAccount(accountId);
      applyPushStatus(res.status);
      if (res.status !== "ok" || !res.data) return;
      const remote = res.data;
      const emptyRemote =
        remote.todos.length === 0 &&
        remote.drafts.length === 0 &&
        remote.extraArticles.length === 0 &&
        !remote.loginAt;
      if (emptyRemote && seed?.todos.length) {
        applyPushStatus(await pushAccount(cloudPayload({ ...seed, accountId })));
        return;
      }
      setState((s) => {
        const extras = remote.extraArticles;
        return {
          ...s,
          accountId,
          name: remote.name || s.name,
          email: remote.email || s.email,
          role: remote.role || s.role,
          todos: remote.todos,
          drafts: remote.drafts,
          extraArticles: extras,
          articles: mergeArticles(extras),
          readIds: remote.readIds,
          savedIds: remote.savedIds,
          notes: remote.notes,
        };
      });
    },
    [applyPushStatus],
  );

  useEffect(() => {
    const local = load();
    setState(local);
    setHydrated(true);
    if (local.loggedIn && local.accountId) void runPull(local.accountId, local);
  }, [runPull]);

  useEffect(() => {
    if (!hydrated) return;
    localStorage.setItem(KEY, JSON.stringify({ ...state, articles: undefined }));
  }, [hydrated, state]);

  useEffect(() => {
    if (!hydrated || !state.loggedIn || !state.accountId) return;
    const t = window.setTimeout(() => {
      void pushAccount(cloudPayload(stateRef.current)).then(applyPushStatus);
    }, 400);
    return () => window.clearTimeout(t);
  }, [
    hydrated,
    state.loggedIn,
    state.accountId,
    state.todos,
    state.drafts,
    state.extraArticles,
    state.readIds,
    state.savedIds,
    state.notes,
    state.name,
    state.email,
    state.role,
    applyPushStatus,
  ]);

  const login = useCallback(
    (email: string, name?: string) => {
      const clean = email.trim().toLowerCase();
      const id = accountIdFor(clean);
      const isDemo = clean === "careet@example.com" || clean === "";
      const next = empty({
        accountId: id,
        loggedIn: true,
        loginAt: Date.now(),
        email: clean || "careet@example.com",
        name: name?.trim() || "김캐릿",
        todos: isDemo ? SEED_TODOS : [],
        readIds: isDemo ? ["chaekeup"] : [],
        savedIds: isDemo ? ["danggim"] : [],
      });
      setState(next);
      showToast("로그인되었어요");
      void runPull(id, next);
    },
    [runPull, showToast],
  );

  const logout = useCallback(() => {
    setState((s) => empty({ accountId: s.accountId, email: s.email, name: s.name }));
    showToast("로그아웃되었어요");
  }, [showToast]);

  const withdraw = useCallback(() => {
    const id = stateRef.current.accountId;
    if (id) void deleteAccount(id);
    localStorage.removeItem(KEY);
    setState(empty());
    showToast("탈퇴가 완료되었습니다");
  }, [showToast]);

  const saveProfile = useCallback((input: { name: string; email: string; role: string }) => {
    setState((s) => ({ ...s, name: input.name, email: input.email, role: input.role }));
    showToast("정보가 저장되었습니다");
  }, [showToast]);

  const markRead = useCallback((id: string) => {
    setState((s) => (s.readIds.includes(id) ? s : { ...s, readIds: [...s.readIds, id] }));
  }, []);

  const toggleSave = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      savedIds: s.savedIds.includes(id) ? s.savedIds.filter((x) => x !== id) : [...s.savedIds, id],
    }));
  }, []);

  const isSaved = useCallback((id: string) => state.savedIds.includes(id), [state.savedIds]);

  const isArticleTodoSaved = useCallback(
    (todoId: string, text?: string) =>
      state.todos.some(
        (t) => t.id === `saved_${todoId}` || t.id === todoId || (text ? t.text === text : false),
      ),
    [state.todos],
  );

  const addTodoFromArticle = useCallback((article: Article, todo: { id: string; text: string }) => {
    const sid = `saved_${todo.id}`;
    let added = false;
    setState((s) => {
      if (s.todos.some((t) => t.id === sid || t.text === todo.text)) return s;
      added = true;
      return {
        ...s,
        todos: [
          {
            id: sid,
            text: todo.text,
            sourceArticleId: article.id,
            sourceTitle: article.title,
            addedAt: Date.now(),
            done: false,
          },
          ...s.todos,
        ],
      };
    });
    return added;
  }, []);

  const toggleTodo = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) => (t.id === id ? { ...t, done: !t.done } : t)),
    }));
  }, []);

  const editTodo = useCallback((id: string, text: string) => {
    const next = text.trim();
    if (!next) return;
    setState((s) => ({
      ...s,
      todos: s.todos.map((t) => (t.id === id ? { ...t, text: next.slice(0, 50) } : t)),
    }));
  }, []);

  const deleteTodo = useCallback((id: string) => {
    setState((s) => ({ ...s, todos: s.todos.filter((t) => t.id !== id) }));
  }, []);

  const addNote = useCallback((note: Omit<Note, "id" | "createdAt">) => {
    setState((s) => ({
      ...s,
      notes: [{ ...note, id: uid("note"), createdAt: Date.now() }, ...s.notes],
    }));
    showToast("밑줄 노트에 담았어요");
  }, [showToast]);

  const deleteNote = useCallback((id: string) => {
    setState((s) => ({ ...s, notes: s.notes.filter((n) => n.id !== id) }));
  }, []);

  const saveDraft = useCallback(
    (draft: Omit<Draft, "id" | "updatedAt"> & { id?: string }) => {
      const saved: Draft = { ...draft, id: draft.id || uid("draft"), updatedAt: Date.now() };
      setState((s) => ({ ...s, drafts: [saved, ...s.drafts.filter((d) => d.id !== saved.id)] }));
      showToast("임시저장되었습니다");
      return saved;
    },
    [showToast],
  );

  const deleteDraft = useCallback((id: string) => {
    setState((s) => ({ ...s, drafts: s.drafts.filter((d) => d.id !== id) }));
  }, []);

  const publishArticle = useCallback(
    (input: {
      category: string;
      title: string;
      body: string;
      todos: string[];
      criteria: [boolean, boolean, boolean];
      thumbnail: string;
    }): Article | { error: string } => {
      if (!input.category.trim()) return { error: "카테고리를 선택해주세요" };
      if (!input.title.trim()) return { error: "제목을 입력해주세요" };
      if (!input.thumbnail) return { error: "썸네일을 업로드해주세요" };
      if (!input.body.trim()) return { error: "본문을 입력해주세요" };
      const met = input.criteria.every(Boolean);
      const todos = met
        ? input.todos.map((text) => ({ id: uid("td"), text: text.trim() })).filter((t) => t.text)
        : [];
      const article: Article = {
        id: uid("art"),
        category: input.category,
        title: input.title.trim(),
        titleBreak: input.title.trim(),
        dek: input.body.trim().slice(0, 80),
        date: new Date().toISOString().slice(0, 10).replace(/-/g, "."),
        author: "캐릿 에디터팀",
        label: "유행중",
        cardTone: "lime",
        cardEyebrow: input.category,
        cardLine: "NEW",
        heroQuote: input.title.trim(),
        lead: input.body.trim().slice(0, 180),
        sections: [{ id: "s1", heading: "본문", body: input.body.trim() }],
        todos,
        published: true,
        thumbnail: input.thumbnail,
      };
      setState((s) => ({
        ...s,
        extraArticles: [article, ...s.extraArticles],
        articles: mergeArticles([article, ...s.extraArticles]),
      }));
      return article;
    },
    [],
  );

  const value = useMemo<Store>(
    () => ({
      ...state,
      hydrated,
      cloudStatus,
      toast,
      showToast,
      login,
      logout,
      withdraw,
      saveProfile,
      markRead,
      toggleSave,
      isSaved,
      addTodoFromArticle,
      isArticleTodoSaved,
      toggleTodo,
      editTodo,
      deleteTodo,
      addNote,
      deleteNote,
      saveDraft,
      deleteDraft,
      publishArticle,
    }),
    [
      state,
      hydrated,
      cloudStatus,
      toast,
      showToast,
      login,
      logout,
      withdraw,
      saveProfile,
      markRead,
      toggleSave,
      isSaved,
      addTodoFromArticle,
      isArticleTodoSaved,
      toggleTodo,
      editTodo,
      deleteTodo,
      addNote,
      deleteNote,
      saveDraft,
      deleteDraft,
      publishArticle,
    ],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}

export function progressOf(todos: AppState["todos"]) {
  const total = todos.length;
  const done = todos.filter((t) => t.done).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return { total, done, pct };
}
