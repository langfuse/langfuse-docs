---
name: product-screenshot-capture
description: Create or refresh Langfuse product screenshots for the website and documentation. Use when asked to capture, replace, update, audit, or review screenshots of the Langfuse product UI. Also use when recovering the source trace, observation, prompt, dataset, or project behind an existing screenshot. Only create a video when the existing asset is already a video.
---

# Langfuse product screenshot capture

Create documentation screenshots that are current, readable at embedded size, visually complete, and reproducible. Treat the existing asset as the specification for what the replacement should explain.

## Non-negotiable rules

- Capture screenshots at exactly 16:9. Prefer 1920×1080; 1440×810 is acceptable.
- Show the complete Langfuse product viewport, including every product border relevant to the frame.
- Exclude browser tabs, the address bar, bookmarks, desktop wallpaper, docks, and OS chrome.
- Never crop through a product border, control, label, output sentence, table, or panel.
- Zoom in enough that text remains readable when the image is embedded at roughly 1000–1200 px wide.
- Prefer an observation of type `GENERATION`. Generations usually contain the most relevant input/output, token, cost, model, prompt, and tool information and produce the strongest screenshots.
- Match the selected observation in the existing screenshot whenever refreshing an asset. Do not substitute a prettier but semantically different observation unless the user approves.
- Only create or re-record a video when the asset being replaced is already a video. A GIF counts as video-style media and should be replaced with MP4, not with a newly invented interaction for a static screenshot.
- Do not modify project data unless the user explicitly asks. Browsing, selecting observations, and changing local display state are read-only.

## Step 1: Recover the screenshot source

Start from the page and existing asset, not from a random recent trace.

1. Find every page that references the asset and read the surrounding copy and alt text.
2. Inspect the old image closely:
   - trace and observation names
   - selected tree row
   - observation type icon
   - prompt name/version
   - project, dataset, session, or environment
   - trace ID, observation ID, timestamp, tags, scores, model, and tool names
3. Follow a public trace or session link when one exists.
4. Otherwise search the appropriate Langfuse example project using the visible identifiers.
5. If the old screenshot shows a generation, select that same generation in the replacement.
6. If the exact trace no longer exists, choose a semantically equivalent trace and record the substitution in the review notes.

Do not infer that an asset is stale from age alone. Historical changelog and blog screenshots may intentionally document the UI that existed when a feature shipped.

## Step 2: Choose a good state

Use this preference order:

1. The same selected observation as the existing screenshot.
2. A `GENERATION` observation with meaningful, non-sensitive input and output.
3. A generation that also shows useful model, prompt, token, cost, tool, or score context.
4. A span or event only when the page specifically teaches that observation type.
5. The trace root only when the page explains trace-level metadata or the complete workflow.

A strong sample:

- has a clear observation tree with descriptive names;
- contains realistic but non-sensitive data;
- has no errors, skeleton loaders, empty states, or placeholder values unless those are the documented subject;
- avoids typos, unexplained IDs, internal test names, and noisy metadata;
- fits naturally without cutting long unwrapped payloads.

If necessary, ingest a new example only after confirming that no suitable existing trace is available. Use polished names and sample data designed for the target page.

## Step 3: Prepare the viewport

1. Use a 16:9 display or viewport: 1920×1080 or 1440×810.
2. Enter browser fullscreen or use an app-only capture so browser and OS chrome are absent.
3. Keep the full Langfuse product boundary visible. Collapse the left navigation to its icon rail when this matches the old image: it preserves product context, creates more room for trace content, and avoids exposing the expanded account name or email. Do not remove the navigation or top product header merely to increase zoom unless the existing image intentionally focuses on a self-contained panel.
4. Increase browser zoom until the important text is comfortably readable. Start around 125–150%, then verify that no controls, labels, or important content are clipped. The tested trace-detail framing used 150%.
5. Size the trace tree and detail pane so both have enough room:
   - tree labels must be complete;
   - the selected row must be visibly highlighted;
   - the detail pane must show the relevant tabs and payload;
   - output should wrap or fit without being cut at the right edge.
6. Select the intended generation and wait for all content to finish loading.
7. Place scrolling deliberately. Begin at the most informative input/output section, not at arbitrary telemetry metadata.
8. Move the pointer away from important content and dismiss all tooltips, dialogs, menus, and transient notifications.

Cropping is a fallback for removing browser chrome, not a substitute for viewport preparation. If cropping is needed, retain a safety margin around every product edge and control.

Prefer a direct, untransformed 1920×1080 capture. Do not crop away the bottom of the product or stretch a shorter capture back to 16:9.

## Step 4: Capture useful variants

For a new screenshot style or ambiguous page, capture no more than three purposeful variants:

- **Full product context:** complete Langfuse viewport and location within the product.
- **Workflow-focused:** observation tree plus selected generation detail.
- **Detail-focused:** selected generation panel when the page teaches fields or payloads.

Do not create variants that differ only by a few pixels. Label each candidate with its intended use and selected observation.

## Step 5: Privacy and content review

Before saving a candidate, inspect the entire frame for:

- personal names, emails, avatars, and user IDs;
- API keys, public keys, tokens, request headers, or credentials;
- organization, project, service instance, or environment identifiers that should not be published;
- customer data, private prompts, internal URLs, and internal ticket IDs;
- accidental browser history, account controls, or unrelated projects.

Public trace and project IDs are acceptable only when the project is intentionally public and the same identifiers are already part of the documentation workflow. Prefer clean example data over blur or redaction.

## Step 6: Automated checks

Verify every candidate before human review:

```bash
ffprobe -v error \
  -show_entries stream=width,height \
  -of default=noprint_wrappers=1 \
  path/to/screenshot.png
```

The dimensions must reduce exactly to 16:9. Also confirm:

- PNG or WebP for screenshots;
- no accidental resampling blur;
- no browser or OS chrome;
- no clipped product borders or content;
- no loaders, errors, or empty panels;
- selected tree row and detail panel agree;
- text is readable at expected documentation width.

## Step 7: Independent visual review

Give the candidate and, when available, the old image to a separate visual-review subagent. Ask for a strict PASS/FAIL on:

1. exact 16:9 composition;
2. full product boundary without browser chrome;
3. zoom and embedded-size legibility;
4. correct selected observation, preferring a generation;
5. semantic match with the old screenshot and page copy;
6. complete controls, borders, labels, and payloads;
7. whitespace balance and visual hierarchy;
8. loading/error/transient artifacts;
9. privacy and sample-data quality.

Reject a candidate on any material failure. Do not describe a failed candidate as production-ready.

## Step 8: Human review handoff

For each replacement, provide:

- page URL and source file;
- old image;
- new candidate;
- selected trace and observation names;
- source locator: public URL or project plus trace/observation IDs;
- viewport, zoom, dimensions, and capture date;
- automated and independent review result;
- any deliberate semantic substitution.

Show old and new images side by side whenever possible. Group review by workflow or shared asset because one image may appear on multiple pages.

## Common failure modes

- Capturing the trace root when a generation is the meaningful subject.
- Zooming out to fit more UI, making all text unreadable in docs.
- Cropping away the browser chrome but also cutting product borders or controls.
- Leaving thin strips of desktop wallpaper around the app.
- Showing telemetry metadata instead of the user-relevant input/output.
- Cutting long output at the right edge.
- Claiming a screenshot is clean without inspecting the actual saved file.
- Trusting capture-agent self-reports instead of checking dimensions and pixels.
- Recording the entire automation session, creating minutes of dead time.
- Replacing a historical image merely because it is old.
