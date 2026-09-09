/* eslint-disable @next/next/no-img-element -- Local compressed images have explicit dimensions and native lazy loading. */
import Link from "next/link";
import { ArrowRight } from "lucide-react";
export function ProgramPanel({
  title,
  body,
  href,
  action,
  image,
  index,
}: {
  title: string;
  body: string;
  href: string;
  action: string;
  image: string;
  index: number;
}) {
  return (
    <article className={"bpa-program bpa-program-" + index}>
      <div className="program-copy">
        <h3>{title}</h3>
        <p>{body}</p>
        <Link className="bpa-button bpa-button-outline" href={href}>
          {action}
          <ArrowRight size={18} />
        </Link>
      </div>
      <div className="program-image">
        <img src={image} alt="" loading="lazy" width={1200} height={800} />
      </div>
    </article>
  );
}
