import {
  Blocks,
  Database,
  Globe,
  HardDrive,
  Layers,
  ListOrdered,
  LockKeyhole,
  Server,
  Sparkles,
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
    y: 164,
  },
  {
    name: "Redis / Valkey",
    detail: "Cache & job queue",
    path: "cache",
    icon: ListOrdered,
    y: 268,
  },
  {
    name: "ClickHouse",
    detail: "Observability data",
    path: "clickhouse",
    icon: Layers,
    y: 372,
  },
  {
    name: "S3 / Blob storage",
    detail: "Events & attachments",
    path: "blobstorage",
    icon: HardDrive,
    y: 476,
  },
];

function Service({
  x,
  y,
  name,
  detail,
  image,
  path,
  icon: Icon,
  accent,
}: {
  x: number;
  y: number;
  name: string;
  detail: string;
  image?: string;
  path: string;
  icon: LucideIcon;
  accent?: "web" | "worker";
}) {
  return (
    <a
      href={`${infrastructure}/${path}`}
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

// Connections mirror the original Mermaid diagram. Storage sits between the
// containers so their fan-out paths never cross one another.
export function SelfHostingArchitecture() {
  return (
    <figure
      className={`not-prose ${styles.figure}`}
      aria-label="Langfuse self-hosting architecture"
    >
      <div className={styles.header}>
        <span className={styles.eyebrow}>Deployment architecture</span>
        <span className={styles.hint}>Scroll to explore →</span>
      </div>
      <div
        className={styles.scroll}
        tabIndex={0}
        role="region"
        aria-label="Architecture diagram; scroll horizontally on small screens"
      >
        <svg
          viewBox="0 0 800 704"
          className={styles.diagram}
          role="group"
          aria-label="Web and worker containers connected to four shared storage services"
        >
          <desc>
            UI, API, and SDK clients connect to Langfuse Web. Web connects to
            PostgreSQL, Redis or Valkey, ClickHouse, and S3 or blob storage.
            Redis queues jobs for Langfuse Worker, which connects to PostgreSQL,
            ClickHouse, and S3. Both containers can optionally connect to an LLM
            API or gateway: Web for the playground, Worker for evaluations. The
            application containers and storage run in your VPC or on-premises.
            The optional LLM can also run in the same VPC or a peered VPC.
          </desc>
          <rect
            x="20"
            y="104"
            width="760"
            height="480"
            rx="12"
            className={styles.boundary}
          />
          <LockKeyhole
            x={300}
            y={124}
            width={14}
            height={14}
            className={styles.icon}
            aria-hidden="true"
          />
          <text x="322" y="136" className={styles.label}>
            YOUR INFRASTRUCTURE
          </text>
          <text x="758" y="136" textAnchor="end" className={styles.detail}>
            VPC / on-premises
          </text>
          <g transform="translate(40 24)">
            <rect width="200" height="54" rx="8" className={styles.card} />
            <Globe
              x={16}
              y={17}
              width={20}
              height={20}
              strokeWidth={1.5}
              className={styles.icon}
              aria-hidden="true"
            />
            <text x="46" y="33" className={styles.name}>
              UI, API & SDKs
            </text>
          </g>
          {/* Explicit arrowheads avoid shared SVG marker IDs. */}
          <g className={styles.webPaths}>
            <path d="M 140 78 V 294" />
            <path d="m 136 288 4 6 4 -6" />
            <path d="M 240 319 C 270 319 270 204 300 204" />
            <path d="M 240 341 C 270 341 270 308 300 308" />
            <path d="M 240 363 C 270 363 270 412 300 412" />
            <path d="M 240 385 C 270 385 270 516 300 516" />
            {stores.map(({ path, y }) => (
              <path key={path} d={`m 294 ${y + 36} 6 4 -6 4`} />
            ))}
          </g>
          <g className={styles.workerPaths}>
            <path d="M 560 319 C 530 319 530 204 500 204" />
            <path d="M 500 308 C 530 308 530 341 560 341" />
            <path d="m 554 337 6 4 -6 4" />
            <path d="M 560 363 C 530 363 530 412 500 412" />
            <path d="M 560 385 C 530 385 530 516 500 516" />
            {stores
              .filter(({ path }) => path !== "cache")
              .map(({ path, y }) => (
                <path key={path} d={`m 506 ${y + 36} -6 4 6 4`} />
              ))}
          </g>
          <text x="154" y="223" className={styles.detail}>
            Requests
          </text>
          <text x="660" y="268" textAnchor="middle" className={styles.label}>
            BACKGROUND PROCESSING
          </text>
          <Service
            x={40}
            y={294}
            name="Langfuse Web"
            detail="UI & API server"
            image="langfuse/langfuse"
            icon={Server}
            path="containers"
            accent="web"
          />
          <Service
            x={560}
            y={294}
            name="Langfuse Worker"
            detail="Async event processing"
            image="langfuse/worker"
            icon={Blocks}
            path="containers"
            accent="worker"
          />
          {stores.map((store) => (
            <Service key={store.path} x={300} {...store} />
          ))}
          <g className={styles.optionalPaths}>
            <path d="M 140 420 V 628 Q 140 644 156 644 H 280" />
            <path d="M 660 420 V 628 Q 660 644 644 644 H 520" />
          </g>
          <g className={styles.arrows}>
            <path d="m 274 640 6 4 -6 4" />
            <path d="m 526 640 -6 4 6 4" />
          </g>
          <text x="154" y="612" className={styles.detail}>
            Playground
          </text>
          <text x="646" y="612" textAnchor="end" className={styles.detail}>
            Evaluations
          </text>
          <a
            href={`${infrastructure}/llm-api`}
            className={styles.service}
            aria-label="Optional LLM API or gateway. View documentation."
          >
            <rect
              x="280"
              y="608"
              width="240"
              height="72"
              rx="8"
              className={styles.card}
            />
            <Sparkles
              x={298}
              y={623}
              width={18}
              height={18}
              strokeWidth={1.5}
              className={styles.icon}
              aria-hidden="true"
            />
            <text x="327" y="638" className={styles.name}>
              LLM API / Gateway
            </text>
            <text x="298" y="660" className={styles.detail}>
              Optional · bring your own
            </text>
          </a>
        </svg>
      </div>
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
          Each component links to its setup guide. The LLM API can also run in
          the same VPC or a peered VPC.
        </p>
      </figcaption>
    </figure>
  );
}
