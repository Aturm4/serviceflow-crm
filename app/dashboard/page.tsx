"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleDollarSign, Clock3, Gauge, ShoppingBag, TrendingUp, TriangleAlert } from "lucide-react";
import { CrmShell } from "@/components/crm-shell";
import { crmData, employeeLoad, EmployeeRecord, EventRecord, formatMoney, OrderRecord } from "@/lib/crm-data";

export default function DashboardPage(){
  const [orders,setOrders]=useState<OrderRecord[]>([]),[employees,setEmployees]=useState<EmployeeRecord[]>([]),[events,setEvents]=useState<EventRecord[]>([]);
  useEffect(()=>{const load=()=>{crmData.seed();setOrders(crmData.getOrders());setEmployees(crmData.getEmployees());setEvents(crmData.getEvents())};load();return crmData.subscribe(load)},[]);
  const stats=useMemo(()=>{const active=orders.filter(order=>order.status!=="Выдано"),total=orders.reduce((sum,order)=>sum+order.amount,0),today=new Date().toISOString().slice(0,10);return {active:active.length,revenue:total,average:orders.length?Math.round(total/orders.length):0,overdue:active.filter(order=>order.due<today).length}},[orders]);
  const revenue=useMemo(()=>{const days=Array.from({length:14},(_,index)=>{const date=new Date();date.setDate(date.getDate()-(13-index));const key=date.toISOString().slice(0,10);return {label:date.toLocaleDateString("ru-RU",{day:"numeric",month:"short"}),value:orders.filter(order=>order.createdAt.slice(0,10)===key).reduce((sum,order)=>sum+order.amount,0)}});const max=Math.max(...days.map(day=>day.value),1);return days.map(day=>({...day,height:Math.max(4,Math.round(day.value/max*92))}))},[orders]);
  return <CrmShell title="Обзор" eyebrow="NOVA SERVICE / DASHBOARD" actions={<Link className="primary-button small" href="/orders?create=1">Новый заказ <ArrowRight/></Link>}>
    <section className="crm-kpis">
      <article className="cyan"><span><CircleDollarSign/>Выручка</span><b>{formatMoney(stats.revenue)}</b><small className="green"><TrendingUp/>+12,8% к прошлой неделе</small></article>
      <article className="violet"><span><ShoppingBag/>Активные заказы</span><b>{stats.active}</b><small>4 новых сегодня</small></article>
      <article className="green"><span><Gauge/>Средний чек</span><b>{formatMoney(stats.average)}</b><small className="green">+6,4% за месяц</small></article>
      <article className="orange"><span><TriangleAlert/>Просрочено</span><b>{stats.overdue}</b><small className="orange">Требуют внимания</small></article>
    </section>
    <section className="dashboard-layout">
      <article className="crm-panel revenue-chart"><header><div><span className="technical">{"// REVENUE STREAM"}</span><h2>Динамика выручки</h2></div><span className="period-chip">Последние 14 дней</span></header><div className="chart-summary"><b>{formatMoney(stats.revenue)}</b><span className="green">по всем заказам</span></div><div className="bar-chart">{revenue.map((day,index)=><div key={day.label}><i style={{height:`${day.height}%`}} title={formatMoney(day.value)}/><span>{index%2===0?day.label:""}</span></div>)}</div></article>
      <article className="crm-panel team-load"><header><div><span className="technical">{"// TEAM CAPACITY"}</span><h2>Загрузка мастеров</h2></div><Link href="/employees">Все мастера <ArrowRight/></Link></header><div>{employees.map(employee=>{const load=employeeLoad(employee.id,orders);return <div className="team-load-row" key={employee.id}><span className="avatar cyan-bg">{employee.name.split(" ").map(part=>part[0]).join("")}</span><span><b>{employee.name}</b><small>{employee.specialty}</small></span><div className="capacity"><i style={{width:`${load}%`}}/></div><strong>{load}%</strong></div>})}</div></article>
      <article className="crm-panel orders-snapshot"><header><div><span className="technical">{"// ACTIVE ORDERS"}</span><h2>Заказы в работе</h2></div><Link href="/orders">Открыть Kanban <ArrowRight/></Link></header><div className="snapshot-list">{orders.filter(order=>order.status!=="Выдано").slice(0,5).map(order=><Link href={`/orders?open=${order.id}`} key={order.id}><span className="mono">{order.id}</span><span><b>{order.device}</b><small>{order.customer}</small></span><span className={`status status-${order.status}`}>{order.status}</span><strong>{formatMoney(order.amount)}</strong></Link>)}</div></article>
      <article className="crm-panel live-events"><header><div><span className="technical">{"// EVENT STREAM"}</span><h2>Последние события</h2></div><Clock3/></header><div className="event-feed">{events.slice(0,5).map(event=><div key={event.id}><i className={event.tone}/><span className="mono">{event.time}</span><span><b>{event.title}</b><small>{event.detail}</small></span></div>)}</div></article>
    </section>
  </CrmShell>
}
