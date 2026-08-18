"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import { CrmShell } from "@/components/crm-shell";
import { authService } from "@/lib/auth";
import { crmData, WorkspaceSettings } from "@/lib/crm-data";

export default function SettingsPage(){
  const user=authService.getSession(); const [saved,setSaved]=useState(false),[settings]=useState<WorkspaceSettings>(()=>crmData.getSettings()),[error,setError]=useState("");
  function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setError("");const data=new FormData(event.currentTarget),next:WorkspaceSettings={company:String(data.get("company")).trim(),email:String(data.get("email")).trim().toLowerCase(),phone:String(data.get("phone")).trim(),timezone:String(data.get("timezone")),address:String(data.get("address")).trim(),sms:Boolean(data.get("sms")),overdueReminders:Boolean(data.get("overdueReminders"))};if(next.company.length<2)return setError("Укажите название компании");if(!/^\S+@\S+\.\S+$/.test(next.email))return setError("Введите корректный email");try{authService.updateProfile({company:next.company,email:next.email});crmData.saveSettings(next);setSaved(true);setTimeout(()=>setSaved(false),2200)}catch(reason){setError(reason instanceof Error?reason.message:"Не удалось сохранить настройки")}}
  return <CrmShell title="Настройки" eyebrow="WORKSPACE / SETTINGS">
    <form className="settings-form crm-panel" onSubmit={submit}>
      <header><div><span className="technical">{"// COMPANY PROFILE"}</span><h2>Профиль компании</h2></div></header>
      <div className="settings-body">
        {error&&<div className="form-error" role="alert">{error}</div>}
        <div className="form-row"><label>Название компании<input name="company" maxLength={120} defaultValue={settings.company||user?.company}/></label><label>Рабочий email<input name="email" maxLength={160} defaultValue={settings.email||user?.email} type="email"/></label></div>
        <div className="form-row"><label>Телефон<input name="phone" maxLength={20} defaultValue={settings.phone}/></label><label>Часовой пояс<select name="timezone" defaultValue={settings.timezone}><option>Asia/Tashkent</option><option>Europe/Moscow</option></select></label></div>
        <label>Адрес<input name="address" maxLength={240} defaultValue={settings.address}/></label>
        <div className="settings-switches">
          <label><span><b>SMS-уведомления клиентам</b><small>Отправлять при смене статуса заказа</small></span><input name="sms" aria-label="SMS-уведомления клиентам" type="checkbox" defaultChecked={settings.sms}/></label>
          <label><span><b>Напоминания о просрочке</b><small>Уведомлять ответственного мастера</small></span><input name="overdueReminders" aria-label="Напоминания о просрочке" type="checkbox" defaultChecked={settings.overdueReminders}/></label>
        </div>
        <button className="primary-button"><Save/>{saved?<><Check/>Сохранено</>:"Сохранить изменения"}</button>
      </div>
    </form>
  </CrmShell>
}
