"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useMemo, useState } from "react";
import { CrmShell } from "@/components/crm-shell";
import { crmData, formatMoney, OrderRecord } from "@/lib/crm-data";

export default function AnalyticsPage(){
  const [orders,setOrders]=useState<OrderRecord[]>([]);useEffect(()=>{crmData.seed();setOrders(crmData.getOrders())},[]);
  const byStatus=useMemo(()=>["Новые","Диагностика","Согласование","В работе","Готово","Выдано"].map(status=>({status,count:orders.filter(order=>order.status===status).length})),[orders]);
  return <CrmShell title="Аналитика" eyebrow="PERFORMANCE / ANALYTICS">
    <div className="analytics-hero"><div><span className="technical cyan">{"// MONTHLY PERFORMANCE"}</span><h2>Производительность сервиса</h2><p>Август 2026 · обновлено только что</p></div><div><span>Выручка за период</span><b>{formatMoney(orders.reduce((sum,item)=>sum+item.amount,0))}</b><small className="green">+12,8% к июлю</small></div></div>
    <div className="analytics-grid"><article className="crm-panel"><header><div><span className="technical">{"// ORDER DISTRIBUTION"}</span><h2>Распределение заказов</h2></div></header><div className="status-distribution">{byStatus.map(item=><div key={item.status}><span>{item.status}</span><div><i style={{width:`${Math.max(item.count*23,8)}%`}}/></div><b>{item.count}</b></div>)}</div></article><article className="crm-panel"><header><div><span className="technical">{"// TOP SERVICES"}</span><h2>Популярные работы</h2></div></header><div className="top-services">{[["Замена дисплея",35],["Диагностика",26],["Компонентный ремонт",21],["Чистка и обслуживание",18]].map((item,index)=><div key={String(item[0])}><b className="mono">0{index+1}</b><span>{item[0]}</span><strong>{item[1]}%</strong></div>)}</div></article></div>
  </CrmShell>
}
