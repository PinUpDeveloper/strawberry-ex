// WebAudio beep (глухой "пик")
let actx;
function beep(freq=740, dur=0.07, type='triangle', vol=0.06){
  try{
    actx = actx || new (window.AudioContext||window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type=type; o.frequency.value=freq;
    g.gain.value = vol;
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
  }catch(_){}
}

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initReviewStars();
  initKeyboardNav();
  initLangSelector(); // каркас i18n
});

/* ---------- Night/Day toggle (с сохранением) ---------- */
function initThemeToggle(){
  const btn = document.querySelector('[data-role="theme-pill"]');
  if(!btn) return;
  const KEY = 'se_theme';
  const apply = (mode)=>{
    document.documentElement.setAttribute('data-theme', mode==='dark'?'dark':'');
    btn.innerHTML = mode==='dark' ? 'Switch to Day ☀️' : 'Switch to Night 🌙';
  };
  // restore
  const saved = localStorage.getItem(KEY);
  apply(saved==='dark'?'dark':'');
  // click
  btn.addEventListener('click', ()=>{
    const nowDark = document.documentElement.getAttribute('data-theme')!=='dark';
    const mode = nowDark ? 'dark' : '';
    apply(mode);
    try{localStorage.setItem(KEY, nowDark?'dark':'');}catch(_){}
    beep(620, .06); // мягкий "пик"
  });
}

/* ---------- Rate our service ---------- */
function initReviewStars(){
  const wrap = document.querySelector('[data-role="review-stars"]');
  const out = document.querySelector('[data-role="review-out"]');
  if(!wrap || !out) return;
  const stars = Array.from(wrap.querySelectorAll('.star-btn'));
  let value = 0;

  const paint = (v)=> stars.forEach((s,i)=> s.classList.toggle('active', i < v));
  stars.forEach((s,i)=>{
    s.addEventListener('mouseenter', ()=> paint(i+1));
    s.addEventListener('mouseleave', ()=> paint(value));
    s.addEventListener('click', ()=>{
      value = i+1; paint(value); out.textContent = `You rated: ${value}/5`;
      s.classList.add('appear'); setTimeout(()=>s.classList.remove('appear'), 250);
      beep(820, .07);
    });
  });
}

/* ---------- Keyboard nav 1/2/3 ---------- */
function initKeyboardNav(){
  const items = Array.from(document.querySelectorAll('.kbd-nav a'));
  if(!items.length) return;
  let idx = 0; items[idx].tabIndex=0;
  document.addEventListener('keydown', (e)=>{
    if(e.key==='ArrowRight' || e.key==='ArrowLeft'){
      e.preventDefault();
      idx = e.key==='ArrowRight' ? (idx+1)%items.length : (idx-1+items.length)%items.length;
      items.forEach(a=>a.tabIndex=-1); items[idx].tabIndex=0; items[idx].focus();
      beep(520,.04,'square',.04);
    }
  });
}

/* ---------- i18n (каркас) ---------- */
const I18N = {
  en:{ nav_products:'Products', nav_delivery:'Delivery', nav_about:'About', nav_contact:'Contact',
       reviews_title:'Rate Our Service', reviews_hint:'You rated:' },
  ru:{ nav_products:'Продукты', nav_delivery:'Доставка', nav_about:'О нас', nav_contact:'Контакты',
       reviews_title:'Оцените наш сервис', reviews_hint:'Ваша оценка:' },
  kz:{ nav_products:'Өнімдер', nav_delivery:'Жеткізу', nav_about:'Біз туралы', nav_contact:'Байланыс',
       reviews_title:'Қызметімізді бағалаңыз', reviews_hint:'Бағаңыз:' }
};
function applyI18n(lang){
  document.querySelectorAll('[data-i18n]').forEach(el=>{
    const key = el.getAttribute('data-i18n');
    if(I18N[lang] && I18N[lang][key]) el.textContent = I18N[lang][key];
  });
}
function initLangSelector(){
  const sel = document.getElementById('langSel');
  if(!sel) return;
  applyI18n(sel.value);
  sel.addEventListener('change', ()=> {
    applyI18n(sel.value);
    // обновим подпись рейтинга
    const out = document.querySelector('[data-role="review-out"]');
    if(out){
      const txt = (I18N[sel.value]?.reviews_hint) || 'You rated:';
      const val = out.textContent.match(/(\d)\/5/)?.[1] || 0;
      out.textContent = `${txt} ${val}/5`;
    }
    beep(500,.05);
  });
}