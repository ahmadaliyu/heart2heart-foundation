"use client";

import { useState } from "react";
import { Send } from "lucide-react";

import { useT } from "@/lib/i18n/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Field, Select, TextArea, TextInput } from "@/components/ui/field";

const SUBJECTS = ["GENERAL", "PARTNERSHIP", "VOLUNTEER", "MEDIA", "OTHER"] as const;

export function ContactForm() {
  const t = useT();
  const [state, setState] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    // Capture the element before awaiting — currentTarget is nulled out by
    // React once the event handler yields.
    const element = event.currentTarget;
    const form = new FormData(element);
    setState("sending");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(form.entries())),
      });
      if (!response.ok) throw new Error("failed");
      setState("sent");
      element.reset();
    } catch {
      setState("error");
    }
  }

  if (state === "sent") {
    return (
      <Card className="p-6 sm:p-8">
        <Alert tone="success" live title={t("contact.sent")} />
        <div className="mt-5">
          <Button variant="secondary" onClick={() => setState("idle")}>
            {t("contact.send")}
          </Button>
        </div>
      </Card>
    );
  }

  return (
    <Card as="form" onSubmit={handleSubmit} className="space-y-5 p-6 sm:p-8">
      <Field label={t("contact.name")} required>
        {({ id, describedBy, invalid }) => (
          <TextInput
            id={id}
            name="name"
            required
            autoComplete="name"
            aria-describedby={describedBy}
            invalid={invalid}
          />
        )}
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label={t("contact.email")} required>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              name="email"
              type="email"
              required
              autoComplete="email"
              aria-describedby={describedBy}
            />
          )}
        </Field>

        <Field label={t("contact.phone")} optionalLabel={t("common.optional")}>
          {({ id, describedBy }) => (
            <TextInput
              id={id}
              name="phone"
              type="tel"
              autoComplete="tel"
              aria-describedby={describedBy}
            />
          )}
        </Field>
      </div>

      <Field label={t("contact.subject")} required>
        {({ id, describedBy }) => (
          <Select id={id} name="subject" required aria-describedby={describedBy}>
            {SUBJECTS.map((subject) => (
              <option key={subject} value={subject}>
                {t(`contact.subjects.${subject}`)}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <Field label={t("contact.message")} required>
        {({ id, describedBy }) => (
          <TextArea
            id={id}
            name="message"
            required
            rows={6}
            maxLength={2000}
            aria-describedby={describedBy}
          />
        )}
      </Field>

      {state === "error" ? (
        <Alert tone="danger" live>
          {t("contact.error")}
        </Alert>
      ) : null}

      <Button type="submit" size="lg" fullWidth disabled={state === "sending"}>
        <Send aria-hidden="true" className="size-4" />
        {state === "sending" ? t("contact.sending") : t("contact.send")}
      </Button>
    </Card>
  );
}
