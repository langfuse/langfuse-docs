"use client";

import { Background } from "./Background";
import { ScheduleDemo } from "./CalComScheduleDemo";
import { Header } from "./Header";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator as BreadcrumbSeparatorPrimitive,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckIcon } from "lucide-react";
import ReactCountryFlag from "react-country-flag";

export function ScheduleDemoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const selectedRegion = searchParams.get("region");

  const isValidRegion = selectedRegion === "us" || selectedRegion === "eu";

  const handleRegionSelect = (region: "us" | "eu") => {
    router.replace(`?region=${region}`);
  };

  return (
    <section className="flex flex-col gap-10 w-full min-h-screen items-center pt-10">
      <Header
        title="Talk to us"
        description="Learn more about Langfuse by meeting one of the founders"
        h="h1"
        buttons={[
          {
            href: "/enterprise",
            text: "Enterprise FAQ",
          },
          {
            href: "/watch-demo",
            text: "Watch Langfuse demo (10 min)",
          },
          {
            href: "/docs",
            text: "Docs",
          },
        ]}
      />

      {/* Card 1: Breadcrumb */}
      <Card>
        <CardHeader>
          <CardTitle className="text-center">
            <Breadcrumb className="text-lg">
              <BreadcrumbList className="justify-center">
                <BreadcrumbItem>
                  {isValidRegion ? (
                    <BreadcrumbLink
                      className="cursor-pointer flex items-center"
                      onClick={() => router.replace("?")}
                    >
                      <CheckIcon className="mr-1 h-4 w-4" />
                      1. Pick timezone
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>1. Pick timezone</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
                <BreadcrumbSeparatorPrimitive />
                <BreadcrumbItem>
                  <BreadcrumbPage>2. Schedule meeting</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Card 2: Timezone Selection (conditionally rendered) */}
      {!isValidRegion && (
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center gap-4">
              <p className="text-muted-foreground">
                Please select your timezone region
              </p>
              <div className="flex gap-4 flex-col mt-3">
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleRegionSelect("us")}
                >
                  <ReactCountryFlag
                    countryCode="US"
                    svg
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                      marginRight: "0.5rem",
                    }}
                    aria-label="United States"
                  />{" "}
                  US timezone
                </Button>
                <Button
                  variant="secondary"
                  size="lg"
                  onClick={() => handleRegionSelect("eu")}
                >
                  <ReactCountryFlag
                    countryCode="EU"
                    svg
                    style={{
                      width: "1.5em",
                      height: "1.5em",
                      marginRight: "0.5rem",
                    }}
                    aria-label="European Union"
                  />{" "}
                  EU timezone
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isValidRegion && selectedRegion && (
        <ScheduleDemo region={selectedRegion} />
      )}

      <Background />
    </section>
  );
}
