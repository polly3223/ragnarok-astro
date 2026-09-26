// Placeholder typewriter with a block cursor ("Digital Typewriter"): 12 characters per second,
// occasional random pauses after a word (cursor blinks while paused), 1s hold, next phrase after 0.6s.
const CPS = 12;

function run(root: HTMLElement): void {
  const phrases: string[] = JSON.parse(root.dataset.digitalTypewriter ?? "[]");
  const line = document.createElement("p");
  line.className = "dt-line";
  const [typed, cursor, rest] = ["", "dt-cursor", "dt-rest"].map((cls) => {
    const span = document.createElement("span");
    span.className = cls;
    line.append(span);
    return span;
  }) as [HTMLSpanElement, HTMLSpanElement, HTMLSpanElement];
  root.replaceChildren(line);

  let phrase = 0;
  const show = (text: string, at: number) => {
    typed.textContent = text.slice(0, at);
    cursor.textContent = text[at] ?? " ";
    rest.textContent = text.slice(at + 1);
  };
  const type = (text: string, at: number, cps: number) => {
    show(text, at);
    root.toggleAttribute("data-paused", false);
    if (at >= text.length) {
      root.toggleAttribute("data-paused", true);
      setTimeout(() => {
        phrase = (phrase + 1) % phrases.length;
        const next = `${phrases[phrase]} `;
        show(next, 0);
        setTimeout(() => type(next, 0, CPS), 600);
      }, 1000);
    } else if (text[at - 1] === " " && Math.random() < 0.1) {
      root.toggleAttribute("data-paused", true);
      const pause = 200 + Math.round(Math.random() * 18) * 100;
      setTimeout(() => type(text, at + 1, 8 + Math.round(Math.random() * 14)), pause);
    } else {
      setTimeout(() => type(text, at + 1, cps), 1000 / cps);
    }
  };

  const first = `${phrases[0]} `;
  show(first, 0);
  root.toggleAttribute("data-paused", true);
  const observer = new IntersectionObserver(([entry]) => {
    if (!entry?.isIntersecting) return;
    observer.disconnect();
    setTimeout(() => type(first, 0, CPS), 600);
  });
  observer.observe(root);
}

document.querySelectorAll<HTMLElement>("[data-digital-typewriter]").forEach(run);
