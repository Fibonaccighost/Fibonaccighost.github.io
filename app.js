(function () {
  const { profile, experience, skills = [], education = [], achievements = [] } = window.PORTFOLIO;
  const $ = (id) => document.getElementById(id);

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const fmtDate = (d) => {
    if (!d) return "Present";
    const [y, m] = String(d).split("-");
    return m ? `${MONTHS[+m - 1]} ${y}` : y;
  };
  const span = (a, b) => `${fmtDate(a)} – ${fmtDate(b)}`;
  const bare = (url) => url.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "");

  const roles = experience.filter((job) => !job.independent);
  const independent = experience.filter((job) => job.independent);
  const current = roles.find((job) => !job.end);

  // Every project, newest first (by the year it ended), numbered like a catalogue (oldest = 001)
  const endYear = (y) => {
    const parts = String(y).split(/[–-]/);
    const last = parts[parts.length - 1].trim();
    return last.length === 2 ? +(parts[0].slice(0, 2) + last) : +last;
  };
  const projects = experience
    .flatMap((job) => job.projects.map((p) => ({ ...p, company: job.company })))
    .map((p, order) => ({ p, order }))
    .sort((a, b) => endYear(b.p.year) - endYear(a.p.year) || a.order - b.order)
    .map(({ p }) => p);
  projects.forEach((p, i) => {
    p.code = `${String(p.year).slice(0, 4)}.${String(projects.length - i).padStart(3, "0")}`;
  });
  const oldest = Math.min(...projects.map((p) => +String(p.year).slice(0, 4)));

  // ── Site ───────────────────────────────────────────────
  document.title = `${profile.name}, ${profile.role}`;
  $("top-name").textContent = profile.name;
  $("hero-name").textContent = profile.name;
  $("hero-role").textContent = current ? `${profile.role} at ${current.company}` : profile.role;
  $("hero-intro").textContent = profile.intro;

  // Past projects: one panel each, after the intro panel
  $("intro-lead").textContent =
    `${projects.length} things I've built, from now back to ${oldest}. Keep scrolling and they'll slide in from the left, one at a time.`;
  $("cue-past").textContent = oldest;
  $("tl-past").textContent = oldest;

  $("track").insertAdjacentHTML("beforeend", projects
    .map((p, i) => {
      const impact = (p.impact || []).length ? `<ul class="panel-impact">${p.impact.map((x) => `<li>${esc(x)}</li>`).join("")}</ul>` : "";
      const stack = (p.stack || []).length ? `<p class="panel-stack">${p.stack.map(esc).join(", ")}</p>` : "";
      const links = (p.links || []).filter((l) => l.url)
        .map((l) => `<a href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`).join("");
      return `
        <article class="panel" style="--i:${i + 1}" aria-label="${esc(p.name)}">
          <div class="panel-text">
            <p class="panel-meta">${esc(p.type)}</p>
            <h3 class="panel-name">${esc(p.name)}</h3>
            <p class="panel-summary">${esc(p.summary)}</p>
            ${p.why ? `<p class="panel-h">Why it's useful</p><p class="panel-why">${esc(p.why)}</p>` : ""}
            ${impact}${stack}
            ${links ? `<p class="panel-links">${links}</p>` : ""}
          </div>
          <figure class="panel-figure">
            <div class="tile"><canvas data-figure="${esc(p.figure || "loop")}" aria-hidden="true"></canvas></div>
            <figcaption><span>${esc(p.code)}</span><span>${esc(p.company)}</span></figcaption>
          </figure>
        </article>`;
    })
    .join(""));

  // Scroll drives the track: each step brings the next (older) project in from the left
  const work = $("work"), track = $("track");
  const panels = [...track.querySelectorAll(".panel")];
  const stops = panels.length - 1;
  const STEP = 0.8; // viewport heights of scrolling per project
  const smooth = (x) => x * x * (3 - 2 * x);

  const tiles = panels.map((panel) => {
    const canvas = panel.querySelector("canvas[data-figure]");
    return canvas && window.Draw.figure(canvas, { pad: 0 });
  });
  const ribbons = window.Draw.ribbons(track.querySelector("[data-ribbons]"));
  let activePanel = -1;

  function sizeWork() {
    work.style.height = `${innerHeight * (1 + stops * STEP)}px`;
  }
  function moveTrack() {
    const total = work.offsetHeight - innerHeight;
    const rect = work.getBoundingClientRect();
    const u = Math.min(1, Math.max(0, -rect.top / total)) * stops;
    const i = Math.floor(u), f = u - i;
    // Hold each project still for a while before moving on
    const pos = Math.min(stops, i + (f < 0.22 ? 0 : f > 0.78 ? 1 : smooth((f - 0.22) / 0.56)));
    track.style.transform = `translate3d(${pos * panels[0].offsetWidth}px, 0, 0)`;

    const at = Math.round(pos);
    $("tl-dot").style.left = `${100 - (Math.max(0, pos - 1) / Math.max(1, stops - 1)) * 100}%`;
    $("tl-current").textContent = at === 0 ? "Scroll to go back in time" : `${projects[at - 1].company}, ${projects[at - 1].year}`;

    // The project in the middle is the active one: it draws itself in
    if (at !== activePanel) {
      panels[activePanel]?.classList.remove("is-active");
      panels[at].classList.add("is-active");
      tiles[at]?.reveal();
      activePanel = at;
    }
    const inView = rect.top < innerHeight && rect.bottom > 0;
    if (at === 0 && inView) ribbons.start(); else ribbons.stop();
  }
  $("tl-line").insertAdjacentHTML("beforeend", projects
    .map((_, i) => `<span class="tl-tick" style="left:${100 - (i / Math.max(1, stops - 1)) * 100}%"></span>`).join(""));

  sizeWork();
  tiles.forEach((tile) => tile?.show());
  moveTrack();
  addEventListener("scroll", moveTrack, { passive: true });

  $("roles").innerHTML = roles
    .map((job) => `
      <li class="role-row">
        <p class="role-dates">${span(job.start, job.end)}</p>
        <div>
          <p class="role-title">${esc(job.role)}</p>
          <p class="role-company">${esc(job.company)}</p>
        </div>
        <p class="role-place">${esc(job.location || "")}</p>
      </li>`)
    .join("");

  // About: three steps, each with its own drawing
  $("step1-h").textContent = "900M+ views";
  $("step1-p").textContent =
    "Through the content distribution system I built from scratch at The Prakhar Gupta Xperience, peaking at 167M+ views a month.";
  $("step2-h").textContent = "Systems that make results repeatable";
  $("step2-p").textContent =
    "AI automations, dashboards, SOPs and an internal ERP, built so the work doesn't depend on any one person.";
  $("step3-h").textContent = `Based in ${profile.location}`;
  $("step3-p").textContent = current ? `Currently at ${current.company}.` : "";

  const email = $("contact-email");
  email.textContent = profile.email;
  email.href = `mailto:${profile.email}`;
  const socials = [
    ["LinkedIn", profile.linkedin],
    ["X", profile.x]
  ].filter(([, url]) => url)
    .map(([label, url]) => `<a href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`);
  $("contact-alt").innerHTML = socials.length
    ? `or find me on ${socials.length > 1 ? `${socials.slice(0, -1).join(", ")} and ${socials.at(-1)}` : socials[0]}`
    : "";
  $("foot-copy").textContent = `© ${new Date().getFullYear()} ${profile.name}`;

  // ── Resume ─────────────────────────────────────────────
  const contact = [
    profile.email && `<a href="mailto:${esc(profile.email)}">${esc(profile.email)}</a>`,
    profile.phone && esc(profile.phone),
    profile.website && esc(bare(profile.website)),
    profile.linkedin && `<a href="${esc(profile.linkedin)}">${esc(bare(profile.linkedin))}</a>`,
    profile.x && `<a href="${esc(profile.x)}">${esc(bare(profile.x))}</a>`,
    profile.location && esc(profile.location)
  ].filter(Boolean);

  const bullets = (job) => job.projects.filter((p) => p.resume !== false)
    .map((p) => `<li><strong>${esc(p.name)}.</strong> ${esc(p.resumeLine || p.summary)}</li>`).join("");

  const jobs = roles
    .map((job) => {
      const lines = bullets(job);
      return `
        <div class="r-job">
          <div class="r-job-head">
            <h3>${esc(job.company)}</h3>
            <p class="r-dates">${span(job.start, job.end)}</p>
          </div>
          <p class="r-role">${esc(job.role)}${job.location ? `, ${esc(job.location)}` : ""}</p>
          ${lines ? `<ul>${lines}</ul>` : ""}
        </div>`;
    })
    .join("");

  $("resume").innerHTML = `
    <header class="r-head">
      <h1>${esc(profile.name)}</h1>
      <p class="r-title">${esc(profile.role)}</p>
      <p class="r-contact">${contact.map((c) => `<span>${c}</span>`).join("")}</p>
    </header>
    <p class="r-intro">${esc(profile.resumeSummary)}</p>
    <section><h2>Experience</h2>${jobs}</section>
    ${independent.map((job) => bullets(job)).filter(Boolean)
      .map((lines) => `<section><h2>Independent projects</h2><ul>${lines}</ul></section>`).join("")}
    ${achievements.length ? `<section class="r-achievements"><h2>Achievements</h2><ul>${achievements.map((a) => `<li>${esc(a)}</li>`).join("")}</ul></section>` : ""}
    <div class="r-two">
      <section><h2>Skills</h2><dl class="r-skills">${skills
        .map((s) => `<dt>${esc(s.group)}</dt><dd>${s.items.map(esc).join(", ")}</dd>`).join("")}</dl></section>
      <section><h2>Education</h2>${education
        .map((e) => `<p><strong>${esc(e.degree)}</strong><br>${esc(e.school)}${e.start || e.end ? `, ${esc([e.start, e.end].filter(Boolean).join(" – "))}` : ""}</p>`).join("")}</section>
    </div>`;

  // Preview and print share the same resume layout
  const root = document.documentElement;
  const siteTitle = document.title;
  const resumeTitle = `${profile.name.replace(/\s+/g, "-")}-Resume`; // becomes the PDF filename
  let previewing = false;
  const setResume = (on) => {
    root.classList.toggle("resume-mode", on);
    document.title = on ? resumeTitle : siteTitle;
  };
  addEventListener("beforeprint", () => setResume(true));
  addEventListener("afterprint", () => setResume(previewing));

  document.addEventListener("click", (e) => {
    const action = e.target.closest("[data-action]")?.dataset.action;
    if (action === "download") window.print();
    if (action === "preview") {
      previewing = !previewing;
      setResume(previewing);
      scrollTo(0, 0);
    }
  });

  // Hero and About drawings reveal themselves as they come into view
  const params = { number: { text: "900M" }, map: { pin: profile.mapPin, label: profile.location.split(",")[0] } };
  const scenes = [...document.querySelectorAll(".hero canvas[data-figure], .step canvas[data-figure]")]
    .map((canvas) => ({ canvas, fig: window.Draw.figure(canvas, { pad: 12, params: params[canvas.dataset.figure] }) }));
  const seen = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      scenes.find((s) => s.canvas === entry.target)?.fig.reveal();
      seen.unobserve(entry.target);
    });
  }, { threshold: 0.35 });
  scenes.forEach((s) => seen.observe(s.canvas));

  // Redraw everything at the new size
  let resizeTimer;
  addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      sizeWork(); moveTrack();
      tiles.forEach((tile) => tile?.paint());
      scenes.forEach((s) => s.fig.paint());
      ribbons.paint();
    }, 120);
  });
  if (document.fonts) document.fonts.ready.then(() => scenes.forEach((s) => s.fig.paint()));
})();
