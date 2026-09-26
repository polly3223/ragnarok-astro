// "How it works": starts when scrolled into view, then shows step 1 → 2 → 3 (9.2s, 9s, 9.2s) in a
// loop; clicking a step pointer jumps to it. Each step's progress tint and illustration restart.
const DURATIONS = [9200, 9000, 9200];
const root = document.querySelector<HTMLElement>("[data-hiw]");

if (root) {
  const bars = [...root.querySelectorAll<HTMLElement>(".bar")];
  const illustrations = [...root.querySelectorAll<HTMLElement>(".illustration")];
  let timer = 0;
  let started = false;

  const restart = (el: HTMLElement | undefined) => {
    if (!el) return;
    el.classList.remove("play");
    void el.offsetWidth; // reflow so the CSS animations start over
    el.classList.add("play");
  };
  const show = (step: number) => {
    root.dataset.step = String(step);
    for (const bar of bars) bar.classList.remove("play");
    restart(bars[step - 1]);
    restart(illustrations[step - 1]);
    clearTimeout(timer);
    timer = window.setTimeout(() => show((step % 3) + 1), DURATIONS[step - 1]);
  };
  // Whichever comes first starts the loop: entering the viewport (step 1) or a step click. A click
  // that scrolls the section into view must not be overridden by the observer firing just after it.
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry?.isIntersecting && !started) start(1);
    },
    { threshold: 0.3 },
  );
  const start = (step: number) => {
    started = true;
    observer.disconnect();
    root.removeAttribute("data-idle");
    show(step);
  };

  root.querySelectorAll<HTMLElement>("[data-step-target]").forEach((button) => {
    button.addEventListener("click", () => start(Number(button.dataset.stepTarget)));
  });
  observer.observe(root);
}
