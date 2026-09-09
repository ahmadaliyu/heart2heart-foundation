"use client";
import { useState } from "react";
import Link from "next/link";
import { ChevronUp, MessageCircle, Phone, X } from "lucide-react";
import { localePath, type Locale } from "@/lib/i18n/config";
export function FloatingTools({locale}:{locale:Locale}) {
  const [open,setOpen]=useState(false);
  return <div className="floating-tools">
    {open && <section className="contact-popover" aria-label="Contact Heart2Heart" onKeyDown={e=>{if(e.key==='Escape')setOpen(false);}}>
      <h2>Talk to Heart2Heart</h2><p>Reach our team in Kaduna. This is a contact menu, not a live chat.</p>
      {['08034709661','08029175028','08132943547'].map(phone=><a href={`tel:${phone}`} key={phone}><Phone size={17}/>{phone}</a>)}
      <Link href={localePath(locale,'/contact')} onClick={()=>setOpen(false)}>Send an enquiry →</Link>
    </section>}
    <button className="chat-toggle" onClick={()=>setOpen(!open)} aria-expanded={open} aria-label={open?'Close contact menu':'Open contact menu'}>{open?<X/>:<MessageCircle/>}</button>
    <button className="back-top" aria-label="Back to top" onClick={()=>window.scrollTo({top:0,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})}><ChevronUp/></button>
  </div>;
}
