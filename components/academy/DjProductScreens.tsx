"use client";

// DJ feature product screens for the music-streaming-dj academy example.
// Page-local component: imported directly by the MDX page, intentionally NOT
// registered in mdx-components.tsx. Markup sourced from the design artifact.

import { useLayoutEffect, useRef } from "react";

const INNER_W = 1174;
const INNER_H = 774;

function estimateInitialScale(): number {
  if (typeof window === "undefined") return 0.57;
  const vw = document.documentElement.clientWidth;
  if (vw < 768) {
    return Math.max(0.25, (vw - 32) / INNER_W);
  }
  return 0.57;
}

const SCREENS_HTML = `<div style="display:flex;flex-wrap:wrap;gap:44px;justify-content:center;">

    <!-- ════════ SCREEN 1 — HOME ════════ -->
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="lf-corners" style="width:362px;height:772px;border-radius:2px;display:flex;flex-direction:column;">
        <!-- status bar -->
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px 6px;">
          <span class="lf-mono" style="font-size:13px;color:var(--text-primary);">9:41</span>
          <div style="display:flex;gap:6px;align-items:center;">
            <div style="display:flex;gap:2px;align-items:flex-end;height:11px;"><div style="width:3px;height:5px;background:var(--text-primary);"></div><div style="width:3px;height:7px;background:var(--text-primary);"></div><div style="width:3px;height:9px;background:var(--text-primary);"></div><div style="width:3px;height:11px;background:var(--text-primary);"></div></div>
            <div style="width:22px;height:11px;border:1.5px solid var(--text-primary);border-radius:2px;padding:1.5px;box-sizing:border-box;"><div style="width:68%;height:100%;background:var(--text-primary);"></div></div>
          </div>
        </div>

        <div style="padding:14px 22px 0;display:flex;flex-direction:column;flex:1;">
          <!-- greeting -->
          <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:22px;">
            <div>
              <div class="lf-eyebrow" style="margin-bottom:4px;">Good evening</div>
              <div class="lf-h3">Alex</div>
            </div>
            <div class="lf-corners" style="width:40px;height:40px;border-radius:2px;background:var(--surface-1);display:flex;align-items:center;justify-content:center;">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.6"><circle cx="12" cy="8" r="4"></circle><path d="M4 21a8 8 0 0 1 16 0"></path></svg>
            </div>
          </div>

          <!-- DJ hero (yellow) -->
          <div class="lf-corners" style="background:var(--surface-cta-primary);border-radius:2px;padding:18px 18px 16px;margin-bottom:26px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:12px;">
              <div style="display:flex;gap:3px;align-items:flex-end;height:15px;">
                <div style="width:4px;height:15px;background:var(--text-primary);transform-origin:bottom;animation:barDance 1.1s ease-in-out infinite;"></div>
                <div style="width:4px;height:15px;background:var(--text-primary);transform-origin:bottom;animation:barDance 1.1s ease-in-out .28s infinite;"></div>
                <div style="width:4px;height:15px;background:var(--text-primary);transform-origin:bottom;animation:barDance 1.1s ease-in-out .52s infinite;"></div>
              </div>
              <span class="lf-eyebrow" style="color:var(--text-secondary);">Your DJ</span>
            </div>
            <div style="font-family:var(--font-analog);font-weight:500;font-size:23px;line-height:1.1;color:var(--text-primary);margin-bottom:8px;">Mixing songs for<br>your evening</div>
            <p style="font-size:13px;color:var(--text-secondary);margin:0 0 16px;">It picks the tracks, talks you through them, and listens when you talk back.</p>
            <div class="lf-btn primary" style="height:36px;padding:0 16px;font-size:13px;">
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"></path></svg>
              Start DJ session
            </div>
          </div>

          <!-- recently played -->
          <div class="lf-h4" style="font-size:18px;margin-bottom:14px;">Recently played</div>
          <div style="display:flex;gap:12px;margin-bottom:26px;">
            <div style="flex:1;">
              <div class="lf-corners" style="aspect-ratio:1;border-radius:2px;background:var(--surface-1);display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="1"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg></div>
              <div style="font-size:12px;color:var(--text-primary);font-weight:500;line-height:1.3;">Night Shapes</div>
              <div class="lf-mono-xs">Vela</div>
            </div>
            <div style="flex:1;">
              <div class="lf-corners" style="aspect-ratio:1;border-radius:2px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="1"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg></div>
              <div style="font-size:12px;color:var(--text-primary);font-weight:500;line-height:1.3;">Paper Cities</div>
              <div class="lf-mono-xs">Hollow Coast</div>
            </div>
            <div style="flex:1;">
              <div class="lf-corners" style="aspect-ratio:1;border-radius:2px;background:var(--surface-1);display:flex;align-items:center;justify-content:center;margin-bottom:8px;"><svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" stroke-width="1.4"><rect x="3" y="3" width="18" height="18" rx="1"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg></div>
              <div style="font-size:12px;color:var(--text-primary);font-weight:500;line-height:1.3;">Slow Tide</div>
              <div class="lf-mono-xs">Marlowe</div>
            </div>
          </div>

          <!-- made for you -->
          <div style="display:flex;justify-content:space-between;align-items:baseline;margin-bottom:14px;">
            <div class="lf-h4" style="font-size:18px;">Made for you</div>
            <span class="lf-mono-xs" style="text-transform:uppercase;">See all</span>
          </div>
          <div style="display:flex;gap:12px;">
            <div class="lf-corners" style="flex:1;border-radius:2px;background:var(--surface-1);padding:12px;display:flex;flex-direction:column;justify-content:flex-end;height:74px;">
              <div class="lf-mono-xs" style="margin-bottom:3px;">Daily mix</div>
              <div style="font-size:13px;color:var(--text-primary);font-weight:500;">Late night</div>
            </div>
            <div class="lf-corners" style="flex:1;border-radius:2px;background:var(--surface-beige-accent);padding:12px;display:flex;flex-direction:column;justify-content:flex-end;height:74px;">
              <div class="lf-mono-xs" style="margin-bottom:3px;">Daily mix</div>
              <div style="font-size:13px;color:var(--text-primary);font-weight:500;">Focus drift</div>
            </div>
          </div>

          <!-- bottom nav -->
          <div style="margin-top:auto;display:flex;border-top:1px solid var(--line-structure);padding-top:12px;margin-left:-22px;margin-right:-22px;padding-left:22px;padding-right:22px;">
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;color:var(--text-primary);"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path><path d="M9 22V12h6v10"></path></svg><span class="lf-mono-xs" style="text-transform:uppercase;color:var(--text-primary);">Home</span></div>
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;color:var(--text-disabled);"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><circle cx="11" cy="11" r="7"></circle><path d="m21 21-4-4"></path></svg><span class="lf-mono-xs" style="text-transform:uppercase;">Search</span></div>
            <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:5px;color:var(--text-disabled);"><svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M4 6h16M4 12h16M4 18h10"></path></svg><span class="lf-mono-xs" style="text-transform:uppercase;">Library</span></div>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════ SCREEN 2 — NOW PLAYING (why text) ════════ -->
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="lf-corners" style="width:362px;height:772px;border-radius:2px;display:flex;flex-direction:column;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px 6px;">
          <span class="lf-mono" style="font-size:13px;color:var(--text-primary);">9:41</span>
          <div style="display:flex;gap:6px;align-items:center;"><div style="display:flex;gap:2px;align-items:flex-end;height:11px;"><div style="width:3px;height:5px;background:var(--text-primary);"></div><div style="width:3px;height:7px;background:var(--text-primary);"></div><div style="width:3px;height:9px;background:var(--text-primary);"></div><div style="width:3px;height:11px;background:var(--text-primary);"></div></div><div style="width:22px;height:11px;border:1.5px solid var(--text-primary);border-radius:2px;padding:1.5px;box-sizing:border-box;"><div style="width:68%;height:100%;background:var(--text-primary);"></div></div></div>
        </div>

        <div style="padding:10px 22px 22px;display:flex;flex-direction:column;flex:1;">
          <!-- top bar -->
          <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="1.8"><path d="m6 9 6 6 6-6"></path></svg>
            <span class="lf-eyebrow">Now playing</span>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="var(--text-primary)"><circle cx="5" cy="12" r="1.8"></circle><circle cx="12" cy="12" r="1.8"></circle><circle cx="19" cy="12" r="1.8"></circle></svg>
          </div>

          <!-- DJ why-this-song callout -->
          <div class="lf-corners" style="background:var(--surface-1);border-radius:2px;padding:13px 14px;margin-bottom:22px;">
            <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
              <div style="display:flex;gap:2.5px;align-items:flex-end;height:13px;">
                <div style="width:3px;height:7px;background:var(--text-primary);transform-origin:bottom;animation:barDance 1.1s ease-in-out infinite;"></div>
                <div style="width:3px;height:13px;background:var(--text-primary);transform-origin:bottom;animation:barDance 1.1s ease-in-out .3s infinite;"></div>
                <div style="width:3px;height:9px;background:var(--text-primary);transform-origin:bottom;animation:barDance 1.1s ease-in-out .55s infinite;"></div>
              </div>
              <span class="lf-eyebrow lf-highlight"><span>DJ · why this song</span></span>
            </div>
            <p style="font-size:13px;color:var(--text-secondary);margin:0;line-height:1.5;">A deep cut after that album you ran on repeat last week — easing you in before I pick the pace up.</p>
          </div>

          <!-- album art -->
          <div class="lf-corners" style="width:100%;aspect-ratio:1;border-radius:2px;background:var(--surface-2);display:flex;align-items:center;justify-content:center;margin-bottom:18px;">
            <svg width="52" height="52" viewBox="0 0 24 24" fill="none" stroke="var(--text-disabled)" stroke-width="1.3"><rect x="3" y="3" width="18" height="18" rx="1"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><path d="m21 15-5-5L5 21"></path></svg>
          </div>

          <div style="font-family:var(--font-analog);font-weight:500;font-size:24px;color:var(--text-primary);line-height:1.1;">Slow Tide</div>
          <div style="font-size:14px;color:var(--text-tertiary);margin-top:4px;">Marlowe</div>

          <!-- progress -->
          <div style="margin:auto 0 6px;padding-top:18px;">
            <div style="height:3px;background:var(--surface-2);border-radius:2px;position:relative;">
              <div style="position:absolute;left:0;top:0;height:3px;width:24%;background:var(--text-primary);border-radius:2px;"></div>
              <div style="position:absolute;left:24%;top:50%;transform:translate(-50%,-50%);width:11px;height:11px;background:var(--text-primary);border-radius:2px;"></div>
            </div>
            <div style="display:flex;justify-content:space-between;margin-top:7px;"><span class="lf-mono-xs">0:48</span><span class="lf-mono-xs">3:36</span></div>
          </div>

          <!-- controls -->
          <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0 0;">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-tertiary)" stroke-width="1.7"><path d="M2 18h1.4c1.3 0 2.5-.6 3.3-1.7l6.1-8.6c.7-1.1 2-1.7 3.3-1.7H22"></path><path d="m18 2 4 4-4 4"></path><path d="M2 6h1.9c1.5 0 2.9.9 3.6 2.2"></path><path d="M22 18h-5.9c-1.3 0-2.6-.7-3.3-1.8l-.5-.8"></path><path d="m18 14 4 4-4 4"></path></svg>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><polygon points="19 20 9 12 19 4"></polygon><line x1="5" y1="19" x2="5" y2="5"></line></svg>
            <div style="width:60px;height:60px;border-radius:50%;background:var(--text-primary);display:flex;align-items:center;justify-content:center;"><svg width="22" height="22" viewBox="0 0 24 24" fill="var(--surface-bg)"><rect x="6" y="5" width="4" height="14" rx="1"></rect><rect x="14" y="5" width="4" height="14" rx="1"></rect></svg></div>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="1.8" stroke-linejoin="round" stroke-linecap="round"><polygon points="5 4 15 12 5 20"></polygon><line x1="19" y1="5" x2="19" y2="19"></line></svg>
            <!-- talk-to-DJ mic (yellow corner box) -->
            <div class="lf-corners" style="width:44px;height:44px;border-radius:2px;background:var(--surface-cta-primary);display:flex;align-items:center;justify-content:center;">
              <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="1.8"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path></svg>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- ════════ SCREEN 3 — TALK TO DJ ════════ -->
    <div style="display:flex;flex-direction:column;gap:16px;">
      <div class="lf-corners" style="width:362px;height:772px;border-radius:2px;display:flex;flex-direction:column;">
        <div style="display:flex;justify-content:space-between;align-items:center;padding:16px 22px 6px;">
          <span class="lf-mono" style="font-size:13px;color:var(--text-primary);">9:41</span>
          <div style="display:flex;gap:6px;align-items:center;"><div style="display:flex;gap:2px;align-items:flex-end;height:11px;"><div style="width:3px;height:5px;background:var(--text-primary);"></div><div style="width:3px;height:7px;background:var(--text-primary);"></div><div style="width:3px;height:9px;background:var(--text-primary);"></div><div style="width:3px;height:11px;background:var(--text-primary);"></div></div><div style="width:22px;height:11px;border:1.5px solid var(--text-primary);border-radius:2px;padding:1.5px;box-sizing:border-box;"><div style="width:68%;height:100%;background:var(--text-primary);"></div></div></div>
        </div>

        <div style="padding:10px 26px 26px;display:flex;flex-direction:column;flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:center;">
            <span class="lf-eyebrow">Talk to DJ</span>
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"></path></svg>
          </div>

          <!-- listening orb -->
          <div style="position:relative;width:168px;height:168px;margin:64px auto 52px;display:flex;align-items:center;justify-content:center;">
            <div style="position:absolute;width:168px;height:168px;border-radius:50%;border:1.5px solid var(--line-structure);animation:ringPulse 2.4s ease-out infinite;"></div>
            <div style="position:absolute;width:168px;height:168px;border-radius:50%;border:1.5px solid var(--line-structure);animation:ringPulse 2.4s ease-out 1.2s infinite;"></div>
            <div style="width:96px;height:96px;border-radius:50%;background:var(--surface-cta-primary);border:1px solid var(--line-cta);display:flex;align-items:center;justify-content:center;animation:orbBreathe 2.4s ease-in-out infinite;">
              <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="var(--text-primary)" stroke-width="1.8"><rect x="9" y="3" width="6" height="11" rx="3"></rect><path d="M5 11a7 7 0 0 0 14 0"></path><path d="M12 18v3"></path></svg>
            </div>
          </div>

          <!-- live transcript -->
          <div class="lf-eyebrow" style="text-align:center;margin-bottom:14px;">Listening…</div>
          <div style="font-family:var(--font-analog);font-weight:500;font-size:24px;line-height:1.25;color:var(--text-primary);text-align:center;">Play something with a bit more energy<span style="display:inline-block;width:2px;height:22px;background:var(--text-primary);margin-left:3px;vertical-align:-3px;animation:caret 1s step-end infinite;"></span></div>

          <!-- suggestions -->
          <div style="margin-top:auto;">
            <div class="lf-eyebrow" style="text-align:center;margin-bottom:12px;">Try saying</div>
            <div style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:18px;">
              <span class="lf-badge">Who is this?</span>
              <span class="lf-badge">Skip this one</span>
              <span class="lf-badge">More like this</span>
            </div>
            <div style="text-align:center;"><span class="lf-mono-xs" style="text-transform:uppercase;">Tap the orb to stop</span></div>
          </div>
        </div>
      </div>
    </div>

  </div>`;

export function DjProductScreens() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const estScale = estimateInitialScale();

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const inner = innerRef.current;
    if (!wrap || !inner) return;
    const fit = () => {
      const scale = Math.min(1, wrap.clientWidth / INNER_W);
      inner.style.transform = `scale(${scale})`;
      wrap.style.height = `${INNER_H * scale}px`;
    };
    fit();
    let rafId = 0;
    const ro = new ResizeObserver(() => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(fit);
    });
    ro.observe(wrap);
    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <figure
      className="dj-product-screens not-prose"
      aria-label="The DJ feature: home screen entry point, now playing with DJ commentary, and the talk-to-DJ voice screen"
    >
      <div
        ref={wrapRef}
        suppressHydrationWarning
        style={{
          position: "relative",
          width: "100%",
          overflow: "hidden",
          height: `${INNER_H * estScale}px`,
          margin: "32px 0",
        }}
      >
        <div
          ref={innerRef}
          suppressHydrationWarning
          style={{
            width: INNER_W,
            height: INNER_H,
            transformOrigin: "top left",
            transform: `scale(${estScale})`,
          }}
          dangerouslySetInnerHTML={{ __html: SCREENS_HTML }}
        />
      </div>
      <style>{`.dj-product-screens .lf-h3 {
  font-family: var(--font-analog);
  font-weight: 500;
  font-size: 24px;
  line-height: 120%;
  color: var(--text-primary);
}

.dj-product-screens .lf-h4 {
  font-family: var(--font-analog);
  font-weight: 500;
  font-size: 20px;
  line-height: 125%;
  color: var(--text-primary);
}

.dj-product-screens .lf-eyebrow {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 11px;
  letter-spacing: 0.04em;
  line-height: 150%;
  text-transform: uppercase;
  color: var(--text-tertiary);
}

.dj-product-screens .lf-mono {
  font-family: var(--font-mono);
  font-weight: 400;
  font-size: 13px;
  line-height: 150%;
  color: var(--text-secondary);
}

.dj-product-screens .lf-mono-xs {
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: -0.02em;
  color: var(--text-tertiary);
}

.dj-product-screens .lf-highlight {
  position: relative;
  display: inline-block;
}

.dj-product-screens .lf-highlight::before {
  content: "";
  position: absolute;
  inset-inline: 0;
  top: 50%;
  height: 0.76em;
  transform: translateY(-52%);
  background: var(--highlight-yellow);
  mix-blend-mode: multiply;
  z-index: 0;
}

.dj-product-screens .lf-highlight > * { position: relative; z-index: 1; }

.dj-product-screens .lf-corners {
  position: relative;
  border: 1px solid var(--line-structure);
  background: var(--surface-bg);
  border-radius: 2px;
}

.dj-product-screens .lf-corners::before {
  content: "";
  position: absolute;
  inset: -1px;
  pointer-events: none;
  z-index: 10;
  background-color: var(--line-cta);
  --tl: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M8 0V1H3C1.89543 1 1 1.89543 1 3V8H0V0H8Z' fill='black'/%3E%3C/svg%3E");
  --bl: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M8 8V7H3C1.89543 7 1 6.10457 1 5V0H0V8H8Z' fill='black'/%3E%3C/svg%3E");
  --br: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 8V7H5C6.10457 7 7 6.10457 7 5V0H8V8H0Z' fill='black'/%3E%3C/svg%3E");
  --tr: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cpath d='M0 0V1H5C6.10457 1 7 1.89543 7 3V8H8V0H0Z' fill='black'/%3E%3C/svg%3E");
  -webkit-mask-image: var(--tl), var(--bl), var(--br), var(--tr);
          mask-image: var(--tl), var(--bl), var(--br), var(--tr);
  -webkit-mask-position: top left, bottom left, bottom right, top right;
          mask-position: top left, bottom left, bottom right, top right;
  -webkit-mask-size: 8px 8px;
          mask-size: 8px 8px;
  -webkit-mask-repeat: no-repeat;
          mask-repeat: no-repeat;
}

.dj-product-screens .lf-corners-hover::before { opacity: 0; transition: opacity 0.2s ease; }

.dj-product-screens .lf-corners-hover:hover::before { opacity: 1; }

.dj-product-screens .lf-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  height: 32px;
  padding: 0 10px;
  border-radius: 2px;
  border: 1px solid transparent;
  box-shadow: 0 4px 8px rgba(0,0,0,0.05), 0 4px 4px rgba(0,0,0,0.03);
  font-family: var(--font-sans);
  font-size: 12px;
  font-weight: 450;
  letter-spacing: -0.005em;
  line-height: 150%;
  cursor: pointer;
  text-decoration: none;
  transition: border-color 0.15s ease, background 0.15s ease;
}

.dj-product-screens .lf-btn.sm { height: 26px; padding: 0 8px; }

.dj-product-screens .lf-btn.primary { background: var(--text-primary); color: var(--surface-bg); border-color: var(--text-secondary); }

.dj-product-screens .lf-btn.secondary { background: var(--surface-bg); color: var(--text-secondary); border-color: var(--line-structure); }

.dj-product-screens .lf-btn.secondary:hover { border-color: var(--line-cta); }

.dj-product-screens .lf-btn.text { background: transparent; color: var(--text-tertiary); border: 0; box-shadow: none; padding: 0; }

.dj-product-screens .lf-btn.text:hover { color: var(--text-primary); }

.dj-product-screens .lf-btn .kbd {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px; height: 20px;
  border: 1px solid rgba(64,61,57,0.30);
  border-radius: 1px;
  font-size: 11px;
  margin-left: 4px;
}

.dj-product-screens .lf-btn.primary .kbd { background: rgba(64,61,57,0.40); color: var(--surface-bg); }

.dj-product-screens .lf-btn.secondary .kbd { background: rgba(64,61,57,0.10); color: var(--text-tertiary); border-color: rgba(64,61,57,0.20); }

.dj-product-screens .lf-btn-wrapper { position: relative; display: inline-flex; padding: 4px; }

.dj-product-screens .lf-btn-wrapper .lf-corners-hover {
  position: absolute; inset: 0; border: 0; background: transparent;
}

.dj-product-screens .lf-btn-wrapper .lf-corners-hover::before {
  background-color: var(--line-cta);
  opacity: 0;
  transition: opacity 0.15s ease;
}

.dj-product-screens .lf-btn-wrapper:has(> .lf-btn:hover) .lf-corners-hover::before, .dj-product-screens .lf-btn-wrapper:hover > .lf-corners-hover::before { opacity: 1; }

.dj-product-screens .lf-btn.secondary:hover {
  background: repeating-linear-gradient(315deg, var(--surface-bg) 0, var(--surface-bg) 2px, rgba(64,61,57,0.12) 4px, var(--surface-bg) 4px);
}

.dj-product-screens .lf-badge {
  display: inline-flex; align-items: center; gap: 4px;
  padding: 2px 8px;
  border: 1px solid var(--line-structure);
  border-radius: 9999px;
  font-family: var(--font-sans);
  font-size: 11px;
  color: var(--text-tertiary);
  background: var(--surface-bg);
}

.dj-product-screens .lf-badge.accent { background: var(--surface-cta-primary); border-color: rgba(64,61,57,0.2); color: var(--text-primary); }

@keyframes ringPulse { 0%{transform:scale(.5);opacity:.7} 70%{opacity:0} 100%{transform:scale(1.5);opacity:0} }

@keyframes orbBreathe { 0%,100%{transform:scale(1)} 50%{transform:scale(1.05)} }

@keyframes barDance { 0%,100%{transform:scaleY(.32)} 50%{transform:scaleY(1)} }

@keyframes caret { 0%,100%{opacity:1} 50%{opacity:0} }`}</style>
    </figure>
  );
}
