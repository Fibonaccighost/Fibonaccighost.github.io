// Line drawings for the site, in the style of the theme: bold outlines,
// thin and dashed lines, arcs, hatching and a single solid dot.
// Each figure has two layers drawn into a box:
//   dots(g, box, opts)  → main shapes; drawn as bold outlines (fills become strokes)
//   lines(g, box, opts) → thin lines, dashed lines and solid dots on top
// Pick one per project with `figure: "<key>"` in data.js.
(function () {
  const TAU = Math.PI * 2;

  // Unit square (0..1) centred in the box
  function sq(b) {
    const S = Math.min(b.w, b.h);
    const ox = b.x + (b.w - S) / 2, oy = b.y + (b.h - S) / 2;
    return { S, X: (u) => ox + u * S, Y: (v) => oy + v * S, L: (k) => k * S };
  }

  // Small drawing kit bound to one square
  function kit(g, b) {
    const f = sq(b);
    const k = {
      f,
      dash(on = true) { g.setLineDash(on ? [4, 4] : []); },
      width(px) { g.lineWidth = px; },
      thick(k2) { g.lineWidth = f.L(k2); },
      line(u1, v1, u2, v2) { g.beginPath(); g.moveTo(f.X(u1), f.Y(v1)); g.lineTo(f.X(u2), f.Y(v2)); g.stroke(); },
      poly(pts, close) {
        g.beginPath();
        pts.forEach(([u, v], i) => (i ? g.lineTo(f.X(u), f.Y(v)) : g.moveTo(f.X(u), f.Y(v))));
        if (close) g.closePath();
      },
      circle(u, v, r) { g.beginPath(); g.arc(f.X(u), f.Y(v), f.L(r), 0, TAU); },
      arc(u, v, r, a0, a1) { g.beginPath(); g.arc(f.X(u), f.Y(v), f.L(r), a0, a1); g.stroke(); },
      ring(u, v, r) { k.circle(u, v, r); g.stroke(); },
      disc(u, v, r) { k.circle(u, v, r); g.fill(); },
      box(u, v, w, h, r) {
        g.beginPath();
        if (g.roundRect) g.roundRect(f.X(u), f.Y(v), f.L(w), f.L(h), f.L(r || 0));
        else g.rect(f.X(u), f.Y(v), f.L(w), f.L(h));
      },
      fillBox(u, v, w, h, r) { k.box(u, v, w, h, r); g.fill(); },
      strokeBox(u, v, w, h, r) { k.box(u, v, w, h, r); g.stroke(); },
      curve(u1, v1, cu, cv, u2, v2) {
        g.beginPath(); g.moveTo(f.X(u1), f.Y(v1)); g.quadraticCurveTo(f.X(cu), f.Y(cv), f.X(u2), f.Y(v2)); g.stroke();
      },
      dot(u, v) { g.beginPath(); g.arc(f.X(u), f.Y(v), 3.5, 0, TAU); g.fill(); },
      arrow(u1, v1, u2, v2) {
        k.line(u1, v1, u2, v2);
        const a = Math.atan2(v2 - v1, u2 - u1), s = 0.025;
        k.line(u2, v2, u2 - Math.cos(a - 0.5) * s, v2 - Math.sin(a - 0.5) * s);
        k.line(u2, v2, u2 - Math.cos(a + 0.5) * s, v2 - Math.sin(a + 0.5) * s);
      }
    };
    return k;
  }

  // Deterministic randomness, so figures don't change between visits
  const seeded = (seed) => () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

  const F = {};

  // Long-form content cut into short clips that fan out to many accounts
  F.clipper = {
    // Clip positions along a wide fan
    clips: () => Array.from({ length: 8 }, (_, i) => {
      const a = -1.0 + (i / 7) * 2.0;
      return [0.5 + Math.sin(a) * 0.44, 0.5 + (1 - Math.cos(a)) * 0.38];
    }),
    dots(g, b) {
      const k = kit(g, b);
      k.fillBox(0.06, 0.16, 0.88, 0.1, 0.02);
      F.clipper.clips().forEach(([u, v]) => k.fillBox(u - 0.035, v, 0.07, 0.12, 0.012));
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1); k.dash();
      for (let i = 1; i < 8; i++) k.line(0.06 + 0.11 * i, 0.12, 0.06 + 0.11 * i, 0.3);
      k.dash(false);
      F.clipper.clips().forEach(([u, v], i) => {
        k.curve(0.115 + 0.11 * i, 0.3, 0.115 + 0.11 * i, 0.45, u, v - 0.01);
        k.dot(u, v + 0.16);
      });
    }
  };

  // Documents filed into a knowledge graph that answers with a source
  F.brain = {
    nodes: {
      root: [0.5, 0.1, 0.05],
      l2: [[0.22, 0.36], [0.5, 0.36], [0.78, 0.36]],
      l3: [[0.1, 0.62], [0.3, 0.62], [0.42, 0.62], [0.58, 0.62], [0.7, 0.62], [0.9, 0.62]],
      answer: [0.62, 0.87, 0.045]
    },
    dots(g, b) {
      const k = kit(g, b), n = F.brain.nodes;
      k.disc(n.root[0], n.root[1], n.root[2]);
      n.l2.forEach(([u, v]) => k.disc(u, v, 0.035));
      n.l3.forEach(([u, v]) => k.disc(u, v, 0.024));
      k.disc(n.answer[0], n.answer[1], n.answer[2]);
    },
    lines(g, b) {
      const k = kit(g, b), n = F.brain.nodes;
      k.width(1);
      n.l2.forEach(([u, v]) => k.line(n.root[0], n.root[1], u, v));
      n.l3.forEach(([u, v], i) => k.line(n.l2[Math.min(2, Math.floor(i / 2))][0], n.l2[Math.min(2, Math.floor(i / 2))][1], u, v));
      k.line(0.3, 0.62, 0.58, 0.62);
      k.dash();
      k.line(0.42, 0.62, n.answer[0], n.answer[1]);
      k.line(0.7, 0.62, n.answer[0], n.answer[1]);
      k.ring(n.answer[0], n.answer[1], 0.085);
      k.dash(false);
      k.dot(n.answer[0], n.answer[1]);
      k.ring(n.root[0], n.root[1], 0.075);
    }
  };

  // A ranked board where paid boosts run down over time
  F.ranking = {
    bars: [0.74, 0.62, 0.52, 0.43, 0.34, 0.26],
    dots(g, b) {
      const k = kit(g, b);
      F.ranking.bars.forEach((len, i) => k.fillBox(0.14, 0.17 + i * 0.12, len, 0.05, 0.01));
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.line(0.1, 0.1, 0.1, 0.9);
      F.ranking.bars.forEach((_, i) => k.line(0.1, 0.25 + i * 0.12, 0.92, 0.25 + i * 0.12));
      k.dot(0.06, 0.195);
    }
  };

  // Database → knowledge graph → answer and dashboard
  F.bi = {
    dots(g, b) {
      const k = kit(g, b);
      k.thick(0.022);
      [0.36, 0.48, 0.6].forEach((v) => { g.beginPath(); g.ellipse(k.f.X(0.18), k.f.Y(v), k.f.L(0.11), k.f.L(0.035), 0, 0, TAU); g.stroke(); });
      k.line(0.07, 0.36, 0.07, 0.6); k.line(0.29, 0.36, 0.29, 0.6);
      [[0.46, 0.36], [0.54, 0.52], [0.44, 0.64], [0.56, 0.34]].forEach(([u, v]) => k.disc(u, v, 0.022));
      k.fillBox(0.68, 0.5, 0.05, 0.16, 0.006);
      k.fillBox(0.76, 0.44, 0.05, 0.22, 0.006);
      k.fillBox(0.84, 0.54, 0.05, 0.12, 0.006);
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.line(0.46, 0.36, 0.54, 0.52); k.line(0.54, 0.52, 0.44, 0.64); k.line(0.46, 0.36, 0.56, 0.34); k.line(0.44, 0.64, 0.46, 0.36);
      k.curve(0.29, 0.48, 0.37, 0.48, 0.44, 0.5);
      k.dash(); k.curve(0.56, 0.5, 0.6, 0.56, 0.66, 0.58); k.dash(false);
      k.strokeBox(0.64, 0.38, 0.29, 0.32, 0.02);
      k.strokeBox(0.66, 0.16, 0.24, 0.1, 0.03);
      k.line(0.72, 0.26, 0.7, 0.31);
      k.dot(0.18, 0.24);
    }
  };

  // A rail of clothes you own, with one dashed gap for the one thing to buy
  F.closet = {
    shirt(k, u) {
      k.poly([[u - 0.025, 0.3], [u - 0.075, 0.31], [u - 0.105, 0.4], [u - 0.08, 0.425], [u - 0.055, 0.37],
        [u - 0.055, 0.66], [u + 0.055, 0.66], [u + 0.055, 0.37], [u + 0.08, 0.425], [u + 0.105, 0.4],
        [u + 0.075, 0.31], [u + 0.025, 0.3], [u, 0.33]], true);
    },
    dots(g, b) {
      const k = kit(g, b);
      [0.17, 0.39, 0.61].forEach((u) => { F.closet.shirt(k, u); g.fill(); });
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.line(0.05, 0.18, 0.95, 0.18); k.ring(0.05, 0.18, 0.012); k.ring(0.95, 0.18, 0.012);
      [0.17, 0.39, 0.61, 0.83].forEach((u) => {
        k.arc(u, 0.2, 0.018, Math.PI, TAU * 0.9);
        k.line(u, 0.22, u - 0.075, 0.3); k.line(u, 0.22, u + 0.075, 0.3);
      });
      k.dash(); F.closet.shirt(k, 0.83); g.stroke(); k.dash(false);
      k.dot(0.83, 0.76);
      k.line(0.05, 0.84, 0.95, 0.84);
    }
  };

  // Bar chart with a trend line
  F.sales = {
    bars: [0.28, 0.42, 0.36, 0.52, 0.6, 0.72],
    dots(g, b) {
      const k = kit(g, b);
      F.sales.bars.forEach((h, i) => k.fillBox(0.16 + i * 0.12, 0.84 - h, 0.07, h, 0.008));
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.line(0.1, 0.08, 0.1, 0.86); k.line(0.1, 0.86, 0.92, 0.86);
      k.poly(F.sales.bars.map((h, i) => [0.195 + i * 0.12, 0.8 - h])); g.stroke();
      k.dot(0.195 + 5 * 0.12, 0.8 - 0.72);
    }
  };

  // One source fanning out to many channels
  F.distribution = {
    ends: [0.12, 0.25, 0.38, 0.5, 0.62, 0.75, 0.88],
    dots(g, b) {
      const k = kit(g, b);
      k.thick(0.05); k.ring(0.18, 0.5, 0.08);
      k.thick(0.012);
      F.distribution.ends.forEach((v) => k.curve(0.26, 0.5, 0.55, v + (0.5 - v) * 0.6, 0.86, v));
      F.distribution.ends.forEach((v) => k.disc(0.88, v, 0.022));
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.ring(0.18, 0.5, 0.14);
      k.dash(); k.ring(0.18, 0.5, 0.19); k.dash(false);
      k.dot(0.18, 0.5);
      k.line(0.95, 0.08, 0.95, 0.92);
    }
  };

  // A signal rippling outwards
  F.ripple = {
    dots(g, b) {
      const k = kit(g, b);
      k.disc(0.24, 0.55, 0.05);
      [0.15, 0.27, 0.39, 0.51].forEach((r, i) => { k.thick(0.03 - i * 0.004); k.arc(0.24, 0.55, r, -0.9, 0.9); });
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.dash(); [0.21, 0.33, 0.45].forEach((r) => k.arc(0.24, 0.55, r, -1.3, 1.3)); k.dash(false);
      k.dot(0.24, 0.55);
    }
  };

  // A person and their dashed AI copy
  F.avatar = {
    person(k, du) {
      k.circle(0.34 + du, 0.34, 0.12);
      return k;
    },
    dots(g, b) {
      const k = kit(g, b);
      F.avatar.person(k, 0); g.fill();
      g.beginPath(); g.ellipse(k.f.X(0.34), k.f.Y(0.8), k.f.L(0.15), k.f.L(0.2), 0, Math.PI, TAU); g.fill();
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1); k.dash();
      F.avatar.person(k, 0.32); g.stroke();
      g.beginPath(); g.ellipse(k.f.X(0.66), k.f.Y(0.8), k.f.L(0.15), k.f.L(0.2), 0, Math.PI, TAU); g.stroke();
      k.dash(false);
      for (let i = 0; i < 6; i++) k.line(0.46, 0.27 + i * 0.03, 0.54, 0.27 + i * 0.03);
      k.dot(0.66, 0.34);
      k.line(0.06, 0.8, 0.94, 0.8);
    }
  };

  // A feedback loop: build, measure, learn, repeat
  F.loop = {
    dots(g, b) {
      const k = kit(g, b);
      k.thick(0.03); k.arc(0.5, 0.5, 0.3, -1.2, TAU - 1.7);
      [0, 1, 2, 3].forEach((i) => { const a = i * (TAU / 4) + 0.4; k.disc(0.5 + Math.cos(a) * 0.3, 0.5 + Math.sin(a) * 0.3, 0.045); });
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      const a = TAU - 1.7;
      k.arrow(0.5 + Math.cos(a - 0.15) * 0.3, 0.5 + Math.sin(a - 0.15) * 0.3, 0.5 + Math.cos(a + 0.08) * 0.3, 0.5 + Math.sin(a + 0.08) * 0.3);
      k.dash(); k.ring(0.5, 0.5, 0.19); k.dash(false);
      k.ring(0.5, 0.5, 0.4);
      k.dot(0.5, 0.5);
    }
  };

  // Modules around one hub
  F.modules = {
    dots(g, b) {
      const k = kit(g, b);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        if (r === 1 && c === 1) continue;
        k.fillBox(0.14 + c * 0.28, 0.14 + r * 0.28, 0.16, 0.16, 0.025);
      }
      k.disc(0.5, 0.5, 0.07);
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) {
        if (r === 1 && c === 1) continue;
        const u = 0.22 + c * 0.28, v = 0.22 + r * 0.28;
        k.poly([[u, v], [u, 0.5], [0.5, 0.5]]); g.stroke();
      }
      k.dash(); k.strokeBox(0.06, 0.06, 0.88, 0.88, 0.06); k.dash(false);
      k.dot(0.5, 0.5);
    }
  };

  // A written process, step by step, with checks
  F.steps = {
    dots(g, b) {
      const k = kit(g, b);
      [0.1, 0.32, 0.76].forEach((v) => k.fillBox(0.28, v, 0.36, 0.12, 0.03));
      k.poly([[0.46, 0.52], [0.6, 0.6], [0.46, 0.68], [0.32, 0.6]], true); g.fill();
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.arrow(0.46, 0.22, 0.46, 0.31); k.arrow(0.46, 0.44, 0.46, 0.51); k.arrow(0.46, 0.68, 0.46, 0.75);
      [0.16, 0.38, 0.82].forEach((v) => { k.line(0.72, v, 0.75, v + 0.03); k.line(0.75, v + 0.03, 0.81, v - 0.03); });
      k.dash(); k.poly([[0.28, 0.82], [0.14, 0.82], [0.14, 0.16], [0.27, 0.16]]); g.stroke(); k.dash(false);
      k.dot(0.14, 0.82);
    }
  };

  // Raw data funnelled into clean reports
  F.funnel = {
    dots(g, b) {
      const k = kit(g, b), r = seeded(7);
      // Raw data: loose, uneven, but never overlapping
      for (let row = 0; row < 3; row++) for (let c = 0; c < 9; c++) {
        if (r() < 0.3) continue;
        k.disc(0.1 + c * 0.1 + (r() - 0.5) * 0.04, 0.7 + row * 0.08 + (r() - 0.5) * 0.03, 0.01 + r() * 0.008);
      }
      [0.5, 0.38, 0.28, 0.2].forEach((w, i) => k.fillBox(0.5 - w / 2, 0.08 + i * 0.07, w, 0.04, 0.008));
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.line(0.06, 0.62, 0.36, 0.4); k.line(0.94, 0.62, 0.64, 0.4);
      k.dash(); k.line(0.06, 0.62, 0.94, 0.62); k.dash(false);
      k.arrow(0.5, 0.58, 0.5, 0.4);
      k.dot(0.5, 0.62);
    }
  };

  // Day / week / month board with filled-in cells
  F.board = {
    dots(g, b) {
      const k = kit(g, b), r = seeded(11);
      for (let row = 0; row < 4; row++) for (let c = 0; c < 7; c++) {
        if (r() < 0.62) k.fillBox(0.1 + c * 0.115 + 0.012, 0.22 + row * 0.15 + 0.012, 0.09, 0.125, 0.008);
      }
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      for (let c = 0; c <= 7; c++) k.line(0.1 + c * 0.115, 0.22, 0.1 + c * 0.115, 0.82);
      for (let row = 0; row <= 4; row++) k.line(0.1, 0.22 + row * 0.15, 0.905, 0.22 + row * 0.15);
      k.dash(); k.strokeBox(0.07, 0.1, 0.865, 0.06, 0.01); k.dash(false);
      k.dot(0.1 + 4.5 * 0.115, 0.13);
    }
  };

  // A leaf inside a globe
  F.leaf = {
    over: true, // the veins sit on the leaf
    dots(g, b) {
      const k = kit(g, b), f = k.f;
      g.beginPath();
      g.moveTo(f.X(0.32), f.Y(0.7));
      g.quadraticCurveTo(f.X(0.3), f.Y(0.3), f.X(0.7), f.Y(0.28));
      g.quadraticCurveTo(f.X(0.7), f.Y(0.66), f.X(0.32), f.Y(0.7));
      g.fill();
    },
    lines(g, b) {
      const k = kit(g, b), f = k.f;
      k.width(1);
      k.ring(0.5, 0.5, 0.42);
      k.dash(); k.ring(0.5, 0.5, 0.46); k.dash(false);
      k.line(0.24, 0.78, 0.66, 0.33);
      [0.4, 0.5, 0.58].forEach((t) => { const u = 0.24 + (0.66 - 0.24) * t, v = 0.78 + (0.33 - 0.78) * t; k.line(u, v, u + 0.08, v + 0.02); });
      k.dot(0.24, 0.78);
    }
  };

  // Pareto chart: causes sorted by size, with the cumulative line
  F.pareto = {
    over: true, // the cumulative line is read across the bars
    bars: [0.46, 0.3, 0.19, 0.13, 0.08, 0.05],
    dots(g, b) {
      const k = kit(g, b);
      F.pareto.bars.forEach((h, i) => k.fillBox(0.14 + i * 0.125, 0.84 - h, 0.1, h, 0.008));
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      k.line(0.1, 0.1, 0.1, 0.86); k.line(0.1, 0.86, 0.92, 0.86);
      let sum = 0;
      const total = F.pareto.bars.reduce((a, c) => a + c, 0);
      // cumulative share, drawn in a band above the bars (0% at 0.34, 100% at 0.1)
      const pts = F.pareto.bars.map((h, i) => { sum += h; return [0.19 + i * 0.125, 0.34 - (sum / total) * 0.24]; });
      k.poly(pts); g.stroke();
      k.dash(); k.line(0.1, 0.34 - 0.8 * 0.24, 0.92, 0.34 - 0.8 * 0.24); k.dash(false);
      pts.forEach(([u, v]) => k.ring(u, v, 0.008));
      k.dot(pts[1][0], pts[1][1]);
    }
  };

  // A gauge reading a KPI
  F.gauge = {
    dots(g, b) {
      const k = kit(g, b);
      k.thick(0.07); k.arc(0.5, 0.66, 0.32, Math.PI, Math.PI * 1.72);
      k.thick(0.025); k.arc(0.5, 0.66, 0.32, Math.PI * 1.76, TAU);
      k.disc(0.5, 0.66, 0.04);
    },
    lines(g, b) {
      const k = kit(g, b);
      k.width(1);
      for (let i = 0; i <= 10; i++) {
        const a = Math.PI + (i / 10) * Math.PI;
        k.line(0.5 + Math.cos(a) * 0.38, 0.66 + Math.sin(a) * 0.38, 0.5 + Math.cos(a) * 0.42, 0.66 + Math.sin(a) * 0.42);
      }
      k.dash(); k.arc(0.5, 0.66, 0.22, Math.PI, TAU); k.dash(false);
      const a = Math.PI * 1.68;
      k.line(0.5, 0.66, 0.5 + Math.cos(a) * 0.17, 0.66 + Math.sin(a) * 0.17);
      k.dot(0.5 + Math.cos(a) * 0.17, 0.66 + Math.sin(a) * 0.17);
      k.line(0.08, 0.8, 0.92, 0.8);
    }
  };

  // ── Site figures (hero and About) ─────────────────────────

  const STAGES = [["Idea", -2.35], ["Build", -0.75], ["Ship", 0.85], ["Learn", 2.45]];
  const roundBox = (g, x, y, w, h, r) => {
    g.beginPath();
    if (g.roundRect) g.roundRect(x, y, w, h, r); else g.rect(x, y, w, h);
  };
  const thin = (g, dashed) => { g.lineWidth = 1; g.setLineDash(dashed ? [4, 4] : []); };
  const solidDot = (g, x, y, r = 3.5) => { g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); };

  // A product (an app screen) inside the loop that builds it
  F.product = {
    geo(b) {
      const s = Math.min(b.w, b.h);
      return { b, s, cx: b.x + b.w * 0.54, cy: b.y + b.h * 0.5, sw: s * 0.32, sh: s * 0.52, R: s * 0.43, nr: s * 0.028 };
    },
    at: ({ cx, cy, R }, a) => [cx + Math.cos(a) * R, cy + Math.sin(a) * R],
    // Where people come in: from the bottom left, ending at the Learn node
    path(geo, shift = 0) {
      const { b, s } = geo, [lx, ly] = F.product.at(geo, STAGES[3][1]);
      return [b.x + b.w * 0.04 + shift, b.y + b.h * 0.98, lx - s * 0.06 + shift, ly + s * 0.16, lx + shift * 0.3, ly + geo.nr + 2];
    },
    dots(g, b) {
      const geo = F.product.geo(b), { s, cx, cy, sw, sh, R, nr } = geo;
      const left = cx - sw / 2, top = cy - sh / 2, pad = s * 0.03, inner = sw - pad * 2;
      g.setLineDash([s * 0.016, s * 0.014]);
      g.beginPath(); g.arc(cx, cy, R, 0, TAU); g.stroke();
      g.setLineDash([]);
      const [x0, y0, qx, qy, x1, y1] = F.product.path(geo);
      g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(qx, qy, x1, y1); g.stroke();
      STAGES.forEach(([, a]) => { const [px, py] = F.product.at(geo, a); g.beginPath(); g.arc(px, py, nr, 0, TAU); g.fill(); });
      roundBox(g, left, top, sw, sh, s * 0.035); g.fill();
      g.fillRect(left + pad, top + pad, inner, s * 0.028);
      g.fillRect(left + pad, top + pad + s * 0.055, inner * 0.6, s * 0.09);
      g.fillRect(left + pad + inner * 0.66, top + pad + s * 0.055, inner * 0.34, s * 0.09);
      [0.35, 0.6, 0.48, 0.8].forEach((hh, i) => {
        const bw = inner / 7, bh = s * 0.14 * hh;
        g.fillRect(left + pad + i * bw * 1.85, top + pad + s * 0.3 - bh, bw, bh);
      });
      roundBox(g, left + pad, top + sh - pad - s * 0.055, inner, s * 0.055, s * 0.027); g.fill();
    },
    lines(g, b) {
      const geo = F.product.geo(b), { s, cx, cy, sw, sh, R } = geo;
      // Stacked cards behind the screen
      thin(g); roundBox(g, cx - sw / 2 + s * 0.022, cy - sh / 2 + s * 0.018, sw, sh, s * 0.035); g.stroke();
      thin(g, true); roundBox(g, cx - sw / 2 + s * 0.044, cy - sh / 2 + s * 0.036, sw, sh, s * 0.035); g.stroke();
      // Arrowheads on the loop, halfway between stages
      thin(g);
      STAGES.forEach(([, a], i) => {
        const next = STAGES[(i + 1) % 4][1] + (i === 3 ? TAU : 0), m = (a + next) / 2;
        const ex = cx + Math.cos(m) * R, ey = cy + Math.sin(m) * R, t = m + Math.PI / 2;
        g.beginPath();
        g.moveTo(ex - Math.cos(t - 0.6) * 9, ey - Math.sin(t - 0.6) * 9); g.lineTo(ex, ey);
        g.lineTo(ex - Math.cos(t + 0.6) * 9, ey - Math.sin(t + 0.6) * 9); g.stroke();
      });
      // Labels beside each node, outside the loop
      g.font = "400 13px Geist, system-ui, sans-serif"; g.textBaseline = "middle";
      STAGES.forEach(([label, a]) => {
        const [px, py] = F.product.at(geo, a), side = Math.cos(a) < 0 ? -1 : 1;
        g.textAlign = side < 0 ? "right" : "left";
        g.fillText(label, px + side * (geo.nr + 10), py - (Math.sin(a) < 0 ? geo.nr + 8 : -(geo.nr + 8)));
      });
      // The idea: a solid dot, joined to the screen
      const [ix, iy] = F.product.at(geo, STAGES[0][1]);
      g.beginPath(); g.moveTo(ix, iy); g.lineTo(cx - sw / 2, cy - sh / 2 + s * 0.05); g.stroke();
      solidDot(g, ix, iy, 4.5);
      // The users' path, dashed alongside
      const [x0, y0, qx, qy, x1, y1] = F.product.path(geo, s * 0.035);
      thin(g, true); g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(qx, qy, x1, y1 + 4); g.stroke();
    }
  };

  // A big number, outlined, on a measured baseline
  F.number = {
    geo(g, b, text) {
      let size = b.h * 0.7;
      g.font = `600 ${size}px Geist, system-ui, sans-serif`;
      const tw = g.measureText(text).width;
      if (tw > b.w * 0.86) size *= (b.w * 0.86) / tw;
      g.font = `600 ${size}px Geist, system-ui, sans-serif`;
      return { size, tw: g.measureText(text).width, cx: b.x + b.w / 2, cy: b.y + b.h / 2 };
    },
    dots(g, b, { text = "900M" } = {}) {
      const { cx, cy } = F.number.geo(g, b, text);
      g.textAlign = "center"; g.textBaseline = "middle";
      g.fillText(text, cx, cy);
    },
    lines(g, b, { text = "900M" } = {}) {
      const { size, tw, cx, cy } = F.number.geo(g, b, text);
      const x0 = cx - tw / 2, x1 = cx + tw / 2, base = cy + size * 0.42, top = cy - size * 0.42;
      thin(g);
      g.beginPath(); g.moveTo(x0, base); g.lineTo(x1, base); g.stroke();
      for (let i = 0; i <= 10; i++) {
        const tx = x0 + (tw * i) / 10;
        g.beginPath(); g.moveTo(tx, base); g.lineTo(tx, base + (i % 5 ? 6 : 12)); g.stroke();
      }
      thin(g, true);
      g.beginPath(); g.moveTo(x0, top); g.lineTo(x1, top); g.stroke();
      solidDot(g, x1, top);
    }
  };

  // A process box with inputs, outputs and a dashed scope
  F.system = {
    geo(b) {
      const s = Math.min(b.w, b.h);
      return { s, cx: b.x + b.w / 2, cy: b.y + b.h / 2, bw: s * 0.42, bh: s * 0.56, rad: s * 0.06 };
    },
    dots(g, b) {
      const { s, cx, cy, bw, bh, rad } = F.system.geo(b);
      g.setLineDash([s * 0.02, s * 0.02]);
      g.beginPath(); g.arc(cx - s * 0.36, cy - s * 0.3, s * 0.1, 0, TAU); g.stroke();
      g.setLineDash([]);
      roundBox(g, cx - bw / 2, cy - bh / 2, bw, bh, rad); g.fill();
      g.beginPath(); g.moveTo(cx - s * 0.46, cy + s * 0.12); g.lineTo(cx - bw / 2, cy + s * 0.12); g.stroke();
      g.beginPath(); g.moveTo(cx + bw / 2 + s * 0.08, cy - s * 0.1); g.lineTo(cx + s * 0.46, cy - s * 0.1); g.stroke();
      g.beginPath(); g.moveTo(cx + s * 0.1, cy + bh / 2 + s * 0.1); g.lineTo(cx + s * 0.2, cy + s * 0.46); g.stroke();
      g.beginPath(); g.arc(cx - s * 0.46, cy + s * 0.12, s * 0.022, 0, TAU); g.fill();
    },
    lines(g, b) {
      const { s, cx, cy, bw, bh, rad } = F.system.geo(b);
      thin(g); roundBox(g, cx - bw / 2 + s * 0.04, cy - bh / 2 + s * 0.03, bw, bh, rad); g.stroke();
      thin(g, true); roundBox(g, cx - bw / 2 + s * 0.08, cy - bh / 2 + s * 0.06, bw, bh, rad); g.stroke();
      thin(g);
      const ax = cx + s * 0.46, ay = cy - s * 0.1;
      g.beginPath(); g.moveTo(ax - 10, ay - 6); g.lineTo(ax, ay); g.lineTo(ax - 10, ay + 6); g.stroke();
      solidDot(g, cx + s * 0.2, cy + s * 0.46);
    }
  };

  // Outline of India with a ringed home city
  const INDIA = [
    [68.2,23.7],[68.8,24.2],[70.0,25.0],[70.6,26.0],[70.2,27.0],[71.5,27.9],[72.8,29.0],[73.5,30.0],
    [74.6,31.0],[74.6,32.5],[74.0,34.0],[74.5,37.0],[77.0,35.8],[78.0,35.5],[80.0,35.0],[79.5,33.0],
    [78.8,32.5],[78.5,31.0],[80.0,30.3],[80.1,28.8],[83.0,27.4],[84.5,27.0],[86.0,26.6],[88.0,26.4],
    [88.2,27.1],[88.9,27.3],[88.9,26.8],[90.0,26.8],[92.0,26.9],[92.0,27.8],[94.0,28.8],[95.5,29.3],
    [97.0,28.3],[97.3,27.5],[96.0,27.2],[95.2,26.5],[94.6,25.5],[94.2,24.0],[93.3,23.2],[92.6,21.9],
    [92.3,23.7],[91.4,24.1],[91.7,25.1],[89.9,25.3],[89.7,26.2],[88.3,26.0],[88.6,24.3],[88.8,22.9],
    [89.0,21.7],[87.0,21.5],[86.5,20.2],[85.0,19.3],[83.5,18.0],[82.3,16.6],[81.0,15.8],[80.2,15.0],
    [80.3,13.3],[79.9,11.5],[79.8,10.3],[78.9,9.0],[77.5,8.1],[76.5,8.9],[76.0,10.5],[75.3,12.0],
    [74.7,13.5],[74.0,15.5],[73.4,17.0],[72.8,19.0],[72.7,20.5],[72.6,21.4],[72.6,22.2],[72.0,21.3],
    [70.9,20.8],[69.2,22.3],[70.0,22.6],[68.9,23.0]
  ];
  F.map = {
    over: true, // the pin sits on the map
    project(b) {
      const lon0 = 68, lon1 = 97.5, lat0 = 6.5, lat1 = 37.2, squash = Math.cos((22 * Math.PI) / 180);
      const gw = (lon1 - lon0) * squash, gh = lat1 - lat0;
      const sc = Math.min((b.w * 0.86) / gw, (b.h * 0.9) / gh);
      const ox = b.x + (b.w - gw * sc) / 2, oy = b.y + (b.h - gh * sc) / 2;
      return { sc, p: ([lon, lat]) => [ox + (lon - lon0) * squash * sc, oy + (lat1 - lat) * sc] };
    },
    dots(g, b) {
      const { p } = F.map.project(b);
      g.beginPath();
      INDIA.forEach((pt, i) => { const [px, py] = p(pt); i ? g.lineTo(px, py) : g.moveTo(px, py); });
      g.closePath(); g.fill();
    },
    lines(g, b, { pin = [77.59, 12.97], label = "" } = {}) {
      const { p } = F.map.project(b), [dx, dy] = p(pin), s = Math.min(b.w, b.h);
      thin(g); g.beginPath(); g.arc(dx, dy, s * 0.035, 0, TAU); g.stroke();
      thin(g, true); g.beginPath(); g.arc(dx, dy, s * 0.07, 0, TAU); g.stroke();
      solidDot(g, dx, dy);
      if (label) {
        const lx = Math.max(b.x + 80, dx - s * 0.3);
        thin(g); g.beginPath(); g.moveTo(dx - s * 0.07, dy); g.lineTo(lx, dy); g.stroke();
        g.font = "400 13px Geist, system-ui, sans-serif";
        g.textAlign = "right"; g.textBaseline = "middle";
        g.fillText(label, lx - 8, dy);
      }
    }
  };

  // ── Rendering ─────────────────────────────────────────────

  // Drawing order, like the theme: thin lines underneath, then the main shapes
  // on top with a white fill (so lines stop at their edges instead of running
  // through them), then solid dots and labels over everything.
  const BOLD = 2;
  const wrap = (g, get, set) => new Proxy(g, {
    get(target, prop) {
      const own = get(target, prop);
      if (own) return own;
      const v = target[prop];
      return typeof v === "function" ? v.bind(target) : v;
    },
    set(target, prop, value) { (set && set(target, prop, value)) || (target[prop] = value); return true; }
  });
  const noop = () => {};
  // Pass 1: only the strokes of the lines layer
  const strokesOnly = (g) => wrap(g, (t, p) => (p === "fill" || p === "fillRect" || p === "fillText") && noop);
  // Pass 3: only the solid dots and labels of the lines layer
  const fillsOnly = (g) => wrap(g, (t, p) => (p === "stroke" || p === "strokeRect") && noop);
  // Pass 2: main shapes as bold outlines over a white fill
  const shapes = (g, bg) => wrap(g,
    (t, p) => {
      if (p === "fill") return () => {
        t.save(); t.fillStyle = bg; t.fill(); t.restore();
        t.lineWidth = BOLD; t.stroke();
      };
      if (p === "fillRect") return (...a) => {
        t.save(); t.fillStyle = bg; t.fillRect(...a); t.restore();
        t.lineWidth = BOLD; t.strokeRect(...a);
      };
      if (p === "fillText") return (...a) => { t.lineWidth = 1.5; t.strokeText(...a); };
    },
    (t, p, v) => {
      if (p === "lineWidth") { t.lineWidth = Math.min(Math.max(v, 1.2), BOLD); return true; }
    });

  const pass = (g, fn) => {
    g.save();
    g.fillStyle = g.strokeStyle = "#000";
    g.lineCap = "round"; g.lineJoin = "round";
    fn();
    g.restore();
  };

  // Draw one figure into a box, on a background colour (the shapes are filled
  // with it). Figures marked `over` keep their lines on top.
  F.draw = (g, key, b, opts, bg = "#fff") => {
    const fig = F[key] || F.loop;
    if (fig.over) {
      pass(g, () => fig.dots(shapes(g, bg), b, opts));
      pass(g, () => fig.lines(g, b, opts));
      return;
    }
    pass(g, () => fig.lines(strokesOnly(g), b, opts));
    pass(g, () => fig.dots(shapes(g, bg), b, opts));
    pass(g, () => fig.lines(fillsOnly(g), b, opts));
  };

  window.Figures = F;
})();
