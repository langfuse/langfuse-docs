import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Auth": {
    type: "separator",
    title: <MenuSubSeparator>Auth</MenuSubSeparator>,
  },
  "authentication-and-sso": {},
  rbac: {},
  "scim-and-org-api": {},

  "-- Security": {
    type: "separator",
    title: <MenuSubSeparator>Security</MenuSubSeparator>,
  },
  "audit-logs": {},
  "data-deletion": {},
  "data-retention": {},
  "security-docs": {
    title: "Security Docs ↗",
    href: "/security",
  },
  "-- Configuration": {
    type: "separator",
    title: <MenuSubSeparator>Configuration</MenuSubSeparator>,
  },
  "llm-connection": {},
  "spend-alerts": {},
  "-- Misc": {
    type: "separator",
    title: <MenuSubSeparator>Misc</MenuSubSeparator>,
  },
  "troubleshooting-and-faq": {
    title: "Troubleshooting & FAQ",
  },
};
