$(document).ready(function() {

  // Task 1
  $("#searchInput").on("keyup", function() {
    const value = $(this).val().toLowerCase();
    $(".search-item").filter(function() {
      $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
    });
  });

  // Task 2
  const suggestions = ["Apple", "Banana", "Bread", "Milk", "Strawberry", "Carrot", "Orange", "Tomato"];
  $("#autocompleteInput").on("keyup", function() {
    const inputVal = $(this).val().toLowerCase();
    let matches = suggestions.filter(item => item.toLowerCase().includes(inputVal));
    $("#suggestionsList").empty();
    if (inputVal.length > 0) {
      matches.forEach(item => {
        $("#suggestionsList").append(`<li class="list-group-item suggestion-item">${item}</li>`);
      });
    }
  });

  $(document).on("click", ".suggestion-item", function() {
    $("#autocompleteInput").val($(this).text());
    $("#suggestionsList").empty();
  });

  // Task 3
  $("#highlightBtn").on("click", function() {
    const keyword = $("#highlightInput").val();
    if (!keyword) return;
    $(".faq-section, .blog-section, .news-section").each(function() {
      const html = $(this).html();
      const regex = new RegExp(`(${keyword})`, "gi");
      $(this).html(html.replace(regex, '<span class="highlight">$1</span>'));
    });
  });

  // Task 4
  $(window).on("scroll", function() {
    let scroll = $(window).scrollTop();
    let height = $(document).height() - $(window).height();
    let progress = (scroll / height) * 100;
    $("#scrollBar").css("width", progress + "%");
  });

  // Task 5
  $(".counter").each(function() {
    let $this = $(this),
      countTo = $this.attr("data-target");
    $({ countNum: 0 }).animate(
      { countNum: countTo },
      {
        duration: 2000,
        easing: "swing",
        step: function() {
          $this.text(Math.floor(this.countNum));
        },
        complete: function() {
          $this.text(this.countNum);
        }
      }
    );
  });

  // Task 6
  $("#fakeForm").on("submit", function(e) {
    e.preventDefault();
    const btn = $("#submitBtn");
    btn.prop("disabled", true).html('<span class="spinner-border spinner-border-sm"></span> Please wait…');
    setTimeout(() => {
      btn.prop("disabled", false).html("Submit");
      alert("Form submitted!");
    }, 2000);
  });

  // Task 7
  $("#showNotificationBtn").on("click", function() {
    const notif = $('<div class="notification success">📢 Notification shown successfully!</div>').appendTo("body");
    notif.fadeIn(300).delay(2000).fadeOut(600, function() {
      $(this).remove();
    });
  });

  // Task 8
  $("#copyBtn").on("click", function() {
    const text = $("#promoCode").text();
    navigator.clipboard.writeText(text);
    $(this).text("✔ Copied!").addClass("btn-success");
    setTimeout(() => {
      $(this).text("Copy").removeClass("btn-success");
    }, 1500);
  });

  // Task 9
  $(window).on("scroll", function() {
    $("img.lazy").each(function() {
      if ($(this).offset().top < $(window).scrollTop() + $(window).height()) {
        $(this).attr("src", $(this).data("src")).removeClass("lazy");
      }
    });
  });

});
