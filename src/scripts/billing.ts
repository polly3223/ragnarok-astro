// "Billed Yearly" switch: flips every plan in the pricing section at once and re-types each price
// through a short glitch ("Text Glitch": 400ms, a fresh mix every 40ms, ~61% of characters swapped).
const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,.<>?";

function glitch(el: HTMLElement, text: string): void {
  const start = performance.now();
  const timer = setInterval(() => {
    if (performance.now() - start >= 400) {
      clearInterval(timer);
      el.textContent = text;
      return;
    }
    el.replaceChildren(
      ...[...text].map((ch) => {
        if (ch === " " || Math.random() > 0.61) return ch;
        const span = document.createElement("span");
        span.className = "text-muted";
        span.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)] ?? "";
        return span;
      }),
    );
  }, 40);
}

document.querySelectorAll<HTMLElement>("[data-pricing]").forEach((root) => {
  const toggles = root.querySelectorAll<HTMLButtonElement>("[data-billing-toggle]");
  for (const toggle of toggles) {
    toggle.addEventListener("click", () => {
      const yearly = !root.hasAttribute("data-yearly");
      root.toggleAttribute("data-yearly", yearly);
      for (const t of toggles) t.setAttribute("aria-checked", String(yearly));
      root.querySelectorAll<HTMLElement>("[data-price-monthly]").forEach((price) => {
        glitch(price, (yearly ? price.dataset.priceYearly : price.dataset.priceMonthly) ?? "");
      });
    });
  }
});
