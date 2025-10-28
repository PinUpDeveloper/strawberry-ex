$(function () {
  const THEME_KEY = "se-theme";
  function applyTheme(t) { $("html").toggleClass("theme-dark", t === "dark"); $("#themeToggle").text(t === "dark" ? "Day" : "Night") }
  function getTheme() { return localStorage.getItem(THEME_KEY) || "light" }
  applyTheme(getTheme());
  $("#themeToggle").on("click", function () { const n = getTheme() === "dark" ? "light" : "dark"; localStorage.setItem(THEME_KEY, n); applyTheme(n) })

  $(".chip").on("click", function () { $(".chip").removeClass("active"); $(this).addClass("active") })

  $(".faq-q").each(function () {
    const q = $(this), a = q.next(".faq-a")
    q.on("click", function () { a.stop(true, true).slideToggle(180) })
  })

  $(".rating").each(function (i) {
    const box = $(this), name = box.data("name") || ("delivery-" + i), key = "se-rating:" + name, out = box.next(".rating-out")
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
