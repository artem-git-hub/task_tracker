// Добавление нового элемента чек-листа в модальное окно
function addChecklistItem(modalElement, id, isChecked = false, text = "") {
    let checklistItem = $('<div class="checklist-item mb-3 d-flex" data-id="' + id + '"></div>');
    let checkbox = $('<input type="checkbox" class="form-check-input">').prop('checked', isChecked);

    let label = $('<span class="checklist-label flex-fill"></span>').text(text);

    let editButton = $('<button class="btn btn-link"><i class="bi bi-pencil"></i></button>');

    let deleteButton = $('<button class="btn btn-link" data-bs-toggle="popover" data-bs-placement="bottom" '
        + 'data-bs-content="Нажмите еще раз для подтверждения удаления"><i class="bi bi-x"></i></button>');

    let errorMessage = $('<div class="text-danger error-checkbox d-none" role="alert"></div>');

    checklistItem.append(checkbox).append(label).append(editButton).append(deleteButton);
    modalElement.find('.modal-checklist-content').append(checklistItem).append(errorMessage);;

    let popover = new bootstrap.Popover(deleteButton[0]);

    editButton.on('click', function () {
        toggleEdit(checklistItem, label, editButton, id, errorMessage);
    });

    deleteButton.on('click', function () {
        deleteCheckboxItem(checklistItem, deleteButton, popover, id, errorMessage);
    });

    return checklistItem;
}

function toggleEdit(checklistItem, label, editButton, id, errorMessage) {
    if (editButton.find('i').hasClass('bi-pencil')) {
        // Превращаем надпись в input
        let input = $('<input type="text" class="form-control d-inline-block flex-fill" placeholder="Элемент чек-листа">')
            .val(label.text());
        label.replaceWith(input);
        input.focus();
        editButton.html('<i class="bi bi-check2"></i>'); // Меняем кнопку на галочку
    } else {
        let newText = checklistItem.find('input[type="text"]').val();
        // Отправляем обновленные данные на сервер
        $.ajax({
            url: '/checkbox/update',
            method: 'POST',
            data: {
                id: id,
                text: newText,
                isChecked: checklistItem.find('input[type="checkbox"]').val()
            },
            success: function (response) {
                // Превращаем input обратно в надпись
                label.text(newText);
                checklistItem.find('input[type="text"]').replaceWith(label);
                editButton.html('<i class="bi bi-pencil"></i>'); // Меняем кнопку обратно на карандаш

                console.log('Данные успешно обновлены:', response);
                errorMessage.addClass('d-none');
            },
            error: function (xhr) {
                console.error('Ошибка при обновлении данных:', xhr.responseText);
                errorMessage.text(xhr.responseText || 'Произошла ошибка при обновлении.').removeClass('d-none');
            }
        });
    }
}

function deleteCheckboxItem(checklistItem, deleteButton, popover, id, errorMessage) {
    if (deleteButton.data('confirm')) {
        // Отправляем запрос на удаление на сервер
        $.ajax({
            url: '/checkbox/delete',
            method: 'POST',
            data: {
                id: id
            },
            success: function (response) {
                console.log('Элемент успешно удален:', response);
                checklistItem.remove();
                errorMessage.remove();
            },
            error: function (xhr) {
                console.error('Ошибка при удалении элемента:', xhr.responseText);
                errorMessage.text(xhr.responseText || 'Произошла ошибка при удалении.').removeClass('d-none');
            }
        });
    } else {
        deleteButton.data('confirm', true);
        deleteButton.addClass('text-danger');
        popover.show();

        // Сбрасываем флаг после 2 секунд
        setTimeout(() => {
            deleteButton.data('confirm', false);
            deleteButton.removeClass('text-danger');
            popover.hide();
        }, 2000);
    }
}


// Добавление нового элемента ссылки в модальное окно
function addLinkItem(modalElement, text = "", url = "") {
    let linkItem = $('<div class="link-item mb-3"></div>');
    let newLinkText = $('<input type="text" class="form-control mb-2" placeholder="Текст ссылки">').val(text);
    let newLinkUrl = $('<input type="url" class="form-control mb-2" placeholder="URL ссылки">').val(url);

    linkItem.append(newLinkText).append(newLinkUrl);
    modalElement.find('.modal-links-content').append(linkItem);

    return linkItem;
}

// Очистка данных в модальном окне
function clearModalData(modalElement) {
    let modalBlockTitle = modalElement.find('[name="blockTitle"]');
    modalBlockTitle.val('');

    switch (modalElement.attr('id')) {
        case 'modalProject':
            modalElement.find('textarea').val('');
            break;
        case 'modalChecklist':
            modalElement.find('.modal-checklist-content').empty();
            // Добавляем новый элемент чек-листа
            addChecklistItem(modalElement);
            break;
        case 'modalImage':
            modalElement.find('img').attr('src', '');
            break;
        case 'modalText':
            modalElement.find('textarea').val('');
            break;
        case 'modalLinks':
            modalElement.find('.modal-links-content').empty();
            // Добавляем новый элемент ссылки
            addLinkItem(modalElement);
            break;
    }
}

// Загрузка данных в модальное окно из блока проекта
function loadModalDataProject(modalElement, blockElement) {
    let descriptionData = blockElement.find('.pre-text').text();
    let modalText = modalElement.find('textarea');

    modalText.text(descriptionData);
}

// Загрузка данных в модальное окно из блока чеклиста
function loadModalDataChecklist(modalElement, blockElement) {
    let checklistContent = modalElement.find('.modal-checklist-content');
    checklistContent.empty();

    // Перебираем все чекбоксы в блоке
    blockElement.find('.form-check').each(function () {
        let checkbox = $(this).find('input[type="checkbox"]');

        let labelText = $(this).find('label').text().trim();

        addChecklistItem(
            modalElement,
            checkbox.attr('id'),
            checkbox.is(':checked'),
            labelText
        );
    });
}

// Загрузка данных в модальное окно из блока ссылок
function loadModalDataLinks(modalElement, blockElement) {
    let linksContent = modalElement.find('.modal-links-content');
    linksContent.empty();

    // Перебираем все ссылки в блоке
    blockElement.find('.b-list').find('a').each(function () {
        let link = $(this);
        let linkText = link.text().trim();
        let linkUrl = link.attr('href');

        addLinkItem(modalElement, linkText, linkUrl);
    });
}

// Загрузка данных в модальное окно из блока изображения
function loadModalDataImage(modalElement, blockElement) {
    let blockImageData = blockElement.find('img').attr('src');
    let modalImage = modalElement.find('img');

    modalImage.attr('src', blockImageData);
}

// Загрузка данных в модальное окно из блока текста
function loadModalDataText(modalElement, blockElement) {
    let blockTextData = blockElement.find('.pre-text').text();
    let modalText = modalElement.find('textarea');

    modalText.text(blockTextData);
}

// Загрузка заголовка в модальное окно и вызов функции для загрузки остальных данных
function loadModalData(modalElement, blockElement) {
    let blockTitleData = blockElement.find('.block-title').text();
    let modalBlockTitle = modalElement.find('[name="blockTitle"]');

    modalBlockTitle.val(blockTitleData);

    switch (modalElement.attr('id')) {
        case 'modalProject':
            loadModalDataProject(modalElement, blockElement);
            break;
        case 'modalChecklist':
            loadModalDataChecklist(modalElement, blockElement);
            break;
        case 'modalImage':
            loadModalDataImage(modalElement, blockElement);
            break;
        case 'modalText':
            loadModalDataText(modalElement, blockElement);
            break;
        case 'modalLinks':
            loadModalDataLinks(modalElement, blockElement);
            break;
    }
}

// Добавление нового элемента с установкой фокуса
function addFocusItem(modalElement) {
    let newItem;

    switch (modalElement.attr('id')) {
        case 'modalChecklist':
            newItem = addChecklistItem(modalElement);
            break;
        case 'modalLinks':
            newItem = addLinkItem(modalElement);
            break;
    }

    let scrollable = modalElement.find('.modal-body')[0];
    scrollable.scrollTop = scrollable.scrollHeight;

    newItem.find('input[type="text"]').focus();
}

// Получение элемента модального окна по его типу
function getModalElementFromType(type) {
    return $('#modal' + type);
}

// Отправка данных из модального окна на сервер
function submitModal(type) {
    let modalElement = getModalElementFromType(type);
    let data = {
        blockType: type,
        blockId: modalElement.data('blockId'),
        blockTitle: modalElement.find('[name="blockTitle"]').val(),
    };

    switch (type) {
        case 'Project':
            data.description = modalElement.find('textarea').val();
            break;
        case 'Checklist':
            data.checklistItems = [];
            modalElement.find('.checklist-item').each(function () {
                let isChecked = $(this).find('input[type="checkbox"]').is(':checked');
                let text = $(this).find('input[type="text"]').val();
                data.checklistItems.push({ checked: isChecked, text: text });
            });
            break;
        case 'Links':
            data.links = [];
            modalElement.find('.link-item').each(function () {
                let text = $(this).find('input[type="text"]').val();
                let url = $(this).find('input[type="url"]').val();
                data.links.push({ text: text, url: url });
            });
            break;
        case 'Image':
            // Логика сбора данных для изображения
            break;
        case 'Text':
            data.text = modalElement.find('textarea').val();
            break;
    }

    // Отправка данных на сервер с помощью AJAX
    $.ajax({
        url: '/', // URL обработчика на сервере
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (response) {
            // Обработка успешного ответа от сервера
            console.log('Данные успешно отправлены на сервер:', response);

            // Обновление блока на странице (с сервера)
            // ...
        },
        error: function (error) {
            // Обработка ошибки отправки данных
            console.error('Ошибка отправки данных:', error);
        }
    });

    console.log('Отправленные данные:', data);

    modalElement.modal('hide');
}

// Удаление блока
function deleteBlock() {
    let modalElement = $('#modalDeleteBlock');

    let data = {
        blockId: modalElement.data('blockId'),
    };

    // Отправка данных на сервер с помощью AJAX
    $.ajax({
        url: '/block/delete', // URL обработчика на сервере
        type: 'POST',
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (response) {
            // Обработка успешного ответа от сервера
            console.log('Данные успешно отправлены на сервер:', response);

            // Удаление блока на странице (с сервера)
            // ...
        },
        error: function (error) {
            // Обработка ошибки отправки данных
            console.error('Ошибка отправки данных:', error);
        }
    });

    console.log('Отправленные данные:', data);

    modalElement.modal('hide');
}

// Удаление проекта
function deleteProject() {

}

// Обработка открытия модального окна добавления/редактирования блока
$('.modal-block').on('show.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);

    let blockId = modalElement.data('blockId');

    let titleElement = modalElement.find('.modal-title');
    let primaryButton = modalElement.find('.btn-primary');

    // Определяем исходный заголовок в зависимости от типа
    let initialTitle;
    switch (modalElement.attr('id')) {
        case 'modalProject':
            initialTitle = 'Проект';
            break;
        case 'modalChecklist':
            initialTitle = 'Чек-лист';
            break;
        case 'modalImage':
            initialTitle = 'Изображение';
            break;
        case 'modalText':
            initialTitle = 'Текст';
            break;
        case 'modalLinks':
            initialTitle = 'Ссылки';
            break;
        default:
            initialTitle = 'Блок';
    }

    if (blockId) {
        titleElement.text(initialTitle);

        if (initialTitle != 'Проект') {
            deleteButton = $('<button class="btn btn-link" data-bs-toggle="modal" data-bs-target="#modalDeleteBlock">' +
                '<i class="bi bi-trash"></i></button>');

            deleteButton.on('click', function () {
                $('#modalDeleteBlock').data('blockId', blockId);
            });

            titleElement.append(deleteButton);
        }

        primaryButton.text('Сохранить изменения');

        let blockElement = $('#' + blockId);

        loadModalData(modalElement, blockElement);

    } else {
        titleElement.text('Добавить ' + initialTitle);
        primaryButton.text('Добавить ' + initialTitle);

        clearModalData(modalElement);
    }
});

// Обработка после открытия модального окна добавления/редактирования блока
$('.modal-block').on('shown.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);

    let button = $(event.relatedTarget);

    if (button.is('[data-addItem]')) {
        addFocusItem(modalElement)
    }
});

$('.card').on('click', function (event) {
    // Игнорируем клики на чекбоксах, кнопках и ссылках
    let eventTarget = $(event.target);
    if (
        eventTarget.closest('.form-check-label').length > 0 ||
        eventTarget.closest('button').length > 0 ||
        eventTarget.closest('a').length > 0
    ) {
        return;
    }

    let card = $(this);
    let type = card.data('type');

    let modalElement = $('#modal' + type);

    modalElement.data('blockId', card.attr('id'));
    modalElement.modal('show');
});