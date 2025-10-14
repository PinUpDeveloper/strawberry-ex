const bgBtn = document.getElementById("bgBtn");
const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0"];
bgBtn.addEventListener("click", () => { document.body.style.background = colors[Math.floor(Math.random() * colors.length)] });

const contactForm = document.getElementById("contactForm");
const nameEl = document.getElementById("name");
const emailEl = document.getElementById("email");
const phoneEl = document.getElementById("phone");
const topicEl = document.getElementById("topic");
const msgEl = document.getElementById("message");
const toast = document.getElementById("toast");

function showToast(t) {
    toast.textContent = t;
    toast.classList.add("show");
    setTimeout(() => toast.classList.remove("show"), 2000);
}

function mark(el, ok) {
    el.classList.toggle("is-invalid", !ok);
    return ok;
}

function validateEmail(v) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
}
function validatePhone(v) {
    return /^\+?[0-9 ()-]{9,}$/.test(v);
}

function validateContact() {
    const v1 = mark(nameEl, nameEl.value.trim().length > 1);
    const v2 = mark(emailEl, validateEmail(emailEl.value.trim()));
    const v3 = mark(phoneEl, validatePhone(phoneEl.value.trim()));
    const v4 = mark(topicEl, !!topicEl.value);
    const v5 = mark(msgEl, msgEl.value.trim().length > 4);
    return v1 && v2 && v3 && v4 && v5;
}

contactForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateContact()) { return }
    contactForm.reset();
    showToast("Thanks! Your message has been sent.");
});

const modal = document.getElementById("signupModal");
const openSignup = document.getElementById("openSignup");
const closeSignup = document.getElementById("closeSignup");
const signupForm = document.getElementById("signupForm");
const sEmail = document.getElementById("sEmail");
const sPass = document.getElementById("sPass");
const sConfirm = document.getElementById("sConfirm");
const signupToast = document.getElementById("signupToast");

openSignup.addEventListener("click", () => modal.classList.add("active"));
closeSignup.addEventListener("click", () => modal.classList.remove("active"));
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("active") });
document.addEventListener("keydown", e => { if (e.key === "Escape") modal.classList.remove("active") });

function validateSignup() {
    const ok1 = mark(sEmail, /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(sEmail.value.trim()));
    const ok2 = mark(sPass, (sPass.value || "").length >= 8);
    const ok3 = mark(sConfirm, sPass.value === sConfirm.value && sConfirm.value !== "");
    return ok1 && ok2 && ok3;
}

signupForm.addEventListener("submit", e => {
    e.preventDefault();
    if (!validateSignup()) { return }
    signupForm.reset();
    signupToast.classList.add("show");
    setTimeout(() => signupToast.classList.remove("show"), 2000);
    modal.classList.remove("active");
});
