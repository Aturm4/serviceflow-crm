"use client";

import { useState } from "react";
import { Check, Save } from "lucide-react";
import { CrmShell } from "@/components/crm-shell";
import { authService } from "@/lib/auth";

export default function SettingsPage(){
  const user=authService.getSession(); const [saved,setSaved]=useState(false);
  function submit(event:React.FormEvent<HTMLFormElement>){event.preventDefault();setSaved(true);setTimeout(()=>setSaved(false),2200)}
  return <CrmShell title="Настройки" eyebrow="WORKSPACE / SETTINGS">
    <form className="settings-form crm-panel" onSubmit={submit}>
      <header><div><span className="technical">{"// COMPANY PROFILE"}</span><h2>Профиль компании</h2></div></header>
      <div className="settings-body">
        <div className="form-row"><label>Название компании<input defaultValue={user?.company}/></label><label>Рабочий email<input defaultValue={user?.email} type="email"/></label></div>
        <div className="form-row"><label>Телефон<input defaultValue="+998 71 205 44 11"/></label><label>Часовой пояс<select defaultValue="Asia/Tashkent"><option>Asia/Tashkent</option><option>Europe/Moscow</option></select></label></div>
        <label>Адрес<input defaultValue="Ташкент, ул. Шота Руставели, 12"/></label>
        <div className="settings-switches">
          <label><span><b>SMS-уведомления клиентам</b><small>Отправлять при смене статуса заказа</small></span><input aria-label="SMS-уведомления клиентам" type="checkbox" defaultChecked/></label>
          <label><span><b>Напоминания о просрочке</b><small>Уведомлять ответственного мастера</small></span><input aria-label="Напоминания о просрочке" type="checkbox" defaultChecked/></label>
        </div>
        <button className="primary-button"><Save/>{saved?<><Check/>Сохранено</>:"Сохранить изменения"}</button>
      </div>
    </form>
  </CrmShell>
}
