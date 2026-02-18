# Backup: Pages Router home

`index.mdx` here was the former `pages/index.mdx` (root `/`). It was moved to fix the conflict with `app/page.tsx`.

To restore the full home page (with `<Home />`), you’ll need to:
1. Update `app/page.tsx` to render the `Home` component from `@/components/home`.
2. Replace any Nextra usage in `Home` and its children (see `MIGRATION.md`).
