document.addEventListener('DOMContentLoaded', () => {
  const copyYear = document.getElementById('copy-year-legal');
  if (copyYear) copyYear.textContent = new Date().getFullYear();
});
