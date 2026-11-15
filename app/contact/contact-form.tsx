"use client";

import Script from "next/script";
import { useActionState } from "react";
import { LoaderCircle, Send, ShieldCheck } from "lucide-react";
import { submitContactInquiry, type ContactFormState } from "./actions";

const initialState: ContactFormState = { success: false, message: null };

export function ContactForm({ siteKey }: { siteKey: string }) {
  const [state, action, pending] = useActionState(submitContactInquiry, initialState);

  return (
    <section className="contact-form-card" aria-labelledby="contact-form-title">
      <div className="contact-form-heading">
        <span className="eyebrow">Send a message · أرسل رسالة</span>
        <h2 id="contact-form-title" className="display">How can we help?</h2>
        <p>Messages submitted here are delivered to the private mosque administration inbox.</p>
      </div>

      {state.success ? (
        <div className="contact-success" role="status">
          <span><ShieldCheck size={23} /></span>
          <h3>Message received.</h3>
          <p>{state.message}</p>
        </div>
      ) : (
        <form action={action} className="contact-form">
          <div className="contact-field">
            <label htmlFor="full_name">Your name</label>
            <input id="full_name" name="full_name" type="text" autoComplete="name" required minLength={2} maxLength={100} aria-invalid={Boolean(state.fieldErrors?.fullName)} />
            {state.fieldErrors?.fullName && <span className="field-error">{state.fieldErrors.fullName}</span>}
          </div>
          <div className="contact-field">
            <label htmlFor="email">Email address</label>
            <input id="email" name="email" type="email" autoComplete="email" required maxLength={254} aria-invalid={Boolean(state.fieldErrors?.email)} />
            {state.fieldErrors?.email && <span className="field-error">{state.fieldErrors.email}</span>}
          </div>
          <div className="contact-field">
            <label htmlFor="message">Your message</label>
            <textarea id="message" name="message" required minLength={10} maxLength={4000} rows={6} aria-invalid={Boolean(state.fieldErrors?.message)} />
            {state.fieldErrors?.message && <span className="field-error">{state.fieldErrors.message}</span>}
          </div>

          <div className="contact-honeypot" aria-hidden="true">
            <label htmlFor="company_website">Leave this field empty</label>
            <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="turnstile-wrap">
            <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
            <div className="cf-turnstile" data-sitekey={siteKey} data-action="contact" data-theme="light" />
          </div>

          {state.message && <p className="form-error" role="alert">{state.message}</p>}
          <button className="btn-primary contact-submit" type="submit" disabled={pending}>
            {pending ? <><LoaderCircle size={16} className="spin" /> Sending…</> : <>Send message <Send size={15} /> </>}
          </button>
          <p className="form-hint">Your message is visible only to authorized mosque administrators. Do not include passwords, payment credentials, or sensitive personal information.</p>
        </form>
      )}
    </section>
  );
}
