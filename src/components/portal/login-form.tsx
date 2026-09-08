"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, LogIn } from "lucide-react";

import { useI18n } from "@/lib/i18n/client";
import { localePath } from "@/lib/i18n/config";
import type { StaffUser } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Field, TextInput } from "@/components/ui/field";
import { initials } from "@/lib/utils";
import { signIn } from "@/app/[locale]/portal/session-actions";

export function LoginForm({ accounts }: { accounts: StaffUser[] }) {
  const { locale, t } = useI18n();
  const router = useRouter();
  const [pending, setPending] = useState<string | null>(null);
  const [error, setError] = useState(false);

  async function chooseAccount(staffId: string) {
    setPending(staffId);
    setError(false);

    const result = await signIn(staffId);

    if (!result.ok) {
      setError(true);
      setPending(null);
      return;
    }

    router.push(localePath(locale, "/portal/dashboard"));
    router.refresh();
  }

  return (
    <div className="space-y-7">
      <form
        className="space-y-5"
        onSubmit={(event) => {
          event.preventDefault();
          // The demo build has no password check. The fields are present so the
          // real form's layout, labelling and error handling already exist.
          setError(true);
        }}
      >
        <Field label={t("portal.login.email")}>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              type="email"
              autoComplete="username"
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field label={t("portal.login.password")}>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              type="password"
              autoComplete="current-password"
              aria-describedby={describedBy}
            />
          )}
        </Field>

        {error ? (
          <Alert tone="danger" live>
            {t("portal.login.error")}
          </Alert>
        ) : null}

        <Button type="submit" fullWidth size="lg">
          <LogIn aria-hidden="true" className="size-4" />
          {t("portal.login.signIn")}
        </Button>
      </form>

      <div className="relative text-center">
        <span
          aria-hidden="true"
          className="absolute inset-x-0 top-1/2 h-px bg-line"
        />
        <span className="eyebrow relative bg-surface px-4 text-ink-faint">
          {t("portal.login.demoNote")}
        </span>
      </div>

      <ul className="space-y-2.5">
        {accounts.map((account) => (
          <li key={account.id}>
            <button
              type="button"
              onClick={() => chooseAccount(account.id)}
              disabled={pending !== null}
              className="group/acc flex w-full items-center gap-3.5 rounded-2xl border border-line p-3.5 text-left transition-all duration-250 hover:-translate-y-0.5 hover:border-plum-300 hover:shadow-sm disabled:opacity-60"
            >
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-plum-800 text-xs font-bold text-white"
              >
                {initials(account.name)}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-semibold text-ink">
                  {account.name}
                </span>
                <span className="block truncate text-xs text-ink-muted">
                  {account.title}
                </span>
              </span>
              <span className="eyebrow flex shrink-0 items-center gap-1.5 text-brand">
                {pending === account.id
                  ? t("portal.login.signingIn")
                  : t("portal.login.signIn")}
                <ArrowRight
                  aria-hidden="true"
                  className="size-3.5 transition-transform duration-250 group-hover/acc:translate-x-0.5"
                />
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
