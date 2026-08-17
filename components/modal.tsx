"use client";

import { X } from "lucide-react";

export function AppModal({title,eyebrow,onClose,children,wide=false}:{title:string;eyebrow:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){
  return <div className="overlay modal-wrap" role="presentation" onMouseDown={event=>event.target===event.currentTarget&&onClose()}>
    <section className={`app-modal ${wide?"wide":""}`} role="dialog" aria-modal="true" aria-label={title}>
      <header><div><span className="technical cyan">{`// ${eyebrow}`}</span><h2>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Закрыть"><X/></button></header>
      {children}
    </section>
  </div>;
}

