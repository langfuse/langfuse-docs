"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SentimentClassifier } from "@/components/sentimentClassifier";

export const SentimentClassifierCompare = () => {
  const [tab, setTab] = useState("jev");

  return (
    <Tabs value={tab} onValueChange={setTab}>
      <TabsList>
        <TabsTrigger value="jev">Jev</TabsTrigger>
        <TabsTrigger value="llm">GPT-4o mini</TabsTrigger>
      </TabsList>
      <TabsContent
        value="jev"
        forceMount
        className={tab !== "jev" ? "hidden" : undefined}
      >
        <SentimentClassifier />
      </TabsContent>
      <TabsContent
        value="llm"
        forceMount
        className={tab !== "llm" ? "hidden" : undefined}
      >
        <SentimentClassifier engine="llm" />
      </TabsContent>
    </Tabs>
  );
};
