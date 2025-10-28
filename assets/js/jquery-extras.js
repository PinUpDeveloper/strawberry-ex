// Assignment 7 — jQuery enhancements
// Ensure jQuery loaded
$(function () {
  console.log('jQuery is ready!');

  initSearchFilter();        // Part 1 Task 1
  initAutocomplete();        // Part 1 Task 2
  initHighlight();           // Part 1 Task 3

  initScrollProgress();      // Part 2 Task 4
  initCounters();            // Part 2 Task 5
  initSubmitSpinner();       // Part 2 Task 6

  initToasts();              // Part 3 Task 7
  initCopyToClipboard();     // Part 3 Task 8
  initLazyLoading();         // Part 3 Task 9
});

/* ---------------- Part 1: Search ---------------- */

// Task 1: Real-time filter
function initSearchFilter() {
  const $input = $('#productSearch');
  if (!$input.length) return;

  $input.on('keyup', function () {
    const term = $(this).val().toLowerCase().trim();
    $('#productGrid .product-card').each(function () {
      const text = $(this).text().toLowerCase();
      $(this).closest('.col').toggle(text.indexOf(term) > -1);
    });
  });
}

// Task 2: Autocomplete suggestions
function initAutocomplete() {
  const $input = $('#productSearch');
  const $list = $('#autocomplete-list');
  if (!$input.length || !$list.length) return;

  // source: product titles
  const titles = $('#productGrid .product-card .card-title').map(function () {
    return $(this).text().trim();
  }).get();

  $input.on('input', function () {
    const q = $(this).val().toLowerCase();
    $list.empty().hide();
    if (!q) return;

    const matches = titles.filter(t => t.toLowerCase().includes(q)).slice(0, 8);
    if (!matches.length) return;

    matches.forEach(t => {
      $list.append(`<div class="suggestion">${t}</div>`);
    });
    $list.show();

    // choose suggestion
    $list.find('.suggestion').on('click', function () {
      $input.val($(this).text());
      $list.empty().hide();
      $input.trigger('keyup'); // apply filter
    });
  });

  // hide list on outside click
  $(document).on('click', function (e) {
    if (!$(e.target).closest('#productSearch, #autocomplete-list').length) {
      $list.empty().hide();
    }
  });
}

// Task 3: Highlight matches
function initHighlight() {
  const $btn = $('#highlightBtn');
  const $scope = $('#productGrid');
  if (!$btn.length || !$scope.length) return;

  function clearHighlights() {
    $scope.find('span.highlight').each(function () {
      // unwrap highlight span
      $(this).replaceWith($(this).text());
    });
  }

  $btn.on('click', function () {
    const term = $('#productSearch').val();
    clearHighlights();
    if (!term) return;

    const re = new RegExp(`(${escapeRegExp(term)})`, 'gi');
    $scope.find('.card-title, .card-text').each(function () {
      const html = $(this).html().replace(re, '<span class="highlight">$1</span>');
      $(this).html(html);
    });
  });
}

function escapeRegExp(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/* ---------------- Part 2: UX Elements ---------------- */

// Task 4: Scroll progress bar
function initScrollProgress() {
  const $bar = $('#progressBar');
  if (!$bar.length) return;

  $(window).on('scroll resize', function () {
    const h = $(document).height() - $(window).height();
    const scrolled = h > 0 ? (($(window).scrollTop() / h) * 100) : 0;
    $bar.css('width', scrolled + '%');
  }).trigger('scroll');
}

// Task 5: Animated counters
function initCounters() {
  const $counters = $('.counter');
  if (!$counters.length) return;

  $counters.each(function () {
    const $el = $(this);
    const target = parseInt($el.attr('data-target'), 10) || 0;

    // run when element enters viewport
    const run = () => {
      $({ val: 0 }).animate({ val: target }, {
        duration: 1800,
        easing: 'swing',
        step: function () { $el.text(Math.floor(this.val)); },
        complete: function () { $el.text(target + '+'); }
      });
    };

    // simple viewport check
    const onScroll = () => {
      const top = $el.offset().top;
      const bottom = $(window).scrollTop() + $(window).height();
      if (bottom >= top - 30) {
        $(window).off('scroll', onScroll);
        run();
      }
    };
    $(window).on('scroll', onScroll);
    onScroll();
  });
}

// Task 6: Loading spinner on submit
function initSubmitSpinner() {
  // apply to any form on this page (registration modal included)
  $('form').on('submit', function (e) {
    // if ты уже валидируешь в main.js, можно не e.preventDefault()
    // Здесь эмулируем "запрос" и возвращаем кнопку обратно
    e.preventDefault();

    const $btn = $(this).find('button[type="submit"]');
    const original = $btn.text();
    $btn.prop('disabled', true).html('<i class="spinner"></i> Please wait…');

    setTimeout(() => {
      $btn.prop('disabled', false).text(original);
      // success toast
      showToast('Form submitted successfully!');
    }, 1500);
  });
}

/* ---------------- Part 3: App Functionality ---------------- */

// Task 7: Notification/Toast
let toastTimer = null;
function initToasts() {
  // nothing to init; use showToast(message)
}
function showToast(msg) {
  const $existing = $('#addToast'); // у тебя уже есть базовый тост
  if ($existing.length) {
    $existing.text(msg).css({ opacity: 1, transform: 'translateY(0)' });
    clearTimeout($existing.data('tm'));
    const tm = setTimeout(() => {
      $existing.css({ opacity: 0, transform: 'translateY(10px)' });
    }, 1500);
    $existing.data('tm', tm);
    return;
  }
  // fallback (if page without #addToast)
  let $t = $('.toast-float');
  if (!$t.length) {
    $t = $('<div class="toast-float"></div>').appendTo('body');
  }
  $t.text(msg).fadeIn(180);
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $t.fadeOut(250), 1500);
}

// Task 8: Copy to clipboard
function initCopyToClipboard() {
  $('.copy-btn').on('click', function () {
    const text = $(this).siblings('.copy-text').text().trim();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => {
        const $btn = $(this);
        const orig = $btn.text();
        $btn.text('✔ Copied!');
        showToast('Copied to clipboard!');
        setTimeout(() => $btn.text(orig), 1200);
      });
    }
  });
}

// Task 9: Image Lazy Loading (simple jQuery scroll check)
function initLazyLoading() {
  const $imgs = $('img.lazy[data-src]');
  if (!$imgs.length) return;

  function loadInView() {
    const winBottom = $(window).scrollTop() + $(window).height();
    $imgs.each(function () {
      const $img = $(this);
      if ($img.hasClass('loaded')) return;
      const top = $img.offset().top;
      if (top < winBottom + 120) {
        const real = $img.attr('data-src');
        $img.attr('src', real).on('load', function () {
          $img.addClass('loaded');
        });
      }
    });
  }
  $(window).on('scroll resize', loadInView);
  loadInView();
}