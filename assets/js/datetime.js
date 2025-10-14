function updateDateTime() {
  const now = new Date();
  const formatted = now.toLocaleString('en-US', {
    month: 'long', 
    day: 'numeric', 
    year: 'numeric',
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false
  });
  document.querySelectorAll("#datetime").forEach(el => el.textContent = formatted);
}
setInterval(updateDateTime, 1000);
updateDateTime();
