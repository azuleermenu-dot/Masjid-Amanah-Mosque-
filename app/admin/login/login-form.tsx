"use client";

import { useActionState } from "react";
import { signInAdmin, type LoginState } from "./actions";
import { ArrowRight, LoaderCircle } from "lucide-react";

const initialState: LoginState = { error: null };

export function LoginForm() {
  const [state, action, pending] = useActionState(signInAdmin, initialState);

  return (
    <form action={action} className="admin-form">
      <label htmlFor="email">Administrator email</label>
      <input id="email" name="email" type="email" autoComplete="username" required maxLength={254} />
      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" autoComplete="current-password" required minLength={8} maxLength={200} />
      {state.error && <p className="form-error" role="alert">{state.error}</p>}
      <button className="btn-primary admin-submit" type="submit" disabled={pending}>
        {pending ? <><LoaderCircle className="spin" size={15} /> Signing in…</> : <>Sign in securely <ArrowRight size={15} /></>}
      </button>
      <p className="form-hint">Administrator accounts are created and authorized by mosque management. Public registration is disabled.</p>
    </form>
  );
}
