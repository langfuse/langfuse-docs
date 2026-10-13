import { Callout } from "@/components/ui/callout";
import { Link } from "@/components/ui/link";

interface PropagationRestrictionsCalloutProps {
  attributes?: (
    | "userId"
    | "sessionId"
    | "metadata"
    | "version"
    | "tags"
    | "traceName"
  )[];
}

export function PropagationRestrictionsCallout({
  attributes = [
    "userId",
    "sessionId",
    "metadata",
    "version",
    "tags",
    "traceName",
  ],
}: PropagationRestrictionsCalloutProps) {
  const pythonLink =
    "/docs/observability/sdk/instrumentation#propagate-attributes";
  const tsLink = "/docs/observability/sdk/instrumentation#propagate-attributes";

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
  const hasStringAttributes =
    isGeneric || attributes.some((attribute) => attribute !== "metadata");

  return (
    <Callout type="info" title="Note on Attribute Propagation">
      {isGeneric ? (
        <div className="my-3">
          We use Attribute Propagation to propagate specific attributes (userId,
          sessionId, version, tags, metadata, traceName) across all observations
          in an execution context. We will use all observations with these
          attributes to calculate attribute-level metrics. Please consider the
          following when using Attribute Propagation:
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
        {hasStringAttributes && (
          <li>
            {isGeneric
              ? "userId, sessionId, version, tags, and traceName"
              : includesMetadata
                ? formatAttributes(attributes.filter((a) => a !== "metadata"))
                : "Values"}{" "}
            must be <strong>strings ≤200 characters</strong>
          </li>
        )}
        {(includesMetadata || isGeneric) && (
          <>
            <li>
              Metadata values are <strong>JSON-encoded</strong>, strings
              included, in Python SDK v5 and JS/TS SDK v6. Values can be
              strings, numbers, booleans, lists, or objects, and the{" "}
              <strong>encoded value must be ≤200 characters</strong> (the quotes
              around a string count). Top-level <code>null</code> /{" "}
              <code>None</code> values are dropped with a warning. In Python SDK
              v4 and JS/TS SDK v5, use string values ≤200 characters.
            </li>
            <li>
              Metadata keys: use <strong>alphanumeric characters</strong> (no
              whitespace or special characters)
            </li>
          </>
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
          <Link href={pythonLink} variant="underline">
            Python SDK
          </Link>
          {" | "}
          <Link href={tsLink} variant="underline">
            TypeScript SDK
          </Link>
        </div>
      ) : null}
    </Callout>
  );
}
