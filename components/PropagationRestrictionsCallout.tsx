import { Callout } from "nextra/components";

interface PropagationRestrictionsCalloutProps {
  attributes?: ("userId" | "sessionId" | "metadata" | "version" | "tags")[];
}

export function PropagationRestrictionsCallout({
  attributes = ["userId", "sessionId", "metadata", "version", "tags"],
}: PropagationRestrictionsCalloutProps) {
  const pythonLink =
    "/docs/observability/sdk/python/instrumentation#propagate-attributes";
  const tsLink =
    "/docs/observability/sdk/typescript/instrumentation#propagate-attributes";

  const formatAttributes = (attrs: string[]) => {
    if (attrs.length === 1) return `\`${attrs[0]}\``;
    if (attrs.length === 2) return `\`${attrs[0]}\` and \`${attrs[1]}\``;
    const formatted = attrs
      .slice(0, -1)
      .map((a) => `\`${a}\``)
      .join(", ");
    return `${formatted}, and \`${attrs[attrs.length - 1]}\``;
  };

  const includesMetadata = attributes.includes("metadata");
  const isGeneric = !attributes || attributes.length === 0;

  return (
    <Callout type="info">
      <strong>Note on Attribute Propagation</strong>
      {isGeneric ? (
        <div className="my-3">
          We use Attribute Propagation to propagate specific attributes (userId,
          sessionId, version, tags, metadata) across all observations in an
          execution context. We will use all observations with these attributes
          to calculate attribute-level metrics. Please consider the following
          when using Attribute Propagation:
        </div>
      ) : (
        <div className="my-3">
          We use Attribute Propagation to propagate{" "}
          {formatAttributes(attributes)} across all observations of a trace. We
          will use all observations with {formatAttributes(attributes)} to
          create {formatAttributes(attributes)}
          -level metrics. Please consider the following when using Attribute
          Propagation:
        </div>
      )}
      <ul className="mt-2 mb-4 pl-6 leading-7 list-disc">
        <li>
          Values must be <strong>strings ≤200 characters</strong>
        </li>
        {(includesMetadata || isGeneric) && (
          <li>
            Metadata keys: <strong>Alphanumeric characters only</strong> (no
            whitespace or special characters)
          </li>
        )}
        <li>
          Call <strong>early in your trace</strong> to ensure all observations
          are covered. This way you make sure that all Metrics in Langfuse are
          accurate.
        </li>
        <li>Invalid values are dropped with a warning</li>
      </ul>
      {!isGeneric ? (
        <div className="mt-4 pt-3 border-t border-border">
          <strong>Learn more:</strong>{" "}
          <a href={pythonLink} className="underline">
            Python SDK
          </a>
          {" | "}
          <a href={tsLink} className="underline">
            TypeScript SDK
          </a>
        </div>
      ) : null}
    </Callout>
  );
}
