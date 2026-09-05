import type { Article, Draft, Note, UserTodo } from "./types";
import { getSupabase, isMissingTable } from "./supabase";

export type CloudStatus = "ok" | "missing-table" | "error" | "off";

export type CloudAccount = {
  id: string;
  name: string;
  email: string;
  role: string;
  loginAt: number | null;
  todos: UserTodo[];
  drafts: Draft[];
  extraArticles: Article[];
  readIds: string[];
  savedIds: string[];
  notes: Note[];
};

function toIso(ms: number) {
  return new Date(ms).toISOString();
}

function fromIso(iso: string | null | undefined, fallback = Date.now()) {
  if (!iso) return fallback;
  const t = Date.parse(iso);
  return Number.isNaN(t) ? fallback : t;
}

export async function pullAccount(accountId: string): Promise<{
  status: CloudStatus;
  data?: CloudAccount;
  message?: string;
}> {
  const sb = getSupabase();
  if (!sb) return { status: "off" };

  const accountRes = await sb
    .from("accounts")
    .select("*")
    .eq("id", accountId)
    .maybeSingle();
  if (accountRes.error) {
    if (isMissingTable(accountRes.error)) return { status: "missing-table" };
    return { status: "error", message: accountRes.error.message };
  }
  if (!accountRes.data) {
    return {
      status: "ok",
      data: {
        id: accountId,
        name: "김캐릿",
        email: "",
        role: "트렌드 담당자",
        loginAt: null,
        todos: [],
        drafts: [],
        extraArticles: [],
        readIds: [],
        savedIds: [],
        notes: [],
      },
    };
  }

  const [todoRes, draftRes] = await Promise.all([
    sb.from("todos").select("*").eq("account_id", accountId),
    sb.from("drafts").select("*").eq("account_id", accountId),
  ]);
  for (const res of [todoRes, draftRes]) {
    if (res.error) {
      if (isMissingTable(res.error)) return { status: "missing-table" };
      return { status: "error", message: res.error.message };
    }
  }

  const row = accountRes.data;
  return {
    status: "ok",
    data: {
      id: accountId,
      name: (row.name as string) || "김캐릿",
      email: (row.email as string) || "",
      role: (row.role as string) || "트렌드 담당자",
      loginAt: row.login_at ? fromIso(row.login_at as string) : null,
      extraArticles: ((row.extra_articles as Article[]) ?? []).filter((a) => a?.id),
      readIds: (row.read_ids as string[]) ?? [],
      savedIds: (row.saved_ids as string[]) ?? [],
      notes: (row.notes as Note[]) ?? [],
      todos: (todoRes.data ?? []).map((t) => ({
        id: t.id as string,
        text: t.text as string,
        sourceArticleId: (t.source_article_id as string) || undefined,
        sourceTitle: (t.source_title as string) || "",
        addedAt: fromIso(t.added_at as string),
        done: Boolean(t.done),
      })),
      drafts: (draftRes.data ?? []).map((d) => ({
        id: d.id as string,
        category: d.category as string,
        title: d.title as string,
        body: d.body as string,
        thumbnail: d.thumbnail as string,
        todos: (d.todos as string[]) ?? [],
        criteria: (d.criteria as [boolean, boolean, boolean]) ?? [false, false, false],
        updatedAt: fromIso(d.updated_at as string),
      })),
    },
  };
}

export async function pushAccount(input: CloudAccount): Promise<CloudStatus> {
  const sb = getSupabase();
  if (!sb) return "off";

  const accountRes = await sb.from("accounts").upsert({
    id: input.id,
    name: input.name,
    email: input.email,
    role: input.role,
    login_at: input.loginAt ? toIso(input.loginAt) : null,
    notes: input.notes,
    extra_articles: input.extraArticles,
    read_ids: input.readIds,
    saved_ids: input.savedIds,
    updated_at: new Date().toISOString(),
  });
  if (accountRes.error) {
    if (isMissingTable(accountRes.error)) return "missing-table";
    console.warn("[supabase] accounts", accountRes.error.message);
    return "error";
  }

  const [remoteTodos, remoteDrafts] = await Promise.all([
    sb.from("todos").select("id").eq("account_id", input.id),
    sb.from("drafts").select("id").eq("account_id", input.id),
  ]);
  if (remoteTodos.error || remoteDrafts.error) {
    const err = remoteTodos.error || remoteDrafts.error;
    if (isMissingTable(err)) return "missing-table";
    return "error";
  }

  const keepTodos = new Set(input.todos.map((t) => t.id));
  const staleTodos = (remoteTodos.data ?? []).map((r) => r.id as string).filter((id) => !keepTodos.has(id));
  if (staleTodos.length) await sb.from("todos").delete().in("id", staleTodos);

  const keepDrafts = new Set(input.drafts.map((d) => d.id));
  const staleDrafts = (remoteDrafts.data ?? []).map((r) => r.id as string).filter((id) => !keepDrafts.has(id));
  if (staleDrafts.length) await sb.from("drafts").delete().in("id", staleDrafts);

  if (input.todos.length) {
    const todoRes = await sb.from("todos").upsert(
      input.todos.map((t) => ({
        id: t.id,
        account_id: input.id,
        text: t.text,
        source_article_id: t.sourceArticleId ?? null,
        source_title: t.sourceTitle,
        added_at: toIso(t.addedAt),
        done: t.done,
      })),
    );
    if (todoRes.error) {
      console.warn("[supabase] todos", todoRes.error.message);
      return "error";
    }
  }

  if (input.drafts.length) {
    const draftRes = await sb.from("drafts").upsert(
      input.drafts.map((d) => ({
        id: d.id,
        account_id: input.id,
        category: d.category,
        title: d.title,
        body: d.body,
        thumbnail: d.thumbnail,
        todos: d.todos,
        criteria: d.criteria,
        updated_at: toIso(d.updatedAt),
      })),
    );
    if (draftRes.error) {
      console.warn("[supabase] drafts", draftRes.error.message);
      return "error";
    }
  }

  return "ok";
}

export async function deleteAccount(accountId: string): Promise<CloudStatus> {
  const sb = getSupabase();
  if (!sb) return "off";
  const res = await sb.from("accounts").delete().eq("id", accountId);
  if (res.error) {
    if (isMissingTable(res.error)) return "missing-table";
    console.warn("[supabase] delete account", res.error.message);
    return "error";
  }
  return "ok";
}
