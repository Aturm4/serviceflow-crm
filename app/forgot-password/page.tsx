"use client";

import { useState } from "react";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound } from "lucide-react";
import { AuthLayout } from "@/components/auth-layout";
import { authService } from "@/lib/auth";

export default function ForgotPasswordPage(){
  const [sent,setSent]=useState(false),[message,setMessage]=useState(""),[show,setShow]=useState(false);
  async function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setMessage("");const data=new FormData(event.currentTarget),email=String(data.get("email")||"").trim(),password=String(data.get("password")||""),confirm=String(data.get("confirm")||"");if(!/^\S+@\S+\.\S+$/.test(email))return setMessage("Введите корректный email");if(password.length<8)return setMessage("Пароль должен содержать не менее 8 символов");if(password!==confirm)return setMessage("Пароли не совпадают");try{await authService.resetPassword(email,password);setSent(true)}catch(reason){setMessage(reason instanceof Error?reason.message:"Не удалось обновить пароль")}}
  return <AuthLayout eyebrow="RECOVERY" title="Восстановление доступа" description="Укажите email, связанный с рабочим пространством.">
    {sent?<div className="recovery-success"><span><Check/></span><h3>Пароль обновлён</h3><p>Теперь можно войти с новым паролем.</p><a className="primary-button" href="/login"><ArrowLeft/>Вернуться ко входу</a></div>:<form className="auth-form" onSubmit={submit} noValidate>{message&&<div className="form-error" role="alert">{message}</div>}<label>Email<input name="email" type="email" maxLength={160} placeholder="you@company.uz" required/></label><label>Новый пароль<span className="password-field"><input name="password" type={show?"text":"password"} maxLength={128} placeholder="Минимум 8 символов" required/><button type="button" onClick={()=>setShow(!show)} aria-label={show?"Скрыть пароль":"Показать пароль"}>{show?<EyeOff/>:<Eye/>}</button></span></label><label>Повтор пароля<input name="confirm" type={show?"text":"password"} maxLength={128} placeholder="Повторите пароль" required/></label><button className="primary-button auth-submit"><KeyRound/>Обновить пароль</button></form>}
  </AuthLayout>
}
