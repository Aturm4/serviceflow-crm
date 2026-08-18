"use client";
/* eslint-disable @next/next/no-html-link-for-pages */

import { Command, ShieldCheck } from "lucide-react";

export function AuthLayout({ children, eyebrow, title, description }:{ children:React.ReactNode; eyebrow:string; title:string; description:string }) {
  return <main className="auth-page">
    <div className="ambient" aria-hidden="true"><i/><i/><i/></div><div className="scanlines" aria-hidden="true"/>
    <a className="brand auth-brand" href="/"><span className="brand-mark"><Command size={17}/></span>ServiceFlow</a>
    <section className="auth-stage">
      <div className="auth-context">
        <span className="technical cyan">{"// SERVICEFLOW ACCESS"}</span>
        <h1>Сервис работает.<br/><span>Вы управляете.</span></h1>
        <p>Единый рабочий поток для заказов, клиентов и команды. Данные демо-аккаунта сохраняются на этом устройстве.</p>
        <div className="auth-proof"><ShieldCheck/><span><b>Локальный demo-auth</b><small>Архитектура готова к замене на Supabase Auth</small></span></div>
      </div>
      <div className="auth-card">
        <header><span className="technical magenta">{`// ${eyebrow}`}</span><h2>{title}</h2><p>{description}</p></header>
        {children}
      </div>
    </section>
    <footer className="auth-footer"><span>ServiceFlow CRM</span><span className="mono">SECURE DEMO SESSION / 2026</span></footer>
  </main>;
}
