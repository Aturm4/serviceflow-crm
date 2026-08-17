"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Gauge, MoreHorizontal, Wrench } from "lucide-react";
import { CrmShell } from "@/components/crm-shell";
import { crmData, EmployeeRecord, OrderRecord } from "@/lib/crm-data";

export default function EmployeesPage(){
  const [employees,setEmployees]=useState<EmployeeRecord[]>([]),[orders,setOrders]=useState<OrderRecord[]>([]);
  useEffect(()=>{crmData.seed();setEmployees(crmData.getEmployees());setOrders(crmData.getOrders())},[]);
  function toggle(id:string){const next=employees.map(item=>item.id===id?{...item,status:item.status==="Работает"?"Перерыв":"Работает" as EmployeeRecord["status"]}:item);setEmployees(next);crmData.saveEmployees(next);crmData.addEvent("Статус мастера изменён",next.find(item=>item.id===id)?.name||"","cyan")}
  return <CrmShell title="Мастера" eyebrow="TEAM / EMPLOYEES">
    <div className="employee-summary"><span><Gauge/><b>{Math.round(employees.reduce((sum,item)=>sum+item.capacity,0)/Math.max(employees.length,1))}%</b><small>Средняя загрузка</small></span><span><Wrench/><b>{orders.filter(order=>order.status==="В работе").length}</b><small>Заказов в работе</small></span><span><CheckCircle2/><b>{employees.reduce((sum,item)=>sum+item.completed,0)}</b><small>Выполнено всего</small></span><span><Clock3/><b>2,1 дня</b><small>Средний срок</small></span></div>
    <div className="employee-grid">{employees.map(employee=>{const active=orders.filter(order=>order.employeeId===employee.id&&order.status!=="Выдано");return <article key={employee.id} className="employee-card"><header><span className="avatar cyan-bg">{employee.name.split(" ").map(part=>part[0]).join("")}</span><span><b>{employee.name}</b><small>{employee.specialty}</small></span><button aria-label="Ещё"><MoreHorizontal/></button></header><div className="employee-status-row"><button className={`employee-status ${employee.status}`} onClick={()=>toggle(employee.id)}><i/>{employee.status}</button><span>{active.length} активных заказа</span></div><div className="employee-capacity"><span>Загрузка <b>{employee.capacity}%</b></span><div className="capacity"><i style={{width:`${employee.capacity}%`}}/></div></div><div className="employee-stats"><span><b>{employee.completed}</b>выполнено</span><span><b>{employee.avgDays} дня</b>средний срок</span></div><div className="employee-orders">{active.slice(0,2).map(order=><span key={order.id}><b className="mono">{order.id}</b>{order.device}<em>{order.status}</em></span>)}{!active.length&&<small>Нет активных заказов</small>}</div></article>})}</div>
  </CrmShell>
}
