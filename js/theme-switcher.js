// js/theme-switcher.js

function switchTheme(theme) {
    if (theme === 'light') {
        document.body.classList.remove('bg-dark');
        document.body.classList.add('bg-light');
    } else {
        document.body.classList.remove('bg-light');
        document.body.classList.add('bg-dark');
    }
}
