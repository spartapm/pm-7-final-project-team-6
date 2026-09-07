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
import { ARTICLES, COUPON_CATALOG, EDITOR_PASSWORD, SEED_TODOS, isEditorEmail } from "./data";
import { hashPassword, uid } from "./format";
import type { AppState, Article, Draft, Note, Prefs } from "./types";
import { mergePrefs } from "./types";
import { deleteAccount, pullAccount, pushAccount, type CloudStatus } from "./cloud";

const KEY = "careet:v2";
const PW_KEY = "careet:pw";
const SESSION_MS = 30 * 24 * 60 * 60 * 1000;

export function accountIdFor(email: string) {
  return `careet_${email.trim().toLowerCase()}`;
}

function mergeArticles(extras: Article[], email = ""): Article[] {
  const extra = isEditorEmail(email)
    ? extras.filter((a) => a?.id && !ARTICLES.some((b) => b.id === a.id))
    : [];
  return [...extra, ...ARTICLES];
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function readPwMap(): Record<string, string> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(PW_KEY) || "{}") as Record<string, string>;
  } catch {
    return {};
  }
}

function writePwMap(map: Record<string, string>) {
  localStorage.setItem(PW_KEY, JSON.stringify(map));
}

function empty(partial?: Partial<AppState>): AppState {
  const prefs = mergePrefs(partial?.prefs);
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
    prefs,
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
      articles: mergeArticles(extras, parsed.email ?? ""),
      loggedIn: expired ? false : Boolean(parsed.loggedIn),
      loginAt: expired ? null : loginAt,
      prefs: mergePrefs(parsed.prefs),
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
    prefs: s.prefs,
  };
}

type LoginResult = { ok: true } | { ok: false; error: string };

type Store = AppState & {
  hydrated: boolean;
  cloudStatus: CloudStatus;
  toast: string | null;
  showToast: (msg: string) => void;
  login: (email: string, password: string, name?: string) => Promise<LoginResult>;
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
  deleteExtraArticle: (id: string) => void;
  isEditor: boolean;
  publishArticle: (input: {
    category: string;
    title: string;
    body: string;
    todos: string[];
    criteria: [boolean, boolean, boolean];
    thumbnail: string;
  }) => Article | { error: string };
  subscribeLetter: (email: string) => void;
  unsubscribeLetter: () => void;
  redeemCoupon: (code: string) => string | null;
  claimDailyPoints: () => string | null;
  upgradePlan: () => string | null;
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

  const patchPrefs = useCallback((fn: (prefs: Prefs) => Prefs) => {
    setState((s) => ({ ...s, prefs: fn(s.prefs) }));
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
        !remote.loginAt &&
        !remote.prefs.passwordHash;
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
          articles: mergeArticles(extras, remote.email || s.email),
          readIds: remote.readIds,
          savedIds: remote.savedIds,
          notes: remote.notes,
          prefs: mergePrefs({
            ...s.prefs,
            ...remote.prefs,
            passwordHash: remote.prefs.passwordHash || s.prefs.passwordHash,
          }),
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
    state.prefs,
    applyPushStatus,
  ]);

  const login = useCallback(
    async (email: string, password: string, name?: string): Promise<LoginResult> => {
      const clean = email.trim().toLowerCase();
      if (!clean) return { ok: false, error: "이메일을 입력해주세요" };
      if (!password) return { ok: false, error: "비밀번호를 입력해주세요" };
      const hash = await hashPassword(password);
      const id = accountIdFor(clean);
      const isDemo = clean === "careet@example.com";
      const isEditor = isEditorEmail(clean);
      if (isEditor && password !== EDITOR_PASSWORD) {
        return { ok: false, error: "비밀번호가 일치하지 않습니다" };
      }
      const localHash = readPwMap()[clean] || "";
      const pulled = await pullAccount(id);
      const remote = pulled.status === "ok" ? pulled.data : undefined;
      const stored = remote?.prefs.passwordHash || localHash;
      if (!isEditor && stored && stored !== hash) {
        return { ok: false, error: "비밀번호가 일치하지 않습니다" };
      }
      writePwMap({ ...readPwMap(), [clean]: hash });
      applyPushStatus(pulled.status);
      const hasRemote =
        Boolean(remote?.loginAt) ||
        Boolean(remote?.prefs.passwordHash) ||
        Boolean(remote?.todos.length) ||
        Boolean(remote?.extraArticles.length);
      const firstAuth = !stored;
      const next = empty({
        accountId: id,
        loggedIn: true,
        loginAt: Date.now(),
        email: clean,
        name: isEditor ? "캐릿 에디터" : name?.trim() || remote?.name || "김캐릿",
        role: isEditor ? "에디터" : remote?.role || "트렌드 담당자",
        todos: hasRemote ? (remote?.todos ?? []) : isDemo ? SEED_TODOS : [],
        drafts: hasRemote ? (remote?.drafts ?? []) : [],
        extraArticles: hasRemote ? (remote?.extraArticles ?? []) : [],
        articles: mergeArticles(hasRemote ? (remote?.extraArticles ?? []) : [], clean),
        readIds: hasRemote ? (remote?.readIds ?? []) : isDemo ? ["chaekeup"] : [],
        savedIds: hasRemote ? (remote?.savedIds ?? []) : isDemo ? ["danggim"] : [],
        notes: hasRemote ? (remote?.notes ?? []) : [],
        prefs: mergePrefs({
          ...(hasRemote ? remote?.prefs : isDemo ? { points: 800, plan: "free" } : {}),
          passwordHash: hash,
          ...(isDemo && firstAuth ? { points: Math.max(remote?.prefs.points ?? 0, 800) } : {}),
        }),
      });
      setState(next);
      showToast("로그인되었어요");
      if (pulled.status === "ok") void pushAccount(cloudPayload(next)).then(applyPushStatus);
      return { ok: true };
    },
    [applyPushStatus, showToast],
  );

  const logout = useCallback(() => {
    setState((s) => empty({ accountId: s.accountId, email: s.email, name: s.name }));
    showToast("로그아웃되었어요");
  }, [showToast]);

  const withdraw = useCallback(() => {
    const current = stateRef.current;
    if (current.accountId) void deleteAccount(current.accountId);
    if (current.email) {
      const map = readPwMap();
      delete map[current.email];
      writePwMap(map);
    }
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

  const deleteExtraArticle = useCallback((id: string) => {
    setState((s) => {
      const extraArticles = s.extraArticles.filter((a) => a.id !== id);
      return {
        ...s,
        extraArticles,
        articles: mergeArticles(extraArticles, s.email),
      };
    });
    showToast("발행글을 삭제했습니다");
  }, [showToast]);

  const publishArticle = useCallback(
    (input: {
      category: string;
      title: string;
      body: string;
      todos: string[];
      criteria: [boolean, boolean, boolean];
      thumbnail: string;
    }): Article | { error: string } => {
      if (!isEditorEmail(stateRef.current.email)) return { error: "에디터 계정만 발행할 수 있습니다" };
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
        articles: mergeArticles([article, ...s.extraArticles], s.email),
      }));
      return article;
    },
    [],
  );

  const subscribeLetter = useCallback(
    (email: string) => {
      const letterEmail = email.trim().toLowerCase();
      if (!letterEmail || !letterEmail.includes("@")) {
        showToast("이메일 형식을 확인해주세요");
        return;
      }
      patchPrefs((p) => ({
        ...p,
        letter: true,
        letterEmail,
        letterBonus: true,
        points: p.letterBonus ? p.points : p.points + 50,
      }));
      showToast(stateRef.current.prefs.letterBonus ? "구독 정보가 갱신되었습니다" : "트렌드 레터를 구독했습니다 · 50P");
    },
    [patchPrefs, showToast],
  );

  const unsubscribeLetter = useCallback(() => {
    patchPrefs((p) => ({ ...p, letter: false }));
    showToast("트렌드 레터 구독을 해지했습니다");
  }, [patchPrefs, showToast]);

  const redeemCoupon = useCallback(
    (raw: string) => {
      const code = raw.trim().toUpperCase();
      if (!code) return "쿠폰 코드를 입력해주세요";
      const catalog = COUPON_CATALOG.find((c) => c.code === code);
      if (!catalog) return "유효하지 않은 쿠폰입니다";
      const current = stateRef.current.prefs;
      if (current.coupons.some((c) => c.code === code)) return "이미 등록한 쿠폰입니다";
      patchPrefs((p) => {
        const next = {
          ...p,
          coupons: [{ id: uid("cpn"), code, title: catalog.title, used: true }, ...p.coupons],
        };
        if (catalog.perk === "points") next.points += catalog.points ?? 0;
        if (catalog.perk === "plus") next.plan = "plus";
        return next;
      });
      showToast(`${catalog.title} 적용`);
      return null;
    },
    [patchPrefs, showToast],
  );

  const claimDailyPoints = useCallback(() => {
    const today = todayKey();
    if (stateRef.current.prefs.lastPointClaim === today) return "오늘은 이미 포인트를 받았습니다";
    patchPrefs((p) => ({ ...p, lastPointClaim: today, points: p.points + 100 }));
    showToast("출석 포인트 100P를 받았습니다");
    return null;
  }, [patchPrefs, showToast]);

  const upgradePlan = useCallback(() => {
    const p = stateRef.current.prefs;
    if (p.plan === "plus") return "이미 캐릿 플러스입니다";
    if (p.points < 2000) return "플러스 업그레이드에는 2,000P가 필요합니다";
    patchPrefs((prev) => ({ ...prev, plan: "plus", points: prev.points - 2000 }));
    showToast("캐릿 플러스로 업그레이드했습니다");
    return null;
  }, [patchPrefs, showToast]);

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
      deleteExtraArticle,
      publishArticle,
      subscribeLetter,
      unsubscribeLetter,
      redeemCoupon,
      claimDailyPoints,
      upgradePlan,
      isEditor: isEditorEmail(state.email),
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
      deleteExtraArticle,
      publishArticle,
      subscribeLetter,
      unsubscribeLetter,
      redeemCoupon,
      claimDailyPoints,
      upgradePlan,
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
