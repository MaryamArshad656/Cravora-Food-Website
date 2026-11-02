// CRAVORA WEBSITE INTERACTIONS

// 1. LIGHT / DARK MODE
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-toggle-icon");

function applyTheme(theme) {
  const selectedTheme = theme === "dark" ? "dark" : "light";
  document.documentElement.dataset.theme = selectedTheme;

  if (themeToggle) {
    const isDark = selectedTheme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
    themeToggle.title = isDark ? "Switch to light mode" : "Switch to dark mode";
  }

  if (themeIcon) {
    themeIcon.textContent = selectedTheme === "dark" ? "☀" : "☾";
  }

  try {
    localStorage.setItem("cravora-theme", selectedTheme);
  } catch (error) {
    // The theme still works for this visit if browser storage is unavailable.
  }
}

let initialTheme = document.documentElement.dataset.theme || "light";
try {
  initialTheme = localStorage.getItem("cravora-theme") || initialTheme;
} catch (error) {
  // Keep the theme already applied in the HTML head.
}
applyTheme(initialTheme);

themeToggle?.addEventListener("click", () => {
  const currentTheme = document.documentElement.dataset.theme;
  applyTheme(currentTheme === "dark" ? "light" : "dark");
});

// 2. MOBILE NAVIGATION
const mobileMenuButton = document.getElementById("mobile-menu-button");
const mobileMenu = document.getElementById("navbar-sticky");

if (mobileMenuButton && mobileMenu) {
  mobileMenuButton.addEventListener("click", () => {
    const isExpanded = mobileMenuButton.getAttribute("aria-expanded") === "true";
    mobileMenu.classList.toggle("hidden", isExpanded);
    mobileMenuButton.setAttribute("aria-expanded", String(!isExpanded));
    mobileMenuButton.setAttribute("aria-label", isExpanded ? "Open navigation menu" : "Close navigation menu");
  });

  mobileMenu.querySelectorAll("a[href^='#']").forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.add("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "false");
      mobileMenuButton.setAttribute("aria-label", "Open navigation menu");
    });
  });

  window.addEventListener("resize", () => {
    if (window.innerWidth >= 768) {
      mobileMenu.classList.remove("hidden");
      mobileMenuButton.setAttribute("aria-expanded", "false");
    } else if (mobileMenuButton.getAttribute("aria-expanded") !== "true") {
      mobileMenu.classList.add("hidden");
    }
  });
}

// 3. NAVIGATION ACTIVE LINK
const navLinks = document.querySelectorAll(".nav-link");
const observedSections = Array.from(navLinks)
  .map((link) => document.querySelector(link.getAttribute("href")))
  .filter(Boolean);

if ("IntersectionObserver" in window && observedSections.length) {
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      navLinks.forEach((link) => {
        const isCurrent = link.getAttribute("href") === `#${entry.target.id}`;
        link.classList.toggle("active", isCurrent);
        if (isCurrent) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    });
  }, { rootMargin: "-30% 0px -60% 0px", threshold: 0 });

  observedSections.forEach((section) => sectionObserver.observe(section));
}

// 4. NEWSLETTER DEMO — preserves the original behaviour.
const newsletterForm = document.getElementById("cravora-newsletter-form");
const newsletterSuccess = document.getElementById("cravora-newsletter-success");

if (newsletterForm && newsletterSuccess) {
  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    if (newsletterForm.checkValidity()) {
      newsletterSuccess.classList.remove("hidden");
      newsletterForm.reset();
    } else {
      newsletterForm.reportValidity();
    }
  });
}
