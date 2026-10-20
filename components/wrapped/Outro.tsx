"use client";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Text } from "@/components/ui/text";
import { WrappedSection } from "./components/WrappedSection";

export function Outro() {
  return (
    <WrappedSection className="text-center pb-20 lg:pb-28 pt-20 lg:pt-28">
      <div className="flex flex-col items-center">
        <Heading
          as="h2"
          id="thank-you"
          size="large"
          className="text-balance max-w-3xl text-center"
        >
          Thank you for being part of this journey
        </Heading>
        <Text className="mt-4 max-w-xl">
          If there was one thing we could wish for...
        </Text>
        <div className="mt-8 flex flex-wrap items-center justify-center">
          <Button
            variant="primary"
            size="default"
            href="https://github.com/langfuse/langfuse"
            target="_blank"
            rel="noopener noreferrer"
            wrapperClassName="w-auto"
          >
            Leave a ⭐ on GitHub
          </Button>
        </div>
      </div>
    </WrappedSection>
  );
}
