"use client";
import { useEffect, useState } from "react";
import { CheckCircle2, Clock3, Gauge, Wrench } from "lucide-react";
import { CrmShell } from "@/components/crm-shell";
import { crmData, employeeLoad, EmployeeRecord, OrderRecord } from "@/lib/crm-data";

export default function EmployeesPage(){
  const [employees,setEmployees]=useState<EmployeeRecord[]>([]),[orders,setOrders]=useState<OrderRecord[]>([]);
  useEffect(()=>{const load=()=>{crmData.seed();setEmployees(crmData.getEmployees());setOrders(crmData.getOrders())};load();return crmData.subscribe(load)},[]);
  function toggle(id:string){const next=employees.map(item=>item.id===id?{...item,status:item.status==="Работает"?"Перерыв":"Работает" as EmployeeRecord["status"]}:item);setEmployees(next);crmData.saveEmployees(next);crmData.addEvent("Статус мастера изменён",next.find(item=>item.id===id)?.name||"","cyan")}
  const averageLoad=Math.round(employees.reduce((sum,item)=>sum+employeeLoad(item.id,orders),0)/Math.max(employees.length,1));
  const averageDays=employees.length?(employees.reduce((sum,item)=>sum+item.avgDays,0)/employees.length).toFixed(1):"0";
  return <CrmShell title="Мастера" eyebrow="TEAM / EMPLOYEES">
    <div className="employee-summary"><span><Gauge/><b>{averageLoad}%</b><small>Средняя загрузка</small></span><span><Wrench/><b>{orders.filter(order=>order.status==="В работе").length}</b><small>Заказов в работе</small></span><span><CheckCircle2/><b>{employees.reduce((sum,item)=>sum+item.completed,0)}</b><small>Выполнено всего</small></span><span><Clock3/><b>{averageDays} дня</b><small>Средний срок</small></span></div>
    <div className="employee-grid">{employees.map(employee=>{const active=orders.filter(order=>order.employeeId===employee.id&&order.status!=="Выдано"),load=employeeLoad(employee.id,orders);return <article key={employee.id} className="employee-card"><header><span className="avatar cyan-bg">{employee.name.split(" ").map(part=>part[0]).join("")}</span><span><b>{employee.name}</b><small>{employee.specialty}</small></span></header><div className="employee-status-row"><button className={`employee-status ${employee.status}`} onClick={()=>toggle(employee.id)}><i/>{employee.status}</button><span>{active.length} активных заказа</span></div><div className="employee-capacity"><span>Загрузка <b>{load}%</b></span><div className="capacity"><i style={{width:`${load}%`}}/></div></div><div className="employee-stats"><span><b>{employee.completed}</b>выполнено</span><span><b>{employee.avgDays} дня</b>средний срок</span></div><div className="employee-orders">{active.slice(0,2).map(order=><span key={order.id}><b className="mono">{order.id}</b>{order.device}<em>{order.status}</em></span>)}{!active.length&&<small>Нет активных заказов</small>}</div></article>})}</div>
  </CrmShell>
}
