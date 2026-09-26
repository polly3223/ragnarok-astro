// Footer wordmark: each outlined layer drifts away from the cursor by up to `data-parallax-layer` px
// (Framer "Parallax Floating"), eased per layer by `data-smoothing` (0 = instant, 100 = slowest).
// Framer maps smoothing 0..100 to a spring of stiffness 2000..50 (damping 100); we follow its slow
// (overdamped) mode as a per-frame lerp. Smoothing 0 means no spring at all.
const lerpFor = (smoothing: number): number => {
  if (!smoothing) return 1;
  const omega = Math.sqrt(2000 - 19.5 * smoothing);
  const zeta = 50 / omega;
  return 1 - Math.exp((-omega * (zeta - Math.sqrt(Math.max(0, zeta * zeta - 1)))) / 60);
};
const layers = [...document.querySelectorAll<HTMLElement>("[data-parallax-layer]")].map((el) => ({
  el,
  distance: Number(el.dataset.parallaxLayer),
  ease: lerpFor(Number(el.dataset.smoothing)),
  x: 0,
  y: 0,
}));
let targetX = 0;
let targetY = 0;
let running = false;

const frame = () => {
  running = false;
  for (const layer of layers) {
    layer.x += (-targetX * layer.distance - layer.x) * layer.ease;
    layer.y += (-targetY * layer.distance - layer.y) * layer.ease;
    layer.el.style.translate = `${layer.x.toFixed(2)}px ${layer.y.toFixed(2)}px`;
    if (Math.abs(-targetX * layer.distance - layer.x) > 0.05 || Math.abs(-targetY * layer.distance - layer.y) > 0.05) {
      running = true;
    }
  }
  if (running) requestAnimationFrame(frame);
};

if (layers.length && matchMedia("(pointer: fine)").matches) {
  addEventListener("mousemove", (event) => {
    targetX = (event.clientX - innerWidth / 2) / (innerWidth / 2);
    targetY = (event.clientY - innerHeight / 2) / (innerHeight / 2);
    if (!running) {
      running = true;
      requestAnimationFrame(frame);
    }
  });
}
