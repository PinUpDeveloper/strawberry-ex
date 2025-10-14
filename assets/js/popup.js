const popup = document.getElementById("popupForm");
const openBtn = document.getElementById("subscribeBtn");
const closeBtn = document.getElementById("closePopup");

openBtn.addEventListener("click", () => popup.classList.add("active"));
closeBtn.addEventListener("click", () => popup.classList.remove("active"));
popup.addEventListener("click", (e) => {
  if (e.target === popup) popup.classList.remove("active");
});
