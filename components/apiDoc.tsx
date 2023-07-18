import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";

const SwaggerUI = dynamic<{
  spec?: any;
  url?: string;
  filter?: string | boolean;
  supportedSubmitMethods?: (
    | "get"
    | "put"
    | "post"
    | "delete"
    | "options"
    | "head"
    | "patch"
    | "trace"
  )[];
  defaultModelRendering: "example" | "model";
  defaultModelExpandDepth?: number;
}>(import("swagger-ui-react"), { ssr: false });

function ApiDoc(props: {
  filter?: string | boolean;
  spec?: string;
  url?: string;
}) {
  return (
    <SwaggerUI
      spec={props.spec}
      filter={props.filter}
      supportedSubmitMethods={[]}
      defaultModelRendering="model"
      defaultModelExpandDepth={5}
      url={props.url}
    />
  );
}

export const ApiServerReference = () => (
  <ApiDoc url="https://cloud.langfuse.com/openapi-server.yml" />
);
export const ApiClientReference = () => (
  <ApiDoc url="https://cloud.langfuse.com/openapi-client.yml" />
);

export default ApiDoc;
