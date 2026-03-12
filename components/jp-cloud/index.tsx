import { Background } from "@/components/Background";
import { JpCloudHero } from "./JpCloudHero";
import { JpCloudValueProps } from "./JpCloudValueProps";
import { JpCloudSocialProof } from "./JpCloudSocialProof";
import { JpCloudCTA } from "./JpCloudCTA";

export function JpCloud() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <JpCloudHero />
        <JpCloudValueProps />
        <JpCloudSocialProof />
        <JpCloudCTA />
      </main>
      <Background />
    </>
  );
}
