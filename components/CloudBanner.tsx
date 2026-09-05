"use client";

import { useStore } from "@/lib/store";

const SQL = `create table if not exists public.accounts (
  id text primary key,
  name text not null default '김캐릿',
  email text not null default '',
  role text not null default '트렌드 담당자',
  login_at timestamptz,
  notes jsonb not null default '[]'::jsonb,
  extra_articles jsonb not null default '[]'::jsonb,
  read_ids jsonb not null default '[]'::jsonb,
  saved_ids jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);`;

export function CloudBanner() {
  const { cloudStatus } = useStore();
  if (cloudStatus !== "missing-table") return null;
  return (
    <div className="cloud-banner">
      <b>Supabase 테이블이 아직 없습니다.</b>{" "}
      <code>npm run db:schema</code> 하거나 SQL Editor에 스키마를 붙여넣으세요.
      <button
        type="button"
        onClick={() => navigator.clipboard.writeText(SQL).catch(() => undefined)}
      >
        SQL 일부 복사
      </button>
    </div>
  );
}
