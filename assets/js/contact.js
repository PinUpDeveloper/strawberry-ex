$(function () {
    const THEME_KEY = "se-theme";
    function applyTheme(t) { $("html").toggleClass("theme-dark", t === "dark"); 
            $("p").toggleClass("theme-dark", t === "dark");
            $(".faq-q").toggleClass("theme-dark", t === "dark");
            $("span").toggleClass("theme-dark", t === "dark");
            $(".nav-link").toggleClass("theme-dark", t === "dark");
            $(".aldik").toggleClass("theme-dark", t === "dark");
            $(".aldikPencil").toggleClass("theme-dark", t === "dark");
        $("#themeToggle").text(t === "dark" ? "Day" : "Night") }
    function getTheme() { return localStorage.getItem(THEME_KEY) || "light" }
    applyTheme(getTheme());
    $("#themeToggle").on("click", function () { const n = getTheme() === "dark" ? "light" : "dark"; localStorage.setItem(THEME_KEY, n); applyTheme(n) })

    const colors = ["#ffeaea", "#ffd6d6", "#fff5f5", "#ffefef", "#fff0f0"]
    $("#bgBtn").on("click", function () { const c = colors[Math.floor(Math.random() * colors.length)]; $("body").css("background", c) })
    $("#timeBtn").on("click", function () { alert(new Date().toLocaleString()) })
    $("#moreBtn").on("click", function () { $("#more").stop(true, true).slideToggle(180) })

    function emailOk(v) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) }
    $("#contactForm").on("submit", function (e) {
        const n = $("#name").val().trim(), em = $("#email").val().trim(), tp = $("#topic").val()
        if (!n || !emailOk(em) || !tp) { e.preventDefault(); this.reportValidity?.(); return }
        e.preventDefault()
        $("#toastOk").fadeIn(160).delay(1600).fadeOut(200)
        this.reset()
    })

    $(".rating").each(function (i) {
        const box = $(this), name = box.data("name") || ("contact-" + i), key = "se-rating:" + name, out = box.next(".rating-out")
        const stars = box.find("button")
        function paint(n) { stars.each(function (idx) { $(this).toggleClass("active", idx < n) }); out.text((n || 0) + "/5") }
        let saved = parseInt(localStorage.getItem(key) || "0", 10); paint(saved)
        stars.each(function (idx) {
            $(this).on("mouseenter", function () { paint(idx + 1) })
                .on("mouseleave", function () { paint(saved) })
                .on("click", function () { saved = idx + 1; localStorage.setItem(key, String(saved)); paint(saved) })
        })
    })
})
