// Navbar scroll
const navbar = document.getElementById("navbar");
window.addEventListener("scroll", () => {
  navbar.classList.toggle("scrolled", window.scrollY > 40);
});

// Mobile menu
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");

menuToggle.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden");
});

mobileMenu.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => mobileMenu.classList.add("hidden"));
});

// Scroll reveal with stagger
const revealTargets = document.querySelectorAll(
  ".timeline-card, .skill-card, .project-card, .about-grid, .contact-container"
);

revealTargets.forEach((el) => el.classList.add("reveal"));

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
);

// Stagger cards in each grid so they don't all pop in at once
document.querySelectorAll(".skills-grid, .projects-grid").forEach((grid) => {
  [...grid.children].forEach((card, i) => {
    card.style.transitionDelay = `${i * 80}ms`;
  });
});

document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

// Version toggle (Virtual Piano)
document.querySelectorAll(".version-toggle").forEach((toggle) => {
  toggle.addEventListener("click", (e) => {
    const btn = e.target.closest(".version-btn");
    if (!btn || btn.classList.contains("active")) return;
    const card = toggle.closest(".project-card");
    const v = btn.dataset.v;
    toggle.querySelectorAll(".version-btn").forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    card.querySelectorAll(".version-content").forEach((c) => c.classList.remove("active"));
    card.querySelector(`.version-content[data-v="${v}"]`).classList.add("active");
    card.querySelectorAll(".project-links a[data-v]").forEach((a) => {
      a.hidden = a.dataset.v !== v;
    });
  });
});

// Fetch last-updated dates from GitHub
fetch("https://api.github.com/users/anthonyn5600/repos?per_page=100")
  .then((res) => res.json())
  .then((repos) => {
    const map = {};
    repos.forEach((r) => (map[r.name] = r.pushed_at));
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

    // Populate date text
    document.querySelectorAll("[data-repo]").forEach((el) => {
      const ts = map[el.dataset.repo];
      if (!ts) return;
      const d = new Date(ts);
      const dateEl = el.querySelector(".project-date");
      if (dateEl) dateEl.textContent = `Updated ${months[d.getMonth()]} ${d.getFullYear()}`;
    });

    // Sort cards by most recently updated
    const grid = document.querySelector(".projects-grid");
    const cards = [...grid.querySelectorAll(".project-card")];

    const getLatest = (card) => {
      if (card.dataset.repo) return map[card.dataset.repo] || "";
      let latest = "";
      card.querySelectorAll("[data-repo]").forEach((el) => {
        const d = map[el.dataset.repo];
        if (d && d > latest) latest = d;
      });
      return latest;
    };

    cards.sort((a, b) => (getLatest(b) > getLatest(a) ? 1 : -1));
    cards.forEach((card) => grid.appendChild(card));

    // Re-apply stagger delays after reorder
    cards.forEach((card, i) => {
      card.style.transitionDelay = `${i * 80}ms`;
    });

    // Highlight recently updated (within last 12 months)
    const cutoff = new Date();
    cutoff.setFullYear(cutoff.getFullYear() - 1);
    cards.forEach((card) => {
      const ts = getLatest(card);
      if (ts && new Date(ts) > cutoff) card.classList.add("recently-updated");
    });
  })
  .catch(() => {});

// Active nav highlight
const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".nav-links a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach((section) => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute("id");
    }
  });
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});
