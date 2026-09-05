"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, loggedIn, hydrated } = useStore();
  const [email, setEmail] = useState("careet@example.com");
  const [name, setName] = useState("김캐릿");
  const [password, setPassword] = useState("demo");

  useEffect(() => {
    if (hydrated && loggedIn) router.replace("/");
  }, [hydrated, loggedIn, router]);

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!email.trim()) return;
    if (!password) return;
    login(email || "careet@example.com", name);
    router.replace("/");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={submit}>
        <div className="logo">Careet</div>
        <h1>이메일로 로그인</h1>
        <p>트렌드를 읽고, 바로 실행할 투두로 옮깁니다. 데모는 아무 비밀번호나 됩니다.</p>
        <label>
          이름
          <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
        </label>
        <label>
          이메일
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="careet@example.com"
            autoComplete="email"
            required
          />
        </label>
        <label>
          비밀번호
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        <button className="btn primary" type="submit">
          로그인
        </button>
        <button
          className="btn ghost"
          type="button"
          onClick={() => {
            login("careet@example.com", "김캐릿");
            router.replace("/");
          }}
        >
          데모 계정으로 시작
        </button>
        <a className="login-home" href="/">
          홈으로
        </a>
      </form>
    </div>
  );
}
