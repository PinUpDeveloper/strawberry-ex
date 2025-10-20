const themeBtn = document.getElementById("themeSwitch");
themeBtn?.addEventListener("click", () => {
  document.body.classList.toggle("theme-night");
  themeBtn.textContent = document.body.classList.contains("theme-night")
    ? "Switch to Day 🌞"
    : "Switch to Night 🌙";
});
