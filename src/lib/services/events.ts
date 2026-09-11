/**
 * Events service — async, backed by the client store.
 */
import { useStore } from "~/lib/store";
import { delay } from "~/lib/util";
import type { Event } from "~/lib/types";

export async function getEvents(): Promise<Event[]> {
  await delay();
  return useStore.getState().events;
}

export async function getUpcomingEvents(): Promise<Event[]> {
  await delay(250);
  const state = useStore.getState();
  return state.events
    .filter((e) => e.status !== "CANCELLED" && new Date(`${e.date}T23:59:59`).getTime() >= Date.now())
    .sort((a, b) => a.date.localeCompare(b.date));
}
