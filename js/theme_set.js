$(function () {
    $('button[data-theme]').on('click', function () {
        let theme = $(this).data('theme');
        localStorage.setItem('bs-theme', theme);
        $('body').attr('data-bs-theme', theme);
    });
});
