(function () {
  const header = document.getElementById("site-header");
  const toggle = document.querySelector(".nav-toggle");
  const backdrop = document.querySelector(".nav-backdrop");
  const navLinks = document.querySelectorAll('.primary-nav a[href^="#"]');
  const backToTop = document.querySelector(".back-to-top");
  const year = document.getElementById("year");
  const sections = [...document.querySelectorAll("main section[id], footer[id]")];
  const navByHref = new Map(
    [...navLinks].map((link) => [link.getAttribute("href"), link])
  );

  if (year) year.textContent = String(new Date().getFullYear());
  if (window.lucide) window.lucide.createIcons();

  const setMenu = (open) => {
    header.classList.toggle("is-open", open);
    document.body.classList.toggle("nav-open", open);
    toggle.setAttribute("aria-expanded", String(open));
    toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) backdrop.hidden = !open;
  };

  const setActive = (id) => {
    navLinks.forEach((link) => link.classList.remove("is-active"));
    const aliases = {
      values: "about",
      mission: "about",
      "why-choose-us": "about",
      credibility: "about",
      "focus-areas": "therapies",
      foundation: "therapies",
      csr: "therapies",
      leadership: "careers",
      commitment: "careers"
    };
    const match = navByHref.get(`#${id}`) || navByHref.get(`#${aliases[id] || ""}`);
    if (match) match.classList.add("is-active");
  };

  const onScroll = () => {
    const y = window.scrollY;
    header.classList.toggle("is-solid", y > 24);
    backToTop.classList.toggle("is-visible", y > 480);

    const offset = (document.querySelector(".site-chrome")?.offsetHeight || 96) + 12;
    let current = "home";
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top - offset <= 0) current = section.id;
    });
    setActive(current);
  };

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toggle.addEventListener("click", () => {
    setMenu(!header.classList.contains("is-open"));
  });

  if (backdrop) backdrop.addEventListener("click", () => setMenu(false));

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const typeTargets = [...document.querySelectorAll(".hero h1 .hl-type")];
  if (typeTargets.length) {
    const words = typeTargets.map((el) => el.querySelector(".hl-sizer")?.textContent || "");
    const typedEls = typeTargets.map((el) => el.querySelector(".hl-typed"));
    if (reduceMotion) {
      typedEls.forEach((el, i) => { if (el) el.textContent = words[i]; });
    } else {
      const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
      (async () => {
        for (let i = 0; i < typedEls.length; i += 1) {
          const el = typedEls[i];
          const word = words[i];
          if (!el || !word) continue;
          el.textContent = "";
          el.classList.add("is-caret");
          for (let n = 1; n <= word.length; n += 1) {
            el.textContent = word.slice(0, n);
            await wait(90);
          }
          el.classList.remove("is-caret");
          if (i < typedEls.length - 1) await wait(280);
        }
      })();
    }
  }

  if (!reduceMotion && "IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
  } else {
    document.querySelectorAll(".reveal").forEach((el) => el.classList.add("is-visible"));
  }

  const foundationFocus = document.querySelector(".foundation-focus");
  if (foundationFocus) {
    const cards = foundationFocus.querySelectorAll(".card");
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver((entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((card) => card.classList.add("is-visible"));
            obs.unobserve(entry.target);
          }
        });
      }, { threshold: 0.28, rootMargin: "0px 0px -48px 0px" }).observe(foundationFocus);
    } else {
      cards.forEach((card) => card.classList.add("is-visible"));
    }
  }

  const culture = document.querySelector(".culture-diagram");
  if (culture) {
    if (!reduceMotion && "IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          culture.classList.toggle("is-in", entry.isIntersecting);
        });
      }, { threshold: 0.28 }).observe(culture);
    } else {
      culture.classList.add("is-in");
    }
  }

  const focusCards = [...document.querySelectorAll(".focus-card")];
  const hoverFine = window.matchMedia("(hover: hover) and (pointer: fine)");
  const setFlipped = (card, open) => {
    card.classList.toggle("is-flipped", open);
    card.querySelector(".focus-flip-btn")?.setAttribute("aria-expanded", String(open));
  };

  focusCards.forEach((card) => {
    card.querySelector(".focus-flip-btn")?.addEventListener("click", () => {
      if (hoverFine.matches) return;
      setFlipped(card, !card.classList.contains("is-flipped"));
      focusCards.forEach((other) => {
        if (other !== card) setFlipped(other, false);
      });
    });
  });

  document.addEventListener("click", (event) => {
    if (hoverFine.matches || event.target.closest(".focus-card")) return;
    focusCards.forEach((card) => setFlipped(card, false));
  });

  const whyCards = [...document.querySelectorAll(".why-grid .card")];
  whyCards.forEach((card) => {
    card.addEventListener("click", () => {
      if (hoverFine.matches) return;
      const on = !card.classList.contains("is-lit");
      whyCards.forEach((other) => other.classList.toggle("is-lit", other === card && on));
    });
  });
  document.addEventListener("click", (event) => {
    if (hoverFine.matches || event.target.closest(".why-grid .card")) return;
    whyCards.forEach((card) => card.classList.remove("is-lit"));
  });

  const carousel = document.querySelector(".values-carousel");
  const ring = document.querySelector(".values-ring");
  if (carousel && ring) {
    const cards = [...ring.querySelectorAll(".card")];
    const n = cards.length;
    const cycle = 11000;
    let index = 0;
    let paused = false;
    let hovering = false;
    let inView = true;
    let last = 0;
    let tween = null;
    let swiping = false;
    let startX = 0;
    let didSwipe = false;

    const wrap = (o) => {
      o = ((o % n) + n) % n;
      if (o > n / 2) o -= n;
      return o;
    };

    const paint = () => {
      cards.forEach((card, i) => {
        const o = wrap(i - index);
        const abs = Math.abs(o);
        card.style.setProperty("--x", `${(o * 290).toFixed(1)}px`);
        card.style.setProperty("--z", `${(50 - abs * 100).toFixed(1)}px`);
        card.style.setProperty("--ry", `${(o * -32).toFixed(2)}deg`);
        card.style.setProperty("--s", (1 - abs * 0.1).toFixed(3));
        card.style.setProperty("--o", abs > 1.15 ? "0" : Math.max(0.42, 1 - abs * 0.38).toFixed(3));
        card.style.zIndex = String(Math.round((3 - abs) * 10));
        card.style.pointerEvents = abs > 1.2 ? "none" : "auto";
        card.classList.toggle("is-front", abs < 0.4);
      });
    };

    const snapTo = (to) => {
      let dest = to;
      const d = dest - index;
      if (d > n / 2) dest -= n;
      if (d < -n / 2) dest += n;
      tween = { from: index, to: dest, start: performance.now(), dur: 700 };
    };

    const snapBy = (dir) => snapTo(Math.round(index) + dir);

    const tick = (ts) => {
      if (!last) last = ts;
      const dt = Math.min(32, ts - last);
      last = ts;

      if (tween) {
        const t = Math.min(1, (ts - tween.start) / tween.dur);
        const e = 1 - (1 - t) ** 3;
        index = tween.from + (tween.to - tween.from) * e;
        if (t >= 1) {
          index = ((tween.to % n) + n) % n;
          tween = null;
          if (!hovering) paused = false;
        }
      } else if (!paused && !reduceMotion && !swiping && inView) {
        index = (index + (dt / cycle) * n) % n;
      }

      paint();
      requestAnimationFrame(tick);
    };

    carousel.addEventListener("mouseenter", () => {
      hovering = true;
      paused = true;
    });
    carousel.addEventListener("mouseleave", () => {
      hovering = false;
      if (!tween) paused = false;
    });

    carousel.querySelector(".values-nav-prev")?.addEventListener("click", () => snapBy(-1));
    carousel.querySelector(".values-nav-next")?.addEventListener("click", () => snapBy(1));

    cards.forEach((card, i) => {
      card.addEventListener("click", () => {
        if (didSwipe) return;
        const o = wrap(i - index);
        if (Math.abs(o) > 0.4) snapTo(index + o);
      });
    });

    carousel.addEventListener("touchstart", (event) => {
      startX = event.changedTouches[0].clientX;
      swiping = true;
      didSwipe = false;
    }, { passive: true });

    carousel.addEventListener("touchend", (event) => {
      const dx = event.changedTouches[0].clientX - startX;
      swiping = false;
      if (dx > 40) { didSwipe = true; snapBy(-1); }
      else if (dx < -40) { didSwipe = true; snapBy(1); }
    }, { passive: true });

    carousel.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") snapBy(-1);
      if (event.key === "ArrowRight") snapBy(1);
    });

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        inView = entries.some((entry) => entry.isIntersecting);
      }, { threshold: 0.2 }).observe(carousel);
    }

    carousel.tabIndex = 0;
    if (reduceMotion) paused = true;
    paint();
    requestAnimationFrame(tick);
  }

  const tiltNode = (el, max = 8) => {
    if (!el || !hoverFine.matches || reduceMotion) return;
    const target = el.querySelector("img") || el;
    const apply = (rx, ry) => {
      target.style.setProperty("--rx", rx);
      target.style.setProperty("--ry", ry);
    };
    el.addEventListener("mousemove", (event) => {
      const box = el.getBoundingClientRect();
      const x = (event.clientX - box.left) / box.width - 0.5;
      const y = (event.clientY - box.top) / box.height - 0.5;
      apply(`${(-y * max).toFixed(2)}deg`, `${(x * max * 2).toFixed(2)}deg`);
    });
    el.addEventListener("mouseleave", () => apply("0deg", "0deg"));
  };
  tiltNode(document.querySelector(".therapies-photo"), 9);

  const slides = [...document.querySelectorAll(".hero-photos img")];
  if (slides.length > 1 && !reduceMotion) {
    slides.forEach((img) => {
      const preload = new Image();
      preload.src = img.currentSrc || img.src;
    });
    let index = 0;
    setInterval(() => {
      slides[index].classList.remove("is-active");
      index = (index + 1) % slides.length;
      slides[index].classList.add("is-active");
    }, 2000);
  }
})();
