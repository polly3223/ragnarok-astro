// Hover effects ported from the template's Framer components:
// - "Scramble Appear": the label is re-typed from the left through a window of random glyphs.
// - "Pixel Grid Reveal": a grid of solid cells disappears column-biased from right to left.

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+[]{}|;:,.<>?~";
const STEP = 0.032; // seconds per character (component speed 85)
const WINDOW = 6; // scrambled letters

function randomize(text: string): string {
  let out = "";
  let last = "";
  for (const ch of text) {
    if (ch === " ") {
      out += ch;
      continue;
    }
    let pick: string;
    do {
      pick = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "";
      pick = ch === ch.toUpperCase() ? pick.toUpperCase() : pick.toLowerCase();
    } while (pick === last);
    out += pick;
    last = pick;
  }
  return out;
}

const clamp = (v: number, max: number) => Math.max(0, Math.min(Math.round(v), max));

function scramble(label: HTMLElement): () => void {
  const text = label.textContent ?? "";
  const overlay = document.createElement("span");
  overlay.className = "fx-scramble";
  overlay.ariaHidden = "true";
  const [done, noise, hidden] = ["", "fx-noise", "opacity-0"].map((cls) => {
    const span = document.createElement("span");
    span.className = cls;
    overlay.append(span);
    return span;
  }) as [HTMLSpanElement, HTMLSpanElement, HTMLSpanElement];
  label.after(overlay);

  const duration = STEP * (text.length + WINDOW) * 1000;
  const start = performance.now();
  let noiseText = randomize(text);
  let lastNoise = start;
  let frame = 0;
  const tick = (now: number) => {
    const y = Math.min(1, (now - start) / duration);
    if (now - lastNoise >= STEP * 1000) {
      noiseText = randomize(text);
      lastNoise = now;
    }
    const a = clamp(-WINDOW + y * (text.length + WINDOW), text.length);
    const b = clamp(y * (text.length + WINDOW), text.length);
    done.textContent = text.slice(0, a);
    noise.textContent = noiseText.slice(a, b);
    hidden.textContent = text.slice(b);
    if (y < 1) frame = requestAnimationFrame(tick);
  };
  frame = requestAnimationFrame(tick);
  return () => {
    cancelAnimationFrame(frame);
    overlay.remove();
  };
}

function pixelReveal(layer: HTMLElement): () => void {
  const { clientWidth: w, clientHeight: h } = layer;
  const size = Math.min(140, Math.max(40, Math.round(60 * Math.min(1, Math.max(0.75, w / 1200)))));
  const cols = Math.ceil(w / size);
  const rows = Math.ceil(h / size);
  const grid = document.createElement("span");
  grid.className = "fx-pixels";
  grid.style.gridTemplateColumns = `repeat(${cols}, ${w / cols}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${h / rows}px)`;
  const cells = Array.from({ length: cols * rows }, (_, i) => {
    const cell = document.createElement("span");
    grid.append(cell);
    return { cell, col: i % cols };
  });
  layer.append(grid);

  const perTick = Math.ceil(cells.length * 0.05);
  const interval = 450 / Math.ceil(cells.length / perTick); // 900ms / animation speed 2
  let visible = cells;
  const timer = setInterval(() => {
    if (!visible.length) {
      clearInterval(timer);
      grid.remove();
      return;
    }
    const lanes = Math.ceil(8 - 6 * (1 - visible.length / cells.length));
    const maxCol = Math.max(...visible.map((c) => c.col));
    const candidates = Array.from({ length: lanes }, (_, i) => {
      const lane = visible.filter((c) => c.col === maxCol - i).sort(() => Math.random() - 0.5);
      return lane.slice(0, Math.max(1, Math.ceil(lane.length * (1 - i / (lanes + 2)))));
    }).flat();
    const picked = new Set(candidates.sort(() => Math.random() - 0.5).slice(0, perTick));
    for (const c of picked) c.cell.style.backgroundColor = "transparent";
    visible = visible.filter((c) => !picked.has(c));
  }, interval);
  return () => {
    clearInterval(timer);
    grid.remove();
  };
}

const active = new WeakMap<Element, Array<() => void>>();

document.addEventListener("pointerover", (event) => {
  const host = (event.target as Element).closest<HTMLElement>("[data-fx]");
  if (!host || active.has(host) || event.pointerType === "touch") return;
  const stops: Array<() => void> = [];
  const label = host.querySelector<HTMLElement>("[data-fx-label]");
  const layer = host.querySelector<HTMLElement>("[data-fx-pixels]");
  if (label) stops.push(scramble(label));
  if (layer) stops.push(pixelReveal(layer));
  active.set(host, stops);
  host.addEventListener(
    "pointerleave",
    () => {
      for (const stop of active.get(host) ?? []) stop();
      active.delete(host);
    },
    { once: true },
  );
});
