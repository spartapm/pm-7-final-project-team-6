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
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    if (hydrated && loggedIn) router.replace("/");
  }, [hydrated, loggedIn, router]);

  const submit = async (e?: FormEvent, demo = false) => {
    e?.preventDefault();
    setError("");
    setBusy(true);
    const result = await login(
      demo ? "careet@example.com" : email || "careet@example.com",
      demo ? "demo" : password,
      demo ? "김캐릿" : name,
    );
    setBusy(false);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    router.replace("/");
  };

  return (
    <div className="login-page">
      <form className="login-card" onSubmit={(e) => submit(e)}>
        <div className="logo">Careet</div>
        <h1>이메일로 로그인</h1>
        <p>투두 리스트는 로그인 없이 이 브라우저에만 저장됩니다. 아티클 작성이 필요하면 에디터 계정으로 들어가 주세요.</p>
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
        {error ? <div className="err">{error}</div> : null}
        <button className="btn primary" type="submit" disabled={busy}>
          {busy ? "확인 중…" : "로그인"}
        </button>
        <button className="btn ghost" type="button" disabled={busy} onClick={() => submit(undefined, true)}>
          데모 계정으로 시작
        </button>
        <p className="login-hint">에디터 · editor@careet.com / editor</p>
        <a className="login-home" href="/">
          홈으로
        </a>
      </form>
    </div>
  );
}
