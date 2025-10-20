document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("readMoreBtn");
  const text = document.getElementById("moreText");

  if (btn && text) {
    btn.addEventListener("click", () => {
      const isVisible = text.style.display === "block";
      text.style.display = isVisible ? "none" : "block";
      btn.textContent = isVisible ? "Read More" : "Show Less";
    });
  }
});
