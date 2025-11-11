fetch(
  "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
)
  .then((res) => res.text())
  .then((number) => {
    document.getElementById("randomNumber").textContent = number;
  })
  .catch((err) => console.error("Ошибка API:", err));

document.getElementById("newNumberBtn").addEventListener("click", () => {
  fetch(
    "https://www.random.org/integers/?num=1&min=1&max=100&col=1&base=10&format=plain&rnd=new"
  )
    .then((res) => res.text())
    .then((number) => {
      document.getElementById("randomNumber").textContent = number;
    });
});
