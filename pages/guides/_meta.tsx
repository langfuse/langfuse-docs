import { MenuSwitcher } from "@/components/MenuSwitcher";

export default {
  "*": {
    theme: {
      breadcrumb: false,
    },
  },
  "-- Switcher": {
    type: "separator",
    title: <MenuSwitcher />,
  },
  index: "Overview",
  cookbook: "Cookbooks",
  videos: "Videos",
};
