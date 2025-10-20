function playClickSound() {
  const ctx = new (window.AudioContext || window.webkitAudioContext)();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "square";
  osc.frequency.value = 600;
  gain.gain.setValueAtTime(0.05, ctx.currentTime);

  osc.start();
  osc.stop(ctx.currentTime + 0.08);
}

document.addEventListener("DOMContentLoaded", () => {
  const buttons = document.querySelectorAll("button, .btn");

  buttons.forEach(btn => {
    btn.addEventListener("click", playClickSound);
  });
});
