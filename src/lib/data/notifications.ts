/**
 * Demo in-app notifications (isDemo: true). New notifications are added at
 * runtime by `~/lib/services/notifications.ts` (which the Resend layer will
 * replace server-side later).
 */
import type { Notification } from "~/lib/types";
import { isoDaysFromNow } from "~/lib/util";

export const demoNotifications: Notification[] = [
  {
    id: "N-1001",
    type: "lead",
    title: "New enquiry received",
    message: "Thandeka Mokoena — Matric Farewell, 120 guests, October.",
    read: false,
    createdAt: isoDaysFromNow(0),
    isDemo: true,
  },
  {
    id: "N-1002",
    type: "inventory",
    title: "Low stock alert",
    message: "Fabric Backdrop and Floral Wall Panel are at or below reorder level.",
    read: false,
    createdAt: isoDaysFromNow(-1),
    isDemo: true,
  },
  {
    id: "N-1003",
    type: "booking",
    title: "Deposit outstanding",
    message: "B-1001 Riverside Matric Farewell — R21 400 balance due.",
    read: false,
    createdAt: isoDaysFromNow(-2),
    isDemo: true,
  },
];
