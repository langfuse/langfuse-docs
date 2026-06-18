# Design tokens

The complete Langfuse token set, sourced from `style.css` (Figma design tokens)
and `tailwind.config.js`. Every token has a light value (`:root`) and a dark
value (`:root[class~="dark"]`). Always reference the semantic token, never the
raw hex.

## Surfaces

| Token                    | Light             | Dark              |
| ------------------------ | ----------------- | ----------------- |
| `--surface-bg`           | `#f6f6f3`         | `#171714`         |
| `--surface-1`            | `#edede8`         | `#1e1e1b`         |
| `--surface-2`            | `#e5e5e1`         | `#252522`         |
| `--surface-code`         | `#333333`         | `#0e0e0c`         |
| `--surface-cta-primary`  | `#fbff81`         | `#4c4d23`         |
| `--surface-beige-accent` | `#f1ede1`         | `#f1ede1`         |
| `--surface-button-grey`  | `#403d391a` (10%) | `#ffffff1a` (10%) |
| `--surface-code-grey`    | `#3d3d3d`         | `#2a2a2a`         |
| `--surface-code-button`  | `#51504f`         | `#3a3937`         |

## Text

| Token                   | Light             | Dark              |
| ----------------------- | ----------------- | ----------------- |
| `--text-primary`        | `#222220`         | `#e8e8e4`         |
| `--text-secondary`      | `#3d3d38`         | `#b4b4ae`         |
| `--text-tertiary`       | `#6b6b66`         | `#7a7a74`         |
| `--text-disabled`       | `#a7a7a0`         | `#4a4a45`         |
| `--text-links`          | `#4f39f6`         | `#7b8ff8`         |
| `--text-code-secondary` | `#fffcf280` (50%) | `#e8e8dc80` (50%) |
| `--text-code-orange`    | `#c17e2e`         | `#e8935a`         |
| `--text-code-pink`      | `#d05376`         | `#e86b9a`         |
| `--text-code-blue`      | `#438aa5`         | `#6ab8cc`         |

## Lines and borders

| Token                 | Light     | Dark      |
| --------------------- | --------- | --------- |
| `--line-structure`    | `#cfcfc9` | `#2c2c29` |
| `--line-divider-dash` | `#bebeb6` | `#232320` |
| `--line-cta`          | `#404039` | `#b8b6a0` |
| `--line-code-border`  | `#333333` | `#3a3a38` |

## Callouts

| Token               | Value     |
| ------------------- | --------- |
| `--callout-info`    | `#b3abef` |
| `--callout-warning` | `#e09d00` |
| `--callout-error`   | `#cc3314` |
| `--callout-success` | `#538a2e` |
| `--callout-idea`    | `#119da4` |

## shadcn/ui semantic tokens (HSL)

These drive shadcn/ui components and are consumed via `hsl(var(--token))`.

| Token             | Light (HSL)         | Dark (HSL)      |
| ----------------- | ------------------- | --------------- |
| `--background`    | `0 0% 99%`          | `0 0% 6.7%`     |
| `--foreground`    | `222.2 84% 4.9%`    | `210 40% 98%`   |
| `--primary`       | `222.2 47.4% 11.2%` | `210 40% 98%`   |
| `--secondary`     | `214 32% 91%`       | `0 0% 18%`      |
| `--muted`         | `214 32% 91%`       | `0 0% 18%`      |
| `--accent`        | `214 32% 91%`       | `0 0% 18%`      |
| `--destructive`   | `0 84.2% 60.2%`     | `0 62.8% 30.6%` |
| `--border`        | `214 32% 91%`       | `0 0% 18%`      |
| `--muted-green`   | `84 81% 44%`        | `84 81% 44%`    |
| `--muted-blue`    | `239 84% 67%`       | `239 84% 67%`   |
| `--muted-magenta` | `330 90% 70%`       | `330 90% 70%`   |

## Typography

| Token               | Value                             |
| ------------------- | --------------------------------- |
| `--font-geist-sans` | Geist Sans (Tailwind `font-sans`) |
| `--font-geist-mono` | Geist Mono (Tailwind `font-mono`) |

## Radius

| Token         | Value                       | Tailwind     |
| ------------- | --------------------------- | ------------ |
| `--radius`    | `0.5rem`                    | `rounded-lg` |
| `--radius-md` | `calc(var(--radius) - 2px)` | `rounded-md` |
| `--radius-sm` | `calc(var(--radius) - 4px)` | `rounded-sm` |
