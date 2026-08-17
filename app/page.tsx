"use client";

import { useMemo, useState } from "react";
import {
  Activity, ArrowRight, Bell, Bot, CalendarClock, Check, ChevronDown,
  CircleDollarSign, Command, FileText, Filter, Gauge, LayoutDashboard,
  Menu, MessageSquareText, MoreHorizontal, Plus, Search, Settings2,
  Table2, Users, Wrench, X, Zap
} from "lucide-react";

type Stage = "Новые" | "Диагностика" | "Согласование" | "В работе" | "Запчасти" | "Готовы";
type Order = { id:string; client:string; device:string; issue:string; master:string; stage:Stage; price:number; due:string; urgent?:boolean };

const initialOrders: Order[] = [
  { id:"SF-1048", client:"Диана Арсланова", device:"MacBook Pro 14″", issue:"Не включается после обновления", master:"Алексей", stage:"Новые", price:0, due:"Сегодня, 18:00", urgent:true },
  { id:"SF-1044", client:"Руслан Каримов", device:"iPhone 15 Pro", issue:"Замена заднего стекла", master:"Мария", stage:"Диагностика", price:1850000, due:"Сегодня, 16:30" },
  { id:"SF-1041", client:"ООО «Vector»", device:"Lenovo ThinkPad X1", issue:"Перегрев и шум кулера", master:"Тимур", stage:"Согласование", price:920000, due:"Завтра, 12:00" },
  { id:"SF-1039", client:"Малика Усманова", device:"Samsung S24 Ultra", issue:"Разбит дисплей", master:"Мария", stage:"В работе", price:2700000, due:"Сегодня, 19:00", urgent:true },
  { id:"SF-1037", client:"Александр Ли", device:"PlayStation 5", issue:"Не читает диски", master:"Алексей", stage:"Запчасти", price:1480000, due:"19 авг, 14:00" },
  { id:"SF-1033", client:"Сабина Нурова", device:"iPad Air M2", issue:"Замена USB-C", master:"Тимур", stage:"Готовы", price:1150000, due:"Готов к выдаче" },
];

const stages: Stage[] = ["Новые","Диагностика","Согласование","В работе","Запчасти","Готовы"];
const money = (v:number) => v ? new Intl.NumberFormat("ru-RU").format(v) + " сум" : "Оценка";

export default function Home() {
  const [view,setView] = useState("Дашборд");
  const [orders,setOrders] = useState(initialOrders);
  const [search,setSearch] = useState("");
  const [status,setStatus] = useState("Все статусы");
  const [requestMode,setRequestMode] = useState<"board"|"table">("board");
  const [selected,setSelected] = useState<Order|null>(null);
  const [newOrder,setNewOrder] = useState(false);
  const [mobileNav,setMobileNav] = useState(false);
  const [toast,setToast] = useState("");

  const filtered = useMemo(() => orders.filter(o => {
    const hay = `${o.id} ${o.client} ${o.device} ${o.issue}`.toLowerCase();
    return hay.includes(search.toLowerCase()) && (status === "Все статусы" || o.stage === status);
  }),[orders,search,status]);

  const notify = (text:string) => { setToast(text); window.setTimeout(()=>setToast(""),2200); };
  const jumpToApp = () => document.querySelector("#product")?.scrollIntoView({behavior:"smooth"});
  const moveOrder = (id:string, stage:Stage) => setOrders(prev => prev.map(o => o.id === id ? {...o,stage} : o));

  function submitOrder(e:React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const added:Order = { id:`SF-${1050 + orders.length}`, client:String(fd.get("client")), device:String(fd.get("device")), issue:String(fd.get("issue")), master:"Не назначен", stage:"Новые", price:0, due:"Сегодня" };
    setOrders([added,...orders]); setNewOrder(false); setView("Заявки"); notify("Заявка создана и добавлена в очередь");
  }

  const appNav = [
    ["Дашборд",LayoutDashboard],["Заявки",Wrench],["Клиенты",Users],["Мастера",Gauge],["Автоматизации",Zap]
  ] as const;

  return <main>
    <div className="ambient" aria-hidden="true"><i/><i/><i/></div><div className="scanlines" aria-hidden="true"/>
    <header className="site-header">
      <a className="brand" href="#top"><span className="brand-mark"><Command size={17}/></span>ServiceFlow</a>
      <nav className={mobileNav ? "nav open" : "nav"}>
        <a href="#platform">Платформа</a><a href="#workflow">Процессы</a><a href="#product">Интерфейс</a><a href="#contact">Контакты</a>
      </nav>
      <div className="header-actions"><button className="ghost-button" onClick={jumpToApp}>Войти</button><button className="primary-button small" onClick={()=>setNewOrder(true)}>Попробовать <ArrowRight size={15}/></button></div>
      <button className="menu-button" aria-label="Меню" onClick={()=>setMobileNav(!mobileNav)}>{mobileNav?<X/>:<Menu/>}</button>
    </header>

    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="eyebrow"><span className="live-dot"/> Сервис под контролем. В реальном времени.</div>
        <h1>Каждый ремонт.<br/><span>В одном потоке.</span></h1>
        <p>Заявки, мастера, клиенты и уведомления — в CRM, которая показывает работу сервиса как она есть: ясно, быстро и без потерянных деталей.</p>
        <div className="hero-actions"><button className="primary-button" onClick={jumpToApp}>Открыть живое демо <ArrowRight size={17}/></button><button className="secondary-button" onClick={()=>setNewOrder(true)}><Plus size={17}/> Создать заявку</button></div>
        <div className="proof-row"><span><Check/> Настройка за 1 день</span><span><Check/> Без карты</span><span><Check/> Данные готовы к Supabase</span></div>
      </div>
      <div className="hero-console" aria-label="Сводка работы сервиса">
        <div className="window-bar"><span className="traffic"><i/><i/><i/></span><span className="mono">serviceflow / live-desk</span><span className="window-live">LIVE</span></div>
        <div className="console-head"><div><span className="technical">{"// СЕГОДНЯ · 17 АВГУСТА"}</span><h3>Добрый вечер, Саид</h3></div><button className="icon-button" aria-label="Уведомления"><Bell size={17}/><b>3</b></button></div>
        <div className="metrics-strip">
          <div><span>Открыто</span><strong>24</strong><small className="cyan">+3 сегодня</small></div>
          <div><span>Срочные</span><strong>04</strong><small className="orange">2 просрочено</small></div>
          <div><span>Выручка</span><strong>18,4 млн</strong><small className="green">+12,8%</small></div>
        </div>
        <div className="mini-flow">
          <div className="flow-label"><span>Поток заявок</span><span className="mono">17:42:08</span></div>
          {[orders[3],orders[1],orders[5]].map((o,i)=><button key={o.id} className="flow-row" onClick={()=>setSelected(o)}><span className={`status-rail s${i}`}/><b className="mono">{o.id}</b><span>{o.device}</span><em>{o.stage}</em><strong>{money(o.price)}</strong></button>)}
        </div>
        <div className="console-foot"><span><Activity size={14}/> Все системы работают</span><span className="mono">SYNC 4s AGO</span></div>
      </div>
    </section>

    <div className="signal-strip"><div>{["ЗАЯВКИ","ДИАГНОСТИКА","СОГЛАСОВАНИЕ","РЕМОНТ","ЗАПЧАСТИ","ВЫДАЧА","УВЕДОМЛЕНИЯ","АНАЛИТИКА"].map((x,i)=><span key={i}>{x}<i>◆</i></span>)}</div></div>

    <section className="section intro" id="platform">
      <div className="section-copy"><span className="technical magenta">{"// ОПЕРАЦИОННЫЙ ЦЕНТР"}</span><h2>Не отчёт о работе.<br/>Сама работа.</h2></div>
      <p>ServiceFlow объединяет приёмку, ремонт и коммуникацию с клиентом в едином живом пространстве. Меньше переключений — больше завершённых заказов.</p>
    </section>

    <section className="product-shell" id="product">
      <aside className="app-sidebar">
        <div className="app-brand"><span className="brand-mark"><Command size={15}/></span><span>ServiceFlow<small>CRM</small></span></div>
        <div className="workspace"><span className="avatar">НС</span><span>Nova Service<small>Ташкент · 4 мастера</small></span><ChevronDown size={14}/></div>
        <nav>{appNav.map(([label,Icon])=><button key={label} className={view===label?"active":""} onClick={()=>setView(label)}><Icon size={16}/>{label}{label==="Заявки"&&<b>{orders.length}</b>}</button>)}</nav>
        <div className="side-bottom"><button><Settings2 size={16}/> Настройки</button><div className="operator"><span className="avatar cyan-bg">СК</span><span>Саид Каримов<small>Администратор</small></span></div></div>
      </aside>
      <section className="app-main">
        <div className="app-toolbar"><div><span className="technical">{`// NOVA-SERVICE / ${view.toUpperCase()}`}</span><h3>{view}</h3></div><div className="toolbar-actions"><label className="search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Поиск…"/></label><button className="icon-button"><Bell size={17}/><b>3</b></button><button className="primary-button small" onClick={()=>setNewOrder(true)}><Plus size={15}/> Новая заявка</button></div></div>
        {view === "Дашборд" && <Dashboard orders={orders} onOrder={setSelected} onNew={()=>setNewOrder(true)} onGo={setView}/>} 
        {view === "Заявки" && <Requests orders={filtered} search={search} setSearch={setSearch} status={status} setStatus={setStatus} mode={requestMode} setMode={setRequestMode} onOrder={setSelected} onMove={moveOrder}/>} 
        {view === "Клиенты" && <Clients/>}
        {view === "Мастера" && <Masters/>}
        {view === "Автоматизации" && <Automations notify={notify}/>} 
      </section>
    </section>

    <section className="section story-head" id="workflow"><div><span className="technical cyan">{"// ПРОДУКТ В ДЕЙСТВИИ"}</span><h2>Сложный процесс.<br/>Понятный с первого взгляда.</h2></div><p>Не набор обещаний, а фрагменты настоящей работы: очередь ремонта, загрузка команды, деньги и события связаны между собой.</p></section>

    <section className="asym-grid">
      <article className="demo-kanban feature-panel"><PanelHead label="LIVE / WORKBOARD" title="Очередь ремонта" icon={<Wrench size={16}/>}/><MiniBoard/></article>
      <article className="load-panel feature-panel"><PanelHead label="TEAM / CAPACITY" title="Загрузка мастеров" icon={<Gauge size={16}/>}/><LoadBars/></article>
      <article className="revenue-panel feature-panel"><PanelHead label="PERFORMANCE" title="Выручка и сроки" icon={<CircleDollarSign size={16}/>}/><div className="revenue-number">18,4 <small>млн сум</small></div><div className="sparkline"><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/><i/></div><div className="split-stat"><span><b>2,8 дня</b>средний ремонт</span><span><b className="green">+12,8%</b>к прошлой неделе</span></div></article>
      <article className="events-panel feature-panel"><PanelHead label="EVENT STREAM" title="Последние события" icon={<Activity size={16}/>}/><EventFeed compact/></article>
      <article className="automation-rail feature-panel"><div><span className="technical magenta">{"// АВТОМАТИЗАЦИИ"}</span><h3>Система двигает процесс, пока команда ремонтирует.</h3></div><div className="automation-flow"><span><Zap/> Статус изменён</span><ArrowRight/><span><MessageSquareText/> Клиент уведомлён</span><ArrowRight/><span><Check/> Доставка подтверждена</span></div></article>
    </section>

    <section className="cta" id="contact"><div><span className="technical cyan">{"// READY TO FLOW"}</span><h2>Сервис без слепых зон.</h2><p>Посмотрите, как ServiceFlow соберёт вашу команду, заказы и клиентов в единую рабочую систему.</p></div><button className="primary-button" onClick={()=>setNewOrder(true)}>Создать первую заявку <ArrowRight size={17}/></button></section>
    <footer><a className="brand" href="#top"><span className="brand-mark"><Command size={17}/></span>ServiceFlow</a><span>CRM для сервисных команд</span><span className="mono">© 2026 / BUILD 1.0.4</span></footer>

    {selected && <OrderDrawer order={selected} onClose={()=>setSelected(null)} notify={notify}/>} 
    {newOrder && <NewOrderModal onClose={()=>setNewOrder(false)} onSubmit={submitOrder}/>} 
    {toast && <div className="toast"><Check size={16}/>{toast}</div>}
  </main>;
}

function Dashboard({orders,onOrder,onNew,onGo}:{orders:Order[];onOrder:(o:Order)=>void;onNew:()=>void;onGo:(v:string)=>void}) {
  return <div className="dashboard-grid">
    <div className="kpi-row">
      <Kpi label="Открытые заявки" value="24" meta="+3 сегодня" tone="cyan"/><Kpi label="Срочные / просрочены" value="4 / 2" meta="Требуют внимания" tone="orange"/><Kpi label="Выручка сегодня" value="18,4 млн" meta="+12,8% к неделе" tone="green"/><Kpi label="Средний срок" value="2,8 дня" meta="−0,4 дня" tone="magenta"/>
    </div>
    <article className="dash-board panel"><PanelHead label="LIVE QUEUE" title="Заявки в работе" icon={<Wrench size={16}/>} action={<button onClick={()=>onGo("Заявки")}>Открыть доску <ArrowRight/></button>}/><MiniBoard orders={orders} onOrder={onOrder}/></article>
    <article className="dash-load panel"><PanelHead label="TEAM" title="Загрузка мастеров" icon={<Gauge size={16}/>}/><LoadBars/></article>
    <article className="dash-events panel"><PanelHead label="STREAM" title="Последние события" icon={<Activity size={16}/>}/><EventFeed/></article>
    <article className="quick-panel panel"><PanelHead label="COMMANDS" title="Быстрые действия" icon={<Command size={16}/>}/><div className="quick-actions"><button onClick={onNew}><Plus/>Новая заявка</button><button><CalendarClock/>Запланировать</button><button><Users/>Найти клиента</button><button><FileText/>Сформировать акт</button></div></article>
  </div>
}

function Requests({orders,search,setSearch,status,setStatus,mode,setMode,onOrder,onMove}:{orders:Order[];search:string;setSearch:(s:string)=>void;status:string;setStatus:(s:string)=>void;mode:"board"|"table";setMode:(m:"board"|"table")=>void;onOrder:(o:Order)=>void;onMove:(id:string,s:Stage)=>void}) {
  return <div className="requests-view"><div className="filters"><label className="search wide"><Search/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Номер, клиент, устройство…"/></label><label className="select-wrap"><Filter/><select value={status} onChange={e=>setStatus(e.target.value)}><option>Все статусы</option>{stages.map(s=><option key={s}>{s}</option>)}</select></label><div className="mode-toggle"><button className={mode==="board"?"active":""} onClick={()=>setMode("board")}><LayoutDashboard/>Доска</button><button className={mode==="table"?"active":""} onClick={()=>setMode("table")}><Table2/>Таблица</button></div></div>
  {mode==="board" ? <div className="full-board">{stages.map(stage=><div className="board-column" key={stage} onDragOver={e=>e.preventDefault()} onDrop={e=>onMove(e.dataTransfer.getData("text/order"),stage)}><div className="column-head"><span>{stage}</span><b>{orders.filter(o=>o.stage===stage).length}</b></div>{orders.filter(o=>o.stage===stage).map(o=><OrderCard key={o.id} order={o} onClick={()=>onOrder(o)}/>)}</div>)}</div> : <OrdersTable orders={orders} onOrder={onOrder}/>}</div>
}

function OrderCard({order,onClick}:{order:Order;onClick:()=>void}) { return <button draggable onDragStart={e=>e.dataTransfer.setData("text/order",order.id)} onClick={onClick} className="order-card"><div><span className="mono">{order.id}</span>{order.urgent&&<em>Срочно</em>}</div><b>{order.device}</b><p>{order.issue}</p><footer><span className="avatar mini">{order.master.slice(0,1)}</span><span>{order.master}</span><strong>{money(order.price)}</strong></footer></button> }
function OrdersTable({orders,onOrder}:{orders:Order[];onOrder:(o:Order)=>void}) { return <div className="table-wrap"><table><thead><tr><th>Номер</th><th>Клиент / устройство</th><th>Неисправность</th><th>Мастер</th><th>Статус</th><th>Стоимость</th><th>Срок</th></tr></thead><tbody>{orders.map(o=><tr key={o.id} onClick={()=>onOrder(o)}><td className="mono">{o.id}</td><td><b>{o.client}</b><small>{o.device}</small></td><td>{o.issue}</td><td>{o.master}</td><td><span className={`status ${o.stage}`}>{o.stage}</span></td><td>{money(o.price)}</td><td className={o.urgent?"danger":""}>{o.due}</td></tr>)}</tbody></table></div> }

function Clients(){ const data=[["ДА","Диана Арсланова","3 устройства","7 заказов","8 420 000 сум"],["РК","Руслан Каримов","2 устройства","4 заказа","5 780 000 сум"],["OV","ООО «Vector»","12 устройств","19 заказов","42 100 000 сум"],["МУ","Малика Усманова","1 устройство","2 заказа","3 550 000 сум"]]; return <div className="entity-view"><div className="entity-hero"><div><span className="technical">{"// CUSTOMER BASE"}</span><h3>1 284 клиента</h3><p>История обращений, устройства и коммуникации в одном профиле.</p></div><div className="entity-metric"><span>Повторные обращения</span><b>68%</b><small className="green">+5,2% за квартал</small></div></div><div className="client-list">{data.map(c=><button key={c[1]}><span className="avatar">{c[0]}</span><span><b>{c[1]}</b><small>{c[2]} · {c[3]}</small></span><strong>{c[4]}</strong><ArrowRight/></button>)}</div></div> }
function Masters(){ return <div className="entity-view"><div className="entity-hero"><div><span className="technical">{"// TEAM CAPACITY"}</span><h3>Команда сегодня</h3><p>Распределяйте заявки по фактической загрузке и специализации.</p></div><div className="entity-metric"><span>Средняя загрузка</span><b>74%</b><small>18 активных заказов</small></div></div><div className="master-grid">{[["Алексей","Ноутбуки · Консоли",82,"6 заказов","2,4 дня"],["Мария","Apple · Samsung",94,"7 заказов","1,8 дня"],["Тимур","Ноутбуки · Пайка",61,"4 заказа","2,9 дня"],["Илья","Диагностика",38,"2 заказа","1,2 дня"]].map(m=><article key={String(m[0])}><span className="avatar cyan-bg">{String(m[0]).slice(0,1)}</span><div><b>{m[0]}</b><small>{m[1]}</small></div><strong>{m[2]}%</strong><div className="capacity"><i style={{width:`${m[2]}%`}}/></div><footer><span>{m[3]}</span><span>среднее {m[4]}</span></footer></article>)}</div></div> }
function Automations({notify}:{notify:(s:string)=>void}){ const [enabled,setEnabled]=useState([true,true,true,false]); const rows=[["Новая заявка","Назначить очередь и уведомить администратора","142 запуска"],["Заказ просрочен","Напомнить мастеру и отметить как срочный","8 запусков"],["Ремонт готов","Отправить клиенту SMS со ссылкой на оплату","37 запусков"],["Повторный визит","Запросить отзыв через 3 дня после выдачи","—"]]; return <div className="entity-view"><div className="entity-hero"><div><span className="technical magenta">{"// AUTOMATION ENGINE"}</span><h3>Автоматизации</h3><p>Правила, триггеры и журнал каждого выполнения.</p></div><div className="entity-metric"><span>Успешно за 7 дней</span><b>98,7%</b><small className="green">187 из 190</small></div></div><div className="automation-list">{rows.map((r,i)=><article key={r[0]}><span className={`automation-icon ${enabled[i]?"on":""}`}><Bot/></span><div><b>{r[0]}</b><small>{r[1]}</small></div><span className="mono run-count">{r[2]}</span><button className={`switch ${enabled[i]?"on":""}`} aria-label={`Переключить ${r[0]}`} onClick={()=>{setEnabled(v=>v.map((x,j)=>j===i?!x:x));notify(enabled[i]?"Автоматизация остановлена":"Автоматизация включена")}}><i/></button></article>)}</div><div className="run-log"><span className="technical">{"// EXECUTION LOG"}</span>{[["17:41:08","SF-1033","SMS доставлено","success"],["17:36:22","SF-1039","Статус изменён: В работе","success"],["17:31:04","SF-1037","Ошибка доставки уведомления","error"]].map(x=><div key={x[0]}><span className="mono">{x[0]}</span><b className="mono">{x[1]}</b><span>{x[2]}</span><em className={x[3]}>{x[3]==="success"?"OK":"ERROR"}</em></div>)}</div></div> }

function Kpi({label,value,meta,tone}:{label:string;value:string;meta:string;tone:string}) { return <article className={`kpi ${tone}`}><span>{label}</span><b>{value}</b><small>{meta}</small></article> }
function PanelHead({label,title,icon,action}:{label:string;title:string;icon:React.ReactNode;action?:React.ReactNode}) { return <header className="panel-head"><div><span className="technical">{`// ${label}`}</span><h4>{icon}{title}</h4></div>{action||<button className="more"><MoreHorizontal/></button>}</header> }
function MiniBoard({orders=initialOrders,onOrder}:{orders?:Order[];onOrder?:(o:Order)=>void}) { return <div className="mini-board">{["Новые","В работе","Готовы"].map(stage=><div key={stage}><header><span>{stage}</span><b>{orders.filter(o=>o.stage===stage).length}</b></header>{orders.filter(o=>o.stage===stage).slice(0,2).map(o=><button key={o.id} onClick={()=>onOrder?.(o)}><span className="mono">{o.id}</span><b>{o.device}</b><small>{o.issue}</small><footer><span>{o.master}</span><strong>{money(o.price)}</strong></footer></button>)}</div>)}</div> }
function LoadBars(){ return <div className="load-bars">{[["Алексей",82,6],["Мария",94,7],["Тимур",61,4],["Илья",38,2]].map(([n,p,c])=><div key={String(n)}><span className="avatar mini">{String(n).slice(0,1)}</span><span><b>{n}</b><small>{c} активных</small></span><div className="bar"><i style={{width:`${p}%`}}/></div><strong>{p}%</strong></div>)}</div> }
function EventFeed({compact=false}:{compact?:boolean}) { const items=[["17:41","SF-1033 готов к выдаче","Клиенту отправлено SMS","green"],["17:36","SF-1039 взят в работу","Мария · пост 04","cyan"],["17:31","SF-1041 согласован","Оплата подтверждена","magenta"],["17:18","SF-1048 создан","Онлайн-форма","orange"]]; return <div className="event-feed">{items.slice(0,compact?4:3).map(x=><div key={x[0]}><i className={x[3]}/><span className="mono">{x[0]}</span><span><b>{x[1]}</b><small>{x[2]}</small></span></div>)}</div> }

function OrderDrawer({order,onClose,notify}:{order:Order;onClose:()=>void;notify:(s:string)=>void}) { return <div className="overlay" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><aside className="drawer"><header><div><span className="technical">{"// ORDER DETAIL"}</span><h3 className="mono">{order.id}</h3></div><button className="icon-button" onClick={onClose}><X/></button></header><div className="drawer-status"><span className={`status ${order.stage}`}>{order.stage}</span><span className="mono">Срок: {order.due}</span></div><section><span className="section-label">Клиент и устройство</span><h4>{order.client}</h4><p>{order.device} · SN C02ZQ0LALVDQ</p><button className="text-button">Открыть профиль клиента <ArrowRight/></button></section><section><span className="section-label">Описание проблемы</span><p>{order.issue}. Клиент просит сохранить данные и предварительно согласовать дополнительные работы.</p><div className="photo-row"><div>ФОТО<br/><span>Приёмка 01</span></div><div>ФОТО<br/><span>Корпус 02</span></div><button><Plus/>Добавить</button></div></section><section><span className="section-label">Работы и запчасти</span><div className="line-item"><span>Диагностика устройства<small>1 × 150 000</small></span><b>150 000 сум</b></div><div className="line-item"><span>Основная работа<small>1 × {money(Math.max(order.price-150000,0))}</small></span><b>{money(Math.max(order.price-150000,0))}</b></div><div className="total"><span>Итого</span><b>{money(order.price)}</b></div></section><section><span className="section-label">История статусов</span><div className="history"><span><i/>Сегодня, 17:36<b>{order.stage}</b></span><span><i/>Сегодня, 16:48<b>Диагностика завершена</b></span><span><i/>Сегодня, 14:12<b>Заявка создана</b></span></div></section><footer><button className="secondary-button" onClick={()=>notify("Комментарий добавлен")}><MessageSquareText/>Комментарий</button><button className="primary-button" onClick={()=>notify("Клиенту отправлено уведомление")}><Bell/>Уведомить клиента</button></footer></aside></div> }
function NewOrderModal({onClose,onSubmit}:{onClose:()=>void;onSubmit:(e:React.FormEvent<HTMLFormElement>)=>void}) { return <div className="overlay modal-wrap" role="presentation" onMouseDown={e=>e.target===e.currentTarget&&onClose()}><form className="modal" onSubmit={onSubmit}><header><div><span className="technical cyan">{"// NEW ORDER"}</span><h3>Новая заявка</h3></div><button type="button" className="icon-button" onClick={onClose}><X/></button></header><label>Клиент<input required name="client" placeholder="Имя или компания"/></label><div className="form-row"><label>Устройство<input required name="device" placeholder="Например, iPhone 15 Pro"/></label><label>Телефон<input required name="phone" placeholder="+998 90 000 00 00"/></label></div><label>Описание неисправности<textarea required name="issue" placeholder="Что случилось с устройством?"/></label><div className="form-row"><label>Мастер<select name="master"><option>Назначить позже</option><option>Алексей</option><option>Мария</option><option>Тимур</option></select></label><label>Срок<input name="due" type="date"/></label></div><footer><button type="button" className="secondary-button" onClick={onClose}>Отмена</button><button className="primary-button">Создать заявку <ArrowRight/></button></footer></form></div> }
