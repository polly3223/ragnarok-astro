// Seamless ticker: repeats the track's items until they cover the viewport, then scrolls by one
// set of items at `data-marquee` px/s (leftwards, or rightwards with `data-reverse`).
function setup(track: HTMLElement): void {
  const items = [...track.children];
  const gap = parseFloat(getComputedStyle(track).columnGap) || 0;
  const unit = track.scrollWidth + gap;
  const needed = (track.parentElement?.clientWidth ?? innerWidth) + unit;
  let width = unit;
  while (width < needed) {
    for (const item of items) track.append(item.cloneNode(true));
    width += unit;
  }
  track.style.setProperty("--marquee-shift", `${unit}px`);
  track.style.setProperty("--marquee-duration", `${unit / Number(track.dataset.marquee || 50)}s`);
  track.classList.add("animate-marquee");
  if (track.hasAttribute("data-reverse")) track.style.animationDirection = "reverse";
}

document.querySelectorAll<HTMLElement>("[data-marquee]").forEach(setup);
