# Hand-off: Langfuse November 2026 product update

Files in this folder:

- `draft.md`: the newsletter in markdown (monthly recap format, UTM parameters on langfuse.com links).
- `draft.html`: paste this into a new Loops campaign (list: Product Updates from Langfuse, sender Marc Klingen).
- `subject_lines.md`: five subject line options plus a preview text.
- `sources.md`: everything that was considered, grouped by category, with links.
- `images/`: hero images (1-ai-gateway, 2-topics, 4-audit-logs, 5-mcp-skills) plus `contact-sheet.png`.

Timing: the Topics launch email went out on Nov 26, so the monthly is planned for about a week later, in the first week of December.

## Open items before sending

1. Trace view hero (section 3) is blocked. The changelog only has a video on static.langfuse.com, which this session could not download. Needed: a 2x screenshot of the new trace view (Timeline or graph view with the detail panel open), or a frame from `trace-ui-before-after-montage.mp4`.
2. Hero images were composed with the hero kit's `compose.py`, not as Figma frames (no Figma access in this session). If you want editable frames, upload the crops in `images/` to the Brand v2 template as `newsletter-2026-11-ai-gateway`, `-topics`, `-audit-logs`, `-mcp-skills`.
3. The terminal card uses JetBrains Mono instead of SF Mono (not installed here).
4. Job list is copied from the October edition and must be checked against https://clickhouse.com/company/careers?search=langfuse (Ashby and clickhouse.com were unreachable here).
5. Upcoming December events were not verifiable (Luma unreachable). Only the Town Hall recording is included. Check whether re:Invent or other December events should be added.
6. The v4 Cloud cutover (announced for Nov 16) is not mentioned; confirm its status if a line is wanted.
7. Loops now exposes `POST /v1/campaigns` and `POST /v1/email-messages/{id}` (Content API). This run did not create a draft campaign because the skill's hand-off is manual; the skill and `create_loops_draft.py` can be updated to use it.
8. Fold in any additions from the team review before pasting.
