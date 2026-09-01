import type { Metadata } from "next";
import { EventsPage } from "@/components/events/EventsPage";

export const metadata: Metadata = {
  title: "Events — Langfuse Community Meetups, Workshops & Community Hours",
  description:
    "Browse upcoming and past Langfuse community events: meetups, workshops, community hours, and conferences online and in person worldwide.",
  alternates: {
    canonical: "https://langfuse.com/events",
  },
};

export default function Page() {
  return <EventsPage />;
}
