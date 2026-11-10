// Builds the page from content.js (window.SKINKIT). Nothing here needs editing to change text.
// Where you are is kept in the address after "#":
//   #about        Part 1, what SkinKit is
//   #tutorial     Part 2, choose a path
//   #make-3       Part 2, step 3 of "Make the kit" (#use-3 for "Use the kit")
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
  // Small photos of a circuit module (images/fpcb-<name>.jpg) or a wire module (images/wire-<name>.jpg)
  const modPhoto = (name) => `<img class="sk-mod-photo" src="images/fpcb-${name}.jpg" alt="" loading="lazy">`;
  const wirePhoto = (name) => `<img class="sk-wire-photo" src="images/wire-${name}.jpg" alt="" loading="lazy">`;

  // ---------- "I did this step" (kept in this browser only) ----------
  const DONE_KEY = "skinkit-done";
  function loadDone() {
    try { return new Set(JSON.parse(localStorage.getItem(DONE_KEY) || "[]")); } catch (e) { return new Set(); }
  }
  const done = loadDone();
  // Materials ticked off in the "Gather your materials" checklist
  const GOT_KEY = "skinkit-materials";
  const got = (() => { try { return new Set(JSON.parse(localStorage.getItem(GOT_KEY) || "[]")); } catch (e) { return new Set(); } })();
  $("sk-step-materials").addEventListener("change", (e) => {
    const k = e.target.dataset && e.target.dataset.key;
    if (!k) return;
    if (e.target.checked) got.add(k); else got.delete(k);
    try { localStorage.setItem(GOT_KEY, JSON.stringify(Array.from(got))); } catch (err) { /* private mode: keep it in memory */ }
  });
  // Which wire module type the visitor is making (picked on the "Choose the modules" step)
  const TYPE_KEY = "skinkit-module-type";
  const moduleTypes = [].concat(...K.steps.map((s) => s.choices || [])).filter((c) => c.go);
  let moduleType = (() => { try { return localStorage.getItem(TYPE_KEY) || ""; } catch (e) { return ""; } })();
  if (!moduleTypes.some((t) => t.id === moduleType)) moduleType = K.wireBase || (moduleTypes.length ? moduleTypes[0].id : "");
  // Steps that are done once per wire module type: in a byType chapter, the steps after the one with choices
  const typedStep = (s) => {
    const ch = chapterById[s.chapter];
    if (!ch || !ch.byType) return false;
    const inCh = K.steps.filter((x) => x.chapter === s.chapter);
    const k = inCh.findIndex((x) => x.choices);
    return k >= 0 && inCh.indexOf(s) > k;
  };
  // "Done" is kept per type on those steps, so ticking Flat's magnets doesn't tick Cross's
  const doneKey = (s) => (typedStep(s) ? s.shot + "@" + moduleType : s.shot);
  const isDone = (s) => done.has(doneKey(s));
  function setModuleType(id) {
    moduleType = id;
    try { localStorage.setItem(TYPE_KEY, id); } catch (e) { /* private mode: keep it in memory */ }
  }
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
      // Paused sign: shows while the clip is stopped, so it does not look frozen
      if (!reduceMotion) {
        const sign = document.createElement("div");
        sign.className = "sk-paused";
        sign.setAttribute("aria-hidden", "true");
        sign.hidden = true;
        box.appendChild(sign);
        v.addEventListener("pause", () => (sign.hidden = false));
        v.addEventListener("play", () => (sign.hidden = true));
      }
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

  // ---------- Step clip progress: a thin line with a dot per key action; the current action shows under it ----------
  function renderScrub(el, v, marks) {
    el.textContent = "";
    el.hidden = !v;
    if (!v) return;
    marks = (marks || []).slice().sort((a, b) => a.t - b.t);
    el.innerHTML = `<div class="sk-scrub-track"><div class="sk-scrub-fill"></div></div>` +
      (marks.length ? `<p class="sk-scrub-label" aria-live="polite"></p>` : "");
    const track = el.querySelector(".sk-scrub-track");
    const fill = el.querySelector(".sk-scrub-fill");
    const label = el.querySelector(".sk-scrub-label");
    const dots = marks.map((m) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "sk-scrub-mark";
      b.title = m.text;
      b.setAttribute("aria-label", "Jump to: " + m.text);
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        v.currentTime = m.t;
        v.play();
      });
      track.appendChild(b);
      return b;
    });
    let placed = false;
    let on = -2;
    function tick() {
      const d = v.duration || 0;
      if (d && !placed) {
        dots.forEach((b, i) => (b.style.left = (marks[i].t / d) * 100 + "%"));
        placed = true;
      }
      fill.style.width = d ? (v.currentTime / d) * 100 + "%" : "0";
      let k = -1;
      marks.forEach((m, i) => { if (v.currentTime + 0.05 >= m.t) k = i; });
      if (k !== on) {
        on = k;
        dots.forEach((b, i) => b.classList.toggle("is-on", i === k));
        if (label) label.textContent = k >= 0 ? `${k + 1}/${marks.length}  ${marks[k].text}` : "";
      }
    }
    track.addEventListener("click", (e) => {
      const r = track.getBoundingClientRect();
      if (v.duration) v.currentTime = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width)) * v.duration;
    });
    v.addEventListener("seeked", tick);
    // Runs until the clip is replaced by the next step's media
    (function loop() {
      if (!v.isConnected) return;
      tick();
      requestAnimationFrame(loop);
    })();
  }

  // ---------- Part 1: hero, how it works ----------
  function renderIntro() {
    $("sk-headline").textContent = K.headline;
    $("sk-intro").textContent = K.intro;
    if (K.parts) {
      $("sk-parts-title").textContent = K.parts.title || "";
      $("sk-parts-lead").textContent = K.parts.lead || "";
    }

    // Icons are small photos of the real modules
    const visuals = [
      ["main-power", "proximity", "led"].map(modPhoto).join(arrow),
      ["flat", "double-flaps", "cross-v2"].map(wirePhoto).join(""),
      `<img class="sk-worn-photo" src="images/ex-hand.jpg" alt="" loading="lazy">`
    ];
    $("sk-how").innerHTML = K.how.map((item, i) =>
      `<li><div class="sk-how-visual">${visuals[i] || ""}</div><h3>${esc(item.title)}</h3><p>${esc(item.text)}</p></li>`).join("");

    const ov = K.overviewVideo || {};
    renderMedia($("sk-overview-media"), ov.youtube ? { youtube: ov.youtube } : ov.media || null,
      "Overview video", "Clip " + (ov.shot || "0-00") + ". Add the YouTube link in content.js.", "SkinKit overview video");
  }

  // ---------- Part 1: what's in the kit ----------
  function renderKit() {
    const kit = $("sk-kit");
    if (kit) kit.innerHTML = (K.kit || []).map((k) =>
      `<li><img src="${esc(k.image)}" alt="" loading="lazy">` +
      `<h3 class="sk-kit-head">${k.count ? `<span class="sk-kit-num">${esc(k.count)}</span>` : ""}<span>${esc(k.name)}</span></h3>` +
      `<p>${esc(k.text)}</p>${k.highlight ? `<p class="sk-kit-highlight">${esc(k.highlight)}</p>` : ""}</li>`).join("");
  }

  // ---------- "Use the kit" steps with extra content: how the modules connect, the three ways to join pieces, all the modules ----------
  // A step with block: "connect" shows the exploded joint and its three points; block: "joins" shows the three joins;
  // block: "modules" shows every circuit module with color filters (filled in by renderModules).
  function stepBlock(kind) {
    if (kind === "modules") return `<div class="sk-chips" id="sk-filters"></div><div class="sk-modules" id="sk-modules"></div>`;
    const c = K.connect;
    if (!c) return "";
    if (kind === "connect") {
      const fig = c.diagram
        ? `<figure><img src="${esc(c.diagram.image)}" alt="${esc(c.diagram.alt || "")}" loading="lazy">${c.diagram.caption ? `<figcaption>${esc(c.diagram.caption)}</figcaption>` : ""}</figure>`
        : "";
      return `<div class="sk-connect">${fig}<ul class="sk-points">${(c.points || []).map((pt) =>
        `<li><h3>${esc(pt.title)}</h3><p>${esc(pt.text)}</p></li>`).join("")}</ul></div>`;
    }
    if (kind === "joins") {
      return `<h3 class="sk-subhead">${esc(c.typesTitle || "")}</h3><ul class="sk-conn-types">${(c.types || []).map((t) =>
        `<li><img src="${esc(t.image)}" alt="" loading="lazy"><h3>${esc(t.name)}</h3><p>${esc(t.text)}</p></li>`).join("")}</ul>` +
        (c.rule ? `<p class="sk-conn-rule">${esc(c.rule)}</p>` : "") + (c.credit ? `<p class="sk-credit">${esc(c.credit)}</p>` : "");
    }
    return "";
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

  // ---------- Part 1: example photos ----------
  function renderGallery() {
    const box = $("sk-gallery");
    if (!box) return;
    box.innerHTML = (K.examples || []).map((e) =>
      `<figure><img src="${esc(e.image)}" alt="SkinKit worn on the ${esc(e.label.toLowerCase())}" loading="lazy"${e.pos ? ` style="object-position:${esc(e.pos)}"` : ""}>` +
      `<figcaption>${esc(e.label)}</figcaption></figure>`).join("");
  }

  // ---------- Module guide (in the "Meet the modules" step) ----------
  let moduleFilter = "all";
  function renderModules() {
    if (!$("sk-filters")) return;
    const filters = [{ id: "all", name: "All" }].concat(K.families);
    $("sk-filters").innerHTML = filters.map((f) =>
      `<button type="button" class="sk-chip" data-f="${f.id}" aria-pressed="${f.id === moduleFilter}">${f.color ? `<span class="sk-swatch" style="background:${f.color}"></span>` : ""}${esc(f.name)}</button>`).join("");
    const list = K.modules.filter((m) => moduleFilter === "all" || m.family === moduleFilter);
    $("sk-modules").innerHTML = list.map((m) =>
      `<div class="sk-module">${m.image ? `<img class="sk-module-img" src="${esc(m.image)}" alt="" loading="lazy">` : tile(colorOfModule(m.name))}<div><h3>${esc(m.name)}</h3><p>${esc(m.does)}</p></div></div>`).join("");
  }
  $("sk-step-block").addEventListener("click", (e) => {
    const b = e.target.closest("#sk-filters .sk-chip");
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
      make: $("sk-how").querySelector("li:nth-child(2) .sk-how-visual"),
      use: $("sk-how").querySelector("li:nth-child(1) .sk-how-visual")
    };
    const eyebrow = { make: "Start from scratch", use: "Start with a kit" };
    // The same two cards show in Part 2 and under the introduction in Part 1
    const html = PATHS.map((p) => {
      const info = K.paths[p];
      const steps = stepsOf(p);
      const chs = chaptersOf(p);
      const n = steps.filter(isDone).length;
      const firstOpen = steps.findIndex((s) => !isDone(s));
      const target = n && firstOpen > 0 ? firstOpen + 1 : 1;
      const go = n && firstOpen > 0 ? `Continue at step ${target}` : n === steps.length && n ? "Go through it again" : "Start";
      return `<a class="sk-path" href="#${p}-${target}">
        <div class="sk-how-visual" aria-hidden="true">${visuals[p] ? visuals[p].innerHTML : ""}</div>
        <p class="sk-eyebrow">${esc(info.audience || eyebrow[p])}</p>
        <h2>${esc(info.name)}</h2>
        <p>${esc(info.pitch)}</p>
        ${info.highlight ? `<p class="sk-callout">${esc(info.highlight)}</p>` : ""}
        <p class="sk-path-meta">${steps.length} steps: ${esc(chs.map((c) => c.name).join(", "))}${n ? ` · ${n} done` : ""}</p>
        ${info.note ? `<p class="sk-note">${esc(info.note)}</p>` : ""}
        <span class="sk-path-go">${go} →</span>
      </a>`;
    }).join("");
    $("sk-paths").innerHTML = html;
    if ($("sk-intro-paths")) $("sk-intro-paths").innerHTML = html;
    $("sk-availability").textContent = K.paths.availability || "";
  }

  // ---------- Part 2: step by step ----------
  const cur = { path: "", i: -1 };
  function showStep(path, n) {
    const steps = stepsOf(path);
    if (!steps.length) return;
    const i = Math.max(0, Math.min(steps.length - 1, n - 1));
    const s = steps[i];
    // Wire module types other than the one filmed get a blank video box on the steps that differ by type
    const otherType = !!(s.forType && K.wireBase && moduleType !== K.wireBase);
    const typeKey = s.forType ? moduleType : "";
    const changed = cur.path !== path || cur.i !== i || cur.type !== typeKey;
    cur.path = path;
    cur.i = i;
    cur.type = typeKey;
    const ch = chapterById[s.chapter];

    $("sk-toc-path").textContent = K.paths[path].name;
    renderToc();
    const typeLabel = typedStep(s) ? (moduleTypes.find((t) => t.id === moduleType) || {}).name : "";
    $("sk-step-meta").textContent = `Step ${i + 1} of ${steps.length} · ${ch.name}${typeLabel ? " · " + typeLabel : ""}`;
    if (changed) {
      document.querySelectorAll("#sk-root .sk-step > .sk-pop").forEach((n) => n.remove());
      $("sk-step-media").hidden = s.media === false;
      const media = otherType && s.media && s.media.video ? null : s.media;
      const typeName = otherType ? (moduleTypes.find((t) => t.id === moduleType) || {}).name : "";
      renderMedia($("sk-step-media"), media, otherType ? typeName : "Clip " + s.shot, otherType ? "Video coming soon" : "Video goes here", s.title);
      if (media && media.image && media.hotspots) addHotspots($("sk-step-media"), media.hotspots, path);
      const block = $("sk-step-block");
      block.hidden = !s.block;
      block.innerHTML = s.block ? stepBlock(s.block) : "";
      if (s.block === "modules") renderModules();
      renderScrub($("sk-step-scrub"), $("sk-step-media").querySelector("video"), media && media.marks);
    }
    $("sk-step-title").textContent = s.title;
    $("sk-step-callout").textContent = s.callout || "";
    $("sk-step-text").textContent = s.text;
    $("sk-step-tip").textContent = s.tip || "";

    // Materials: a checklist visitors can tick off; ticks are saved in their own browser
    const mats = $("sk-step-materials");
    const matKey = s.materials === true ? path : s.materials;
    const list = matKey ? K.materials[matKey] || [] : [];
    const spots = (s.media && s.media.hotspots) || [];
    mats.hidden = !list.length;
    mats.innerHTML = (spots.length ? `<p class="sk-mat-hint">${canHover ? "Click" : "Tap"} a dot on the photo to see what each thing is for.</p>` : "") +
      `<ul class="sk-checklist">${list.map((m) => {
        const key = matKey + ":" + m.name;
        return `<li><label><input type="checkbox" data-key="${esc(key)}"${got.has(key) ? " checked" : ""}><span><strong>${esc(m.name)}</strong>${m.note ? ` ${esc(m.note)}` : ""}${m.link ? " " + matLink(m.link) : ""}</span></label></li>`;
      }).join("")}</ul>`;

    // Options to pick from (the wire module types): a card each, which opens the step that makes it
    const choices = $("sk-step-choices");
    choices.hidden = !(s.choices && s.choices.length);
    choices.innerHTML = (s.choices || []).map((c) => {
      const inner = (c.image ? `<img src="${esc(c.image)}" alt="" loading="lazy">` : "") +
        `<span class="sk-choice-name">${esc(c.name)}</span>${c.tag ? `<span class="sk-choice-tag">${esc(c.tag)}</span>` : ""}<span class="sk-choice-text">${esc(c.text)}</span>` +
        (c.go ? `<span class="sk-choice-go">How to make it →</span>` : "");
      return `<li>${c.go
        ? `<button type="button" class="sk-choice" data-type="${esc(c.id)}" data-go="${esc(c.go)}">${inner}</button>`
        : `<div class="sk-choice">${inner}</div>`}</li>`;
    }).join("");

    // Steps that differ by wire module type: a type picker and the note for the picked type
    const typeBox = $("sk-step-type");
    const notes = s.forType;
    const picked = moduleTypes.find((t) => t.id === moduleType);
    typeBox.hidden = !notes;
    typeBox.innerHTML = notes
      ? `<div class="sk-type-chips" role="group" aria-label="Wire module type">${moduleTypes.map((t) =>
          `<button type="button" class="sk-chip" data-type="${esc(t.id)}" aria-pressed="${t.id === moduleType}">${esc(t.name)}</button>`).join("")}</div>` +
        (picked && notes[moduleType] ? `<p class="sk-type-note"><strong>${esc(picked.name)}:</strong> ${esc(notes[moduleType])}</p>` : "")
      : "";

    // What this step uses, shown under its text. A name from the materials lists reuses that item's photo;
    // { name, note, image } adds a one-off (its note shows; listed items' notes stay on the "Gather" step).
    const need = $("sk-step-need");
    const allMats = [].concat(...Object.values(K.materials));
    const needs = (s.need || []).map((n) => {
      if (typeof n !== "string") return n;
      const m = allMats.find((x) => x.name === n);
      return { name: n, image: m && m.image, link: m && m.link };
    });
    need.hidden = !needs.length;
    need.innerHTML = needs.length
      ? `<h3 class="sk-need-title">You need</h3><ul class="sk-need-list">${needs.map((m) =>
          `<li${m.image ? "" : ' class="no-img"'}>${m.image ? `<img src="${esc(m.image)}" alt="" loading="lazy">` : ""}` +
          `<span>${esc(m.name)}${m.note ? `<small>${esc(m.note)}</small>` : ""}${m.link ? `<small>${matLink(m.link)}</small>` : ""}</span></li>`).join("")}</ul>`
      : "";

    $("sk-step-done").checked = isDone(s);
    $("sk-prev").disabled = i === 0;
    const last = i === steps.length - 1;
    const nextBtn = $("sk-next");
    nextBtn.textContent = !last ? "Next" : path === "make" ? "Next: use the kit" : "Finish";
    $("sk-progress-bar").style.width = ((i + 1) / steps.length) * 100 + "%";
  }

  // ---------- Dots on a step photo: click one (or the thing under it) to open a card, close it with × ----------
  const canHover = !!(window.matchMedia && window.matchMedia("(hover: hover)").matches);
  function spotInfo(h, path) {
    const m = h.item ? (K.materials[path] || []).concat(K.materials.make, K.materials.modules || [], K.materials.use).find((x) => x.name === h.item) : null;
    return { name: h.label || (m && m.name) || "", note: h.text || (m && m.note) || "", image: h.image || (m && m.image) || "" };
  }
  function matLink(l) {
    return l.href
      ? `<a class="sk-mat-link" href="${esc(l.href)}" target="_blank" rel="noopener">${esc(l.text)} ↓</a>`
      : `<span class="sk-mat-link is-soon">${esc(l.text)} (link coming soon)</span>`;
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
    const stepBtn = ({ s, i }, sub) =>
      `<button type="button" data-n="${i + 1}"${sub ? ' class="is-sub"' : ""}${i === cur.i ? ' aria-current="step"' : ""}><span class="sk-check">${isDone(s) ? "✓" : i + 1}</span><span>${esc(s.title)}</span></button>`;
    $("sk-toc").innerHTML = chaptersOf(cur.path).map((c) => {
      const items = steps.map((s, i) => ({ s, i })).filter((x) => x.s.chapter === c.id);
      const typed = items.filter((x) => typedStep(x.s));
      if (!c.byType || !typed.length) return `<h4>${esc(c.name)}</h4>` + items.map((x) => stepBtn(x)).join("");
      // One group per wire module type; the picked type is open and lists its steps. Blank has nothing to make.
      const choices = (items.find((x) => x.s.choices) || {}).s.choices || [];
      const groups = choices.map((t) => {
        if (!t.go) return `<p class="sk-toc-type is-blank">${esc(t.name)} <small>nothing to make</small></p>`;
        const open = t.id === moduleType;
        return `<button type="button" class="sk-toc-type" data-toc-type="${esc(t.id)}" aria-expanded="${open}">${esc(t.name)}</button>` +
          (open ? typed.map((x) => stepBtn(x, true)).join("") : "");
      }).join("");
      return `<h4>${esc(c.name)}</h4>` + items.filter((x) => !typedStep(x.s)).map((x) => stepBtn(x)).join("") + groups;
    }).join("");
  }

  $("sk-toc").addEventListener("click", (e) => {
    const t = e.target.closest("button[data-toc-type]");
    if (t) {
      // Open that type and start its steps
      setModuleType(t.dataset.tocType);
      const first = stepsOf(cur.path).findIndex(typedStep);
      if (first >= 0) go(cur.path + "-" + (first + 1));
      return;
    }
    const b = e.target.closest("button[data-n]");
    if (b) go(cur.path + "-" + b.dataset.n);
  });
  $("sk-step-done").addEventListener("change", (e) => {
    const s = stepsOf(cur.path)[cur.i];
    if (!s) return;
    if (e.target.checked) done.add(doneKey(s)); else done.delete(doneKey(s));
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
  $("sk-step-choices").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-go]");
    if (!b) return;
    setModuleType(b.dataset.type);
    const idx = stepsOf(cur.path).findIndex((x) => x.shot === b.dataset.go);
    if (idx >= 0) go(cur.path + "-" + (idx + 1));
  });
  $("sk-step-type").addEventListener("click", (e) => {
    const b = e.target.closest("button[data-type]");
    if (!b) return;
    setModuleType(b.dataset.type);
    showStep(cur.path, cur.i + 1);
  });
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
      const fig = f.image ? `<figure class="sk-faq-fig"><img src="${esc(f.image.src)}" alt="${esc(f.image.alt || "")}" loading="lazy">${f.image.caption ? `<figcaption>${esc(f.image.caption)}</figcaption>` : ""}</figure>` : "";
      const demo = f.demo ? `<div class="sk-demo" data-demo="${esc(f.demo)}"></div>` : "";
      const src = f.source ? `<p class="sk-faq-src">From the ${esc(f.source)}.</p>` : "";
      return `<details><summary>${esc(f.q)}</summary>${a}${fig}${demo}${src}</details>`;
    }).join("");
    $("sk-faq").querySelectorAll(".sk-demo").forEach((box) => {
      if (box.dataset.demo === "order") orderDemo(box);
      if (box.dataset.demo === "arrows") arrowsDemo(box);
    });
    const c = K.citation;
    $("sk-citation").innerHTML = `${esc(c.text)} <a href="${esc(c.doi)}" target="_blank" rel="noopener">${esc(c.doi.replace(/^https?:\/\//, ""))}</a>. ${esc(c.funding)}`;
  }

  // ---------- FAQ demos ----------
  // Module order: the LED before or after the proximity sensor (paper, section 3.5)
  function orderDemo(box) {
    // Where the LED sits in a chain with two sensors, and what each sensor is sensing (paper, sections 3.1 and 3.5)
    const st = { led: 2, near: true, touch: false };
    const mods = {
      power: { name: "Power", say: "power", photo: "main-power" },
      prox: { name: "Proximity sensor", say: "proximity sensor", photo: "proximity" },
      touch: { name: "Touch sensor", say: "touch sensor", photo: "capacitive-touch" },
      led: { name: "LED", say: "LED", photo: "led" }
    };
    const SPOTS = ["LED first", "LED between the sensors", "LED last"];
    function draw() {
      const chain = ["prox", "touch"];
      chain.splice(st.led, 0, "led");
      chain.unshift("power");
      // A module only gets a signal if every sensor before it is sensing something
      let signal = true, lit = false;
      chain.forEach((id) => {
        if (id === "led") lit = signal;
        if (id === "prox") signal = signal && st.near;
        if (id === "touch") signal = signal && st.touch;
      });
      const seq = "P" + chain.map((id) => mods[id].say).join(" → ").slice(1);
      const say = st.led === 0
        ? "The LED gets the full signal straight from the power module, so it is always on. The sensors after it don't change it."
        : st.led === 1
          ? (st.near
            ? "Something is close, so the proximity sensor passes the signal on and the LED lights up. The touch sensor comes after the LED, so touching it changes nothing."
            : "Nothing is close, so the proximity sensor passes no signal on and the LED stays off. The touch sensor comes after the LED, so touching it changes nothing.")
          : st.near && st.touch
            ? "Something is close and the touch sensor is touched, so both sensors pass the signal on and the LED lights up."
            : st.near
              ? "Something is close, so the proximity sensor passes the signal on. But nothing touches the touch sensor, so the signal stops there and the LED stays off. Both conditions have to be met."
              : st.touch
                ? "Nothing is close, so the proximity sensor sends no signal on. The touch sensor has nothing to pass on, so the LED stays off even though it is touched."
                : "Nothing is close and nothing touches the touch sensor, so the LED stays off.";
      box.innerHTML =
        `<div class="sk-demo-controls">
          <div class="sk-type-chips" role="group" aria-label="Where the LED goes">${SPOTS.map((t, k) =>
            `<button type="button" class="sk-chip" data-led="${k}" aria-pressed="${st.led === k}">${t}</button>`).join("")}
          </div>
          <div class="sk-type-chips" role="group" aria-label="What the sensors sense">
            <button type="button" class="sk-chip" data-sense="near" aria-pressed="${st.near}">Something is close</button>
            <button type="button" class="sk-chip" data-sense="touch" aria-pressed="${st.touch}">Touch the touch sensor</button>
          </div>
        </div>
        <div class="sk-demo-chain">${chain.map((id) => {
          const m = mods[id];
          const cls = (id === "led" && lit ? " is-lit" : "") + ((id === "prox" && st.near) || (id === "touch" && st.touch) ? " is-sensing" : "");
          return `<span class="sk-demo-mod${cls}">${modPhoto(m.photo)}<span>${esc(m.name)}${id === "led" ? (lit ? " (on)" : " (off)") : ""}</span></span>`;
        }).join(arrow)}</div>
        <p class="sk-demo-out" aria-live="polite"><strong>${esc(seq)}:</strong> ${esc(say)}</p>`;
    }
    box.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      if (b.dataset.led) st.led = +b.dataset.led;
      else if (b.dataset.sense) st[b.dataset.sense] = !st[b.dataset.sense];
      draw();
      const again = box.querySelector(b.dataset.led ? `[data-led="${b.dataset.led}"]` : `[data-sense="${b.dataset.sense}"]`);
      if (again) again.focus();
    });
    draw();
  }

  // Arrows: two circuit modules side by side; turning the second one around swaps its + and − (paper, Fig. 3)
  function arrowsDemo(box) {
    let flipped = false;
    const ROWS = [34, 74, 114], NAMES = ["Power +", "Signal", "Ground –"];
    const AX = 76, BX = 286, W = 124, JX = (AX + W + BX) / 2;
    function module(x, labels, dir) {
      const pads = labels.map((t, i) => {
        const y = ROWS[i];
        return `<line x1="${x + 12}" y1="${y}" x2="${x + W - 12}" y2="${y}" class="sk-demo-line"/>` +
          `<circle cx="${x + 14}" cy="${y}" r="6" class="sk-demo-pad"/><circle cx="${x + W - 14}" cy="${y}" r="6" class="sk-demo-pad"/>` +
          `<text x="${x + 10}" y="${y - 10}" class="sk-demo-lab">${t[0]}</text><text x="${x + W - 10}" y="${y - 10}" text-anchor="end" class="sk-demo-lab">${t[1]}</text>`;
      }).join("");
      const ax = x + W / 2, ay = 96;
      const arr = dir > 0 ? `M${ax - 14},${ay} L${ax + 10},${ay} M${ax + 3},${ay - 7} L${ax + 10},${ay} L${ax + 3},${ay + 7}`
        : `M${ax + 14},${ay} L${ax - 10},${ay} M${ax - 3},${ay - 7} L${ax - 10},${ay} L${ax - 3},${ay + 7}`;
      return `<rect x="${x}" y="12" width="${W}" height="122" class="sk-demo-board"/>${pads}<path d="${arr}" class="sk-demo-arrow"/>`;
    }
    function draw() {
      const left = [["+", "+"], ["in", "out"], ["–", "–"]];
      const right = flipped ? [["–", "–"], ["out", "in"], ["+", "+"]] : left;
      const meets = ["+ meets –", "out meets out", "– meets +"];
      const names = NAMES.map((n, i) => `<text x="0" y="${ROWS[i] + 4}" class="sk-demo-name">${n}</text>`).join("");
      const joints = ROWS.map((y, i) => flipped
        ? `<path d="M${JX - 6},${y - 6} l12,12 M${JX + 6},${y - 6} l-12,12" class="sk-demo-bad"/><text x="${JX}" y="${y + 21}" text-anchor="middle" class="sk-demo-badlab">${meets[i]}</text>`
        : `<line x1="${AX + W - 14}" y1="${y}" x2="${BX + 14}" y2="${y}" class="sk-demo-join"/><path d="M${JX - 6},${y - 12} l4,5 l8,-9" class="sk-demo-ok"/>`).join("");
      const say = flipped
        ? "The second module is turned around: its + sits on the ground line, its − on the power line, and two outputs face each other. The circuit won't work, and the magnets won't snap on this way."
        : "Both arrows point the same way: + meets +, the output meets the next input and − meets −. The signal flows from left to right.";
      box.innerHTML =
        `<div class="sk-demo-controls"><div class="sk-type-chips">
          <button type="button" class="sk-chip" data-flip aria-pressed="${flipped}">Turn the second module around</button>
        </div></div>
        <svg class="sk-demo-svg" viewBox="0 0 ${BX + W + 2} 146" role="img" aria-label="${esc(say)}">${names}${module(AX, left, 1)}${module(BX, right, flipped ? -1 : 1)}${joints}</svg>
        <p class="sk-demo-out" aria-live="polite">${esc(say)}</p>`;
    }
    box.addEventListener("click", (e) => {
      if (!e.target.closest("[data-flip]")) return;
      flipped = !flipped;
      draw();
      const again = box.querySelector("[data-flip]");
      if (again) again.focus();
    });
    draw();
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
      renderChooser();
      if (r === "about" || prevView !== "about") toTopOf(root);
    }
  }

  const KNOWN = /^(about|faq|tutorial|(make|use)-\d+)$/;
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
  renderKit();
  renderStrip();
  renderGallery();
  renderModules();
  renderReference();
  const first = useHash ? location.hash.slice(1) : "";
  render(KNOWN.test(first) ? first : "about");
})();
