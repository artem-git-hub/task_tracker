function setTheme(button) {
    const theme = button.dataset.theme;
    if (theme) {
        localStorage.setItem('bs-theme', theme);
        document.body.dataset.bsTheme = theme;
    } else {
        console.error('Кнопка не содержит атрибут data-theme');
    }
}
