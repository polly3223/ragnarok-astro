// Renders a muted looping video as ASCII glyphs on a canvas (port of the template's "Asciivideo"
// component: standard charset, inverted luminance, 7px monospace glyphs, 30fps, half-speed playback).

const CHARSET = " .:-=+*#%@";
const FONT_SIZE = 7;
const FPS = 30;

function start(root: HTMLElement): void {
  const canvas = root.querySelector("canvas");
  const ctx = canvas?.getContext("2d");
  const sampler = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!canvas || !ctx || !sampler) return;

  const video = document.createElement("video");
  Object.assign(video, { muted: true, loop: true, playsInline: true, preload: "auto" });

  const color = getComputedStyle(root).color;
  const brightness = Number(root.dataset.brightness ?? -0.05);
  const contrast = Number(root.dataset.contrast ?? 1);
  let visible = false;
  let last = 0;

  const resize = () => {
    const dpr = Math.max(1, devicePixelRatio || 1);
    canvas.width = Math.max(1, Math.floor(root.clientWidth * dpr));
    canvas.height = Math.max(1, Math.floor(root.clientHeight * dpr));
  };
  new ResizeObserver(resize).observe(root);
  resize();

  const draw = (now: number) => {
    requestAnimationFrame(draw);
    if (!visible || !video.videoWidth || now - last < 1000 / FPS) return;
    last = now;
    const dpr = Math.max(1, devicePixelRatio || 1);
    const { width, height } = canvas;
    const cols = Math.max(8, Math.floor(width / Math.max(2, Math.floor(FONT_SIZE * 0.6 * dpr))));
    const rows = Math.max(8, Math.floor(height / Math.max(2, Math.floor(FONT_SIZE * dpr))));
    sampler.canvas.width = cols;
    sampler.canvas.height = rows;
    sampler.drawImage(video, 0, 0, cols, rows);
    const data = sampler.getImageData(0, 0, cols, rows).data;
    const cellW = width / cols;
    const cellH = height / rows;
    ctx.clearRect(0, 0, width, height);
    ctx.textBaseline = "top";
    ctx.font = `250 ${FONT_SIZE * dpr}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;
    ctx.fillStyle = color;
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const i = (y * cols + x) * 4;
        if (data[i + 3] === 0) continue;
        const lum = (0.2126 * data[i]! + 0.7152 * data[i + 1]! + 0.0722 * data[i + 2]!) / 255;
        const level = 1 - Math.min(1, Math.max(0, (lum + brightness - 0.5) * contrast + 0.5));
        const glyph = CHARSET[Math.min(CHARSET.length - 1, Math.floor(level * (CHARSET.length - 1)))];
        if (glyph && glyph !== " ") ctx.fillText(glyph, x * cellW, y * cellH);
      }
    }
  };

  new IntersectionObserver(
    ([entry]) => {
      visible = Boolean(entry?.isIntersecting);
      if (!visible) return video.pause();
      if (!video.src) video.src = root.dataset.src ?? "";
      video.playbackRate = 0.5;
      video.play().catch(() => {});
    },
    { threshold: 0.01 },
  ).observe(root);
  requestAnimationFrame(draw);
}

document.querySelectorAll<HTMLElement>("[data-ascii]").forEach(start);
