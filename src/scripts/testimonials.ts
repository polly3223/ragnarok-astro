// Testimonial slider: the arrows move a shared --i index (CSS does the sliding) and each result
// counts up from 1 (+1 every 23ms) the first time it becomes visible, like the template's counter.
document.querySelectorAll<HTMLElement>("[data-testimonials]").forEach((root) => {
  const prev = root.querySelector<HTMLButtonElement>("[data-prev]");
  const next = root.querySelector<HTMLButtonElement>("[data-next]");
  const last = root.querySelectorAll("[data-count]").length - 1;
  let index = 0;

  const go = (to: number) => {
    index = Math.max(0, Math.min(last, to));
    root.style.setProperty("--i", String(index));
    if (prev) prev.disabled = index === 0;
    if (next) next.disabled = index === last;
  };
  prev?.addEventListener("click", () => go(index - 1));
  next?.addEventListener("click", () => go(index + 1));

  const counters = new IntersectionObserver((entries) => {
    for (const { isIntersecting, target } of entries) {
      if (!isIntersecting || !(target instanceof HTMLElement)) continue;
      counters.unobserve(target);
      const end = Number(target.dataset.count);
      let value = 1;
      const timer = setInterval(() => {
        value = Math.min(end, value + 1);
        target.textContent = String(value);
        if (value === end) clearInterval(timer);
      }, 23);
    }
  });
  root.querySelectorAll("[data-count]").forEach((el) => counters.observe(el));

  // Later slides sit clipped out of view, so native lazy loading would only fetch them mid-slide;
  // start every image in the section once it approaches the viewport.
  const preload = new IntersectionObserver(
    ([entry]) => {
      if (!entry?.isIntersecting) return;
      preload.disconnect();
      root.querySelectorAll("img").forEach((img) => (img.loading = "eager"));
    },
    { rootMargin: "800px" },
  );
  preload.observe(root);
});
