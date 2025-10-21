const q = (s, c = document) => c.querySelector(s), qa = (s, c = document) => Array.from(c.querySelectorAll(s))

const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0"]
q("#bgBtn").addEventListener("click", () => { document.body.style.background = colors[Math.floor(Math.random() * colors.length)] })

q("#themeToggle").addEventListener("click", e => {
    document.body.classList.toggle("dark")
    e.target.textContent = document.body.classList.contains("dark") ? "Day" : "Night"
})

function greetingByTime() {
    const h = new Date().getHours()
    let text = ""
    switch (true) {
        case h < 12: text = "Good morning! Same-day delivery is available."; break
        case h < 18: text = "Good afternoon! Place orders before 18:00 for today."; break
        default: text = "Good evening! Orders after 18:00 go to next day."
    }
    q("#greeting").textContent = text
}
greetingByTime()

const zones = [
    { title: "Zone A — city center", time: "1–2 hours", price: "free from 8,000 ₸, otherwise 900 ₸" },
    { title: "Zone B — residential areas", time: "2–3 hours", price: "free from 12,000 ₸, otherwise 1,200 ₸" },
    { title: "Zone C — suburbs", time: "3–5 hours", price: "1,800 ₸ (fixed)" }
]
const row = q("#zonesRow")
zones.forEach(z => {
    const col = document.createElement("div"); col.className = "col-md-4"
    const card = document.createElement("div"); card.className = "card zone h-100"
    const body = document.createElement("div"); body.className = "card-body"
    const h = document.createElement("h5"); h.className = "card-title"; h.textContent = z.title
    const p1 = document.createElement("div"); p1.textContent = "Time: " + z.time
    const p2 = document.createElement("div"); p2.textContent = "Price: " + z.price
    body.append(h, p1, p2); card.append(body); col.append(card); row.append(col)
})

const beep = () => { const a = new (window.AudioContext || window.webkitAudioContext)(); const o = a.createOscillator(); const g = a.createGain(); o.frequency.value = 660; o.connect(g); g.connect(a.destination); g.gain.setValueAtTime(.0001, a.currentTime); g.gain.exponentialRampToValueAtTime(.2, a.currentTime + .01); o.start(); setTimeout(() => { g.gain.exponentialRampToValueAtTime(.0001, a.currentTime + .14); o.stop(a.currentTime + .16) }, 120) }

const chips = qa("#slots .chip"), slotText = q("#slotText")
chips.forEach((c, i) => c.addEventListener("click", () => {
    chips.forEach(x => x.classList.remove("active")); c.classList.add("active")
    slotText.textContent = "Selected slot: " + c.textContent
    beep()
}))
let idx = 0
document.addEventListener("keydown", e => {
    const active = document.activeElement
    if (["INPUT", "TEXTAREA", "SELECT"].includes(active.tagName)) return
    if (e.key === "ArrowRight") { idx = (idx + 1) % chips.length; chips[idx].focus(); beep() }
    if (e.key === "ArrowLeft") { idx = (idx - 1 + chips.length) % chips.length; chips[idx].focus(); beep() }
})

const faq = q("#faq")
faq.querySelectorAll(".faq-item").forEach(item => {
    const header = item.querySelector(".faq-header")
    const content = item.querySelector(".faq-content")
    const inner = item.querySelector(".inner")
    header.addEventListener("click", () => {
        const isOpen = item.classList.toggle("open")
        content.style.maxHeight = isOpen ? (inner.scrollHeight + 16) + "px" : "0px"
        beep()
    })
})

const moreTips = ["Fragile products are packed separately.", "Pickup is available 10:00–20:00 (0 ₸).", "Payment: cash, card, Kaspi.", "Courier calls 10–15 minutes before arrival."]
q("#loadTips").addEventListener("click", async () => {
    const list = q("#tipsList")
    const data = moreTips.filter((_, i) => !list.children[i]).map(t => ({ text: t }))
    await new Promise(r => setTimeout(r, 400))
    data.forEach(d => {
        const li = document.createElement("li"); li.textContent = d.text; list.append(li)
    })
    beep()
})

const stars = q("#rateCourier"), rateText = q("#rateText")
let rate = 0
qa("span", stars).forEach(s => {
    s.addEventListener("click", () => {
        rate = +s.dataset.val
        qa("span", stars).forEach(x => x.classList.toggle("active", +x.dataset.val <= rate))
        rateText.textContent = rate + "/5"
        beep()
    })
})
