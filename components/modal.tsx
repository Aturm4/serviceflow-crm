"use client";

import { X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

let modalSequence=0;
const modalStack:number[]=[];
const STACK_EVENT="serviceflow:modal-stack";

export function AppModal({title,eyebrow,onClose,children,wide=false}:{title:string;eyebrow:string;onClose:()=>void;children:React.ReactNode;wide?:boolean}){
  const overlay=useRef<HTMLDivElement>(null),[modalId]=useState(()=>++modalSequence);
  const [active,setActive]=useState(false);

  useEffect(()=>{modalStack.push(modalId);const update=()=>setActive(modalStack.at(-1)===modalId);window.addEventListener(STACK_EVENT,update);window.dispatchEvent(new Event(STACK_EVENT));return()=>{const index=modalStack.lastIndexOf(modalId);if(index>=0)modalStack.splice(index,1);window.removeEventListener(STACK_EVENT,update);window.dispatchEvent(new Event(STACK_EVENT))}},[modalId]);

  useEffect(()=>{if(!active)return;const previous=document.activeElement as HTMLElement|null,dialogNode=overlay.current;if(!dialogNode)return;const activeNode=dialogNode;const background=Array.from(document.body.children).filter(item=>!item.classList.contains("overlay")) as HTMLElement[];const inactiveOverlays=Array.from(document.body.querySelectorAll<HTMLElement>("body > .overlay")).filter(item=>item!==activeNode);background.forEach(item=>{item.inert=true;item.setAttribute("aria-hidden","true")});inactiveOverlays.forEach(item=>item.inert=true);const oldOverflow=document.body.style.overflow;document.body.style.overflow="hidden";activeNode.querySelector<HTMLElement>("button, input, select, textarea, a[href], [tabindex]:not([tabindex='-1'])")?.focus();function keydown(event:KeyboardEvent){if(event.key==="Escape"){event.preventDefault();onClose();return}if(event.key!=="Tab")return;const items=Array.from(activeNode.querySelectorAll<HTMLElement>("button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex='-1'])"));if(!items.length)return;const first=items[0],last=items[items.length-1];if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}}document.addEventListener("keydown",keydown);return()=>{document.removeEventListener("keydown",keydown);document.body.style.overflow=oldOverflow;background.forEach(item=>{item.inert=false;item.removeAttribute("aria-hidden")});inactiveOverlays.forEach(item=>item.inert=false);previous?.focus()}},[active,onClose]);

  return createPortal(<div ref={overlay} className={`overlay modal-wrap ${active?"":"modal-inactive"}`} role="presentation" aria-hidden={!active} onMouseDown={event=>active&&event.target===event.currentTarget&&onClose()}>
    <section className={`app-modal ${wide?"wide":""}`} role="dialog" aria-modal="true" aria-labelledby={`app-modal-title-${modalId}`}>
      <header><div><span className="technical cyan">{`// ${eyebrow}`}</span><h2 id={`app-modal-title-${modalId}`}>{title}</h2></div><button className="icon-button" onClick={onClose} aria-label="Закрыть"><X/></button></header>
      {children}
    </section>
  </div>,document.body);
}
