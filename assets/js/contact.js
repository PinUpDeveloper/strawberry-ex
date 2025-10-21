const q = (s, c = document) => c.querySelector(s), qa = (s, c = document) => Array.from(c.querySelectorAll(s))

const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0"]
q("#bgBtn").addEventListener("click", () => { document.body.style.background = colors[Math.floor(Math.random() * colors.length)] })

const langMap = {
    en: { title: "Get in touch", subtitle: "Questions about order or partnership? Send us a message.", btnBg: "Change Background", btnSignup: "Create account", contactForm: "Contact form" },
    ru: { title: "Свяжитесь с нами", subtitle: "Есть вопросы по заказу или партнёрству? Напишите нам.", btnBg: "Сменить фон", btnSignup: "Создать аккаунт", contactForm: "Контактная форма" },
    kz: { title: "Байланыс", subtitle: "Тапсырыс не серіктестік туралы сұрақтарыңыз бар ма? Жазыңыз.", btnBg: "Фонды ауыстыру", btnSignup: "Аккаунт құру", contactForm: "Байланыс формасы" }
}
q("#lang").addEventListener("change", e => {
    const t = e.target.value
    qa("[data-i18n]").forEach(el => { el.textContent = langMap[t][el.dataset.i18n] })
})

q("#readMoreBtn").addEventListener("click", () => {
    const b = q("#moreText")
    b.classList.toggle("d-none")
})

q("#themeToggle").addEventListener("click", e => {
    document.body.classList.toggle("dark")
    e.target.textContent = document.body.classList.contains("dark") ? "Day" : "Night"
})

q("#showTime").addEventListener("click", () => {
    q("#currentTime").textContent = new Date().toLocaleTimeString()
})

const toast = q("#toast")
const beep = () => { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(); const g = a.createGain(); o.frequency.value = 880; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(.2, a.currentTime + .01); o.start(); setTimeout(() => { g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .14); o.stop(a.currentTime + .16) }, 120) }

const stars = q("#stars"), ratingText = q("#ratingText")
let rating = 0
qa("span", stars).forEach(s => {
    s.addEventListener("click", () => {
        rating = +s.dataset.val
        qa("span", stars).forEach(x => x.classList.toggle("active", +x.dataset.val <= rating))
        ratingText.textContent = rating + "/5"
        beep()
    })
})

const form = q("#contactForm")
const fields = { name: q("#name"), email: q("#email"), phone: q("#phone"), topic: q("#topic"), message: q("#message") }
function mark(el, ok) { el.classList.toggle("is-invalid", !ok); return ok }
function emailOK(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
function phoneOK(v) { return /^\+?[0-9 ()-]{9,}$/.test(v) }
function validate() {
    const a = mark(fields.name, fields.name.value.trim().length > 1)
    const b = mark(fields.email, emailOK(fields.email.value.trim()))
    const c = mark(fields.phone, phoneOK(fields.phone.value.trim()))
    const d = mark(fields.topic, !!fields.topic.value)
    const e = mark(fields.message, fields.message.value.trim().length > 4)
    return a && b && c && d && e
}

form.addEventListener("submit", async e => {
    e.preventDefault()
    if (!validate()) return
    const payload = { name: fields.name.value, email: fields.email.value, phone: fields.phone.value, topic: fields.topic.value, message: fields.message.value, rating }
    try {
        await fetch("https://jsonplaceholder.typicode.com/posts", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) })
    } catch { }
    form.reset(); rating = 0; qa("span", stars).forEach(x => x.classList.remove("active")); ratingText.textContent = "0/5"
    toast.textContent = "Thanks! Your message has been sent."
    toast.classList.add("show"); beep()
    setTimeout(() => toast.classList.remove("show"), 2000)
})

q("#resetForm").addEventListener("click", () => {
    qa("input,textarea,select", form).forEach(i => { if (i.tagName === "SELECT") i.selectedIndex = 0; else i.value = "" })
})

const contacts = [{ title: "Phone", html: '<a href="tel:+77000000000">+7 (700) 000-00-00</a>' }, { title: "E-mail", html: '<a href="mailto:support@strawberry.express">support@strawberry.express</a>' }, { title: "Support hours", html: "Mon–Sun: 09:00–21:00" }]
const wrap = q("#contactsWrap")
contacts.forEach(c => {
    const col = document.createElement("div"); col.className = "col-md-4"
    const card = document.createElement("div"); card.className = "p-4 border rounded-4 bg-white h-100 text-center"
    const h = document.createElement("h6"); h.className = "mb-1"; h.textContent = c.title
    const p = document.createElement("div"); p.innerHTML = c.html
    card.append(h, p); col.append(card); wrap.append(col)
})

const menu = qa("#menu a")
let idx = 0
menu[idx].tabIndex = 0
document.addEventListener("keydown", e => {
    switch (e.key) {
        case "ArrowRight": idx = (idx + 1) % menu.length; menu[idx].focus(); beep(); break
        case "ArrowLeft": idx = (idx - 1 + menu.length) % menu.length; menu[idx].focus(); beep(); break
    }
})

const modal = q("#signupModal"), openBtn = q("#openSignup"), closeBtn = q("#closeSignup"), signupForm = q("#signupForm")
openBtn.addEventListener("click", () => { modal.classList.add("active") })
closeBtn.addEventListener("click", () => { modal.classList.remove("active") })
modal.addEventListener("click", e => { if (e.target === modal) modal.classList.remove("active") })
signupForm.addEventListener("submit", e => {
    e.preventDefault()
    const email = q("#sEmail"), pass = q("#sPass"), conf = q("#sConfirm")
    const ok = emailOK(email.value) && pass.value.length >= 8 && pass.value === conf.value
    if (!ok) { [email, pass, conf].forEach(el => el.classList.remove("is-invalid")); if (!emailOK(email.value)) email.classList.add("is-invalid"); if (pass.value.length < 8) pass.classList.add("is-invalid"); if (pass.value !== conf.value || !conf.value) conf.classList.add("is-invalid"); return }
    signupForm.reset(); q("#signupToast").classList.add("show"); beep(); setTimeout(() => q("#signupToast").classList.remove("show"), 1800); modal.classList.remove("active")
})
