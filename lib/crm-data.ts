export type OrderStatus = "Новые" | "Диагностика" | "Согласование" | "В работе" | "Готово" | "Выдано";
export type OrderRecord = {
  id: string; customerId: string; customer: string; device: string; issue: string;
  employeeId: string; employee: string; status: OrderStatus; amount: number; due: string;
  createdAt: string; notes: string; urgent?: boolean;
};
export type CustomerRecord = {
  id: string; name: string; phone: string; email: string; devices: string[]; notes: string; createdAt: string;
};
export type EmployeeRecord = {
  id: string; name: string; specialty: string; status: "Работает" | "Перерыв" | "Выходной";
  capacity: number; completed: number; avgDays: number;
};
export type EventRecord = { id: string; time: string; title: string; detail: string; tone: "cyan" | "green" | "orange" | "magenta" };
export type WorkspaceSettings = { company:string; email:string; phone:string; timezone:string; address:string; sms:boolean; overdueReminders:boolean };

import { authService } from "@/lib/auth";

const ORDERS_KEY = "serviceflow:crm:orders:v1";
const CUSTOMERS_KEY = "serviceflow:crm:customers:v1";
const EMPLOYEES_KEY = "serviceflow:crm:employees:v1";
const EVENTS_KEY = "serviceflow:crm:events:v1";
const DATA_EVENT = "serviceflow:data-change";
const SETTINGS_KEY = "serviceflow:crm:settings:v1";

const employees: EmployeeRecord[] = [
  { id:"emp-1", name:"Алексей Морозов", specialty:"Ноутбуки · Консоли", status:"Работает", capacity:82, completed:146, avgDays:2.4 },
  { id:"emp-2", name:"Мария Юсупова", specialty:"Apple · Samsung", status:"Работает", capacity:94, completed:203, avgDays:1.8 },
  { id:"emp-3", name:"Тимур Саидов", specialty:"Компонентный ремонт", status:"Работает", capacity:61, completed:118, avgDays:2.9 },
  { id:"emp-4", name:"Илья Пак", specialty:"Диагностика · ПО", status:"Перерыв", capacity:38, completed:92, avgDays:1.2 },
];

const customers: CustomerRecord[] = [
  { id:"cus-1", name:"Диана Арсланова", phone:"+998 90 441 28 12", email:"diana.a@mail.uz", devices:["MacBook Pro 14″","iPhone 14"], notes:"Предпочитает связь в Telegram", createdAt:"2026-05-14" },
  { id:"cus-2", name:"Руслан Каримов", phone:"+998 93 515 09 44", email:"ruslan.k@gmail.com", devices:["iPhone 15 Pro"], notes:"Постоянный клиент", createdAt:"2026-02-09" },
  { id:"cus-3", name:"ООО «Vector»", phone:"+998 71 205 44 11", email:"it@vector.uz", devices:["Lenovo ThinkPad X1","Dell Latitude 7440"], notes:"Счёт и акт обязательны", createdAt:"2025-11-22" },
  { id:"cus-4", name:"Малика Усманова", phone:"+998 95 320 17 70", email:"malika.u@mail.uz", devices:["Samsung S24 Ultra"], notes:"", createdAt:"2026-07-03" },
  { id:"cus-5", name:"Александр Ли", phone:"+998 97 880 24 18", email:"alex.li@gmail.com", devices:["PlayStation 5"], notes:"Звонить после 18:00", createdAt:"2026-06-18" },
  { id:"cus-6", name:"Сабина Нурова", phone:"+998 90 770 63 51", email:"sabina.n@mail.uz", devices:["iPad Air M2"], notes:"", createdAt:"2026-04-25" },
];

const orders: OrderRecord[] = [
  { id:"SF-1048",customerId:"cus-1",customer:"Диана Арсланова",device:"MacBook Pro 14″",issue:"Не включается после обновления",employeeId:"emp-1",employee:"Алексей Морозов",status:"Новые",amount:0,due:"2026-08-17",createdAt:"2026-08-17T09:12:00",notes:"Сохранить данные",urgent:true },
  { id:"SF-1044",customerId:"cus-2",customer:"Руслан Каримов",device:"iPhone 15 Pro",issue:"Замена заднего стекла",employeeId:"emp-2",employee:"Мария Юсупова",status:"Диагностика",amount:1850000,due:"2026-08-17",createdAt:"2026-08-16T14:30:00",notes:"Оригинальная запчасть" },
  { id:"SF-1041",customerId:"cus-3",customer:"ООО «Vector»",device:"Lenovo ThinkPad X1",issue:"Перегрев и шум кулера",employeeId:"emp-3",employee:"Тимур Саидов",status:"Согласование",amount:920000,due:"2026-08-18",createdAt:"2026-08-15T11:20:00",notes:"Подготовить счёт" },
  { id:"SF-1039",customerId:"cus-4",customer:"Малика Усманова",device:"Samsung S24 Ultra",issue:"Разбит дисплей",employeeId:"emp-2",employee:"Мария Юсупова",status:"В работе",amount:2700000,due:"2026-08-17",createdAt:"2026-08-14T16:05:00",notes:"",urgent:true },
  { id:"SF-1037",customerId:"cus-5",customer:"Александр Ли",device:"PlayStation 5",issue:"Не читает диски",employeeId:"emp-1",employee:"Алексей Морозов",status:"В работе",amount:1480000,due:"2026-08-19",createdAt:"2026-08-13T10:40:00",notes:"Ожидаем привод" },
  { id:"SF-1033",customerId:"cus-6",customer:"Сабина Нурова",device:"iPad Air M2",issue:"Замена разъёма USB-C",employeeId:"emp-3",employee:"Тимур Саидов",status:"Готово",amount:1150000,due:"2026-08-17",createdAt:"2026-08-12T12:16:00",notes:"Клиент уведомлён" },
  { id:"SF-1028",customerId:"cus-2",customer:"Руслан Каримов",device:"AirPods Pro 2",issue:"Тихий звук правого наушника",employeeId:"emp-4",employee:"Илья Пак",status:"Выдано",amount:480000,due:"2026-08-15",createdAt:"2026-08-11T08:55:00",notes:"" },
];

const events: EventRecord[] = [
  {id:"ev-1",time:"17:41",title:"SF-1033 готов к выдаче",detail:"Клиенту отправлено уведомление",tone:"green"},
  {id:"ev-2",time:"17:36",title:"SF-1039 взят в работу",detail:"Мария · рабочее место 04",tone:"cyan"},
  {id:"ev-3",time:"17:31",title:"SF-1041 согласован",detail:"Стоимость подтверждена клиентом",tone:"magenta"},
  {id:"ev-4",time:"17:18",title:"SF-1048 создан",detail:"Источник: онлайн-форма",tone:"orange"},
];

function scoped(key:string){const userId=authService.getSession()?.id;return userId?`${key}:${userId}`:`${key}:anonymous`}
function read<T>(key:string, fallback:T):T {
  if (typeof window === "undefined") return fallback;
  try { const raw=localStorage.getItem(scoped(key)); const value=raw?JSON.parse(raw):fallback; return (Array.isArray(fallback)&&!Array.isArray(value))?fallback:value as T; } catch { return fallback; }
}
function write<T>(key:string,value:T){ localStorage.setItem(scoped(key),JSON.stringify(value)); window.dispatchEvent(new Event(DATA_EVENT)); }
function emitEvent(title:string,detail:string,tone:EventRecord["tone"]="cyan") {
  const list=crmData.getEvents();
  const time=new Date().toLocaleTimeString("ru-RU",{hour:"2-digit",minute:"2-digit"});
  write(EVENTS_KEY,[{id:crypto.randomUUID(),time,title,detail,tone},...list].slice(0,20));
}

export const crmData = {
  seed(){ if(typeof window==="undefined") return; if(!localStorage.getItem(scoped(ORDERS_KEY))) write(ORDERS_KEY,orders); if(!localStorage.getItem(scoped(CUSTOMERS_KEY))) write(CUSTOMERS_KEY,customers); if(!localStorage.getItem(scoped(EMPLOYEES_KEY))) write(EMPLOYEES_KEY,employees); if(!localStorage.getItem(scoped(EVENTS_KEY))) write(EVENTS_KEY,events); },
  getOrders:()=>read<OrderRecord[]>(ORDERS_KEY,orders),
  getCustomers:()=>read<CustomerRecord[]>(CUSTOMERS_KEY,customers),
  getEmployees:()=>read<EmployeeRecord[]>(EMPLOYEES_KEY,employees),
  getEvents:()=>read<EventRecord[]>(EVENTS_KEY,events),
  saveOrders:(value:OrderRecord[])=>write(ORDERS_KEY,value),
  saveCustomers:(value:CustomerRecord[])=>write(CUSTOMERS_KEY,value),
  saveEmployees:(value:EmployeeRecord[])=>write(EMPLOYEES_KEY,value),
  getSettings:()=>read<WorkspaceSettings>(SETTINGS_KEY,{company:authService.getSession()?.company||"ServiceFlow",email:authService.getSession()?.email||"",phone:"+998 71 205 44 11",timezone:"Asia/Tashkent",address:"Ташкент, ул. Шота Руставели, 12",sms:true,overdueReminders:true}),
  saveSettings:(value:WorkspaceSettings)=>write(SETTINGS_KEY,value),
  addEvent:emitEvent,
  subscribe(callback:()=>void){ if(typeof window==="undefined") return()=>undefined; window.addEventListener(DATA_EVENT,callback); window.addEventListener("storage",callback); return()=>{window.removeEventListener(DATA_EVENT,callback);window.removeEventListener("storage",callback)}; },
};

export const orderStatuses: OrderStatus[] = ["Новые","Диагностика","Согласование","В работе","Готово","Выдано"];
export const formatMoney = (value:number) => new Intl.NumberFormat("ru-RU").format(value)+" сум";
export function employeeLoad(employeeId:string, ordersList:OrderRecord[]){const active=ordersList.filter(order=>order.employeeId===employeeId&&order.status!=="Выдано").length;return Math.max(0,Math.min(100,Math.round(active/6*100)))}
