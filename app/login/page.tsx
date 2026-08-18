"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { authService } from "@/lib/auth";
import { crmData } from "@/lib/crm-data";

export default function LoginPage(){
  const router=useRouter(),params=useSearchParams(); const [show,setShow]=useState(false),[loading,setLoading]=useState(false),[error,setError]=useState("");const submitting=useRef(false);
  useEffect(()=>{if(authService.getSession()) router.replace("/dashboard")},[router]);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();if(submitting.current)return;submitting.current=true;setError("");setLoading(true);const data=new FormData(event.currentTarget);try{await authService.login(String(data.get("email")),String(data.get("password")),Boolean(data.get("remember")));crmData.seed();const next=params.get("next");router.replace(next?.startsWith("/")&&!next.startsWith("//")?next:"/dashboard")}catch(reason){setError(reason instanceof Error?reason.message:"Не удалось войти");submitting.current=false;setLoading(false)}}
  return <AuthLayout eyebrow="WELCOME BACK" title="Вход в ServiceFlow" description="Продолжите работу с заказами и командой.">
    <form className="auth-form" onSubmit={submit}>
      {error&&<div className="form-error" role="alert">{error}</div>}
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@company.uz" required/></label>
      <label>Пароль<span className="password-field"><input name="password" type={show?"text":"password"} autoComplete="current-password" placeholder="Ваш пароль" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Скрыть пароль":"Показать пароль"}>{show?<EyeOff/>:<Eye/>}</button></span></label>
      <div className="auth-options"><label className="checkbox-line"><input name="remember" type="checkbox" defaultChecked/><span><i><Check/></i>Запомнить меня</span></label><a href="/forgot-password">Забыли пароль?</a></div>
      <button className="primary-button auth-submit" disabled={loading}>{loading?<><LoaderCircle className="spin"/>Проверяем…</>:<>Войти <ArrowRight/></>}</button>
    </form>
    <p className="auth-switch">Нет аккаунта? <a href="/register">Создать бесплатно</a></p>
  </AuthLayout>
}
