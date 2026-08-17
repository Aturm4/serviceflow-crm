"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, CircleDollarSign, Clock3, Gauge, ShoppingBag, TrendingUp, TriangleAlert } from "lucide-react";
import { CrmShell } from "@/components/crm-shell";
import { crmData, EmployeeRecord, EventRecord, formatMoney, OrderRecord } from "@/lib/crm-data";

const revenue=[42,54,49,68,63,84,76,92,88,112,104,126,119,142];

export default function DashboardPage(){
  const [orders,setOrders]=useState<OrderRecord[]>([]),[employees,setEmployees]=useState<EmployeeRecord[]>([]),[events,setEvents]=useState<EventRecord[]>([]);
  useEffect(()=>{const load=()=>{crmData.seed();setOrders(crmData.getOrders());setEmployees(crmData.getEmployees());setEvents(crmData.getEvents())};load();return crmData.subscribe(load)},[]);
  const stats=useMemo(()=>{const active=orders.filter(order=>order.status!=="Выдано"),paid=orders.filter(order=>order.status==="Выдано"),total=orders.reduce((sum,order)=>sum+order.amount,0);return {active:active.length,revenue:total,average:orders.length?Math.round(total/orders.length):0,overdue:active.filter(order=>order.due<"2026-08-17").length,paid:paid.length}},[orders]);
  return <CrmShell title="Обзор" eyebrow="NOVA SERVICE / DASHBOARD" actions={<Link className="primary-button small" href="/orders?create=1">Новый заказ <ArrowRight/></Link>}>
    <section className="crm-kpis">
      <article className="cyan"><span><CircleDollarSign/>Выручка</span><b>{formatMoney(stats.revenue)}</b><small className="green"><TrendingUp/>+12,8% к прошлой неделе</small></article>
      <article className="violet"><span><ShoppingBag/>Активные заказы</span><b>{stats.active}</b><small>4 новых сегодня</small></article>
      <article className="green"><span><Gauge/>Средний чек</span><b>{formatMoney(stats.average)}</b><small className="green">+6,4% за месяц</small></article>
      <article className="orange"><span><TriangleAlert/>Просрочено</span><b>{stats.overdue+2}</b><small className="orange">Требуют внимания</small></article>
    </section>
    <section className="dashboard-layout">
      <article className="crm-panel revenue-chart"><header><div><span className="technical">{"// REVENUE STREAM"}</span><h2>Динамика выручки</h2></div><span className="period-chip">Последние 14 дней</span></header><div className="chart-summary"><b>18,4 млн сум</b><span className="green">+12,8%</span></div><div className="bar-chart">{revenue.map((value,index)=><div key={index}><i style={{height:`${value/1.55}%`}}/><span>{index%2===0?`${index+4} авг`:""}</span></div>)}</div></article>
      <article className="crm-panel team-load"><header><div><span className="technical">{"// TEAM CAPACITY"}</span><h2>Загрузка мастеров</h2></div><Link href="/employees">Все мастера <ArrowRight/></Link></header><div>{employees.map(employee=><div className="team-load-row" key={employee.id}><span className="avatar cyan-bg">{employee.name.split(" ").map(part=>part[0]).join("")}</span><span><b>{employee.name}</b><small>{employee.specialty}</small></span><div className="capacity"><i style={{width:`${employee.capacity}%`}}/></div><strong>{employee.capacity}%</strong></div>)}</div></article>
      <article className="crm-panel orders-snapshot"><header><div><span className="technical">{"// ACTIVE ORDERS"}</span><h2>Заказы в работе</h2></div><Link href="/orders">Открыть Kanban <ArrowRight/></Link></header><div className="snapshot-list">{orders.filter(order=>order.status!=="Выдано").slice(0,5).map(order=><Link href={`/orders?open=${order.id}`} key={order.id}><span className="mono">{order.id}</span><span><b>{order.device}</b><small>{order.customer}</small></span><span className={`status status-${order.status}`}>{order.status}</span><strong>{formatMoney(order.amount)}</strong></Link>)}</div></article>
      <article className="crm-panel live-events"><header><div><span className="technical">{"// EVENT STREAM"}</span><h2>Последние события</h2></div><Clock3/></header><div className="event-feed">{events.slice(0,5).map(event=><div key={event.id}><i className={event.tone}/><span className="mono">{event.time}</span><span><b>{event.title}</b><small>{event.detail}</small></span></div>)}</div></article>
    </section>
  </CrmShell>
}
