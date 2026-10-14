import { useSyncExternalStore } from "react";

// "full" = the site exactly as designed. "lite" = heavy effects (noise overlay,
// blurs, custom cursor, interactive dot grid, motion transforms) switched off
// so old / low-spec phones stay smooth.
export type PerfMode = "full" | "lite";

const STORAGE_KEY = "portfolio-perf-mode";
// An auto-detected "lite" verdict is remembered so the next visit starts light
// right away, but it expires in case it was a one-off hiccup.
const AUTO_LITE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// FPS monitor tuning: watch the first seconds of the session, and drop to lite
// if two consecutive 1s windows average below the threshold.
const MONITOR_DELAY_MS = 1000;
const MONITOR_DURATION_MS = 20000;
const WINDOW_MS = 1000;
const LOW_FPS = 40;
const BAD_WINDOWS_TO_TRIP = 2;
const PAUSE_GAP_MS = 250;

interface Stored {
  mode: PerfMode;
  source: "auto" | "user";
  at: number;
}

function readStored(): Stored | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Stored;
    if (parsed.source === "auto" && Date.now() - parsed.at > AUTO_LITE_TTL_MS) {
      localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    return null;
  }
}

function writeStored(value: Stored | null) {
  try {
    if (value) localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // localStorage unavailable — the verdict just won't persist.
  }
}

// Manual override for testing: ?perf=lite, ?perf=full, or ?perf=auto to reset.
function readQueryOverride(): Stored | null | undefined {
  try {
    const value = new URLSearchParams(window.location.search).get("perf");
    if (value === "lite" || value === "full") {
      const stored: Stored = { mode: value, source: "user", at: Date.now() };
      writeStored(stored);
      return stored;
    }
    if (value === "auto") {
      writeStored(null);
      return null;
    }
  } catch {
    // ignore
  }
  return undefined;
}

// Cheap signals available before the first paint.
function hardwareSaysLite(): boolean {
  const nav = navigator as Navigator & {
    deviceMemory?: number;
    connection?: { saveData?: boolean };
  };
  try {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return true;
  } catch {
    // ignore
  }
  if (nav.connection?.saveData) return true;

  const mem = nav.deviceMemory; // Chromium only, in GB (rounded, capped at 8)
  const cores = nav.hardwareConcurrency;
  if (mem !== undefined && mem <= 2) return true;
  if (cores !== undefined && cores > 0 && cores <= 2) return true;
  if (mem !== undefined && mem <= 4 && cores !== undefined && cores <= 4) return true;
  return false;
}

let mode: PerfMode = "full";
let lockedByUser = false;
const listeners = new Set<() => void>();

function applyMode(next: PerfMode) {
  mode = next;
  document.documentElement.dataset.perf = next;
  listeners.forEach((l) => l());
}

// Watches real frame rates for a while after load. Static hints miss plenty of
// old phones (iOS exposes neither memory nor real core counts), so this is the
// main safety net: if the page can't keep up, switch to lite on the fly.
function startFpsMonitor() {
  let start = 0;
  let last = 0;
  let windowStart = 0;
  let frames = 0;
  let badWindows = 0;

  const tick = (now: number) => {
    if (mode === "lite") return;
    if (!start) {
      start = last = windowStart = now;
    }
    const gap = now - last;
    last = now;

    // Tab hidden / rAF paused — don't count it as jank.
    if (gap > PAUSE_GAP_MS || document.hidden) {
      windowStart = now;
      frames = 0;
    } else {
      frames++;
      if (now - windowStart >= WINDOW_MS) {
        const fps = (frames * 1000) / (now - windowStart);
        badWindows = fps < LOW_FPS ? badWindows + 1 : 0;
        windowStart = now;
        frames = 0;
        if (badWindows >= BAD_WINDOWS_TO_TRIP) {
          writeStored({ mode: "lite", source: "auto", at: Date.now() });
          applyMode("lite");
          return;
        }
      }
    }

    if (now - start < MONITOR_DURATION_MS) requestAnimationFrame(tick);
  };

  window.setTimeout(() => requestAnimationFrame(tick), MONITOR_DELAY_MS);
}

// Call once before the first render so the right mode applies immediately.
export function initPerformanceMode() {
  const query = readQueryOverride();
  const stored = query === undefined ? readStored() : query;

  if (stored) {
    lockedByUser = stored.source === "user";
    applyMode(stored.mode);
  } else {
    applyMode(hardwareSaysLite() ? "lite" : "full");
  }

  if (mode === "full" && !lockedByUser) startFpsMonitor();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function usePerfMode(): PerfMode {
  return useSyncExternalStore(subscribe, () => mode);
}

export function useIsLite(): boolean {
  return usePerfMode() === "lite";
}
