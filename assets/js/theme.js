const themeBtn = document.getElementById("themeSwitch");

const savedTheme = localStorage.getItem("theme");

if (savedTheme === "night") {
  document.body.classList.add("theme-night");
  if (themeBtn) themeBtn.textContent = "Switch to Day 🌞";
}

themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("theme-night");

  const isNight = document.body.classList.contains("theme-night");
  localStorage.setItem("theme", isNight ? "night" : "day");

  themeBtn.textContent = isNight
    ? "Switch to Day 🌞"
    : "Switch to Night 🌙";
});
