import { Callout } from "nextra/components";

interface PropagationRestrictionsCalloutProps {
  attributes?: ("userId" | "sessionId" | "metadata" | "version")[];
}

export function PropagationRestrictionsCallout({
  attributes = ["userId", "sessionId", "metadata", "version"],
}: PropagationRestrictionsCalloutProps) {
  const pythonLink =
    "/docs/observability/sdk/python/instrumentation#propagating-trace-attributes";
  const tsLink =
    "/docs/observability/sdk/typescript/instrumentation#propagating-trace-attributes";

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

  return (
    <Callout type="info">
      <div className="mt-1">
        <strong>Attribute Propagation Restrictions</strong>
        <div className="my-3">
          When propagating {formatAttributes(attributes)} to child observations:
        </div>
        <ul className="mt-2 mb-4 pl-6 leading-7 list-disc">
          <li>
            Values must be <strong>strings ≤200 characters</strong>
          </li>
          {includesMetadata && (
            <li>
              Metadata keys: <strong>Alphanumeric characters only</strong> (no
              whitespace or special characters)
            </li>
          )}
          <li>
            Call <strong>early in your trace</strong> to ensure all observations
            are covered
          </li>
          <li>Invalid values are dropped with a warning</li>
        </ul>
        <div className="mt-4 pt-3 border-t border-border">
          <strong>Learn more:</strong> <a href={pythonLink}>Python SDK</a>
          {" | "}
          <a href={tsLink}>TypeScript SDK</a>
        </div>
      </div>
    </Callout>
  );
}
