// Home preloader, ported from the template's "Preloader" component and timed from per-frame traces
// of the original (relative to its first painted frame): the pixel "R" mask shrinks at 0.85s and
// sweeps away at 1.7s, the backdrop fades at 1.3s, the logo fades at 2.32s, and from 2s the pixel
// grid (140px cells, smaller below 1200px) is cleared at random, 5% of cells per tick over ~0.7s.
// Page scrolling is locked meanwhile on screens wider than 768px, as in the original.
const root = document.querySelector<HTMLElement>("[data-preloader]");
const grid = root?.querySelector<HTMLElement>("[data-preloader-grid]");

if (root && grid) {
  const { innerWidth: w, innerHeight: h } = window;
  const size = Math.min(140, Math.max(40, Math.round(140 * Math.min(1, Math.max(0.75, w / 1200)))));
  const cols = Math.ceil(w / size);
  const rows = Math.ceil(h / size);
  grid.style.gridTemplateColumns = `repeat(${cols}, ${w / cols}px)`;
  grid.style.gridTemplateRows = `repeat(${rows}, ${h / rows}px)`;
  const cells = Array.from({ length: cols * rows }, () => {
    const cell = document.createElement("span");
    cell.className = "bg-primary";
    return grid.appendChild(cell);
  });
  const lock = w > 768;
  if (lock) document.body.style.overflow = "hidden";

  requestAnimationFrame(() => requestAnimationFrame(() => root.toggleAttribute("data-in", true)));
  setTimeout(() => (root.dataset.state = "2"), 850);
  setTimeout(() => root.toggleAttribute("data-end", true), 1300);
  setTimeout(() => (root.dataset.state = "3"), 1700);
  setTimeout(() => (root.dataset.state = "4"), 2320);
  setTimeout(() => {
    const perTick = Math.ceil(cells.length * 0.05);
    let visible = cells.sort(() => Math.random() - 0.5);
    const timer = setInterval(
      () => {
        for (const cell of visible.slice(0, perTick)) cell.style.visibility = "hidden";
        visible = visible.slice(perTick);
        if (visible.length) return;
        clearInterval(timer);
        if (lock) document.body.style.overflow = "";
        root.remove();
      },
      700 / Math.ceil(cells.length / perTick),
    );
  }, 2000);
}
