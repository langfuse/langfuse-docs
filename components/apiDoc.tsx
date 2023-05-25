import dynamic from "next/dynamic";
import "swagger-ui-react/swagger-ui.css";
import { spec } from "../src/openapi";

const SwaggerUI = dynamic<{
  spec: any;
  filter?: string | boolean;
}>(import("swagger-ui-react"), { ssr: false });

function ApiDoc(props: { filter?: string | boolean }) {
  return <SwaggerUI spec={spec} filter={props.filter} />;
}

export default ApiDoc;
