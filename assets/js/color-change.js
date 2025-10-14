const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0"];
document.getElementById("changeColorBtn").addEventListener("click", () => {
  const random = colors[Math.floor(Math.random() * colors.length)];
  document.body.style.background = random;
});
