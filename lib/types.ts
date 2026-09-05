export type TrendLabel = "유행예감" | "유행중" | "유행지남" | "";

export type CardTone = "pink" | "amber" | "green" | "lime";

export type ArticleSection = {
  id: string;
  heading: string;
  body: string;
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
  heroQuote: string;
  lead: string;
  sections: ArticleSection[];
  todos: ArticleTodo[];
  published: boolean;
  thumbnail?: string;
  cover?: string;
};

export type UserTodo = {
  id: string;
  text: string;
  sourceArticleId?: string;
  sourceTitle: string;
  addedAt: number;
  done: boolean;
};

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
};
