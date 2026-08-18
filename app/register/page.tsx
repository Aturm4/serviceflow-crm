"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { authService } from "@/lib/auth";
import { crmData } from "@/lib/crm-data";

export default function RegisterPage(){
  const [show,setShow]=useState(false); const [loading,setLoading]=useState(false); const [error,setError]=useState("");const submitting=useRef(false);
  useEffect(()=>{if(authService.getSession()) window.location.replace("/dashboard")},[]);
  async function submit(event:React.FormEvent<HTMLFormElement>){
    event.preventDefault();if(submitting.current)return; setError(""); const data=new FormData(event.currentTarget);
    const name=String(data.get("name")||"").trim(),company=String(data.get("company")||"").trim(),email=String(data.get("email")||"").trim(),password=String(data.get("password")||""),confirm=String(data.get("confirm")||"");
    if(name.length<2||company.length<2) return setError("Укажите имя и название компании");
    if(!/^\S+@\S+\.\S+$/.test(email)) return setError("Введите корректный email");
    if(password.length<8) return setError("Пароль должен содержать не менее 8 символов");
    if(password!==confirm) return setError("Пароли не совпадают");
    if(!data.get("terms")) return setError("Необходимо принять условия использования");
    submitting.current=true;setLoading(true);
    try{await authService.register({name,company,email,password});crmData.seed();window.location.replace("/dashboard");}
    catch(reason){setError(reason instanceof Error?reason.message:"Не удалось создать аккаунт");submitting.current=false;setLoading(false)}
  }
  return <AuthLayout eyebrow="CREATE WORKSPACE" title="Создайте аккаунт" description="CRM будет готова к работе сразу после регистрации.">
    <form className="auth-form" onSubmit={submit} noValidate>
      {error&&<div className="form-error" role="alert">{error}</div>}
      <div className="form-row"><label>Ваше имя<input name="name" maxLength={100} autoComplete="name" placeholder="Саид Каримов" required/></label><label>Компания<input name="company" maxLength={120} autoComplete="organization" placeholder="Nova Service" required/></label></div>
      <label>Email<input name="email" type="email" maxLength={160} autoComplete="email" placeholder="you@company.uz" required/></label>
      <div className="form-row"><label>Пароль<span className="password-field"><input name="password" maxLength={128} type={show?"text":"password"} autoComplete="new-password" placeholder="Минимум 8 символов" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Скрыть пароль":"Показать пароль"}>{show?<EyeOff/>:<Eye/>}</button></span></label><label>Повтор пароля<input name="confirm" maxLength={128} type={show?"text":"password"} autoComplete="new-password" placeholder="Повторите пароль" required/></label></div>
      <label className="checkbox-line"><input name="terms" type="checkbox"/><span><i><Check/></i>Я принимаю <a href="/terms">условия использования и политику конфиденциальности</a></span></label>
      <button className="primary-button auth-submit" disabled={loading}>{loading?<><LoaderCircle className="spin"/>Создаём пространство…</>:<>Создать аккаунт <ArrowRight/></>}</button>
    </form>
    <p className="auth-switch">Уже есть аккаунт? <a href="/login">Войти</a></p>
  </AuthLayout>
}
