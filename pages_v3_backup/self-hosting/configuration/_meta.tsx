import { MenuSubSeparator } from "@/components/MenuSubSeparator";

export default {
  "-- Essential": {
    type: "separator",
    title: <MenuSubSeparator>Essential</MenuSubSeparator>,
  },
  index: {},
  scaling: {},
  backups: {},

  "-- Advanced": {
    type: "separator",
    title: <MenuSubSeparator>Advanced</MenuSubSeparator>,
  },
  caching: {},
  "*": {
    layout: "default",
  },
};
