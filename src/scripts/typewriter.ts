// Types, holds and deletes a rotating list of phrases ("Pro Text Type Effect": 50ms per typed
// character, 30ms per deleted character, 1s pause). Mobile can use a shorter list.
const TYPE_MS = 50;
const DELETE_MS = 30;
const PAUSE_MS = 1000;
const mobile = matchMedia("(max-width: 809.98px)");

function run(root: HTMLElement): void {
  const output = root.querySelector<HTMLElement>("[data-typewriter-text]");
  if (!output) return;
  const phrases = (): string[] =>
    JSON.parse((mobile.matches && root.dataset.typewriterMobile) || root.dataset.typewriter || "[]");
  let index = 0;
  let length = 0;
  let deleting = false;

  const tick = () => {
    const list = phrases();
    const phrase = list[index % list.length] ?? "";
    if (!deleting && length < phrase.length) {
      output.textContent = phrase.slice(0, ++length);
      setTimeout(tick, TYPE_MS);
    } else if (!deleting) {
      deleting = true;
      setTimeout(tick, PAUSE_MS);
    } else if (length > 0) {
      output.textContent = phrase.slice(0, --length);
      setTimeout(tick, DELETE_MS);
    } else {
      deleting = false;
      index++;
      setTimeout(tick, TYPE_MS);
    }
  };

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      setTimeout(tick, TYPE_MS);
    },
    { threshold: 0.1 },
  );
  observer.observe(root);
}

document.querySelectorAll<HTMLElement>("[data-typewriter]").forEach(run);
