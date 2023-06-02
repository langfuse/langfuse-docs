import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { openApiSpecServer } from "../src/openApiSpecServer";
import { openApiSpecClient } from "../src/openApiSpecClient";

const SwaggerUI = dynamic<{
  spec: any;
  filter?: string | boolean;
}>(import("swagger-ui-react"), { ssr: false });

function ApiDoc(props: { filter?: string | boolean; spec: string }) {
  return <SwaggerUI spec={props.spec} filter={props.filter} />;
}

const cloudEnvironment = `
servers:
- url: https://cloud.langfuse.com
  description: Langfuse Cloud
`;

export const ApiServerReference = () => (
  <ApiDoc spec={openApiSpecServer + cloudEnvironment} />
);
export const ApiClientReference = () => (
  <ApiDoc spec={openApiSpecClient + cloudEnvironment} />
);

export default ApiDoc;
