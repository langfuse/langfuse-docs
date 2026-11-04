import {
  Blocks,
  Bot,
  Database,
  Globe,
  HardDrive,
  Layers,
  ListOrdered,
  LockKeyhole,
  Server,
  Sparkles,
  Waypoints,
  type LucideIcon,
} from "lucide-react";
import styles from "./SelfHostingArchitecture.module.css";

const infrastructure = "/self-hosting/deployment/infrastructure";
const stores = [
  {
    name: "PostgreSQL",
    detail: "Transactional data",
    path: "postgres",
    icon: Database,
    y: 168,
  },
  {
    name: "Redis / Valkey",
    detail: "Cache & job queue",
    path: "cache",
    icon: ListOrdered,
    y: 272,
  },
  {
    name: "ClickHouse",
    detail: "Observability data",
    path: "clickhouse",
    icon: Layers,
    y: 376,
  },
  {
    name: "S3 / Blob storage",
    detail: "Events & attachments",
    path: "blobstorage",
    icon: HardDrive,
    y: 480,
  },
];

function Client({
  x,
  y,
  name,
  icon: Icon,
}: {
  x: number;
  y: number;
  name: string;
  icon: LucideIcon;
}) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect width="200" height="54" rx="8" className={styles.card} />
      <Icon
        x={16}
        y={17}
        width={20}
        height={20}
        strokeWidth={1.5}
        className={styles.icon}
        aria-hidden="true"
      />
      <text x="46" y="33" className={styles.name}>
        {name}
      </text>
    </g>
  );
}

function Service({
  x,
  y,
  name,
  detail,
  image,
  path,
  href = `${infrastructure}/${path}`,
  icon: Icon,
  accent,
}: {
  x: number;
  y: number;
  name: string;
  detail: string;
  image?: string;
  path: string;
  href?: string;
  icon: LucideIcon;
  accent?: "web" | "worker" | "gateway";
}) {
  return (
    <a
      href={href}
      className={styles.service}
      aria-label={`${name}: ${detail}. View documentation.`}
    >
      <g
        transform={`translate(${x} ${y})`}
        className={accent ? styles[accent] : undefined}
      >
        <rect
          width="200"
          height={image ? 126 : 80}
          rx="8"
          className={styles.card}
        />
        {accent && <path d="M 16 0 H 184" className={styles.accent} />}
        <Icon
          x={16}
          y={18}
          width={20}
          height={20}
          strokeWidth={1.5}
          className={styles.icon}
          aria-hidden="true"
        />
        <text x="46" y="33" className={styles.name}>
          {name}
        </text>
        <text x="16" y="59" className={styles.detail}>
          {detail}
        </text>
        {image && (
          <>
            <path d="M 16 77 H 184" className={styles.divider} />
            <text x="16" y="102" className={styles.image}>
              {image}
            </text>
          </>
        )}
      </g>
    </a>
  );
}

function MobileCard({
  name,
  detail,
  image,
  href,
  icon: Icon,
  accent,
}: {
  name: string;
  detail?: string;
  image?: string;
  href?: string;
  icon: LucideIcon;
  accent?: "web" | "worker" | "gateway";
}) {
  const className = `${styles.mobileCard} ${accent ? styles[accent] : ""}`;
  const content = (
    <>
      {accent && <span className={styles.mobileAccent} aria-hidden="true" />}
      <Icon
        width={20}
        height={20}
        strokeWidth={1.5}
        className={styles.mobileIcon}
        aria-hidden="true"
      />
      <span className={styles.mobileCopy}>
        <span className={styles.mobileName}>{name}</span>
        {detail && <span className={styles.mobileDetail}>{detail}</span>}
        {image && <span className={styles.mobileImage}>{image}</span>}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        className={className}
        aria-label={`${name}${detail ? `: ${detail}` : ""}. View documentation.`}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}

function MobileConnector({
  label,
  kind = "web",
}: {
  label: string;
  kind?: "web" | "worker" | "optional";
}) {
  return (
    <div className={`${styles.mobileConnector} ${styles[`${kind}Connector`]}`}>
      <span className={styles.mobileRail} aria-hidden="true" />
      <span>{label}</span>
    </div>
  );
}

// Three columns: Gateway stacked above Web on the left, storage in the
// middle, Worker on the right. Stacking those two containers drops the extra
// gateway column so the diagram stays readable at docs content widths.
const WIDTH = 800;
const HEIGHT = 760;
const LEFT = 40;
const STORE_X = 300;
const RIGHT = 560;
const GATEWAY_Y = 168;
const WEB_Y = 334;
const WORKER_Y = 334;
const LLM_Y = 656;

function DesktopDiagram() {
  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className={styles.diagram}
      role="group"
      aria-label="Web and worker containers connected to four shared storage services, with an optional AI gateway"
    >
      <desc>
        UI, API, and SDK clients connect to Langfuse Web. Web connects to
        PostgreSQL, Redis or Valkey, ClickHouse, and S3 or blob storage. Redis
        queues jobs for Langfuse Worker, which connects to PostgreSQL,
        ClickHouse, and S3. Both containers can optionally connect to LLM
        providers: Web for the playground, Worker for evaluations. The optional
        Langfuse AI gateway receives model requests from applications and coding
        agents, resolves gateway keys and uploads traces through Langfuse Web,
        and relays the requests to the LLM providers. The application
        containers, gateway, and storage run in your VPC or on-premises. The LLM
        providers can also run in the same VPC or a peered VPC.
      </desc>
      <rect
        x="20"
        y="104"
        width="760"
        height="528"
        rx="12"
        className={styles.boundary}
      />
      <LockKeyhole
        x={RIGHT}
        y={124}
        width={14}
        height={14}
        className={styles.icon}
        aria-hidden="true"
      />
      <text x="582" y="136" className={styles.label}>
        YOUR INFRASTRUCTURE
      </text>
      <text x="582" y="152" className={styles.detail}>
        VPC / on-premises
      </text>
      <Client x={LEFT} y={24} name="UI, API & SDKs" icon={Globe} />
      <Client x={STORE_X} y={24} name="Apps & agents" icon={Bot} />
      {/* Explicit arrowheads avoid shared SVG marker IDs. */}
      <g className={styles.optionalPaths}>
        <path d={`M 400 78 V 140 H 140 V ${GATEWAY_Y}`} />
        <path d={`M 140 ${GATEWAY_Y + 126} V ${WEB_Y}`} />
        <path d={`M ${LEFT} 231 H 8 V 692 H 280`} />
        <path
          d={`M 140 ${WEB_Y + 126} V 636 Q 140 ${LLM_Y} 156 ${LLM_Y} H 280`}
        />
        <path
          d={`M 660 ${WORKER_Y + 126} V 636 Q 660 ${LLM_Y} 644 ${LLM_Y} H 520`}
        />
      </g>
      <g className={styles.webPaths}>
        <path d={`M ${LEFT} 51 H 16 V 397 H ${LEFT}`} />
        <path d="M 240 348 C 270 348 270 208 300 208" />
        <path d="M 240 372 C 270 372 270 312 300 312" />
        <path d="M 240 396 C 270 396 270 416 300 416" />
        <path d="M 240 420 C 270 420 270 520 300 520" />
        {stores.map(({ path, y }) => (
          <path key={path} d={`m 294 ${y + 36} 6 4 -6 4`} />
        ))}
      </g>
      <g className={styles.workerPaths}>
        <path d="M 560 348 C 530 348 530 208 500 208" />
        <path d="M 500 312 C 530 312 530 372 560 372" />
        <path d="m 554 368 6 4 -6 4" />
        <path d="M 560 396 C 530 396 530 416 500 416" />
        <path d="M 560 420 C 530 420 530 520 500 520" />
        {stores
          .filter(({ path }) => path !== "cache")
          .map(({ path, y }) => (
            <path key={path} d={`m 506 ${y + 36} -6 4 6 4`} />
          ))}
      </g>
      <g className={styles.arrows}>
        <path d={`m 136 ${GATEWAY_Y - 6} 4 6 4 -6`} />
        <path d={`m 136 ${WEB_Y - 6} 4 6 4 -6`} />
        <path d="m 34 393 6 4 -6 4" />
        <path d="m 274 688 6 4 -6 4" />
        <path d="m 526 688 -6 4 6 4" />
      </g>
      <text x="154" y="136" className={styles.detail}>
        Model requests
      </text>
      <text x="154" y="318" className={styles.detail}>
        Resolve · traces
      </text>
      <text x="48" y="96" className={styles.detail}>
        Requests
      </text>
      <text x="660" y="308" textAnchor="middle" className={styles.label}>
        BACKGROUND PROCESSING
      </text>
      <text x="154" y="620" className={styles.detail}>
        Playground
      </text>
      <text x="646" y="620" textAnchor="end" className={styles.detail}>
        Evaluations
      </text>
      <text x="36" y="500" className={styles.detail}>
        Relay
      </text>
      <Service
        x={LEFT}
        y={GATEWAY_Y}
        name="AI Gateway"
        detail="Optional · beta"
        image="langfuse/ai-gateway"
        icon={Waypoints}
        path="ai-gateway"
        href="/self-hosting/configuration/ai-gateway"
        accent="gateway"
      />
      <Service
        x={LEFT}
        y={WEB_Y}
        name="Langfuse Web"
        detail="UI & API server"
        image="langfuse/langfuse"
        icon={Server}
        path="containers"
        accent="web"
      />
      <Service
        x={RIGHT}
        y={WORKER_Y}
        name="Langfuse Worker"
        detail="Async event processing"
        image="langfuse/worker"
        icon={Blocks}
        path="containers"
        accent="worker"
      />
      {stores.map((store) => (
        <Service key={store.path} x={STORE_X} {...store} />
      ))}
      <a
        href={`${infrastructure}/llm-api`}
        className={styles.service}
        aria-label="Optional LLM providers. View documentation."
      >
        <rect
          x="280"
          y={LLM_Y}
          width="240"
          height="72"
          rx="8"
          className={styles.card}
        />
        <Sparkles
          x={298}
          y={LLM_Y + 15}
          width={18}
          height={18}
          strokeWidth={1.5}
          className={styles.icon}
          aria-hidden="true"
        />
        <text x="327" y={LLM_Y + 30} className={styles.name}>
          LLM providers
        </text>
        <text x="298" y={LLM_Y + 52} className={styles.detail}>
          Optional · bring your own
        </text>
      </a>
    </svg>
  );
}

function MobileDiagram() {
  return (
    <div
      className={styles.mobile}
      role="group"
      aria-label="Web and worker containers connected to four shared storage services, with an optional AI gateway"
    >
      <div className={styles.mobileClients}>
        <MobileCard name="Apps & agents" icon={Bot} />
        <MobileCard name="UI, API & SDKs" icon={Globe} />
      </div>
      <MobileConnector label="Into your infrastructure" kind="optional" />
      <div className={styles.mobileBoundary}>
        <div className={styles.mobileInfra}>
          <span className={styles.mobileInfraTitle}>
            <LockKeyhole
              width={14}
              height={14}
              className={styles.mobileIcon}
              aria-hidden="true"
            />
            Your infrastructure
          </span>
          <span className={styles.mobileInfraDetail}>VPC / on-premises</span>
        </div>
        <MobileCard
          name="AI Gateway"
          detail="Optional · beta"
          image="langfuse/ai-gateway"
          icon={Waypoints}
          href="/self-hosting/configuration/ai-gateway"
          accent="gateway"
        />
        <MobileConnector label="Resolve · traces" kind="optional" />
        <MobileCard
          name="Langfuse Web"
          detail="UI & API server"
          image="langfuse/langfuse"
          icon={Server}
          href={`${infrastructure}/containers`}
          accent="web"
        />
        <MobileConnector label="Web connections" kind="web" />
        <div className={styles.mobileStores}>
          {stores.map((store) => (
            <MobileCard
              key={store.path}
              name={store.name}
              detail={store.detail}
              icon={store.icon}
              href={`${infrastructure}/${store.path}`}
            />
          ))}
        </div>
        <MobileConnector label="Background processing" kind="worker" />
        <MobileCard
          name="Langfuse Worker"
          detail="Async event processing"
          image="langfuse/worker"
          icon={Blocks}
          href={`${infrastructure}/containers`}
          accent="worker"
        />
      </div>
      <MobileConnector label="Playground · evaluations" kind="optional" />
      <MobileCard
        name="LLM providers"
        detail="Optional · bring your own"
        icon={Sparkles}
        href={`${infrastructure}/llm-api`}
      />
    </div>
  );
}

export function SelfHostingArchitecture() {
  return (
    <figure
      className={`not-prose ${styles.figure}`}
      aria-label="Langfuse self-hosting architecture"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Deployment architecture</span>
      </div>
      <div className={styles.desktop}>
        <DesktopDiagram />
      </div>
      <MobileDiagram />
      <figcaption className={styles.caption}>
        <div className={styles.legend}>
          <span>
            <i className={styles.webKey} />
            Web connections
          </span>
          <span>
            <i className={styles.workerKey} />
            Worker connections
          </span>
          <span>
            <i className={styles.optionalKey} />
            Optional
          </span>
        </div>
        <p>
          Each component links to its setup guide. The optional AI gateway
          relays model requests from your apps and coding agents to your LLM
          providers and records them in Langfuse. LLM providers can also run in
          the same VPC or a peered VPC.
        </p>
      </figcaption>
    </figure>
  );
}
