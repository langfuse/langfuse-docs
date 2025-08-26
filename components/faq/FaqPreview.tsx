import { Callout } from "nextra/components";

export const getFaqPages = () => [] as any[];
export const getFilteredFaqPages = () => [] as any[];

export const FaqPreview = () => (
  <Callout type="warning">
    FAQ index temporarily disabled during Nextra v4 migration. See Backlog.md.
  </Callout>
);

export const FaqList = FaqPreview;
