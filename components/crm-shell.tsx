"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Activity, BarChart3, Bell, ChevronDown, Command, Gauge, LayoutDashboard, LogOut, Menu, Settings2, Users, Wrench, X } from "lucide-react";
import { authService, ServiceFlowUser } from "@/lib/auth";
import { crmData } from "@/lib/crm-data";

const nav = [
  ["/dashboard","Обзор",LayoutDashboard],
  ["/orders","Заказы",Wrench],
  ["/customers","Клиенты",Users],
  ["/employees","Мастера",Gauge],
  ["/analytics","Аналитика",BarChart3],
  ["/settings","Настройки",Settings2],
] as const;

export function CrmShell({title,eyebrow,actions,children}:{title:string;eyebrow:string;actions?:React.ReactNode;children:React.ReactNode}) {
  const router=useRouter(); const pathname=usePathname();
  const [user,setUser]=useState<ServiceFlowUser|null>(null); const [ready,setReady]=useState(false); const [mobile,setMobile]=useState(false);
  useEffect(()=>{
    const session=authService.getSession();
    if(!session){ router.replace(`/login?next=${encodeURIComponent(pathname)}`); return; }
    crmData.seed(); setUser(session); setReady(true);
    return authService.subscribe(()=>{ const next=authService.getSession(); if(!next) router.replace("/login"); else setUser(next); });
  },[pathname,router]);
  function logout(){ authService.logout(); router.replace("/login"); }
  if(!ready||!user) return <div className="crm-loading"><span className="brand-mark"><Command/></span><span>Загружаем рабочее пространство…</span></div>;
  const initials=user.name.split(" ").map(part=>part[0]).slice(0,2).join("").toUpperCase();
  return <main className="crm-page">
    <div className="scanlines" aria-hidden="true"/>
    <aside className={`crm-sidebar ${mobile?"open":""}`}>
      <div className="crm-logo"><Link className="brand" href="/"><span className="brand-mark"><Command size={16}/></span>ServiceFlow <small>CRM</small></Link><button onClick={()=>setMobile(false)} aria-label="Закрыть меню"><X/></button></div>
      <div className="crm-workspace"><span className="avatar cyan-bg">{user.company.slice(0,2).toUpperCase()}</span><span><b>{user.company}</b><small>Рабочее пространство</small></span><ChevronDown/></div>
      <nav>{nav.map(([href,label,Icon])=><Link key={href} className={pathname===href?"active":""} href={href} onClick={()=>setMobile(false)}><Icon/>{label}{href==="/orders"&&<b>{crmData.getOrders().filter(o=>o.status!=="Выдано").length}</b>}</Link>)}</nav>
      <div className="crm-side-bottom"><div className="system-health"><Activity/><span><b>Системы работают</b><small>Последняя синхронизация: сейчас</small></span></div><div className="crm-profile"><span className="avatar cyan-bg">{initials}</span><span><b>{user.name}</b><small>{user.email}</small></span><button onClick={logout} aria-label="Выйти"><LogOut/></button></div></div>
    </aside>
    {mobile&&<button className="sidebar-scrim" aria-label="Закрыть меню" onClick={()=>setMobile(false)}/>} 
    <section className="crm-content">
      <header className="crm-topbar"><button className="crm-menu" onClick={()=>setMobile(true)} aria-label="Открыть меню"><Menu/></button><div><span className="technical">{`// ${eyebrow}`}</span><h1>{title}</h1></div><div className="crm-top-actions">{actions}<button className="icon-button" aria-label="Уведомления"><Bell/><b>3</b></button><span className="top-avatar">{initials}</span></div></header>
      <div className="crm-canvas">{children}</div>
    </section>
  </main>;
}
