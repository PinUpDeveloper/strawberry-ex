$(document).ready(function () {
  // === Элементы ===
  const loginPopup = $("#login-popup");
  const signupPopup = $("#signup-popup");
  const profilePopup = $("#profile-popup");
  const loginContainer = $("#login-container");
  const userContainer = $("#user-container");
  const userNick = $("#user-nick");
  const logoutBtn = $("#logout-btn");

  let hideTimeout;

  // === Hover для показа Logout ===
  $("#user-btn").on("mouseenter", function () {
    clearTimeout(hideTimeout);
    logoutBtn.fadeIn(150);
  });

  userContainer.on("mouseleave", function () {
    hideTimeout = setTimeout(() => {
      logoutBtn.fadeOut(300);
    }, 1000);
  });

  // === Получение всех пользователей ===
  function getAllUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  // === Сохранение пользователя ===
  function saveUser(email, nickname, password) {
    const users = getAllUsers();
    users.push({ email, nickname, password });
    localStorage.setItem("users", JSON.stringify(users));
  }

  // === Поиск пользователя по email ===
  function findUserByEmail(email) {
    const users = getAllUsers();
    return users.find((u) => u.email === email);
  }

  // === Показать сообщение ===
  function showMessage(elementId, message, type) {
    const el = $(elementId);
    el.removeClass("error-message success-message");
    el.addClass(type === "error" ? "error-message" : "success-message");
    el.text(message).fadeIn(200);
    setTimeout(() => el.fadeOut(200), 3000);
  }

  // === Обновление статуса ===
  function updateLoginStatus() {
    const currentUser = localStorage.getItem("currentUser");
    if (currentUser) {
      const user = JSON.parse(currentUser);
      userNick.text(user.nickname);
      loginContainer.hide();
      userContainer.show();
    } else {
      userContainer.hide();
      loginContainer.show();
    }
  }

  // === Проверка при загрузке ===
  updateLoginStatus();

  // === Открытие Login Popup ===
  $(document).on("click", "#login-btn", function () {
    loginPopup.fadeIn(200);
    $("#auth-message").hide();
  });

  // === Переключение на Sign Up ===
  $(document).on("click", "#switch-to-signup", function (e) {
    e.preventDefault();
    loginPopup.fadeOut(200, function () {
      signupPopup.fadeIn(200);
    });
    $("#signup-message").hide();
  });

  // === Переключение на Login ===
  $(document).on("click", "#switch-to-login", function (e) {
    e.preventDefault();
    signupPopup.fadeOut(200, function () {
      loginPopup.fadeIn(200);
    });
    $("#auth-message").hide();
  });

  // === Регистрация ===
  $(document).on("submit", "#signup-form", function (e) {
    e.preventDefault();

    const email = $("#signup-email").val().trim();
    const nickname = $("#signup-nickname").val().trim();
    const password = $("#signup-password").val().trim();

    // Валидация
    if (nickname.length < 3) {
      showMessage(
        "#signup-message",
        "Nickname must be at least 3 characters.",
        "error"
      );
      return;
    }
    if (password.length < 6) {
      showMessage(
        "#signup-message",
        "Password must be at least 6 characters.",
        "error"
      );
      return;
    }

    // Проверка существующего аккаунта
    if (findUserByEmail(email)) {
      showMessage(
        "#signup-message",
        "Such an account already exists, log in to it.",
        "error"
      );
      return;
    }

    // Сохранение пользователя
    saveUser(email, nickname, password);
    localStorage.setItem(
      "currentUser",
      JSON.stringify({ email, nickname, password })
    );

    // Успешная регистрация
    showMessage("#signup-message", "Account created successfully!", "success");

    setTimeout(() => {
      signupPopup.fadeOut(200);
      $("#signup-form")[0].reset();
      updateLoginStatus();
    }, 1500);
  });

  // === Логин ===
  $(document).on("submit", "#login-form", function (e) {
    e.preventDefault();

    const email = $("#login-email").val().trim();
    const password = $("#login-password").val().trim();

    const user = findUserByEmail(email);

    if (!user) {
      showMessage(
        "#auth-message",
        "Email not found. Please sign up first.",
        "error"
      );
      return;
    }

    if (user.password !== password) {
      showMessage(
        "#auth-message",
        "Incorrect password. Please try again.",
        "error"
      );
      return;
    }

    // Успешный вход
    localStorage.setItem("currentUser", JSON.stringify(user));
    showMessage("#auth-message", "Login successful!", "success");

    setTimeout(() => {
      loginPopup.fadeOut(200);
      $("#login-form")[0].reset();
      updateLoginStatus();
    }, 1500);
  });

  // === Открытие профиля ===
  $(document).on("click", "#user-btn", function () {
    const currentUser = localStorage.getItem("currentUser");
    if (!currentUser) return;

    const user = JSON.parse(currentUser);
    $("#profile-nick").text(user.nickname);
    $("#profile-email").text(user.email);
    $("#profile-pass").text("••••••••").data("password", user.password);

    profilePopup.fadeIn(200);
  });

  // === Показать/Скрыть пароль ===
  $(document).on("click", "#toggle-pass", function () {
    const passField = $("#profile-pass");
    const isHidden = passField.text() === "••••••••";

    if (isHidden) {
      passField.text(passField.data("password"));
      $(this).text("🙈");
    } else {
      passField.text("••••••••");
      $(this).text("👁️");
    }
  });

  // === Logout из профиля ===
  $(document).on("click", "#profile-logout", function () {
    localStorage.removeItem("currentUser");
    profilePopup.fadeOut(200);
    updateLoginStatus();
  });

  // === Logout из хедера ===
  $(document).on("click", "#logout-btn", function () {
    localStorage.removeItem("currentUser");
    updateLoginStatus();
  });

  // === Закрытие всех popup ===
  $(document).on("click", ".popup-close", function () {
    $(this).closest(".popup-overlay").fadeOut(200);
  });

  // === Закрытие по клику на overlay ===
  $(document).on("click", ".popup-overlay", function (e) {
    if ($(e.target).is(".popup-overlay")) {
      $(this).fadeOut(200);
    }
  });
});
