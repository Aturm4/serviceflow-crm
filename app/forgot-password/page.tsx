"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, Check, Mail } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { authService } from "@/lib/auth";

export default function ForgotPasswordPage(){
  const [sent,setSent]=useState(false),[message,setMessage]=useState("");
  function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();const email=String(new FormData(event.currentTarget).get("email")||"");setSent(true);setMessage(authService.hasAccount(email)?"Аккаунт найден. В демо-режиме обратитесь к администратору пространства для сброса пароля.":"Если аккаунт существует, инструкция появится в почте.")}
  return <AuthLayout eyebrow="RECOVERY" title="Восстановление доступа" description="Укажите email, связанный с рабочим пространством.">
    {sent?<div className="recovery-success"><span><Check/></span><h3>Запрос принят</h3><p>{message}</p><Link className="primary-button" href="/login"><ArrowLeft/>Вернуться ко входу</Link></div>:<form className="auth-form" onSubmit={submit}><label>Email<input name="email" type="email" placeholder="you@company.uz" required/></label><button className="primary-button auth-submit"><Mail/>Проверить аккаунт</button></form>}
  </AuthLayout>
}

