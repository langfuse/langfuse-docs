"use client";

import { useState, useEffect, lazy, Suspense } from "react";
import type { HTMLAttributes } from "react";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  MessageSquareIcon,
  ImageIcon,
  BarChart3Icon,
  MicIcon,
} from "lucide-react";
import { Chat } from "@/components/qaChatbot";
import { SentimentClassifier } from "@/components/sentimentClassifier";
import { ImageGenerator } from "@/components/imageGenerator";
import { VoiceAgent } from "@/components/voiceAgent";
import { Loader } from "@/components/ai-elements/loader";

const TAB_MAP: Record<string, string> = {
  chatbot: "chatbot",
  image: "image",
  sentiment: "sentiment",
  voice: "voice",
};

function getTabFromHash(): string {
  if (typeof window === "undefined") return "chatbot";
  const hash = window.location.hash.replace("#", "");
  return TAB_MAP[hash] ?? "chatbot";
}

type DemoTabsProps = HTMLAttributes<HTMLDivElement>;

export const DemoTabs = ({ className, ...props }: DemoTabsProps) => {
  const [activeTab, setActiveTab] = useState("chatbot");

  useEffect(() => {
    setActiveTab(getTabFromHash());

    const onHashChange = () => setActiveTab(getTabFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
    window.history.replaceState(null, "", `#${value}`);
  };

  return (
    <div className={cn(className)} {...props}>
      <Tabs value={activeTab} onValueChange={handleTabChange}>
        <TabsList className="w-full">
          <TabsTrigger value="chatbot" className="gap-1.5">
            <MessageSquareIcon className="size-4" />
            <span className="hidden sm:inline">Q&A Chatbot</span>
            <span className="sm:hidden">Chat</span>
          </TabsTrigger>
          <TabsTrigger value="image" className="gap-1.5">
            <ImageIcon className="size-4" />
            <span className="hidden sm:inline">Image Generator</span>
            <span className="sm:hidden">Image</span>
          </TabsTrigger>
          <TabsTrigger value="sentiment" className="gap-1.5">
            <BarChart3Icon className="size-4" />
            <span className="hidden sm:inline">Sentiment Classifier</span>
            <span className="sm:hidden">Sentiment</span>
          </TabsTrigger>
          <TabsTrigger value="voice" className="gap-1.5">
            <MicIcon className="size-4" />
            <span className="hidden sm:inline">Voice Agent</span>
            <span className="sm:hidden">Voice</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="chatbot">
          <Chat />
        </TabsContent>

        <TabsContent value="image">
          <ImageGenerator />
        </TabsContent>

        <TabsContent value="sentiment">
          <SentimentClassifier />
        </TabsContent>

        <TabsContent value="voice">
          <VoiceAgent />
        </TabsContent>
      </Tabs>
    </div>
  );
};
