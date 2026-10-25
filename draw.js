// Puts the line drawings on the page. Every <canvas data-figure="key"> gets its
// figure, sized to its box, and draws itself in (outward from the centre) when
// revealed. Ribbons are flowing lines for <canvas data-ribbons>.
(function () {
  const TAU = Math.PI * 2;
  const reduced = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const easeOut = (p) => 1 - Math.pow(1 - p, 3);

  function fit(canvas) {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const { width, height } = canvas.getBoundingClientRect();
    const w = Math.max(1, Math.round(width)), h = Math.max(1, Math.round(height));
    if (canvas.width !== w * dpr || canvas.height !== h * dpr) {
      canvas.width = w * dpr; canvas.height = h * dpr;
    }
    const g = canvas.getContext("2d");
    g.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { g, w, h };
  }

  // A figure on a canvas, with a replayable reveal
  function figure(canvas, opts = {}) {
    let progress = reduced ? 1 : 0, start = 0, raf = 0;
    const key = canvas.dataset.figure;
    const pad = opts.pad ?? 0;

    function paint() {
      const { g, w, h } = fit(canvas);
      g.clearRect(0, 0, w, h);
      if (progress <= 0) return;
      g.save();
      if (progress < 1) {
        g.beginPath(); g.arc(w / 2, h / 2, Math.hypot(w, h) / 2 * easeOut(progress), 0, TAU); g.clip();
        g.globalAlpha = Math.min(1, progress * 2);
      }
      // Shapes are filled with whatever the drawing sits on (a grey tile or the page)
      const bg = getComputedStyle(canvas.parentElement).backgroundColor;
      const paper = bg && bg !== "rgba(0, 0, 0, 0)" && bg !== "transparent" ? bg : "#fff";
      window.Figures.draw(g, key, { x: pad, y: pad, w: w - pad * 2, h: h - pad * 2 }, opts.params, paper);
      g.restore();
    }
    function tick(now) {
      progress = Math.min(1, (now - start) / 1100);
      paint();
      if (progress < 1) raf = requestAnimationFrame(tick);
    }
    return {
      reveal() {
        if (reduced) { progress = 1; paint(); return; }
        cancelAnimationFrame(raf);
        start = performance.now();
        raf = requestAnimationFrame(tick);
      },
      show() { cancelAnimationFrame(raf); progress = 1; paint(); },
      paint
    };
  }

  // Twisting bands drawn as lines: two edges and a dashed centre
  function ribbons(canvas) {
    let raf = 0, running = false;
    function paint(now) {
      const { g, w, h } = fit(canvas);
      const t = reduced ? 0 : now;
      g.clearRect(0, 0, w, h);
      g.strokeStyle = "#000"; g.lineWidth = 1;
      [0.2, 0.52, 0.84].forEach((y0, band) => {
        const phase = band * 2.1;
        const centre = (u) => y0 * h + Math.sin(u * TAU * 0.75 + phase + t * 0.00012) * h * 0.08;
        const width = (u) => Math.sin(u * TAU * 0.9 + phase * 1.7 + t * 0.0002) * h * 0.07;
        const path = (side, dashed) => {
          g.setLineDash(dashed ? [4, 4] : []);
          g.globalAlpha = dashed ? 0.5 : 0.8;
          g.beginPath();
          for (let j = 0; j <= 120; j++) {
            const u = j / 120;
            const y = centre(u) + side * width(u);
            j ? g.lineTo(u * w, y) : g.moveTo(u * w, y);
          }
          g.stroke();
        };
        path(1); path(-1); path(0, true);
      });
      g.globalAlpha = 1;
    }
    function loop(now) { paint(now); if (running) raf = requestAnimationFrame(loop); }
    return {
      start() { if (running || reduced) { paint(0); return; } running = true; raf = requestAnimationFrame(loop); },
      stop() { running = false; cancelAnimationFrame(raf); },
      paint: () => paint(performance.now())
    };
  }

  window.Draw = { figure, ribbons };
})();
