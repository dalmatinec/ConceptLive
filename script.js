/* =========================================================
   APEX — shared front-end behaviour
   ========================================================= */

document.addEventListener("DOMContentLoaded", () => {
  initRevealOnScroll();
  initHeroRotator();
  initNavToggle();
  initSchedulePage();
  initSearchPage();
  initWatchPage();
});

/* ---------- Reveal on scroll ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!items.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => io.observe(el));
}

/* ---------- Dynamic rotating hero ---------- */
function initHeroRotator() {
  const slides = document.querySelectorAll(".hero-slide");
  const dots = document.querySelectorAll(".hero-dots button");
  if (!slides.length) return;

  let index = 0;
  let timer;

  function show(i) {
    slides.forEach((s) => s.classList.remove("active"));
    dots.forEach((d) => d.classList.remove("active"));
    slides[i].classList.add("active");
    if (dots[i]) dots[i].classList.add("active");
    index = i;
  }

  function next() {
    show((index + 1) % slides.length);
  }

  function restart() {
    clearInterval(timer);
    timer = setInterval(next, 7000);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener("click", () => {
      show(i);
      restart();
    });
  });

  show(0);
  restart();
}

/* ---------- Mobile nav toggle (simple slide panel) ---------- */
function initNavToggle() {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (!toggle || !links) return;

  toggle.addEventListener("click", () => {
    const open = links.classList.toggle("mobile-open");
    if (open) {
      links.style.cssText =
        "display:flex;flex-direction:column;position:fixed;top:var(--nav-h);left:16px;right:16px;background:rgba(16,19,25,0.96);backdrop-filter:blur(20px);border:1px solid var(--glass-border);border-radius:16px;padding:10px;gap:2px;z-index:150;";
    } else {
      links.style.cssText = "";
    }
  });
}

/* ---------- Schedule page: day tabs + sport/tournament filters ---------- */
function initSchedulePage() {
  const tabs = document.querySelectorAll("[data-day-tab]");
  const panels = document.querySelectorAll("[data-day-panel]");
  if (tabs.length) {
    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");
        const target = tab.dataset.dayTab;
        panels.forEach((p) => {
          p.style.display = p.dataset.dayPanel === target ? "grid" : "none";
        });
      });
    });
  }

  const sportChips = document.querySelectorAll("[data-sport-filter]");
  const cards = document.querySelectorAll("[data-sport]");
  if (sportChips.length) {
    sportChips.forEach((chip) => {
      chip.addEventListener("click", () => {
        sportChips.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const val = chip.dataset.sportFilter;
        cards.forEach((card) => {
          const match = val === "all" || card.dataset.sport === val;
          card.style.display = match ? "flex" : "none";
        });
      });
    });
  }
}

/* ---------- Search page ---------- */
function initSearchPage() {
  const input = document.querySelector("[data-search-input]");
  const groups = document.querySelectorAll("[data-result-group]");
  const items = document.querySelectorAll("[data-search-item]");
  const kindTabs = document.querySelectorAll("[data-kind-tab]");
  if (!input) return;

  function filter() {
    const q = input.value.trim().toLowerCase();
    let anyVisible = {};

    items.forEach((item) => {
      const text = item.dataset.searchItem.toLowerCase();
      const matches = q === "" || text.includes(q);
      item.style.display = matches ? "flex" : "none";
      if (matches) anyVisible[item.closest("[data-result-group]").dataset.resultGroup] = true;
    });

    groups.forEach((g) => {
      g.style.display = anyVisible[g.dataset.resultGroup] ? "block" : "none";
    });
  }

  input.addEventListener("input", filter);

  kindTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      kindTabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      const kind = tab.dataset.kindTab;
      groups.forEach((g) => {
        const show = kind === "all" || g.dataset.resultGroup === kind;
        g.style.display = show ? "block" : "none";
      });
    });
  });
}

/* ---------- Watch page: intro loader + custom controls ---------- */
function initWatchPage() {
  const overlay = document.querySelector("[data-intro-overlay]");
  if (overlay) {
    setTimeout(() => overlay.classList.add("hide"), 2100);
  }

  const shell = document.querySelector("[data-player-shell]");
  const fsBtn = document.querySelector("[data-action='fullscreen']");
  const pipNote = document.querySelector("[data-action='pip']");
  const theaterBtn = document.querySelector("[data-action='theater']");
  const shareBtn = document.querySelector("[data-action='share']");

  if (fsBtn && shell) {
    fsBtn.addEventListener("click", () => {
      if (shell.requestFullscreen) shell.requestFullscreen();
    });
  }

  if (theaterBtn && shell) {
    theaterBtn.addEventListener("click", () => {
      shell.classList.toggle("theater-mode");
      document.querySelector(".watch-layout")?.classList.toggle("theater");
    });
  }

  if (shareBtn) {
    shareBtn.addEventListener("click", () => {
      shareBtn.querySelector("[data-share-label]").textContent = "Ссылка скопирована";
      navigator.clipboard?.writeText(window.location.href).catch(() => {});
      setTimeout(() => {
        shareBtn.querySelector("[data-share-label]").textContent = "Поделиться";
      }, 1800);
    });
  }

  if (pipNote) {
    pipNote.addEventListener("click", () => {
      pipNote.title = "Picture-in-Picture доступен в полноэкранном плеере";
    });
  }
}
