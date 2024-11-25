function toggleForm(form) {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');
    const toggleRegister = document.getElementById('toggleRegister');

    if (form === 'login') {
        loginForm.style.display = 'block';
        registerForm.style.display = 'none';
        loginLink.classList.add('active-link');
        registerLink.classList.remove('active-link');
        toggleRegister.style.display = 'block'; // Показать ссылку на регистрацию
    } else {
        loginForm.style.display = 'none';
        registerForm.style.display = 'block';
        registerLink.classList.add('active-link');
        loginLink.classList.remove('active-link');
        toggleRegister.style.display = 'none'; // Скрыть ссылку на регистрацию
    }
}
