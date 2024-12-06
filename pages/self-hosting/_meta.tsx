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
  encryption: "Encryption",
  networking: "Networking",
  "-- Features": {
    type: "separator",
    title: "Features",
  },
  "headless-initialization": "Headless Initialization",
  "ui-customization": "UI Customization (EE)",
  "organization-creators": "Organization Creators (EE)",
  "-- Upgrade": {
    type: "separator",
    title: "Upgrade",
  },
  upgrade: "Upgrade",
  "upgrade-v2-to-v3": "Upgrade v2 to v3",
  "background-migrations": "Background Migrations",
  "-- Former Versions": {
    type: "separator",
    title: "Former Versions",
  },
  v2: "v2",
};
