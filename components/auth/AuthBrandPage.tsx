"use client";
import type { AuthMode } from "./auth-types";
import { PAGE_DECOR } from "./auth-data";

export default function AuthBrandPage({ mode }: { mode: AuthMode }) {
  const page = PAGE_DECOR[mode];

  return (
    <div className={`pb-story pb-story-${mode}`}>
      <img
        src="/images/auth/leaves-right.webp"
        alt=""
        className={`pb-deco pb-deco-top-${page.rightDecor}`}
        draggable={false}
        aria-hidden="true"
      />
      <div className="pb-story-copy">
        <p className="pb-kicker pb-story-kicker">{page.rightEyebrow}</p>
        {page.rightQuoteTop ? (
          <blockquote className="pb-quote">
            <span className="pb-quote-mark" aria-hidden="true">
              “
            </span>
            {page.rightQuoteTop}
          </blockquote>
        ) : null}
        <div className="pb-story-lines" aria-hidden="true" />
        <div className="pb-sign">
          {page.rightSignature[0]}
          <br />
          {page.rightSignature[1]}
          <span />
        </div>
      </div>
      <img
        src="/images/auth/leaves-soft.webp"
        alt=""
        className={`pb-deco pb-deco-bottom-${page.rightDecor}`}
        draggable={false}
        aria-hidden="true"
      />
    </div>
  );
}
