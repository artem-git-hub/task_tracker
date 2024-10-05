// Смена надписи при нажатии на кнопку разворачивания
function collapseExpandTextToggle(element) {
    let toggleText = $(element).find('.toggleText');

    if (toggleText.html().includes('Развернуть')) {
        toggleText.html('Свернуть <i class="bi bi-chevron-up"></i>');
    } else {
        toggleText.html('Развернуть <i class="bi bi-chevron-down"></i>');
    }
}

// Очистка данных в модальном окне проекта при открытии
$('#modalProject').on('show.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);
    modalElement.find('[name="blockTitle"]').val('');
    modalElement.find('textarea').val('');
});