const accordions = document.querySelectorAll(".accordion-button");
accordions.forEach(btn => {
  btn.addEventListener("click", () => {
    btn.classList.toggle("active");
    const body = btn.parentElement.nextElementSibling;
    body.style.display = body.style.display === "block" ? "none" : "block";
  });
});
