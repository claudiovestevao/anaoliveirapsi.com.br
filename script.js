const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const segmentCards = document.querySelectorAll(".segment-card");

const setHeaderState = () => {
  if (!header) return;
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

const closeMenu = () => {
  if (!nav || !menuToggle) return;
  nav.classList.remove("is-open");
  document.body.classList.remove("menu-open");
  menuToggle.setAttribute("aria-expanded", "false");
};

setHeaderState();
window.addEventListener("scroll", setHeaderState, { passive: true });

if (menuToggle && nav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = nav.classList.toggle("is-open");
    document.body.classList.toggle("menu-open", isOpen);
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  nav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMenu);
  });
}

segmentCards.forEach((card) => {
  const toggle = card.querySelector(".segment-toggle");
  const content = card.querySelector(".segment-content");

  if (!toggle || !content) return;

  toggle.addEventListener("click", () => {
    const isOpen = card.classList.contains("is-open");

    segmentCards.forEach((currentCard) => {
      currentCard.classList.remove("is-open");
      currentCard.querySelector(".segment-toggle")?.setAttribute("aria-expanded", "false");
      const currentContent = currentCard.querySelector(".segment-content");
      if (currentContent) currentContent.hidden = true;
    });

    if (!isOpen) {
      card.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      content.hidden = false;
    }
  });
});
