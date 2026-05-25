const header = document.querySelector("[data-header]");
const nav = document.querySelector("[data-nav]");
const menuToggle = document.querySelector("[data-menu-toggle]");
const faqItems = document.querySelectorAll(".faq-item");
const scheduleGrid = document.querySelector("[data-schedule-grid]");

const whatsappNumber = "5511943333199";
const scheduleKey = "anaCarolinaWeeklyAvailability_v2";
const days = [
  { id: "seg", label: "Segunda" },
  { id: "ter", label: "Terça" },
  { id: "qua", label: "Quarta" },
  { id: "qui", label: "Quinta" },
  { id: "sex", label: "Sexta" },
];
const hours = Array.from({ length: 14 }, (_, index) => `${String(index + 8).padStart(2, "0")}:00`);
const defaultSlots = {
  seg: ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
  ter: ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
  qua: ["16:00", "17:00", "18:00", "19:00", "20:00", "21:00"],
  qui: ["08:00", "09:00", "10:00", "11:00"],
  sex: ["08:00", "09:00", "10:00", "11:00"],
};

const createDefaultAvailability = () =>
  days.reduce((availability, day) => {
    availability[day.id] = [...defaultSlots[day.id]];
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

const createWhatsAppLink = (dayLabel, hour) => {
  const text = `Olá, Dra. Ana Carolina. Gostaria de solicitar um agendamento para ${dayLabel}, às ${hour} (horário de Brasília).`;
  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
};

const renderSchedule = () => {
  if (!scheduleGrid) return;

  const availability = getAvailability();
  const hasAnySlot = days.some((day) => (availability[day.id] || []).length > 0);

  if (!hasAnySlot) {
    scheduleGrid.innerHTML =
      '<p class="schedule-empty">Nenhum horário disponível nesta semana. Fale pelo WhatsApp para consultar encaixes.</p>';
    return;
  }

  scheduleGrid.innerHTML = days
    .map((day) => {
      const slots = availability[day.id] || [];
      const selectId = `schedule-${day.id}`;

      return `
        <div class="schedule-day">
          <div class="schedule-day-title">${day.label}</div>
          ${
            slots.length
              ? `
                <label class="schedule-select-label" for="${selectId}">Horário</label>
                <select class="schedule-select" id="${selectId}" data-schedule-select data-day-label="${day.label}">
                  ${slots.map((hour) => `<option value="${hour}">${hour}</option>`).join("")}
                </select>
                <a class="slot-button" href="${createWhatsAppLink(day.label, slots[0])}" target="_blank" rel="noreferrer" data-schedule-link aria-label="Solicitar agendamento para ${day.label}, às ${slots[0]}, pelo WhatsApp">Solicitar horário</a>
              `
              : '<span class="slot-unavailable">Sem horários</span>'
          }
        </div>
      `;
    })
    .join("");

  scheduleGrid.querySelectorAll("[data-schedule-select]").forEach((select) => {
    select.addEventListener("change", () => {
      const dayLabel = select.dataset.dayLabel;
      const link = select.closest(".schedule-day").querySelector("[data-schedule-link]");
      link.href = createWhatsAppLink(dayLabel, select.value);
      link.setAttribute("aria-label", `Solicitar agendamento para ${dayLabel}, às ${select.value}, pelo WhatsApp`);
    });
  });
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
