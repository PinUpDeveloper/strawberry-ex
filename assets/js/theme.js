const themeBtn = document.getElementById("themeSwitch");

function updateTextColors() {
  const elements = document.querySelectorAll("p, h1, h2, h3, h4, h5, .nav-str");
  const elements2 = document.querySelectorAll(".why-box, .grid-why");
  const body3 = document.querySelector("body");
  // пробел после запятой лишний

  if (document.body.classList.contains("theme-night")) {
    elements.forEach((el) => (el.style.color = "white"));
    elements2.forEach((el) => (el.style.backgroundColor = "#222"));
    body3.style.background_color = "#333";
  } else {
    elements.forEach((el) => (el.style.color = "black")); // дневная тема
    elements2.forEach((el) => (el.style.backgroundColor = ""));
    body3.style.background_color = "#ff6f6f"; // можно сбросить цвет
  }
}

// Применяем сохранённую тему при загрузке страницы
const savedTheme = localStorage.getItem("theme");
if (savedTheme === "night") {
  document.body.classList.add("theme-night");
  if (themeBtn) themeBtn.textContent = "Switch to Day 🌞";
}
updateTextColors();

// Обработчик кнопки
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("theme-night");
  const isNight = document.body.classList.contains("theme-night");
  localStorage.setItem("theme", isNight ? "night" : "day");

  themeBtn.textContent = isNight ? "Switch to Day 🌞" : "Switch to Night 🌙";
  updateTextColors(); // обновляем цвет текста при переключении
});
