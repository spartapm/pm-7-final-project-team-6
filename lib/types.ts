export type TrendLabel = "유행예감" | "유행중" | "유행지남" | "";

export type CardTone = "pink" | "amber" | "green" | "lime";

export const TODO_MAX = 120;

export type ArticleVisual = {
  tone: CardTone | "ink";
  kicker: string;
  title: string;
};

export type ArticleSection = {
  id: string;
  heading: string;
  body: string;
  visual?: ArticleVisual;
  visuals?: ArticleVisual[];
  caption?: string;
};

export type ArticleTodo = {
  id: string;
  text: string;
};

export type Article = {
  id: string;
  category: string;
  title: string;
  titleBreak: string;
  dek: string;
  date: string;
  author: string;
  label: TrendLabel;
  cardTone: CardTone;
  cardEyebrow: string;
  cardLine: string;
  cardHeadline?: string;
  cardSub?: string;
  heroQuote: string;
  lead: string;
  sections: ArticleSection[];
  todos: ArticleTodo[];
  published: boolean;
  thumbnail?: string;
  cover?: string;
  bodyImages?: string[];
  thumbCard?: boolean;
};

export type UserTodo = {
  id: string;
  text: string;
  sourceArticleId?: string;
  sourceTitle: string;
  addedAt: number;
  done: boolean;
  folderId?: string;
  memo?: string;
  sourceFolderName?: string;
};

export type ZipFolder = {
  id: string;
  name: string;
  collapsed: boolean;
};

export type ZipState = {
  folders: ZipFolder[];
  onboardingDone: boolean;
  doneCollapsed: boolean;
  unsortedCollapsed: boolean;
};

export const defaultZip = (): ZipState => ({
  folders: [],
  onboardingDone: false,
  doneCollapsed: false,
  unsortedCollapsed: false,
});

export function mergeZip(input?: Partial<ZipState> | null): ZipState {
  const base = defaultZip();
  return {
    folders: Array.isArray(input?.folders) ? input.folders.map((f) => ({
      id: f.id,
      name: f.name,
      collapsed: Boolean(f.collapsed),
    })) : base.folders,
    onboardingDone: Boolean(input?.onboardingDone),
    doneCollapsed: Boolean(input?.doneCollapsed),
    unsortedCollapsed: Boolean(input?.unsortedCollapsed),
  };
}

export type Draft = {
  id: string;
  category: string;
  title: string;
  body: string;
  thumbnail: string;
  todos: string[];
  criteria: [boolean, boolean, boolean];
  updatedAt: number;
};

export type Note = {
  id: string;
  articleId: string;
  articleTitle: string;
  text: string;
  createdAt: number;
};

export type Coupon = {
  id: string;
  code: string;
  title: string;
  used: boolean;
};

export type Prefs = {
  passwordHash: string;
  letter: boolean;
  letterEmail: string;
  letterBonus: boolean;
  plan: "free" | "plus";
  points: number;
  lastPointClaim: string;
  coupons: Coupon[];
  zip: ZipState;
};

export const defaultPrefs = (): Prefs => ({
  passwordHash: "",
  letter: false,
  letterEmail: "",
  letterBonus: false,
  plan: "free",
  points: 0,
  lastPointClaim: "",
  coupons: [],
  zip: defaultZip(),
});

export function mergePrefs(input?: Partial<Prefs> | null): Prefs {
  const next = { ...defaultPrefs(), ...(input ?? {}) };
  next.zip = mergeZip(input?.zip ?? next.zip);
  next.coupons = Array.isArray(next.coupons) ? next.coupons : [];
  return next;
}

export type AppState = {
  accountId: string;
  loggedIn: boolean;
  loginAt: number | null;
  name: string;
  email: string;
  role: string;
  todos: UserTodo[];
  drafts: Draft[];
  articles: Article[];
  extraArticles: Article[];
  readIds: string[];
  savedIds: string[];
  notes: Note[];
  prefs: Prefs;
};
