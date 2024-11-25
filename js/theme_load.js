document.addEventListener('DOMContentLoaded', () => {
    let storedTheme = localStorage.getItem('bs-theme');
    if (storedTheme) {
       $('body').attr('data-bs-theme', storedTheme);
    }
});
