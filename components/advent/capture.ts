import type { toCanvas } from "html-to-image";
import { logAdvent } from "./advent-debug";
type Options = NonNullable<Parameters<typeof toCanvas>[1]>;

// html-to-image otherwise copies hundreds of computed properties per element.
// Both captures use the same list: the library memoizes it module-wide.
const CAPTURE_STYLES =
  `content accent-color display position inset top right bottom left z-index box-sizing
width height min-width min-height max-width max-height margin-top margin-right margin-bottom margin-left
padding-top padding-right padding-bottom padding-left overflow overflow-x overflow-y
flex flex-direction flex-wrap flex-grow flex-shrink flex-basis align-items align-self align-content justify-content
order gap row-gap column-gap grid-template-columns grid-template-rows grid-column grid-row grid-auto-flow
background-color background-image background-size background-position background-repeat background-clip
border-top border-right border-bottom border-left border-radius box-shadow outline opacity visibility
color font-family font-size font-weight font-style font-stretch font-variant font-feature-settings
font-variation-settings font-kerning font-optical-sizing font-synthesis line-height letter-spacing word-spacing
text-align text-decoration text-transform text-shadow white-space word-break overflow-wrap text-overflow
-webkit-line-clamp -webkit-box-orient vertical-align list-style object-fit object-position
transform transform-origin transform-style perspective backface-visibility rotate scale translate filter
clip-path fill stroke stroke-width stroke-linecap stroke-linejoin stroke-dasharray stroke-dashoffset
paint-order vector-effect stop-color stop-opacity`.split(/\s+/);

let library: Promise<typeof import("html-to-image")> | undefined;
let fonts: Promise<string> | undefined;
export async function warmAdventCapture() {
  const renderer = await (library ??= import("html-to-image"));
  const page = document.querySelector<HTMLElement>(".adv-page");
  if (page)
    fonts ??= renderer
      .getFontEmbedCSS(page, {
        preferredFontFormat: "woff2",
      })
      .catch(() => {
        fonts = undefined;
        logAdvent("capture.fonts_failed");
        return "";
      });
  return renderer;
}
export async function captureAdvent(node: HTMLElement, options: Options) {
  const start = performance.now();
  logAdvent("capture.start", {
    target: node.classList.contains("adv-dialog") ? "dialog" : "calendar",
  });
  const { toCanvas } = await warmAdventCapture();
  // SVG descendants are deep-cloned by the library without computed styles.
  // Preserve the scene's class-based fills/visibility inside the captured image.
  const svgStyles = ["adv-santa-harness", "adv-santa-coat", "adv-shadow"]
    .map((name) => {
      const element = node.querySelector(`.${name}`);
      if (!element) return "";
      const style = getComputedStyle(element);
      return `.${name}{fill:${style.fill};opacity:${style.opacity}}`;
    })
    .join("");
  const canvas = await toCanvas(node, {
    ...options,
    includeStyleProperties: CAPTURE_STYLES,
    // Computed grid auto-margins report 0px even while centering the live board.
    fontEmbedCSS:
      ((await fonts) ?? "") +
      svgStyles +
      ".adv-calendar{margin-left:auto!important;margin-right:auto!important}",
    // Foreign-object rasterization flattens 3D backfaces; the visible front must win.
    filter: (element) =>
      !element.classList?.contains("adv-door-back") &&
      (options.filter?.(element) ?? true),
  });
  logAdvent("capture.complete", {
    duration_ms: Math.round(performance.now() - start),
    width: canvas.width,
    height: canvas.height,
  });
  return canvas;
}
