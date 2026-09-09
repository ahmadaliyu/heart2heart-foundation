"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronsLeft, ChevronsRight, Pause, Play } from "lucide-react";
export type FeaturedSlide = {
  label: string;
  title: string;
  body: string;
  href: string;
  action: string;
};
export function FeaturedSlider({
  slides,
  previous,
  next,
}: {
  slides: FeaturedSlide[];
  previous: string;
  next: string;
}) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [interacting, setInteracting] = useState(false);
  useEffect(() => {
    if (paused || interacting || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timer = window.setInterval(() => {
      if (!document.hidden) setIndex((current) => (current + 1) % slides.length);
    }, 6000);
    return () => window.clearInterval(timer);
  }, [paused, interacting, slides.length]);
  const slide = slides[index];
  if (!slide) return null;
  return (
    <section
      className="bpa-featured"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onFocusCapture={() => setInteracting(true)}
      onBlurCapture={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) setInteracting(false); }}
      aria-roledescription="carousel"
      aria-label={slide.label}
    >
      <div className="bpa-container">
        <div key={index} className="featured-content featured-enter" aria-live={paused || interacting ? "polite" : "off"}>
          <div>
            <span className="featured-label">{slide.label}</span>
            <h2>{slide.title}</h2>
            <p>{slide.body}</p>
          </div>
          <Link className="bpa-button bpa-button-outline" href={slide.href}>
            {slide.action} <ChevronsRight size={18} />
          </Link>
        </div>
        <div className="featured-controls">
          <button
            onClick={() =>
              setIndex((index + slides.length - 1) % slides.length)
            }
          >
            <ChevronsLeft size={23} /> {previous}
          </button>
          <div className="featured-dots">
            <button onClick={() => setPaused(!paused)} aria-label={paused ? "Play carousel" : "Pause carousel"} aria-pressed={paused}>{paused ? <Play size={16} /> : <Pause size={16} />}</button>
            {slides.map((item, i) => (
              <button
                key={item.title}
                onClick={() => setIndex(i)}
                aria-label={item.title}
                aria-current={i === index ? "true" : undefined}
              >
                <span />
              </button>
            ))}
          </div>
          <button onClick={() => setIndex((index + 1) % slides.length)}>
            {next} <ChevronsRight size={23} />
          </button>
        </div>
      </div>
    </section>
  );
}
