"use client";

import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

import { useT } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { MaskedValue } from "@/components/portal/portal-ui";

/**
 * Contact details are masked until someone deliberately reveals them.
 *
 * The point is not that masking is a security control — the value is in the
 * page source either way. It is that a phone number is not something to have
 * on screen by default in a shared office, and the deliberate click is what the
 * access log records. In the real build, revealing must fire an audit event.
 */
export function RevealContact({ value }: { value: string }) {
  const t = useT();
  const [shown, setShown] = useState(false);

  return (
    <div className="space-y-2">
      <p className="text-sm">
        {shown ? (
          <span className="font-mono font-semibold text-ink">{value}</span>
        ) : (
          <MaskedValue value={value} />
        )}
      </p>

      <Button size="sm" variant="secondary" onClick={() => setShown((v) => !v)}>
        {shown ? (
          <EyeOff aria-hidden="true" className="size-4" />
        ) : (
          <Eye aria-hidden="true" className="size-4" />
        )}
        {shown ? t("portal.requests.hide") : t("portal.requests.reveal")}
      </Button>

      <p className="text-xs text-ink-faint">{t("portal.requests.revealAudit")}</p>
    </div>
  );
}
