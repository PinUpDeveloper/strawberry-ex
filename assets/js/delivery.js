const bgBtn = document.getElementById("bgBtn");
const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0"];
bgBtn.addEventListener("click", () => { document.body.style.background = colors[Math.floor(Math.random() * colors.length)] });

document.querySelectorAll(".chip").forEach(ch => {
    ch.addEventListener("click", () => {
        document.querySelectorAll(".chip").forEach(x => x.classList.remove("active"));
        ch.classList.add("active");
    });
});

const faq = document.getElementById("faq");
faq.querySelectorAll(".faq-item").forEach(item => {
    const header = item.querySelector(".faq-header");
    const content = item.querySelector(".faq-content");
    const inner = item.querySelector(".inner");
    header.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open");
        content.style.maxHeight = isOpen ? (inner.scrollHeight + 16) + "px" : "0px";
    });
});
