(() => {
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".primary-nav");
  const serviceSelect = document.querySelector("#quote-service");
  const quoteForm = document.querySelector("#quote-form");
  const toast = document.querySelector("#toast");

  const closeMenu = () => {
    menuButton.setAttribute("aria-expanded", "false");
    nav.classList.remove("open");
    document.body.classList.remove("menu-open");
  };
  menuButton.addEventListener("click", () => {
    const open = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!open));
    nav.classList.toggle("open", !open);
    document.body.classList.toggle("menu-open", !open);
  });
  nav
    .querySelectorAll("a")
    .forEach((link) => link.addEventListener("click", closeMenu));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") closeMenu();
  });

  const updateHeader = () =>
    header.classList.toggle("scrolled", window.scrollY > 22);
  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 },
  );
  document
    .querySelectorAll(".reveal")
    .forEach((item) => observer.observe(item));

  const showToast = (message) => {
    toast.textContent = message;
    toast.classList.add("show");
    window.setTimeout(() => toast.classList.remove("show"), 2800);
  };

  document.querySelectorAll("[data-service]").forEach((button) => {
    button.addEventListener("click", () => {
      serviceSelect.value = button.dataset.service;
      document.querySelector("#quote").scrollIntoView({ behavior: "smooth" });
      showToast(`${button.dataset.service} selected`);
      window.setTimeout(
        () => serviceSelect.focus({ preventScroll: true }),
        650,
      );
    });
  });

  quoteForm.addEventListener("submit", (event) => {
    event.preventDefault();

    if (!quoteForm.reportValidity()) return;

    const name = document.querySelector("#quote-name").value.trim();
    const email = document.querySelector("#quote-email").value.trim();
    const phone =
      document.querySelector("#quote-phone").value.trim() || "Not provided";
    const date = document.querySelector("#quote-date").value || "Flexible";
    const service = serviceSelect.value;
    const bedrooms = document.querySelector("#quote-bedrooms").value;
    const bathrooms = document.querySelector("#quote-bathrooms").value;
    const details =
      document.querySelector("#quote-details").value.trim() ||
      "No additional details";

    const subject = `Cleaning quote request — ${service}`;
    const body = `Hello Glitters & Sparkles,

I would like a cleaning quote.

Name: ${name}
Email: ${email}
Phone: ${phone}
Service: ${service}
Preferred date: ${date}
Home: ${bedrooms}, ${bathrooms}

Additional details:
${details}

Thank you.`;

    showToast("Opening your email app…");

    window.location.href = `mailto:info@glittersandsparkles.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  document.querySelector("#year").textContent = new Date().getFullYear();
})();
