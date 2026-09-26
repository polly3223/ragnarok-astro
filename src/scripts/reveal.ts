// Scroll-triggered entrances: [data-appear] rises 85px into place; [data-reveal] fades its
// .reveal-item children in one after another. Both play once.
const observer = new IntersectionObserver(
  (entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add("is-in");
      observer.unobserve(entry.target);
    }
  },
  { threshold: 0.3 },
);
document.querySelectorAll("[data-appear], [data-reveal]").forEach((el) => observer.observe(el));
