import { Background } from "@/components/Background";
import { JpCloudHero } from "./JpCloudHero";
import { JpCloudValueProps } from "./JpCloudValueProps";
import { JpCloudSecurity } from "./JpCloudSecurity";
import { JpCloudLogos } from "./JpCloudLogos";
import { JpCloudSocialProof } from "./JpCloudSocialProof";
import { JpCloudInJapan } from "./JpCloudInJapan";
import { JpCloudCTA } from "./JpCloudCTA";

export function JpCloud() {
  return (
    <>
      <main className="relative overflow-hidden w-full">
        <JpCloudHero />
        <JpCloudValueProps />
        <JpCloudSecurity />
        <JpCloudLogos />
        <JpCloudSocialProof />
        <JpCloudInJapan />
        <JpCloudCTA />
      </main>
      <Background />
    </>
  );
}
