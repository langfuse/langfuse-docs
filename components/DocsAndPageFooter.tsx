import { DocsFooter } from "./DocsFooter";
import { Footer } from "./layout";

export function DocsAndPageFooter() {
  return (
    <>
      <DocsFooter />
      <Footer className="px-0 sm:px-0 pb-0 md:max-w-none xl:max-w-none" />
    </>
  );
}