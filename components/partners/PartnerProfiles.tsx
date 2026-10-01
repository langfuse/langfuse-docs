import { ArrowUpRight } from "lucide-react";

import { CornerBox } from "@/components/ui/corner-box";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { langfusePartnerProfiles } from "@/lib/partner-profiles";

type PartnerProfile = {
  name: string;
  url: string;
  logo?: {
    src: string;
    alt: string;
    width: number;
    height: number;
  };
  regions: readonly string[];
  capabilities: readonly string[];
  summary: string;
};

export function PartnerProfiles({
  profiles = langfusePartnerProfiles,
}: {
  profiles?: readonly PartnerProfile[];
}) {
  return (
    <section aria-label="Langfuse partner directory" className="not-prose">
      <div className="grid gap-4">
        {profiles.map((profile) => (
          <CornerBox key={profile.name} className="overflow-hidden">
            <div className="flex flex-col gap-5 p-5 sm:p-6">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-center gap-4">
                  {profile.logo ? (
                    <Image
                      src={profile.logo.src}
                      alt={profile.logo.alt}
                      width={profile.logo.width}
                      height={profile.logo.height}
                      className="h-12 w-auto max-w-32 object-contain"
                    />
                  ) : null}
                  <div>
                    <p className="m-0 font-mono text-xs uppercase tracking-wider text-text-tertiary">
                      {profile.regions.join(" · ")}
                    </p>
                    <h3 className="m-0 mt-1 text-xl font-medium text-text-primary">
                      {profile.name}
                    </h3>
                  </div>
                </div>
                <Link
                  href={profile.url}
                  variant="text"
                  className="inline-flex w-fit items-center gap-1.5 text-sm"
                >
                  Visit {profile.name}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </Link>
              </div>

              <p className="m-0 max-w-3xl text-sm leading-6 text-text-secondary">
                {profile.summary}
              </p>

              <ul className="m-0 flex list-none flex-wrap gap-2 p-0">
                {profile.capabilities.map((capability) => (
                  <li
                    key={capability}
                    className="rounded-full border border-line-structure bg-surface-bg px-3 py-1.5 text-xs text-text-secondary"
                  >
                    {capability}
                  </li>
                ))}
              </ul>
            </div>
          </CornerBox>
        ))}
      </div>
    </section>
  );
}
