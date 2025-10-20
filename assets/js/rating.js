document.addEventListener("DOMContentLoaded", () => {
  const stars = document.querySelectorAll(".star");
  const ratingText = document.getElementById("ratingText");

  stars.forEach((star, index) => {
    star.addEventListener("click", () => {
      stars.forEach((s, i) => s.classList.toggle("active", i <= index));
      ratingText.textContent = `You rated: ${index + 1}/5`;
    });
  });
});
