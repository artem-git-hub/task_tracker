// Добавление нового элемента чек-листа в модальное окно
function addChecklistItem(modalElement, isChecked = false, text = "") {
    let checklistItem = $('<div class="checklist-item mb-2 d-flex"></div>');
    let newCheckbox = $('<input type="checkbox" class="form-check-input">').prop('checked', isChecked);
    let newInput = $('<input type="text" class="form-control d-inline-block flex-fill" placeholder="Введите элемент чек-листа">').val(text);

    checklistItem.append(newCheckbox).append(newInput);
    modalElement.find('.modal-checklist-content').append(checklistItem);

    return checklistItem;
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
            modalElement.find('textarea').text('');
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
            modalElement.find('textarea').text('');
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
        let isChecked = checkbox.is(':checked');

        let labelText = $(this).find('label').text().trim();

        addChecklistItem(modalElement, isChecked, labelText);
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
        url: '/', // URL обработчика на сервере
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

    let button = event.relatedTarget;
    let blockId = button.getAttribute('data-block');
    modalElement.data('blockId', blockId);

    let titleElement = modalElement.find('.modal-title');
    let primaryButton = modalElement.find('.btn-primary');

    // Определяем исходный заголовок в зависимости от типа
    let initialTitle;
    switch (modalElement.attr('id')) {
        case 'modalProject':
            initialTitle = 'проект';
            break;
        case 'modalChecklist':
            initialTitle = 'чек-лист';
            break;
        case 'modalImage':
            initialTitle = 'изображение';
            break;
        case 'modalText':
            initialTitle = 'текст';
            break;
        case 'modalLinks':
            initialTitle = 'ссылки';
            break;
        default:
            initialTitle = 'блок';
    }

    if (blockId) {
        titleElement.text('Редактировать ' + initialTitle);
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

// Обработка открытия модального окна удаления блока
$('#modalDeleteBlock').on('show.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);

    let button = event.relatedTarget;
    let blockId = button.getAttribute('data-block');
    modalElement.data('blockId', blockId);
});
