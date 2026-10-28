// Builds the page from content.js (window.SKINKIT). Nothing here needs editing to change text.
// Where you are is kept in the address after "#":
//   #about        Part 1, what SkinKit is
//   #try          Part 1, scrolled to the circuit playground
//   #tutorial     Part 2, choose a path
//   #make-3       Part 2, step 3 of "Make it yourself" (#use-3 for "I have a SkinKit")
// If the host site already uses "#" for its own pages, set window.SKINKIT_USE_HASH = false
// before this script; the page then switches parts without touching the address.
(function () {
  "use strict";

  const K = window.SKINKIT;
  const root = document.getElementById("sk-root");
  if (!K || !root) return;

  const $ = (id) => document.getElementById(id);
  const useHash = window.SKINKIT_USE_HASH !== false;
  const reduceMotion = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);

  const familyById = {};
  K.families.forEach((f) => { familyById[f.id] = f; });
  const moduleByName = {};
  K.modules.forEach((m) => { moduleByName[m.name] = m; });
  const chapterById = {};
  K.chapters.forEach((c) => { chapterById[c.id] = c; });

  const colorOfFamily = (id) => (familyById[id] ? familyById[id].color : "#ffffff");
  const colorOfModule = (name) => (moduleByName[name] ? colorOfFamily(moduleByName[name].family) : "#ffffff");
  const tile = (color, extra) => `<span class="sk-mod${extra ? " " + extra : ""}" style="--c:${color}" aria-hidden="true"></span>`;
  const arrow = '<span class="sk-arrow" aria-hidden="true">→</span>';

  // ---------- "I did this step" (kept in this browser only) ----------
  const DONE_KEY = "skinkit-done";
  function loadDone() {
    try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch (e) { return new Set(); }
  }
  const done = loadDone();
  function saveDone() {
    try { localStorage.setItem(DONE_KEY, JSON.stringify(Array.from(done))); } catch (e) { /* private mode: keep it in memory */ }
  }

  // ---------- Media: YouTube link, looping clip, photo, or a grey placeholder ----------
  function youtubeId(url) {
    const m = String(url || "").match(/(?:youtu\.be\/|[?&]v=|embed\/|shorts\/)([\w-]{11})/);
    return m ? m[1] : "";
  }
  function renderMedia(box, media, label, sub, alt) {
    box.textContent = "";
    const yt = media && youtubeId(media.youtube);
    if (yt) {
      const f = document.createElement("iframe");
      f.src = "https://www.youtube-nocookie.com/embed/" + yt + "?rel=0";
      f.title = alt;
      f.loading = "lazy";
      f.allow = "accelerometer; encrypted-media; gyroscope; picture-in-picture; fullscreen";
      f.allowFullscreen = true;
      box.appendChild(f);
    } else if (media && media.video) {
      const v = document.createElement("video");
      v.src = media.video;
      v.muted = true;
      v.loop = true;
      v.playsInline = true;
      v.setAttribute("aria-label", alt);
      if (media.poster) v.poster = media.poster;
      if (reduceMotion) {
        v.controls = true;
      } else {
        v.autoplay = true;
        v.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
      }
      box.appendChild(v);
    } else if (media && media.image) {
      const img = document.createElement("img");
      img.src = media.image;
      img.alt = alt;
      img.loading = "lazy";
      box.appendChild(img);
    } else {
      box.innerHTML = `<div class="sk-placeholder"><strong>${esc(label)}</strong><span>${esc(sub)}</span></div>`;
    }
  }

  // ---------- Part 1: hero, facts, how it works ----------
  function renderIntro() {
    $("sk-headline").textContent = K.headline;
    $("sk-intro").textContent = K.intro;
    $("sk-facts").innerHTML = K.facts.map((f) => `<div><dt>${esc(f.value)}</dt><dd>${esc(f.label)}</dd></div>`).join("");

    const diamonds = (() => {
      // Four small skin cloth diamonds in a zigzag, with the three lines running through them
      const h = 22, xs = [22, 44, 66, 88], ys = [22, 44, 22, 44];
      const shapes = xs.map((x, k) => `<polygon points="${x},${ys[k] - h} ${x + h},${ys[k]} ${x},${ys[k] + h} ${x - h},${ys[k]}" fill="#fff" stroke="#bbb"/>`).join("");
      const line = (o) => `<polyline points="${xs.map((x, k) => x + "," + (ys[k] + o)).join(" ")}" fill="none" stroke="#b9b4ac" stroke-width="1.5"/>`;
      return `<svg width="75" height="44" viewBox="0 0 110 66" aria-hidden="true">${shapes}${line(-4)}${line(0)}${line(4)}</svg>`;
    })();
    const visuals = [
      ["sensor", "modifier", "actuator", "power"].map((f) => tile(colorOfFamily(f))).join(""),
      tile(colorOfFamily("power")) + arrow + tile(colorOfFamily("sensor")) + arrow + tile(colorOfFamily("actuator")),
      diamonds
    ];
    $("sk-how").innerHTML = K.how.map((item, i) =>
      `<li><div class="sk-how-visual">${visuals[i] || ""}</div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join("");

    const ov = K.overviewVideo || {};
    renderMedia($("sk-overview-media"), ov.youtube ? { youtube: ov.youtube } : ov.media || null,
      "Overview video", "Clip " + (ov.shot || "0-00") + ". Add the YouTube link in content.js.", "SkinKit overview video");
  }

  // ---------- Part 1: the strip drawing, with a signal running from power to the LED ----------
  function renderStrip() {
    const svg = $("sk-strip");
    if (!svg) return;
    const H = 70, N = 16;
    const cx = (k) => 70 + 70 * k;
    const cy = (k) => (k % 2 ? 180 : 110);
    const seg = Math.hypot(70, 70);
    const NS = "http://www.w3.org/2000/svg";

    let s = "";
    for (let k = 0; k < N; k++) {
      s += `<polygon points="${cx(k)},${cy(k) - H} ${cx(k) + H},${cy(k)} ${cx(k)},${cy(k) + H} ${cx(k) - H},${cy(k)}" fill="#ffffff" stroke="#dddddd"/>`;
    }
    const pts = (o) => Array.from({ length: N }, (_, k) => cx(k) + "," + (cy(k) + o)).join(" ");
    [-8, 0, 8].forEach((o) => { s += `<polyline points="${pts(o)}" fill="none" stroke="#b9b4ac" stroke-width="3" stroke-linejoin="round"/>`; });

    // Modules sit where two diamonds meet. j = index of the diamond to the joint's left.
    const parts = [
      { j: 1, name: "Main power", label: "Power" },
      { j: 5, name: "Proximity", label: "Proximity sensor" },
      { j: 9, name: "Blink", label: "Blink" },
      { j: 13, name: "LED", label: "LED" }
    ];
    const ledX = cx(13) + 35;
    s += `<circle class="sk-strip-glow" cx="${ledX}" cy="145" r="46" fill="#ffd23f" opacity="${reduceMotion ? 0.7 : 0}"/>`;
    parts.forEach((p) => {
      const x = cx(p.j) + 35;
      let dots = "";
      [-15, 15].forEach((dx) => [-10, 0, 10].forEach((dy) => { dots += `<circle cx="${dx}" cy="${dy}" r="2.3" fill="#444"/>`; }));
      s += `<line x1="${x}" y1="34" x2="${x}" y2="110" stroke="#bbbbbb"/>`;
      s += `<g transform="translate(${x} 145) rotate(-45)"><rect x="-22" y="-22" width="44" height="44" fill="${colorOfModule(p.name)}" stroke="rgba(0,0,0,.3)"/>${dots}</g>`;
      s += `<text x="${x}" y="24" text-anchor="middle" style="font-family: var(--sk-font-heading); font-size: 13px; letter-spacing: .08em; text-transform: uppercase; fill: #474747">${esc(p.label.toUpperCase())}</text>`;
    });
    const d = "M" + Array.from({ length: N }, (_, k) => cx(k) + " " + cy(k)).join(" L");
    s += `<path class="sk-strip-path" d="${d}" fill="none" stroke="none"/>`;
    s += `<circle class="sk-strip-pulse" r="7" fill="#ffd23f" stroke="#222" stroke-width="1.5" opacity="0"/>`;
    svg.innerHTML = s;

    if (reduceMotion) return;
    const path = svg.querySelector(".sk-strip-path");
    const pulse = svg.querySelector(".sk-strip-pulse");
    const glow = svg.querySelector(".sk-strip-glow");
    if (!path || !path.getPointAtLength || svg.namespaceURI !== NS) return;
    const from = 1.5 * seg, to = 13.5 * seg, TRAVEL = 2600, CYCLE = 4200;
    let visible = false, running = false;
    function frame(t) {
      if (!visible) { running = false; return; }
      const e = t % CYCLE;
      if (e < TRAVEL) {
        const pt = path.getPointAtLength(from + (to - from) * (e / TRAVEL));
        pulse.setAttribute("cx", pt.x);
        pulse.setAttribute("cy", pt.y);
        pulse.setAttribute("opacity", 1);
        glow.setAttribute("opacity", 0);
      } else {
        pulse.setAttribute("opacity", 0);
        glow.setAttribute("opacity", (0.85 * (1 - (e - TRAVEL) / (CYCLE - TRAVEL))).toFixed(3));
      }
      requestAnimationFrame(frame);
    }
    const start = () => { if (visible && !running) { running = true; requestAnimationFrame(frame); } };
    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; start(); }).observe(svg);
    } else {
      visible = true;
      start();
    }
  }

  // ---------- Part 1: "Try a circuit" ----------
  const sim = { sensor: "proximity", modifier: "blink", actuator: "led", level: 0.2, touching: false };
  const SLOTS = [
    { key: null, family: "power", title: "Power" },
    { key: "sensor", family: "sensor", title: "Sensor", list: K.sim.sensors },
    { key: "modifier", family: "modifier", title: "Modifier", list: K.sim.modifiers },
    { key: "actuator", family: "actuator", title: "Actuator", list: K.sim.actuators }
  ];
  const pick = (list, id) => list.find((o) => o.id === id) || list[0];

  function renderSim() {
    $("sk-chain").innerHTML = SLOTS.map((slot, i) => {
      const options = slot.key
        ? slot.list.map((o) => `<button type="button" class="sk-opt" data-key="${slot.key}" data-id="${esc(o.id)}" aria-pressed="false">${esc(o.name)}</button>`).join("")
        : '<button type="button" class="sk-opt" aria-pressed="true" disabled>Main power</button>';
      return `<div class="sk-slot" role="group" aria-label="${esc(slot.title)}">
        <div class="sk-slot-head">${tile(colorOfFamily(slot.family))}<div><strong>${i + 1}. ${esc(slot.title)}</strong><span data-name="${slot.key || "power"}">Main power</span></div></div>
        <div class="sk-options">${options}</div>
      </div>`;
    }).join("");
    $("sk-chain").addEventListener("click", (e) => {
      const b = e.target.closest(".sk-opt[data-key]");
      if (!b || sim[b.dataset.key] === b.dataset.id) return;
      sim[b.dataset.key] = b.dataset.id;
      if (b.dataset.key === "sensor") { sim.level = 0.2; sim.touching = false; renderControl(); }
      if (b.dataset.key === "actuator") renderOutput();
      syncChain();
      updateSim();
    });
    syncChain();
    renderControl();
    renderOutput();
    updateSim();
  }

  function syncChain() {
    const chain = $("sk-chain");
    chain.querySelectorAll(".sk-opt[data-key]").forEach((b) => b.setAttribute("aria-pressed", String(sim[b.dataset.key] === b.dataset.id)));
    SLOTS.forEach((slot) => {
      if (!slot.key) return;
      const chosen = pick(slot.list, sim[slot.key]);
      const name = chain.querySelector(`[data-name="${slot.key}"]`);
      name.textContent = chosen.name;
      name.closest(".sk-slot-head").querySelector(".sk-mod").classList.toggle("is-empty", chosen.id === "none");
    });
  }

  function renderControl() {
    const box = $("sk-control");
    const sen = pick(K.sim.sensors, sim.sensor);
    if (sen.id === "proximity" || sen.id === "light") {
      box.innerHTML = `<label class="sk-control-label" for="sk-sim-range">${esc(sen.control)}</label>
        <div class="sk-range"><span>${esc(sen.low)}</span><input type="range" id="sk-sim-range" min="0" max="100" value="${Math.round(sim.level * 100)}"><span>${esc(sen.high)}</span></div>`;
      box.querySelector("input").addEventListener("input", (e) => { sim.level = e.target.value / 100; updateSim(); });
    } else if (sen.id === "touch") {
      box.innerHTML = `<p class="sk-control-label">Touch the sensor pad</p>
        <button type="button" class="sk-btn sk-hold" data-on="false">${esc(sen.control)}</button>`;
      const b = box.querySelector("button");
      const set = (on) => { if (sim.touching !== on) { sim.touching = on; b.dataset.on = String(on); updateSim(); } };
      b.addEventListener("pointerdown", (e) => { e.preventDefault(); if (b.setPointerCapture) b.setPointerCapture(e.pointerId); set(true); });
      ["pointerup", "pointercancel", "lostpointercapture"].forEach((t) => b.addEventListener(t, () => set(false)));
      b.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); set(true); } });
      b.addEventListener("keyup", (e) => { if (e.key === " " || e.key === "Enter") set(false); });
      b.addEventListener("blur", () => set(false));
      b.addEventListener("contextmenu", (e) => e.preventDefault());
    } else {
      box.innerHTML = `<p class="sk-control-label">${esc(sen.name)}</p><p>${esc(sen.control)}</p>`;
    }
  }

  function renderOutput() {
    const box = $("sk-output");
    const visual = sim.actuator === "vibration"
      ? '<div class="sk-motor" aria-hidden="true">Motor</div>'
      : sim.actuator === "buzzer"
        ? '<div class="sk-waves" aria-hidden="true">((( • )))</div>'
        : '<div class="sk-led" aria-hidden="true"></div>';
    box.innerHTML = visual + '<p class="sk-out-label"></p>';
  }

  function updateSim() {
    const sen = pick(K.sim.sensors, sim.sensor);
    const act = pick(K.sim.actuators, sim.actuator);
    const mod = sim.modifier;
    let s = sen.id === "none" ? 1 : sen.id === "touch" ? (sim.touching ? 1 : 0) : sim.level;
    if (mod === "inverter") s = 1 - s;
    const on = s >= 0.5;
    const pattern = on && (mod === "blink" || mod === "fade") ? mod : "";

    const box = $("sk-output");
    const visual = box.firstElementChild;
    visual.classList.toggle("is-blink", pattern === "blink");
    visual.classList.toggle("is-fade", pattern === "fade");
    if (act.id === "led") {
      // Steady signal: the closer / brighter, the brighter the LED once it is on.
      const lvl = !on ? 0 : pattern ? 1 : 0.55 + 0.9 * (s - 0.5);
      visual.style.setProperty("--lvl", Math.min(1, lvl).toFixed(3));
    } else if (act.id === "vibration") {
      visual.classList.toggle("is-on", on);
    } else {
      visual.style.opacity = on ? 1 : 0.15;
    }
    const state = !on ? "off" : pattern === "blink" ? "blinking" : pattern === "fade" ? "fading in and out" : "on";
    const label = box.querySelector(".sk-out-label");
    const text = `${act.name}: ${state}`;
    if (label.textContent !== text) label.textContent = text;

    const verb = mod === "blink" ? act.blink : mod === "fade" ? act.fade : act.verb;
    const when = mod === "inverter" ? sen.whenInverted : sen.when;
    $("sk-sentence").textContent = sen.id === "none" && mod === "inverter"
      ? `The ${act.noun || act.name} stays off.`
      : `The ${act.noun || act.name} ${verb} ${when}.`;
  }

  // ---------- Part 1: applications ----------
  function renderApps() {
    const box = $("sk-apps");
    box.innerHTML = K.applications.map((a) => {
      const recipe = a.chain.map((n) => `<span class="sk-chip-mini">${tile(colorOfModule(n), "sk-mod--sm")}${esc(n)}</span>`).join('<span class="sk-arrow" aria-hidden="true">›</span>');
      return `<article class="sk-app">
        <div class="sk-media sk-media--square"></div>
        <h3>${esc(a.name)}</h3>
        <p>${esc(a.text)}</p>
        <p class="sk-app-meta">Worn on: ${esc(a.where)}</p>
        <p class="sk-recipe" aria-label="Circuit: ${esc(a.chain.join(", then "))}">${recipe}</p>
      </article>`;
    }).join("");
    box.querySelectorAll(".sk-media").forEach((m, i) => {
      const a = K.applications[i];
      renderMedia(m, a.image ? { image: a.image } : null, "Photo", "Paper Fig. " + a.fig, a.name);
    });
  }

  // ---------- Part 1: module guide ----------
  let moduleFilter = "all";
  function renderModules() {
    const filters = [{ id: "all", name: "All" }].concat(K.families);
    $("sk-filters").innerHTML = filters.map((f) =>
      `<button type="button" class="sk-chip" data-f="${f.id}" aria-pressed="${f.id === moduleFilter}">${f.color ? `<span class="sk-dot" style="background:${f.color}"></span>` : ""}${esc(f.name)}</button>`).join("");
    const list = K.modules.filter((m) => moduleFilter === "all" || m.family === moduleFilter);
    $("sk-modules").innerHTML = list.map((m) =>
      `<div class="sk-module">${tile(colorOfModule(m.name))}<div><h3>${esc(m.name)}</h3><p>${esc(m.does)}</p></div></div>`).join("");
  }
  $("sk-filters").addEventListener("click", (e) => {
    const b = e.target.closest(".sk-chip");
    if (!b) return;
    moduleFilter = b.dataset.f;
    renderModules();
    const again = $("sk-filters").querySelector(`[data-f="${moduleFilter}"]`);
    if (again) again.focus();
  });

  // ---------- Part 2: choose a path ----------
  const PATHS = ["make", "use"];
  const stepsOf = (path) => K.steps.filter((s) => chapterById[s.chapter] && chapterById[s.chapter].path === path);
  const chaptersOf = (path) => K.chapters.filter((c) => c.path === path);

  function renderChooser() {
    const visuals = {
      make: $("sk-how").querySelector("li:nth-child(3) .sk-how-visual"),
      use: $("sk-how").querySelector("li:nth-child(2) .sk-how-visual")
    };
    const eyebrow = { make: "Start from scratch", use: "Start with a kit" };
    $("sk-paths").innerHTML = PATHS.map((p) => {
      const info = K.paths[p];
      const steps = stepsOf(p);
      const chs = chaptersOf(p);
      const n = steps.filter((s) => done.has(s.shot)).length;
      const firstOpen = steps.findIndex((s) => !done.has(s.shot));
      const target = n && firstOpen > 0 ? firstOpen + 1 : 1;
      const go = n && firstOpen > 0 ? `Continue at step ${target}` : n === steps.length && n ? "Go through it again" : "Start";
      return `<a class="sk-path" href="#${p}-${target}">
        <div class="sk-how-visual" aria-hidden="true">${visuals[p] ? visuals[p].innerHTML : ""}</div>
        <p class="sk-eyebrow">${eyebrow[p]}</p>
        <h2>${esc(info.name)}</h2>
        <p>${esc(info.pitch)}</p>
        <p class="sk-path-meta">${steps.length} steps: ${esc(chs.map((c) => c.name).join(", "))}${n ? ` · ${n} done` : ""}</p>
        ${info.note ? `<p class="sk-note">${esc(info.note)}</p>` : ""}
        <span class="sk-path-go">${go} →</span>
      </a>`;
    }).join("");
    $("sk-availability").textContent = K.paths.availability || "";
  }

  // ---------- Part 2: step by step ----------
  const cur = { path: "", i: -1 };
  function showStep(path, n) {
    const steps = stepsOf(path);
    if (!steps.length) return;
    const i = Math.max(0, Math.min(steps.length - 1, n - 1));
    const changed = cur.path !== path || cur.i !== i;
    cur.path = path;
    cur.i = i;
    const s = steps[i];
    const ch = chapterById[s.chapter];

    $("sk-toc-path").textContent = K.paths[path].name;
    renderToc();
    $("sk-step-meta").textContent = `Step ${i + 1} of ${steps.length} · ${ch.name}`;
    if (changed) {
      document.querySelectorAll("#sk-root .sk-step > .sk-pop").forEach((n) => n.remove());
      renderMedia($("sk-step-media"), s.media, "Clip " + s.shot, "Video goes here", s.title);
      if (s.media && s.media.image && s.media.hotspots) addHotspots($("sk-step-media"), s.media.hotspots, path);
    }
    $("sk-step-title").textContent = s.title;
    $("sk-step-text").textContent = s.text;
    $("sk-step-tip").textContent = s.tip || "";

    // Materials: what is in the photo is explained on hover; the rest is listed in one line
    const mats = $("sk-step-materials");
    const list = s.materials ? K.materials[path] || [] : [];
    const spots = (s.media && s.media.hotspots) || [];
    const shown = new Set(spots.map((h) => h.item));
    const rest = list.filter((m) => !shown.has(m.name));
    mats.hidden = !list.length;
    if (list.length && spots.length) {
      mats.innerHTML = `<p class="sk-mat-hint">${canHover ? "Click" : "Tap"} a dot on the photo to see what each thing is and what it is for.</p>` +
        (rest.length ? `<p class="sk-mat-rest"><strong>Also have ready:</strong> ${rest.map((m) => esc(m.name) + (m.note ? ` <span>(${esc(m.note)})</span>` : "")).join(" · ")}</p>` : "");
    } else {
      mats.innerHTML = `<ul>${list.map((m) => `<li>${esc(m.name)}${m.note ? ` <span>${esc(m.note)}</span>` : ""}</li>`).join("")}</ul>`;
    }

    $("sk-step-done").checked = done.has(s.shot);
    $("sk-prev").disabled = i === 0;
    const last = i === steps.length - 1;
    const nextBtn = $("sk-next");
    nextBtn.textContent = !last ? "Next" : path === "make" ? "Next: use the kit" : "Finish";
    $("sk-progress-bar").style.width = ((i + 1) / steps.length) * 100 + "%";
  }

  // ---------- Dots on a step photo: click one (or the thing under it) to open a card, close it with × ----------
  const canHover = !!(window.matchMedia && window.matchMedia("(hover: hover)").matches);
  function spotInfo(h, path) {
    const m = h.item ? (K.materials[path] || []).concat(K.materials.make, K.materials.use).find((x) => x.name === h.item) : null;
    return { name: h.label || (m && m.name) || "", note: h.text || (m && m.note) || "", image: h.image || (m && m.image) || "" };
  }
  function addHotspots(box, spots, path) {
    let active = null;
    const card = document.createElement("div");
    card.className = "sk-pop";
    card.hidden = true;
    card.setAttribute("role", "dialog");
    const close = () => {
      card.hidden = true;
      if (active) { active.classList.remove("is-on"); active.setAttribute("aria-expanded", "false"); }
      active = null;
    };
    const open = (b, info, h) => {
      if (active) { active.classList.remove("is-on"); active.setAttribute("aria-expanded", "false"); }
      active = b;
      b.classList.add("is-on");
      b.setAttribute("aria-expanded", "true");
      card.setAttribute("aria-label", info.name);
      card.innerHTML = `<button type="button" class="sk-pop-x" aria-label="Close">×</button>` +
        (info.image ? `<img src="${esc(info.image)}" alt="">` : "") +
        `<strong>${esc(info.name)}</strong>${info.note ? `<span>${esc(info.note)}</span>` : ""}`;
      card.querySelector(".sk-pop-x").addEventListener("click", (e) => { e.stopPropagation(); close(); b.focus(); });
      card.hidden = false;
      // On a wide photo the card floats beside the item; on a narrow one it sits under the photo
      const W = box.clientWidth, H = box.clientHeight;
      const wide = W >= 600;
      card.classList.toggle("sk-pop--below", !wide);
      if (wide && card.parentNode !== box) box.appendChild(card);
      if (!wide && card.previousElementSibling !== box) box.after(card);
      if (wide) {
        const cw = card.offsetWidth, ch = card.offsetHeight, gap = 12;
        const l = (h.x / 100) * W, r = ((h.x + h.w) / 100) * W, t = (h.y / 100) * H;
        const x = r + gap + cw <= W ? r + gap : Math.max(gap, l - gap - cw);
        card.style.left = x + "px";
        card.style.top = Math.max(gap, Math.min(t, H - ch - gap)) + "px";
      } else {
        card.style.left = card.style.top = "";
      }
    };
    spots.forEach((h) => {
      const info = spotInfo(h, path);
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sk-hot";
      b.style.cssText = `left:${h.x}%;top:${h.y}%;width:${h.w}%;height:${h.h}%`;
      b.setAttribute("aria-label", info.name);
      b.setAttribute("aria-expanded", "false");
      // dot: where the marker sits, in % of the area (default: its center)
      b.innerHTML = `<span class="sk-dot" style="left:${h.dot ? h.dot[0] : 50}%;top:${h.dot ? h.dot[1] : 50}%"></span>`;
      b.addEventListener("click", () => open(b, info, h));
      box.appendChild(b);
    });
    box.appendChild(card);
    const onKey = (e) => { if (e.key === "Escape" && !card.hidden) { e.stopPropagation(); const b = active; close(); if (b) b.focus(); } };
    card.addEventListener("keydown", onKey);
    box.addEventListener("keydown", onKey);
    // preload the close-ups so the card opens instantly
    spots.forEach((h) => { const src = spotInfo(h, path).image; if (src) new Image().src = src; });
  }

  function renderToc() {
    const steps = stepsOf(cur.path);
    $("sk-toc").innerHTML = chaptersOf(cur.path).map((c) => {
      const items = steps.map((s, i) => ({ s, i })).filter((x) => x.s.chapter === c.id);
      return `<h4>${esc(c.name)}</h4>` + items.map(({ s, i }) =>
        `<button type="button" data-n="${i + 1}"${i === cur.i ? ' aria-current="step"' : ""}><span class="sk-check">${done.has(s.shot) ? "✓" : i + 1}</span><span>${esc(s.title)}</span></button>`).join("");
    }).join("");
  }

  $("sk-toc").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-n]");
    if (b) go(cur.path + "-" + b.dataset.n);
  });
  $("sk-step-done").addEventListener("change", (e) => {
    const s = stepsOf(cur.path)[cur.i];
    if (!s) return;
    if (e.target.checked) done.add(s.shot); else done.delete(s.shot);
    saveDone();
    renderToc();
  });
  function stepBy(d) {
    const steps = stepsOf(cur.path);
    const n = cur.i + d;
    if (n < 0) return;
    if (n >= steps.length) { go(cur.path === "make" ? "use-1" : "tutorial"); return; }
    go(cur.path + "-" + (n + 1));
  }
  $("sk-prev").addEventListener("click", () => stepBy(-1));
  $("sk-next").addEventListener("click", () => stepBy(1));
  document.addEventListener("keydown", (e) => {
    if ($("sk-stepper").hidden || $("sk-tutorial").hidden) return;
    if (e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) return;
    const t = e.target;
    if (t && ((/^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName) && t.type !== "checkbox") || t.isContentEditable)) return;
    if (e.key === "ArrowRight") { e.preventDefault(); stepBy(1); }
    if (e.key === "ArrowLeft") { e.preventDefault(); stepBy(-1); }
  });

  // ---------- Glossary, safety, FAQ, citation ----------
  function renderReference() {
    $("sk-glossary").innerHTML = K.glossary.map((g) => `<dt>${esc(g.term)}</dt><dd>${esc(g.meaning)}</dd>`).join("");
    $("sk-safety").innerHTML = K.safety.map((x) => `<li>${esc(x)}</li>`).join("");
    $("sk-faq").innerHTML = (K.faq || []).map((f) => {
      const tag = f.confirm ? ' <span class="sk-confirm">To confirm</span>' : "";
      const a = f.a ? `<p class="sk-faq-a">${esc(f.a)}${tag}</p>` : `<p class="sk-faq-a is-pending">We are checking this with the lab.${tag}</p>`;
      return `<details><summary>${esc(f.q)}</summary>${a}</details>`;
    }).join("");
    const c = K.citation;
    $("sk-citation").innerHTML = `${esc(c.text)} <a href="${esc(c.doi)}" target="_blank" rel="noopener">${esc(c.doi.replace(/^https?:\/\//, ""))}</a>. ${esc(c.funding)}`;
  }

  // ---------- Switching between parts ----------
  let view = "";
  const toTopOf = (el) => { if (el.getBoundingClientRect().top < 0) el.scrollIntoView({ block: "start" }); };

  function showView(v) {
    $("sk-about").hidden = v !== "about";
    $("sk-tutorial").hidden = v !== "tutorial";
    root.querySelectorAll(".sk-part").forEach((a) => {
      if (a.dataset.part === v) a.setAttribute("aria-current", "page"); else a.removeAttribute("aria-current");
    });
    view = v;
  }

  function render(r) {
    const prevView = view;
    const m = /^(make|use)-(\d+)$/.exec(r);
    if (m) {
      showView("tutorial");
      $("sk-chooser").hidden = true;
      $("sk-stepper").hidden = false;
      showStep(m[1], parseInt(m[2], 10));
      toTopOf($("sk-stepper"));
    } else if (r === "faq") {
      // The questions sit at the bottom of Part 2; keep whatever Part 2 was showing.
      if (prevView !== "tutorial") { showView("tutorial"); $("sk-stepper").hidden = true; $("sk-chooser").hidden = false; renderChooser(); }
      $("faq").scrollIntoView({ block: "start" });
    } else if (r === "tutorial") {
      showView("tutorial");
      $("sk-stepper").hidden = true;
      $("sk-chooser").hidden = false;
      renderChooser();
      toTopOf(root);
    } else {
      showView("about");
      if (r === "try") $("try").scrollIntoView({ block: "start" });
      else if (r === "about" || prevView !== "about") toTopOf(root);
    }
  }

  const KNOWN = /^(about|try|faq|tutorial|(make|use)-\d+)$/;
  function go(r) {
    if (useHash) {
      if (location.hash.slice(1) === r) render(r); else location.hash = r;
    } else {
      render(r);
    }
  }
  // Links like href="#tutorial" go through go(), so they also work when the address is left alone.
  root.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const r = a.getAttribute("href").slice(1);
    if (!KNOWN.test(r)) return;
    e.preventDefault();
    go(r);
  });
  if (useHash) {
    window.addEventListener("hashchange", () => {
      const r = location.hash.slice(1);
      if (KNOWN.test(r) || r === "") render(r || "about");
    });
  }

  // ---------- Start ----------
  renderIntro();
  renderStrip();
  renderSim();
  renderApps();
  renderModules();
  renderReference();
  const first = useHash ? location.hash.slice(1) : "";
  render(KNOWN.test(first) ? first : "about");
})();
