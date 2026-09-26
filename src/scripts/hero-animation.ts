// Advances the hero animation (components/home/HeroAnimation.astro) through its 16 states using the
// original per-state delays. States 8–11 run one step each: spinner for 1s, then the tick.
const DELAYS = [2200, 800, 600, 800, 1000, 1000, 1000, 400, 1400, 1400, 1400, 1400, 700, 1200, 800, 800];

const stage = document.querySelector<HTMLElement>("[data-hero-stage]");
const steps = [...(stage?.querySelectorAll<HTMLElement>("[data-step]") ?? [])];

function enter(state: number): void {
  if (!stage) return;
  stage.dataset.state = String(state);
  const step = steps[state - 8];
  if (step) {
    step.dataset.step = "loading";
    setTimeout(() => (step.dataset.step = "done"), 1000);
  }
  if (state === 15) for (const s of steps) s.dataset.step = "off";
  setTimeout(() => enter(state === 15 ? 1 : state + 1), DELAYS[state]);
}

enter(0);
