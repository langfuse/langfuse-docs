import React from "react";

export default function CanarySearch() {
  const [loaded, setLoaded] = React.useState(false);

  const TABS = JSON.stringify([
    {
      name: "Docs",
      pattern: "**/langfuse.com/**",
    },
    {
      name: "GitHub",
      pattern: "**/github.com/**",
    },
  ]);

  React.useEffect(() => {
    Promise.all([
      import("@getcanary/web/components/canary-root.js"),
      import("@getcanary/web/components/canary-provider-cloud.js"),
      import("@getcanary/web/components/canary-modal.js"),
      import("@getcanary/web/components/canary-trigger-searchbar.js"),
      import("@getcanary/web/components/canary-content.js"),
      import("@getcanary/web/components/canary-input.js"),
      import("@getcanary/web/components/canary-search.js"),
      import("@getcanary/web/components/canary-search-results.js"),
      import("@getcanary/web/components/canary-search-match-github-issue.js"),
      import(
        "@getcanary/web/components/canary-search-match-github-discussion.js"
      ),
      import("@getcanary/web/components/canary-filter-tabs-glob.js"),
      import("@getcanary/web/components/canary-footer.js"),
    ]).then(() => {
      setLoaded(true);
    });
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <canary-root framework="nextra">
      <canary-provider-cloud project-key="cpa0aae64b">
        <canary-modal>
          <canary-trigger-searchbar slot="trigger"></canary-trigger-searchbar>
          <canary-content slot="content">
            <canary-input slot="input"></canary-input>
            <canary-search slot="mode">
              <canary-filter-tabs-glob
                slot="head"
                tabs={TABS}
              ></canary-filter-tabs-glob>
              <canary-search-results slot="body"></canary-search-results>
            </canary-search>
            <canary-footer slot="footer"></canary-footer>
          </canary-content>
        </canary-modal>
      </canary-provider-cloud>
    </canary-root>
  );
}
