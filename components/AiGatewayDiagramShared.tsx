import type { ReactNode } from "react";
import styles from "./AiGatewayDiagram.module.css";

export function AiGatewayDiagramFigure({
  ariaLabel,
  desktop,
  children,
}: {
  ariaLabel: string;
  desktop: ReactNode;
  children: ReactNode;
}) {
  return (
    <figure className={`not-prose ${styles.figure}`}>
      <div className={styles.desktop}>{desktop}</div>
      <div className={styles.mobile} role="group" aria-label={ariaLabel}>
        {children}
      </div>
    </figure>
  );
}

function Card({
  title,
  highlight,
  raised,
  children,
}: {
  title: string;
  highlight?: boolean;
  raised?: boolean;
  children?: ReactNode;
}) {
  const titleClass = highlight
    ? styles.highlightTitle
    : raised
      ? styles.cardTitle
      : styles.title;

  return (
    <div className={`${styles.card} ${raised ? styles.raised : ""}`}>
      <div className={titleClass}>{title}</div>
      {children}
    </div>
  );
}

function Connector({ label, dashed }: { label: string; dashed?: boolean }) {
  return (
    <div
      className={`${styles.connector} ${dashed ? styles.dashedConnector : ""}`}
    >
      <span className={styles.rail} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

function LangfuseBoundary({ children }: { children: ReactNode }) {
  return (
    <div className={styles.boundary}>
      <div className={styles.boundaryHeader}>
        <img
          src="/langfuse-icon.svg"
          alt=""
          width={16}
          height={16}
          className={styles.icon}
        />
        Langfuse
      </div>
      {children}
    </div>
  );
}

const gatewayBullets = (
  <ul className={styles.bullets}>
    <li>Authorize user with gateway key</li>
    <li>Map model name and URL to valid model provider request</li>
  </ul>
);

function TracingCard() {
  return (
    <Card title="Langfuse tracing" raised>
      <p className={styles.body}>
        Capture request data (different tracing options)
      </p>
    </Card>
  );
}

function ProviderCard() {
  return (
    <Card title="External model provider">
      <p className={styles.meta}>OpenAI, Anthropic</p>
    </Card>
  );
}

export function AiGatewayOverviewMobile() {
  return (
    <>
      <div className={styles.clients}>
        <Card title="Coding agent" />
        <Card title="AI application" />
      </div>
      <Connector label="Request / response" />
      <LangfuseBoundary>
        <Card title="AI gateway" highlight raised>
          {gatewayBullets}
        </Card>
        <Connector label="Capture request data" dashed />
        <TracingCard />
      </LangfuseBoundary>
      <Connector label="Request / response" />
      <ProviderCard />
    </>
  );
}

export function AiGatewayArchitectureMobile() {
  return (
    <>
      <div className={styles.clients}>
        <Card title="Coding agent" />
        <Card title="AI application" />
      </div>
      <ul className={styles.details}>
        <li>Authenticate with gateway key</li>
        <li>Send model name and URL along request body</li>
      </ul>
      <Connector label="Request / response" />
      <LangfuseBoundary>
        <Card title="AI gateway" highlight raised>
          {gatewayBullets}
        </Card>
        <Connector label="Capture request data" dashed />
        <TracingCard />
      </LangfuseBoundary>
      <Connector label="API request to model provider / response" />
      <ProviderCard />
    </>
  );
}
