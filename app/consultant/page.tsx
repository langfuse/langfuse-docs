import type { Metadata } from "next";
import { ConsultantChat } from "@/components/consultant/ConsultantChat";

export const metadata: Metadata = {
  title: "Consultant",
  description:
    "Describe your AI application and get a short plan for what to do next with Langfuse.",
};

export default function ConsultantPage() {
  return <ConsultantChat />;
}
