"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { authService } from "@/lib/auth";
import { crmData } from "@/lib/crm-data";

export default function RegisterPage(){
  const router=useRouter(); const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState("");
  useEffect(()=>{if(authService.getSession()) router.replace("/dashboard")},[router]);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault(); setError(""); const data=new FormData(event.currentTarget);
    const name=String(data.get("name")||"").trim(),company=String(data.get("company")||"").trim(),email=String(data.get("email")||"").trim(),password=String(data.get("password")||""),confirm=String(data.get("confirm")||"");
    if(name.length<2||company.length<2) return setError("Укажите имя и название компании");
    if(!/^\S+@\S+\.\S+$/.test(email)) return setError("Введите корректный email");
    if(password.length<8) return setError("Пароль должен содержать не менее 8 символов");
    if(password!==confirm) return setError("Пароли не совпадают");
    if(!data.get("terms")) return setError("Необходимо принять условия использования");
    setLoading(true);
    try{await authService.register({name,company,email,password});crmData.seed();router.replace("/dashboard");}
    catch(reason){setError(reason instanceof Error?reason.message:"Не удалось создать аккаунт");setLoading(false)}
  }
  return <AuthLayout eyebrow="CREATE WORKSPACE" title="Создайте аккаунт" description="CRM будет готова к работе сразу после регистрации.">
    <form className="auth-form" onSubmit={submit} noValidate>
      {error&&<div className="form-error" role="alert">{error}</div>}
      <div className="form-row"><label>Ваше имя<input name="name" autoComplete="name" placeholder="Саид Каримов" required/></label><label>Компания<input name="company" autoComplete="organization" placeholder="Nova Service" required/></label></div>
      <label>Email<input name="email" type="email" autoComplete="email" placeholder="you@company.uz" required/></label>
      <div className="form-row"><label>Пароль<span className="password-field"><input name="password" type={show?"text":"password"} autoComplete="new-password" placeholder="Минимум 8 символов" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Скрыть пароль":"Показать пароль"}>{show?<EyeOff/>:<Eye/>}</button></span></label><label>Повтор пароля<input name="confirm" type={show?"text":"password"} autoComplete="new-password" placeholder="Повторите пароль" required/></label></div>
      <label className="checkbox-line"><input name="terms" type="checkbox"/><span><i><Check/></i>Я принимаю <a href="#terms">условия использования</a> и политику конфиденциальности</span></label>
      <button className="primary-button auth-submit" disabled={loading}>{loading?<><LoaderCircle className="spin"/>Создаём пространство…</>:<>Создать аккаунт <ArrowRight/></>}</button>
    </form>
    <p className="auth-switch">Уже есть аккаунт? <Link href="/login">Войти</Link></p>
  </AuthLayout>
}

