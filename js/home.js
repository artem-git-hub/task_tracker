// Смена надписи при сворачивании/разворачивании
// Для моих проектов
$('.collapse-myProject').on('show.bs.collapse', function () {
    $('button[data-bs-target=".collapse-myProject"] .toggleText').html(
        'Свернуть <i class="bi bi-chevron-up"></i>'
    );
});

$('.collapse-myProject').on('hide.bs.collapse', function () {
    $('button[data-bs-target=".collapse-myProject"] .toggleText').html(
        'Развернуть <i class="bi bi-chevron-down"></i>'
    );
});

// Для доступных проектов
$('.collapse-friendProject').on('show.bs.collapse', function () {
    $('button[data-bs-target=".collapse-friendProject"] .toggleText').html(
        'Свернуть <i class="bi bi-chevron-up"></i>'
    );
});

$('.collapse-friendProject').on('hide.bs.collapse', function () {
    $('button[data-bs-target=".collapse-friendProject"] .toggleText').html(
        'Развернуть <i class="bi bi-chevron-down"></i>'
    );
});

// Очистка данных в модальном окне проекта при открытии
$('#modalProject').on('show.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);
    modalElement.find('[name="blockTitle"]').val('');
    modalElement.find('textarea').val('');
});
