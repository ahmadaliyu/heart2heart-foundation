"use client";
import { useRef } from "react";
import { Play, X } from "lucide-react";

export function HeroVideo() {
  const dialog = useRef<HTMLDialogElement>(null);
  const frame = useRef<HTMLIFrameElement>(null);
  const close = () => { dialog.current?.close(); if (frame.current) frame.current.src = "about:blank"; };
  return <>
    <button className="hero-emblem hero-play" aria-label="Play: There is no shame in taking care of your mental health" onClick={() => {
      dialog.current?.showModal();
      if (frame.current) frame.current.src = "https://www.youtube-nocookie.com/embed/BvpmZktlBFs?autoplay=1";
    }}><Play size={30} fill="currentColor" /></button>
    <dialog ref={dialog} className="video-dialog" onCancel={close} onClose={() => { if (frame.current) frame.current.src = "about:blank"; }} onClick={e => { if (e.target === e.currentTarget) close(); }} aria-label="Mental health video">
      <button autoFocus className="video-close" onClick={close} aria-label="Close video"><X /></button>
      <div className="video-alternative"><span>Video not playing?</span> <a href="https://www.youtube.com/watch?v=BvpmZktlBFs" target="_blank" rel="noopener noreferrer">Watch on YouTube <span aria-hidden="true">↗</span></a></div>
      <iframe ref={frame} referrerPolicy="strict-origin-when-cross-origin" title="There is no shame in taking care of your mental health — Sangu Delle, TED" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowFullScreen />
    </dialog>
  </>;
}
