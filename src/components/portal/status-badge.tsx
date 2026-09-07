"use client";

import { Badge, type BadgeTone } from "@/components/ui/badge";
import { useT } from "@/lib/i18n/client";
import { statusTone } from "@/lib/status";
import type { AppointmentStatus, Priority } from "@/lib/types";

const toBadgeTone: Record<string, BadgeTone> = {
  neutral: "neutral",
  info: "info",
  progress: "progress",
  success: "success",
  warning: "warning",
  danger: "danger",
};

export function StatusBadge({ status }: { status: AppointmentStatus }) {
  const t = useT();
  return (
    <Badge tone={toBadgeTone[statusTone[status]] ?? "neutral"}>
      {t(`enums.status.${status}`)}
    </Badge>
  );
}

export function PriorityBadge({ priority }: { priority: Priority }) {
  const t = useT();
  if (priority === "STANDARD") return null;
  return (
    <Badge tone={priority === "URGENT" ? "danger" : "warning"}>
      {t(`enums.priority.${priority}`)}
    </Badge>
  );
}
