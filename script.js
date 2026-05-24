const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const faqItems = document.querySelectorAll(".faq-item");
const scheduleGrid = document.querySelector("[data-schedule-grid]");
const scheduleEmpty = document.querySelector("[data-schedule-empty]");
const adminModal = document.querySelector("[data-admin-modal]");
const adminOpen = document.querySelector("[data-admin-open]");
const adminClose = document.querySelector("[data-admin-close]");
const adminLogin = document.querySelector("[data-admin-login]");
const adminEditor = document.querySelector("[data-admin-editor]");
const adminPassword = document.querySelector("[data-admin-password]");
const adminEnter = document.querySelector("[data-admin-enter]");
const adminError = document.querySelector("[data-admin-error]");
const adminGrid = document.querySelector("[data-admin-grid]");
const adminSave = document.querySelector("[data-admin-save]");
const adminClear = document.querySelector("[data-admin-clear]");
const adminWeekdays = document.querySelector("[data-admin-weekdays]");
const adminSaved = document.querySelector("[data-admin-saved]");

const whatsappNumber = "5511943333199";
const scheduleKey = "anaCarolinaWeeklyAvailability";
const adminPasswordValue = "guarulhos";
const days = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
  { id: "sab", label: "Sábado" },
  { id: "dom", label: "Domingo" },
];
const hours = Array.from({ length: 13 }, (_, index) => `${String(index + 8).padStart(2, "0")}:00`);

const createDefaultAvailability = () =>
  days.reduce((availability, day) => {
    availability[day.id] = ["seg", "ter", "qua", "qui", "sex"].includes(day.id) ? [...hours] : [];
    return availability;
  }, {});

const getAvailability = () => {
  const fallback = createDefaultAvailability();

  try {
    const stored = JSON.parse(localStorage.getItem(scheduleKey));
    if (!stored || typeof stored !== "object") return fallback;

    return days.reduce((availability, day) => {
      availability[day.id] = Array.isArray(stored[day.id])
        ? stored[day.id].filter((hour) => hours.includes(hour))
        : fallback[day.id];
      return availability;
    }, {});
  } catch {
    return fallback;
  }
};

const saveAvailability = (availability) => {
  localStorage.setItem(scheduleKey, JSON.stringify(availability));
};

const createWhatsAppLink = (dayLabel, hour) => {
  const text = `Olá, Dra. Ana Carolina. Gostaria de solicitar um agendamento para ${dayLabel}, às ${hour}.`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
};

const renderSchedule = () => {
  if (!scheduleGrid) return;

  const availability = getAvailability();
  let hasSlots = false;

  scheduleGrid.innerHTML = days
    .map((day) => {
      const slots = availability[day.id] || [];
      if (slots.length > 0) hasSlots = true;

      return `
        <div class="schedule-day">
          <div class="schedule-day-title">${day.label}</div>
          ${
            slots.length
              ? slots
                  .map(
                    (hour) =>
                      `<a class="slot-button" href="${createWhatsAppLink(day.label, hour)}" target="_blank" rel="noreferrer" aria-label="Solicitar agendamento para ${day.label}, às ${hour}, pelo WhatsApp">${hour}</a>`,
                  )
                  .join("")
              : '<span class="slot-unavailable">Sem horários</span>'
          }
        </div>
      `;
    })
    .join("");

  scheduleEmpty.hidden = hasSlots;
};

const renderAdminGrid = () => {
  if (!adminGrid) return;

  const availability = getAvailability();
  adminGrid.innerHTML = days
    .map(
      (day) => `
        <div class="admin-day">
          <strong>${day.label}</strong>
          ${hours
            .map((hour) => {
              const checked = availability[day.id]?.includes(hour) ? "checked" : "";
              return `
                <label class="admin-slot">
                  <input type="checkbox" data-day="${day.id}" value="${hour}" ${checked} />
                  ${hour}
                </label>
              `;
            })
            .join("")}
        </div>
      `,
    )
    .join("");
};

const collectAdminAvailability = () =>
  days.reduce((availability, day) => {
    availability[day.id] = Array.from(adminGrid.querySelectorAll(`input[data-day="${day.id}"]:checked`)).map(
      (input) => input.value,
    );
    return availability;
  }, {});

const openAdmin = () => {
  adminModal.hidden = false;
  document.body.classList.add("menu-open");
  adminLogin.hidden = false;
  adminEditor.hidden = true;
  adminError.hidden = true;
  adminSaved.hidden = true;
  adminPassword.value = "";
  window.setTimeout(() => adminPassword.focus(), 50);
};

const closeAdmin = () => {
  adminModal.hidden = true;
  document.body.classList.remove("menu-open");
};

const enterAdmin = () => {
  if (adminPassword.value !== adminPasswordValue) {
    adminError.hidden = false;
    return;
  }

  adminLogin.hidden = true;
  adminEditor.hidden = false;
  adminError.hidden = true;
  renderAdminGrid();
};

const setHeaderState = () => {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
};

setHeaderState();
renderSchedule();
window.addEventListener("scroll", setHeaderState, { passive: true });

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("is-open");
  document.body.classList.toggle("menu-open", isOpen);
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    document.body.classList.remove("menu-open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

faqItems.forEach((item, index) => {
  const question = item.querySelector(".faq-question");
  const answer = item.querySelector(".faq-answer");
  const answerId = `faq-answer-${index + 1}`;

  answer.id = answerId;
  question.setAttribute("aria-controls", answerId);

  question.addEventListener("click", () => {
    const isOpen = item.classList.contains("is-open");

    faqItems.forEach((currentItem) => {
      currentItem.classList.remove("is-open");
      currentItem.querySelector(".faq-question").setAttribute("aria-expanded", "false");
      currentItem.querySelector(".faq-answer").hidden = true;
    });

    if (!isOpen) {
      item.classList.add("is-open");
      question.setAttribute("aria-expanded", "true");
      answer.hidden = false;
    }
  });
});

adminOpen.addEventListener("click", openAdmin);
adminClose.addEventListener("click", closeAdmin);
adminEnter.addEventListener("click", enterAdmin);
adminPassword.addEventListener("keydown", (event) => {
  if (event.key === "Enter") enterAdmin();
});

adminModal.addEventListener("click", (event) => {
  if (event.target === adminModal) closeAdmin();
});

adminSave.addEventListener("click", () => {
  saveAvailability(collectAdminAvailability());
  renderSchedule();
  adminSaved.hidden = false;
});

adminClear.addEventListener("click", () => {
  adminGrid.querySelectorAll("input").forEach((input) => {
    input.checked = false;
  });
});

adminWeekdays.addEventListener("click", () => {
  adminGrid.querySelectorAll("input").forEach((input) => {
    input.checked = ["seg", "ter", "qua", "qui", "sex"].includes(input.dataset.day);
  });
});
