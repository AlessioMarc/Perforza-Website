/* ==========================================================================
   PERFORZA · interazioni
   JavaScript puro, nessuna libreria. Il sito funziona anche se questo file
   non si carica (le animazioni di comparsa vengono semplicemente saltate).
   ========================================================================== */
(() => {
  "use strict";

  const header = document.getElementById("site-header");
  const nav = document.getElementById("site-nav");
  const menuToggle = header.querySelector(".menu-toggle");
  const callBar = document.getElementById("call-bar");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- Anno nel footer ---------- */
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  /* ---------- Intestazione: sfondo pieno dopo il primo scorrimento ---------- */
  const onScroll = () => header.classList.toggle("is-scrolled", window.scrollY > 24);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  /* ---------- Menu su schermi piccoli ---------- */
  const setMenu = (open) => {
    header.classList.toggle("is-open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    menuToggle.querySelector(".menu-toggle__label").textContent = open ? "Chiudi" : "Menu";
  };
  menuToggle.addEventListener("click", () => setMenu(!header.classList.contains("is-open")));
  nav.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && header.classList.contains("is-open")) {
      setMenu(false);
      menuToggle.focus();
    }
  });
  window.matchMedia("(min-width: 1000px)").addEventListener("change", (e) => { if (e.matches) setMenu(false); });

  /* ---------- Comparsa degli elementi durante lo scorrimento ---------- */
  const revealEls = document.querySelectorAll(".reveal, .reveal-img");
  if ("IntersectionObserver" in window && !reducedMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -6% 0px" });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }

  /* ---------- Voce di menu attiva in base alla sezione visibile ---------- */
  const links = [...nav.querySelectorAll('a[href^="#"]')];
  const sections = links.map((a) => document.querySelector(a.getAttribute("href"))).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((a) => {
          const on = a.getAttribute("href") === "#" + entry.target.id;
          if (on) a.setAttribute("aria-current", "true"); else a.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-45% 0px -50% 0px" });
    sections.forEach((s) => spy.observe(s));
  }

  /* ---------- Barra "Chiama" su mobile: si nasconde dove c'è già il numero grande ---------- */
  if (callBar && "IntersectionObserver" in window) {
    const hideZones = new Set();
    const barObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) hideZones.add(entry.target); else hideZones.delete(entry.target);
      });
      callBar.classList.toggle("is-hidden", hideZones.size > 0);
    }, { threshold: 0.35 });
    ["contatti"].forEach((id) => {
      const el = document.getElementById(id);
      if (el) barObserver.observe(el);
    });
  }

  /* ==========================================================================
     LIGHTBOX · ingrandimento di foto e video (usa l'elemento nativo <dialog>,
     che gestisce già focus e tasto Esc)
     ========================================================================== */
  const dialog = document.getElementById("lightbox");
  const stage = document.getElementById("lightbox-stage");
  const caption = document.getElementById("lightbox-caption");
  const btnClose = document.getElementById("lightbox-close");
  const btnPrev = document.getElementById("lightbox-prev");
  const btnNext = document.getElementById("lightbox-next");
  const triggers = [...document.querySelectorAll(".g-btn[data-src]")];
  let current = 0;
  let lastFocus = null;

  if (!dialog || typeof dialog.showModal !== "function" || !triggers.length) return;

  const show = (index) => {
    current = (index + triggers.length) % triggers.length;
    const t = triggers[current];
    const src = t.dataset.src;
    const text = t.dataset.caption || "";
    const thumb = t.querySelector("img");
    stage.replaceChildren();

    if (t.dataset.type === "video") {
      const v = document.createElement("video");
      v.src = src;
      v.controls = true;
      v.playsInline = true;
      v.preload = "metadata";
      if (thumb) v.poster = thumb.getAttribute("src");
      stage.append(v);
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.alt = thumb ? thumb.alt : text;
      stage.append(img);
    }
    caption.textContent = text;
    const single = triggers.length < 2;
    btnPrev.hidden = single;
    btnNext.hidden = single;
  };

  const open = (index) => {
    lastFocus = document.activeElement;
    show(index);
    dialog.showModal();
    document.body.style.overflow = "hidden";
  };
  const close = () => dialog.close();

  triggers.forEach((t, i) => t.addEventListener("click", () => open(i)));
  btnClose.addEventListener("click", close);
  btnPrev.addEventListener("click", () => show(current - 1));
  btnNext.addEventListener("click", () => show(current + 1));

  // clic sullo sfondo scuro = chiudi
  dialog.addEventListener("click", (e) => { if (e.target === dialog || e.target === stage) close(); });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") show(current - 1);
    if (e.key === "ArrowRight") show(current + 1);
  });
  dialog.addEventListener("close", () => {
    stage.replaceChildren();               // ferma eventuali video
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  });
})();
