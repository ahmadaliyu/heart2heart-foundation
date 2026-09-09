"use client";
import Link from "next/link";
import { useState } from "react";
import { ChevronsLeft, ChevronsRight } from "lucide-react";
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
  const slide = slides[index];
  if (!slide) return null;
  return (
    <section
      className="bpa-featured"
      aria-roledescription="carousel"
      aria-label={slide.label}
    >
      <div className="bpa-container">
        <div className="featured-content" aria-live="polite">
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
