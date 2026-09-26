// Navbar: hides while scrolling down, returns on scroll up (Framer "scroll direction" effect,
// 4px threshold), and toggles the mobile menu.
const navbar = document.querySelector<HTMLElement>("[data-navbar]");
const toggle = navbar?.querySelector<HTMLButtonElement>("[data-navbar-toggle]");

if (navbar && toggle) {
  let lastY = scrollY;
  let anchor = scrollY;
  let lastDirection = 0;

  addEventListener(
    "scroll",
    () => {
      const y = scrollY;
      const direction = Math.sign(y - lastY);
      if (direction !== lastDirection) {
        lastDirection = direction;
        anchor = lastY;
      }
      lastY = y;
      if (!direction || y < 0 || navbar.hasAttribute("data-open")) return;
      if (Math.abs(y - anchor) >= 4) navbar.toggleAttribute("data-hidden", direction > 0);
    },
    { passive: true },
  );

  toggle.addEventListener("click", () => {
    const open = !navbar.hasAttribute("data-open");
    navbar.toggleAttribute("data-open", open);
    toggle.setAttribute("aria-expanded", String(open));
  });
}
