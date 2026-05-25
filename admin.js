const login = document.querySelector("[data-admin-login]");
const editor = document.querySelector("[data-admin-editor]");
const password = document.querySelector("[data-admin-password]");
const enter = document.querySelector("[data-admin-enter]");
const error = document.querySelector("[data-admin-error]");
const grid = document.querySelector("[data-admin-grid]");
const save = document.querySelector("[data-admin-save]");
const clear = document.querySelector("[data-admin-clear]");
const restoreDefault = document.querySelector("[data-admin-default]");
const saved = document.querySelector("[data-admin-saved]");

const scheduleKey = "anaCarolinaWeeklyAvailability_v2";
const adminPassword = "guarulhos";
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

const getDefaultAvailability = () =>
  days.reduce((availability, day) => {
    availability[day.id] = [...defaultSlots[day.id]];
    return availability;
  }, {});

const getAvailability = () => {
  try {
    return JSON.parse(localStorage.getItem(scheduleKey)) || getDefaultAvailability();
  } catch {
    return getDefaultAvailability();
  }
};

const renderGrid = () => {
  const availability = getAvailability();
  grid.innerHTML = days
    .map(
      (day) => `
        <div class="admin-day">
          <strong>${day.label}</strong>
          ${hours
            .map((hour) => {
              const checked = availability[day.id]?.includes(hour) ? "checked" : "";
              return `<label class="admin-slot"><input type="checkbox" data-day="${day.id}" value="${hour}" ${checked} />${hour}</label>`;
            })
            .join("")}
        </div>
      `,
    )
    .join("");
};

const collectAvailability = () =>
  days.reduce((availability, day) => {
    availability[day.id] = Array.from(grid.querySelectorAll(`input[data-day="${day.id}"]:checked`)).map(
      (input) => input.value,
    );
    return availability;
  }, {});

const enterAdmin = () => {
  if (password.value !== adminPassword) {
    error.hidden = false;
    return;
  }
  login.hidden = true;
  editor.hidden = false;
  renderGrid();
};

enter.addEventListener("click", enterAdmin);
password.addEventListener("keydown", (event) => {
  if (event.key === "Enter") enterAdmin();
});

save.addEventListener("click", () => {
  localStorage.setItem(scheduleKey, JSON.stringify(collectAvailability()));
  saved.hidden = false;
});

clear.addEventListener("click", () => {
  grid.querySelectorAll("input").forEach((input) => {
    input.checked = false;
  });
});

restoreDefault.addEventListener("click", () => {
  grid.querySelectorAll("input").forEach((input) => {
    input.checked = defaultSlots[input.dataset.day].includes(input.value);
  });
});
