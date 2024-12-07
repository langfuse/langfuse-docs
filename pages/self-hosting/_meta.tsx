import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  configuration: "Configuration",
  "license-key": "License Key",
  troubleshooting: "Troubleshooting",
  "-- Deployment": {
    type: "separator",
    title: "Deployment",
  },
  local: "Local (Docker Compose)",
  "docker-compose": "VM (Docker Compose)",
  docker: "Docker",
  "kubernetes-helm": "Kubernetes (Helm)",
  infrastructure: "Infrastructure",
  "-- Security": {
    type: "separator",
    title: "Security",
  },
  "authentication-and-sso": "Authentication and SSO",
  "data-masking": {
    title: "Data Masking ↗ (main docs)",
    href: "/docs/tracing-features/masking",
    newWindow: true,
  },
  encryption: "Encryption",
  rbac: {
    title: "RBAC ↗ (main docs)",
    href: "/docs/rbac",
    newWindow: true,
  },
  networking: "Networking",
  "-- Features": {
    type: "separator",
    title: "Features",
  },
  "automated-access-provisioning": "Automated Access Provisioning",
  "custom-base-path": "Custom Base Path",
  "headless-initialization": "Headless Initialization",
  "ui-customization": "UI Customization (EE)",
  "organization-creators": "Organization Creators (EE)",
  "-- Upgrade": {
    type: "separator",
    title: "Upgrade",
  },
  upgrade: "How to Upgrade",
  "background-migrations": "Background Migrations",
  "upgrade-guides": "Upgrade Guides",
  "-- Former Versions": {
    type: "separator",
    title: "Former Versions",
  },
  v2: "v2",
};
