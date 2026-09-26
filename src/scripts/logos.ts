// Logo strip choreography: every second one cell flips to its second logo (left to right), then
// each flips on to the copy of its first logo; the loop then resets without animation (8.5s cycle).
const cells = [...document.querySelectorAll<HTMLElement>("[data-logos] .logo-cell")];
let step = 0;

function tick(): void {
  if (step === 0) {
    for (const cell of cells) {
      cell.toggleAttribute("data-reset", true);
      cell.dataset.show = "0";
    }
    requestAnimationFrame(() => requestAnimationFrame(() => cells.forEach((c) => c.removeAttribute("data-reset"))));
  } else {
    const cell = cells[(step - 1) % cells.length];
    if (cell) cell.dataset.show = step <= cells.length ? "1" : "2";
  }
  const delay = step === 2 * cells.length ? 500 : 1000;
  step = (step + 1) % (2 * cells.length + 1);
  setTimeout(tick, delay);
}

if (cells.length) tick();
