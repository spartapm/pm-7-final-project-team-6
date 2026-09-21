import { uid } from "./format";
import type { UserTodo, ZipFolder, ZipState } from "./types";

export const DONE_ID = "done";
export const UNSORTED_ID = "unsorted";

export const FOLDER_SUGGESTIONS = [
  "SNS 콘텐츠 소재",
  "시즌·프로모션 캘린더",
  "캠페인 기획 아이디어",
  "경쟁사 벤치마킹",
] as const;

export function migrateTodo(t: UserTodo): UserTodo {
  return {
    ...t,
    folderId: t.folderId || (t.done ? DONE_ID : UNSORTED_ID),
    memo: t.memo ?? "",
  };
}

export function folderTitle(id: string, folders: ZipFolder[]) {
  if (id === DONE_ID) return "업무 적용 완료된 일잘 TIP";
  if (id === UNSORTED_ID) return "미분류 TIP";
  return folders.find((f) => f.id === id)?.name ?? "미분류 TIP";
}

export function tipsIn(todos: UserTodo[], folderId: string) {
  return todos.filter((t) => (t.folderId || (t.done ? DONE_ID : UNSORTED_ID)) === folderId);
}

export function normalizeName(name: string) {
  return name.trim().replace(/\s+/g, " ");
}

export function findFolderByName(folders: ZipFolder[], name: string) {
  const key = normalizeName(name).toLowerCase();
  return folders.find((f) => f.name.trim().toLowerCase() === key);
}

export function createFolder(name: string): ZipFolder {
  return { id: uid("fld"), name: normalizeName(name), collapsed: false };
}

export function patchZip(zip: ZipState, patch: Partial<ZipState>): ZipState {
  return { ...zip, ...patch };
}
