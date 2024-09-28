// Добавление нового элемента чек-листа в модальное окно
function addChecklistItem(modalElement, isChecked = false, text = "") {
    let checklistItem = $('<div class="checklist-item mb-2 d-flex"></div>');
    let newCheckbox = $('<input type="checkbox" class="form-check-input">').prop('checked', isChecked);
    let newInput = $('<input type="text" class="form-control d-inline-block flex-fill" placeholder="Введите элемент чек-листа">').val(text);

    checklistItem.append(newCheckbox).append(newInput);
    modalElement.find('.modal-checklist-content').append(checklistItem);
}

// Добавление нового элемента ссылки в модальное окно
function addLinkItem(modalElement, text = "", url = "") {
    let linkItem = $('<div class="link-item mb-3"></div>');
    let newLinkText = $('<input type="text" class="form-control mb-2" placeholder="Текст ссылки">').val(text);
    let newLinkUrl = $('<input type="url" class="form-control mb-2" placeholder="URL ссылки">').val(url);

    linkItem.append(newLinkText).append(newLinkUrl);
    modalElement.find('.modal-links-content').append(linkItem);
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


$('.modal-block').on('show.bs.modal', function (event) {
    let modalElement = $(event.currentTarget);

    let button = event.relatedTarget;
    let idBlock = button.getAttribute('data-bs-block');

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

    if (idBlock == '-1') {
        titleElement.text('Добавить ' + initialTitle);
        primaryButton.text('Добавить ' + initialTitle);

        clearModalData(modalElement);
    } else {
        titleElement.text('Редактировать ' + initialTitle);
        primaryButton.text('Сохранить изменения');

        let blockElement = $('#' + idBlock);

        loadModalData(modalElement, blockElement);
    }
});
