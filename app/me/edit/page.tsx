"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { SiteShell } from "@/components/chrome";
import { useStore } from "@/lib/store";

export default function EditProfilePage() {
  const router = useRouter();
  const { hydrated, loggedIn, name, email, role, saveProfile, withdraw } = useStore();
  const [form, setForm] = useState({ name, email, role });

  useEffect(() => {
    setForm({ name, email, role });
  }, [name, email, role]);

  useEffect(() => {
    if (hydrated && !loggedIn) router.replace("/login");
  }, [hydrated, loggedIn, router]);

  if (!loggedIn) return null;

  return (
    <SiteShell>
      <div className="me">
        <div className="wrap" style={{ maxWidth: 520 }}>
          <h1>내 정보 수정</h1>
          <div className="field">
            <label>이름</label>
            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>이메일</label>
            <input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
          </div>
          <div className="field">
            <label>직무</label>
            <input value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
          <button
            className="btn primary"
            type="button"
            onClick={() => {
              saveProfile(form);
              router.push("/me");
            }}
          >
            저장
          </button>
          <button
            className="btn ghost"
            type="button"
            style={{ marginLeft: 8 }}
            onClick={() => {
              if (window.confirm("탈퇴하면 투두·노트·임시저장이 모두 삭제됩니다.")) {
                withdraw();
                router.push("/login");
              }
            }}
          >
            회원 탈퇴
          </button>
        </div>
      </div>
    </SiteShell>
  );
}
