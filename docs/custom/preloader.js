/**
 * OpenClaw Nine Hand Seals preloader — Mintlify overlay.
 * Inject via docs.json customJS.
 * Creates a full-screen overlay, runs the 九字真言 animation,
 * then removes overlay to reveal the Mintlify page underneath.
 */
(function () {
  "use strict";

  /* Skip on reduced motion or if already visited this session */
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  try {
    if (sessionStorage.getItem("oc_preloader_done")) return;
  } catch (_) {}

  /* ── Nine seals data ── */
  var SEALS = [
    { char: "\u4e34", jp: "Rin", meaning: "tenacity" },
    { char: "\u5175", jp: "Py\u014d", meaning: "strength" },
    { char: "\u6597", jp: "T\u014d", meaning: "wisdom" },
    { char: "\u8005", jp: "Sha", meaning: "healing" },
    { char: "\u7686", jp: "Kai", meaning: "control" },
    { char: "\u9635", jp: "Jin", meaning: "perception" },
    { char: "\u5217", jp: "Retsu", meaning: "reality" },
    { char: "\u5728", jp: "Zai", meaning: "presence" },
    { char: "\u524d", jp: "Zen", meaning: "completion" },
  ];

  var COLORS = [
    "#FF5A36",
    "#FF6A44",
    "#FF7A52",
    "#E85A36",
    "#FF5A36",
    "#D84A2E",
    "#FF6E48",
    "#FF8A5A",
    "#FF5A36",
  ];

  /* ── Build overlay elements ── */
  var overlay = document.createElement("div");
  overlay.id = "oc-overlay";
  overlay.style.cssText =
    "position:fixed;inset:0;z-index:999999;background:#0a0808;" +
    "display:flex;flex-direction:column;align-items:center;justify-content:center;" +
    "pointer-events:none;";

  var canvas = document.createElement("canvas");
  canvas.id = "oc-canvas";
  canvas.style.cssText = "position:fixed;inset:0;width:100%;height:100%;z-index:0;";
  overlay.appendChild(canvas);

  var charEl = document.createElement("div");
  charEl.id = "oc-char";
  charEl.style.cssText =
    "position:relative;z-index:1;font-size:clamp(96px,24vw,220px);font-weight:700;" +
    "line-height:1;opacity:0;transform:scale(0.3);" +
    'font-family:"DM Sans",system-ui,-apple-system,sans-serif;' +
    "color:#f0e8e0;" +
    "text-shadow:0 0 40px rgba(255,90,54,0.6),0 0 80px rgba(255,90,54,0.6)," +
    "0 0 160px rgba(255,90,54,0.6);" +
    "transition:transform 0.35s cubic-bezier(0.34,1.56,0.64,1),opacity 0.2s ease;";
  overlay.appendChild(charEl);

  var subEl = document.createElement("div");
  subEl.id = "oc-sub";
  subEl.style.cssText =
    "position:relative;z-index:1;margin-top:14px;" +
    "font-size:clamp(12px,2vw,18px);letter-spacing:0.15em;opacity:0;" +
    'font-family:"DM Sans",system-ui,-apple-system,sans-serif;' +
    "color:rgba(240,232,224,0.4);" +
    "transition:opacity 0.25s ease 0.05s;";
  overlay.appendChild(subEl);

  /* Progress dots */
  var progressWrap = document.createElement("div");
  progressWrap.id = "oc-progress";
  progressWrap.style.cssText =
    "position:fixed;top:clamp(20px,4vh,40px);left:50%;transform:translateX(-50%);" +
    "z-index:1;display:flex;gap:6px;opacity:0;" +
    "transition:opacity 0.6s ease;";

  var dots = [];
  for (var i = 0; i < SEALS.length; i++) {
    var dot = document.createElement("div");
    dot.style.cssText =
      "width:5px;height:5px;border-radius:50%;" +
      "background:rgba(255,255,255,0.1);" +
      "transition:background 0.2s,transform 0.2s,box-shadow 0.2s;";
    progressWrap.appendChild(dot);
    dots.push(dot);
  }
  overlay.appendChild(progressWrap);

  /* Brand at bottom (shown at end) */
  var brandEl = document.createElement("div");
  brandEl.id = "oc-brand";
  brandEl.style.cssText =
    "position:fixed;bottom:clamp(32px,6vh,60px);left:50%;transform:translateX(-50%);" +
    "z-index:1;opacity:0;text-align:center;" +
    "transition:opacity 0.8s ease;pointer-events:none;";
  brandEl.innerHTML =
    '<div style="font-size:clamp(20px,3.5vw,36px);font-weight:700;' +
    "letter-spacing:0.04em;color:#f0e8e0;" +
    "font-family:'DM Sans',system-ui,-apple-system,sans-serif;\">OPENCLAW</div>" +
    '<div style="margin-top:6px;font-size:clamp(10px,1.2vw,13px);' +
    "letter-spacing:0.2em;color:rgba(240,232,224,0.3);" +
    'font-weight:300;text-transform:uppercase;">' +
    "Multi-channel gateway for AI agents</div>";
  overlay.appendChild(brandEl);

  /* Skip button */
  var skipBtn = document.createElement("button");
  skipBtn.id = "oc-skip";
  skipBtn.textContent = "\u8df3\u8fc7 \u203a";
  skipBtn.style.cssText =
    "position:fixed;bottom:clamp(16px,3vh,28px);right:clamp(16px,3vw,28px);" +
    "z-index:10;padding:8px 18px;border:1px solid rgba(255,255,255,0.15);" +
    "border-radius:6px;background:rgba(255,255,255,0.04);" +
    "color:rgba(255,255,255,0.4);font-size:13px;font-family:inherit;cursor:pointer;" +
    "opacity:0;transition:opacity 0.4s ease;" +
    "pointer-events:auto;";
  overlay.appendChild(skipBtn);

  /* Append overlay to body */
  document.documentElement.appendChild(overlay);

  /* ── Canvas setup ── */
  var ctx = canvas.getContext("2d");
  var W, H, CX, CY;

  function resize() {
    W = canvas.width = window.innerWidth;
    H = canvas.height = window.innerHeight;
    CX = W / 2;
    CY = H / 2;
  }
  window.addEventListener("resize", resize);
  resize();

  /* ── TTS ── */
  var speechSynth = window.speechSynthesis;
  var zhVoice = null;

  function loadVoices() {
    try {
      zhVoice =
        speechSynth.getVoices().find(function (v) {
          return v.lang.startsWith("zh");
        }) || null;
    } catch (_) {}
  }
  if (speechSynth) {
    speechSynth.addEventListener("voiceschanged", loadVoices);
    loadVoices();
  }

  function speak(text) {
    if (!speechSynth) return;
    try {
      window.speechSynthesis.cancel();
    } catch (_) {}
    var u = new SpeechSynthesisUtterance(text);
    u.lang = "zh-CN";
    u.rate = 0.85;
    if (zhVoice) u.voice = zhVoice;
    try {
      speechSynth.speak(u);
    } catch (_) {}
  }

  /* ── Particles ── */
  var N = 140,
    NF = 40;
  var ambient = [],
    focusRing = [];

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function hexToRgb(h) {
    var v = parseInt(h.slice(1), 16);
    return { r: (v >> 16) & 255, g: (v >> 8) & 255, b: v & 255 };
  }

  function P(o) {
    o = o || {};
    this.x = o.x || rand(0, W);
    this.y = o.y || rand(0, H);
    this.vx = o.vx || rand(-0.3, 0.3);
    this.vy = o.vy || rand(-0.3, 0.3);
    this.sz = o.size || rand(1.5, 4);
    this.c = o.color || { r: 255, g: 90, b: 54 };
    this.op = o.opacity || rand(0.2, 0.7);
    this.ang = rand(0, Math.PI * 2);
    this.oR = rand(70, 180);
    this.oS = rand(0.003, 0.01);
  }

  P.prototype.tick = function (phase, tx, ty, now) {
    switch (phase) {
      case "idle":
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < -40) this.x = W + 40;
        if (this.x > W + 40) this.x = -40;
        if (this.y < -40) this.y = H + 40;
        if (this.y > H + 40) this.y = -40;
        this.op = this.op * 0.25;
        break;
      case "converge": {
        var dx = tx - this.x,
          dy = ty - this.y;
        var d = Math.sqrt(dx * dx + dy * dy);
        var sp = Math.min(d * 0.06, 14);
        if (d > 2) {
          this.x += (dx / d) * sp;
          this.y += (dy / d) * sp;
        }
        this.op = Math.min(this.op, 1 - d / (W * 0.5));
        break;
      }
      case "burst":
        this.x += rand(-8, 8);
        this.y += rand(-8, 8);
        this.op = Math.max(0, this.op - 0.05);
        this.sz = this.sz * rand(1.5, 3);
        break;
      case "orbit":
        this.ang += this.oS;
        var ttx = tx + Math.cos(this.ang) * this.oR;
        var tty = ty + Math.sin(this.ang) * this.oR * 0.5;
        this.x += (ttx - this.x) * 0.07;
        this.y += (tty - this.y) * 0.07;
        this.op = 0.2 + Math.sin(now * 0.003 + this.ang) * 0.15;
        break;
      case "fade":
        this.x += this.vx * 0.3;
        this.y += this.vy * 0.3;
        this.op = Math.max(0, this.op - 0.015);
        break;
    }
  };

  P.prototype.draw = function (ctx) {
    if (this.op <= 0.01) return;
    ctx.globalAlpha = this.op;
    var r = this.c.r,
      g = this.c.g,
      b = this.c.b;
    var gd = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.sz * 3);
    gd.addColorStop(0, "rgba(" + r + "," + g + "," + b + ",1)");
    gd.addColorStop(0.3, "rgba(" + r + "," + g + "," + b + ",0.5)");
    gd.addColorStop(1, "rgba(" + r + "," + g + "," + b + ",0)");
    ctx.fillStyle = gd;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.sz * 3, 0, Math.PI * 2);
    ctx.fill();
  };

  function initParticles(color) {
    ambient = [];
    focusRing = [];
    var c = color || { r: 245 + rand(-20, 10), g: 80 + rand(-20, 20), b: 44 + rand(-10, 10) };
    var gc = { r: 255, g: 200 + rand(-20, 20), b: 100 + rand(-20, 20) };
    for (var i = 0; i < N; i++) {
      ambient.push(
        new P({
          x: rand(-100, W + 100),
          y: rand(-100, H + 100),
          vx: rand(-0.4, 0.4),
          vy: rand(-0.4, 0.4),
          size: rand(1, 4),
          color: c,
          opacity: rand(0.15, 0.6),
        }),
      );
    }
    for (var i = 0; i < NF; i++) {
      focusRing.push(
        new P({
          x: rand(CX - 120, CX + 120),
          y: rand(CY - 120, CY + 120),
          size: rand(0.5, 2),
          color: gc,
          opacity: rand(0.2, 0.5),
        }),
      );
    }
  }

  /* ── Background ── */
  function drawBG(now) {
    var g = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.max(W, H) * 0.55);
    g.addColorStop(0, "rgba(22,10,7,1)");
    g.addColorStop(0.5, "rgba(13,8,7,1)");
    g.addColorStop(1, "rgba(10,8,8,1)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    var pulse = 0.08 + Math.sin(now * 0.001) * 0.03;
    var ag = ctx.createRadialGradient(CX, CY, 0, CX, CY, Math.max(W, H) * 0.3);
    ag.addColorStop(0, "rgba(255,90,54," + pulse * 0.2 + ")");
    ag.addColorStop(1, "rgba(255,90,54,0)");
    ctx.fillStyle = ag;
    ctx.fillRect(0, 0, W, H);
  }

  /* ── Animation engine ── */
  var T = { converge: 380, burst: 180, glow: 380, fade: 250 };
  var SEAL_MS = T.converge + T.burst + T.glow + T.fade;

  var idx = 0,
    t0 = 0;
  var skipped = false,
    done = false;
  var animRaf = null;

  function go(i) {
    if (i >= SEALS.length) {
      done = true;
      finish();
      return;
    }
    idx = i;
    t0 = performance.now();
    var s = SEALS[i];
    var c = hexToRgb(COLORS[i % COLORS.length]);
    charEl.textContent = s.char;
    subEl.textContent = s.jp + " \u00b7 " + s.meaning;
    charEl.style.opacity = "0";
    charEl.style.transform = "scale(0.3)";
    subEl.style.opacity = "0";
    initParticles(c);
    for (var j = 0; j < dots.length; j++) {
      dots[j].style.background = j < i ? "#FF5A36" : j === i ? "#FF5A36" : "rgba(255,255,255,0.1)";
      dots[j].style.transform = j === i ? "scale(1.4)" : j < i ? "scale(1)" : "scale(1)";
      dots[j].style.boxShadow = j <= i ? "0 0 6px rgba(255,90,54,0.6)" : "none";
      if (j === i)
        dots[j].style.boxShadow = "0 0 10px rgba(255,90,54,0.6), 0 0 20px rgba(255,90,54,0.6)";
    }
    speak(s.char);
    if (i === 0) {
      setTimeout(function () {
        skipBtn.style.opacity = "1";
        progressWrap.style.opacity = "1";
      }, 200);
    }
  }

  function finish() {
    done = true;
    charEl.style.display = "none";
    subEl.style.display = "none";
    brandEl.style.opacity = "1";
    for (var j = 0; j < dots.length; j++) {
      dots[j].style.background = "#FF5A36";
      dots[j].style.boxShadow = "0 0 6px rgba(255,90,54,0.6)";
    }
    try {
      sessionStorage.setItem("oc_preloader_done", "1");
    } catch (_) {}
    /* Fade out overlay after brand text shows */
    setTimeout(function () {
      overlay.style.transition = "opacity 0.6s ease";
      overlay.style.opacity = "0";
      setTimeout(function () {
        if (overlay && overlay.parentNode) overlay.parentNode.removeChild(overlay);
        if (animRaf) cancelAnimationFrame(animRaf);
        document.documentElement.classList.add("loaded");
      }, 700);
    }, 1800);
  }

  function skipHandler() {
    if (skipped || done) return;
    skipped = true;
    charEl.style.transition = "transform 0.35s cubic-bezier(0.55,0,0.7,0.2),opacity 0.3s ease";
    charEl.style.opacity = "0";
    charEl.style.transform = "scale(0.85)";
    subEl.style.transition = "opacity 0.2s ease";
    subEl.style.opacity = "0";
    setTimeout(finish, 250);
  }
  skipBtn.addEventListener("click", skipHandler);
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" || e.key === " ") skipHandler();
  });

  /* ── Main loop ── */
  var prev = -1;

  function loop(now) {
    if (done) {
      drawBG(now);
      animRaf = requestAnimationFrame(loop);
      return;
    }

    if (idx !== prev) {
      go(idx);
      prev = idx;
    }

    var dt = performance.now() - t0;

    var phase;
    if (dt < T.converge) phase = "converge";
    else if (dt < T.converge + T.burst) phase = "burst";
    else if (dt < T.converge + T.burst + T.glow) phase = "orbit";
    else phase = "fade";

    if (phase === "burst") {
      var bp = (dt - T.converge) / T.burst;
      if (bp < 0.15) {
        charEl.style.opacity = "1";
        charEl.style.transform = "scale(1)";
        subEl.style.opacity = "1";
      } else if (bp < 0.6) {
        charEl.style.transform = "scale(1.15)";
      }
    } else if (phase === "orbit") {
      charEl.style.transform = "scale(1.15)";
      subEl.style.opacity = "1";
      var gp = (dt - T.converge - T.burst) / T.glow;
      charEl.style.transform = "scale(" + (1 + Math.sin(gp * Math.PI * 4) * 0.04) + ")";
    } else if (phase === "fade") {
      charEl.style.opacity = "0";
      charEl.style.transform = "scale(0.85)";
      subEl.style.opacity = "0";
      var fp = (dt - T.converge - T.burst - T.glow) / T.fade;
      if (fp >= 1) {
        idx++;
        prev = -1;
      }
    } else if (phase === "converge") {
      var cp = Math.min(dt / T.converge, 1);
      var r = Math.max(W, H) * 0.35 * (1 - cp) + 30;
      ctx.strokeStyle = "rgba(255,90,54," + (1 - cp) * 0.2 + ")";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(CX, CY, r, 0, Math.PI * 2);
      ctx.stroke();
    }

    drawBG(performance.now());
    for (var i = 0; i < ambient.length; i++) {
      ambient[i].tick(phase, CX, CY, now);
      ambient[i].draw(ctx);
    }
    for (var i = 0; i < focusRing.length; i++) {
      if (phase === "orbit" || phase === "burst") focusRing[i].tick(phase, CX, CY, now);
      else focusRing[i].tick("idle", CX, CY, now);
      focusRing[i].draw(ctx);
    }

    if (phase === "burst") {
      var bp2 = Math.min((dt - T.converge) / T.burst, 1);
      if (bp2 < 0.2) {
        ctx.fillStyle = "rgba(255,255,255," + (1 - bp2 / 0.2) * 0.1 + ")";
        ctx.fillRect(0, 0, W, H);
      }
    }

    animRaf = requestAnimationFrame(loop);
  }

  /* ── Go! ── */
  initParticles();
  go(0);
  animRaf = requestAnimationFrame(loop);
})();
