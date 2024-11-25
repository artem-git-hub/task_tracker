function cancelDeleteItem(deleteButton, popover) {
    deleteButton.data('confirm', false);
    deleteButton.removeClass('text-danger');
    popover.hide();
}

// Функция для удаления элемента с подтверждением
function deleteItem(itemContainer, deleteButton, popover) {
    if (deleteButton.data('confirm')) {
        itemContainer.remove();
    } else {
        deleteButton.data('confirm', true);
        deleteButton.addClass('text-danger');
        popover.show();

        // Сбрасываем флаг после 3 секунд
        setTimeout(() => cancelDeleteItem(deleteButton, popover), 3000);
    }
}

// Функция для создания кнопки удаления
function createDeleteBtn(itemContainer) {
    let deleteButton =
        $(`<button class="btn btn-link" data-bs-toggle="popover" data-bs-placement="bottom" 
        data-bs-content="Нажмите еще раз для подтверждения удаления">
        <i class="bi bi-x"></i></button>`);

    let popover = new bootstrap.Popover(deleteButton[0]);

    deleteButton.on('click', function () {
        deleteItem(itemContainer, deleteButton, popover);
    });

    deleteButton.on('blur', function () {
        cancelDeleteItem(deleteButton, popover);
    });

    return deleteButton;
}

// Добавление нового элемента чек-листа в модальное окно
function addChecklistItem(
    modalElement,
    isChecked = false,
    text = '',
    itemId = null
) {
    let checklistItem = $(
        '<div class="checklist-item mb-3 d-flex" data-item-id="' +
            itemId +
            '"></div>'
    );
    let checkbox = $('<input type="checkbox" class="form-check-input">').prop(
        'checked',
        isChecked
    );

    let input = $(
        '<input type="text" class="input-content form-control ' +
            'd-inline-block flex-fill fw-medium" maxlength="128">'
    ).val(text);

    let deleteButton = createDeleteBtn(checklistItem);

    checklistItem.append(checkbox).append(input).append(deleteButton);
    modalElement.find('.modal-checklist-content').append(checklistItem);

    return checklistItem;
}

// Добавление нового элемента ссылки в модальное окно
function addLinkItem(modalElement, text = '', url = '', itemId = null) {
    let linkItem = $(
        '<div class="link-item mb-4" data-item-id="' + itemId + '"></div>'
    );

    // Строка для текста ссылки и кнопки удаления
    let textRow = $('<div class="d-flex align-items-center"></div>');
    let newLinkText = $(
        '<input type="text" class="input-content form-control fw-medium no-border" ' +
            'placeholder="Название ссылки" maxlength="128">'
    ).val(text);
    let deleteButton = createDeleteBtn(linkItem);

    textRow.append(newLinkText).append(deleteButton);
    linkItem.append(textRow);

    // Строка для URL и кнопки перехода
    let urlRow = $('<div class="d-flex align-items-center"></div>');
    let newLinkUrl = $(
        '<input type="url" class="input-content form-control" ' +
            'placeholder="URL ссылки" maxlength="2048">'
    ).val(url);
    let goButton = $(
        '<button class="btn btn-link"><i class="bi bi-link-45deg"></i></button>'
    ).on('click', function () {
        window.open(newLinkUrl.val(), '_blank');
    });

    urlRow.append(newLinkUrl).append(goButton);
    linkItem.append(urlRow);
    modalElement.find('.modal-links-content').append(linkItem);

    return linkItem;
}

// Очистка данных в модальном окне
function clearModalData(modalElement) {
    let modalBlockTitle = modalElement.find('[name="blockTitle"]');
    modalBlockTitle.val('');

    switch (modalElement.attr('id')) {
        case 'modalProject':
            // Очищаем краткое и полное описание
            modalElement.find('textarea[name="shortDescription"]').val('');
            modalElement.find('textarea[name="description"]').val('');

            // Устанавливаем статус на "Не задан"
            const projectStatusSelect = modalElement.find(
                'select[name="projectStatus"]'
            );
            projectStatusSelect.val('undefined');
            projectStatusSelect.trigger('change');
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
    let shortDescription = blockElement
        .find('[name="shortDescription"]')
        .text();
    let description = blockElement.find('[name="description"]').text();

    modalElement
        .find('textarea[name="shortDescription"]')
        .val(shortDescription);
    modalElement.find('textarea[name="description"]').val(description);

    let status = blockElement.find('[name="projectStatus"]').text();

    let projectStatusSelect = modalElement.find('select[name="projectStatus"]');
    projectStatusSelect.find('option').prop('selected', false);
    projectStatusSelect
        .find(`option[value = "${status}"]`)
        .prop('selected', true);
    projectStatusSelect.trigger('change');
}

// Загрузка данных в модальное окно из блока чеклиста
function loadModalDataChecklist(modalElement, blockElement) {
    let checklistContent = modalElement.find('.modal-checklist-content');
    checklistContent.empty();

    // Перебираем все чекбоксы в блоке
    blockElement.find('.form-check').each(function () {
        let checkItem = $(this);
        let checkbox = checkItem.find('input[type="checkbox"]');
        let labelText = checkItem.find('label').text().trim();
        let itemId = checkItem.data('item-id');

        addChecklistItem(
            modalElement,
            checkbox.is(':checked'),
            labelText,
            itemId
        );
    });
}

// Загрузка данных в модальное окно из блока ссылок
function loadModalDataLinks(modalElement, blockElement) {
    let linksContent = modalElement.find('.modal-links-content');
    linksContent.empty();

    // Перебираем все ссылки в блоке
    blockElement
        .find('.b-list')
        .find('a')
        .each(function () {
            let link = $(this);
            let linkText = link.text().trim();
            let linkUrl = link.attr('href');
            let itemId = link.data('item-id');

            addLinkItem(modalElement, linkText, linkUrl, itemId);
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
            data.shortDescription = modalElement
                .find('textarea[name="shortDescription"]')
                .val();
            data.description = modalElement
                .find('textarea[name="description"]')
                .val();
            data.projectStatus = modalElement
                .find('select[name="projectStatus"]')
                .val();
            break;
        case 'Checklist':
            data.checklistItems = [];
            modalElement.find('.checklist-item').each(function () {
                let checkItem = $(this);
                let isChecked = checkItem
                    .find('input[type="checkbox"]')
                    .is(':checked');
                let text = checkItem.find('input[type="text"]').val();
                let id = checkItem.data('item-id');
                data.checklistItems.push({
                    checked: isChecked,
                    text: text,
                    id: id,
                });
            });
            break;
        case 'Links':
            data.links = [];
            modalElement.find('.link-item').each(function () {
                let linkItem = $(this);
                let text = linkItem.find('input[type="text"]').val();
                let url = linkItem.find('input[type="url"]').val();
                let id = linkItem.data('item-id');
                data.links.push({ text: text, url: url, id: id });
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
        },
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
        },
    });

    console.log('Отправленные данные:', data);

    modalElement.modal('hide');
}

// Удаление проекта
function deleteProject() {
    let projectIdElement = $('[data-project-id]');
    let projectId = projectIdElement.data('project-id');

    console.log('projectId:', projectId);

    // Отправляем запрос на сервер
    $.ajax({
        url: '/project/delete', // Замените на ваш URL
        type: 'POST',
        data: { projectId: projectId },
        success: function (response) {
            // Обработка ответа от сервера (если необходимо)
            console.log('Project deleted successfully:', response);
            // Переадресация на новую страницу
            window.location.href = '/home';
        },
        error: function (error) {
            // Обработка ошибки (если необходимо)
            console.error('Error deleting project:', error);
        },
    });
}

// Обработка открытия модального окна добавления/редактирования блока
$('.modal-block').on('show.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);

    if (
        event.relatedTarget &&
        event.relatedTarget.classList.contains('btn-add-block')
    ) {
        modalElement.data('blockId', false);
    }

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
            deleteButton = $(
                '<button class="btn btn-link" data-bs-toggle="modal" data-bs-target="#modalDeleteBlock">' +
                    '<i class="bi bi-trash"></i></button>'
            );

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

    if (modalElement.data('addItem')) {
        modalElement.data('addItem', false);
        addFocusItem(modalElement);
    }
});

$('.card').on('click', function (event) {
    let eventTarget = $(event.target);
    // Игнорируем клики на чекбоксах, кнопках и ссылках (кроме кнопки добавления пункта)
    if (
        (eventTarget.closest('.form-check-label').length > 0 ||
            eventTarget.closest('button').length > 0 ||
            eventTarget.closest('a').length > 0) &&
        !(eventTarget.closest('.btn-add-item').length > 0)
    ) {
        return;
    }

    let card = $(this);
    let type = card.data('type');

    if (type == 'AddBlock') {
        modalElement.data('addItem', false);
        return;
    }

    let modalElement = $('#modal' + type);

    modalElement.data('blockId', card.attr('id'));
    modalElement.modal('show');

    if (eventTarget.closest('.btn-add-item').length > 0) {
        modalElement.data('addItem', true);
    } else {
        modalElement.data('addItem', false);
    }
});

$(document).on('change', 'input[type="checkbox"]', function () {
    // Находим ближайший родительский элемент с атрибутом data-item-id
    let itemId = $(this).closest('[data-item-id]').data('item-id');
    let isChecked = $(this).is(':checked');

    // Выводим данные в консоль
    console.log('itemId:', itemId);
    console.log('isChecked:', isChecked);

    // Отправляем AJAX запрос
    $.ajax({
        url: '/checkChange',
        type: 'POST',
        data: {
            itemId: itemId,
            isChecked: isChecked,
        },
        success: function (response) {
            // Обработка ответа от сервера (если необходимо)
            console.log(response);
        },
        error: function (error) {
            // Обработка ошибки (если необходимо)
            console.error(error);
        },
    });
});
