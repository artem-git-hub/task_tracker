function loadModalDataProject(modalElement, blockElement) {
    let descriptionData = blockElement.find('.pre-text').text();
    let modalText = modalElement.find('textarea');

    modalText.text(descriptionData);
}

function loadModalDataChecklist(modalElement, blockElement) {
    let checklistContent = modalElement.find('.modal-checklist-content');
    checklistContent.empty();

    // Перебираем все чекбоксы в блоке
    blockElement.find('.form-check').each(function () {
        let checkbox = $(this).find('input[type="checkbox"]');
        let isChecked = checkbox.is(':checked');

        let labelText = $(this).find('label').text().trim();

        let checklistItem = $('<div class="checklist-item mb-2 d-flex"></div>');
        let newCheckbox = $('<input type="checkbox" class="form-check-input">').prop('checked', isChecked);
        let newInput = $('<input type="text" class="form-control d-inline-block flex-fill" placeholder="Введите элемент чек-листа">').val(labelText);

        // Добавляем чекбокс и текстовое поле в новый элемент
        checklistItem.append(newCheckbox).append(newInput);

        // Добавляем новый элемент в модальное окно
        checklistContent.append(checklistItem);
    });
}

function loadModalDataLinks(modalElement, blockElement) {
    let linksContent = modalElement.find('.modal-links-content');
    linksContent.empty();

    // Перебираем все ссылки в блоке
    blockElement.find('.b-list').find('a').each(function () {
        let link = $(this);
        let linkText = link.text().trim();
        let linkUrl = link.attr('href');

        let linkItem = $('<div class="link-item mb-3"></div>');
        let newLinkText = $('<input type="text" class="form-control mb-2" placeholder="Текст ссылки">').val(linkText);
        let newLinkUrl = $('<input type="url" class="form-control mb-2" placeholder="URL ссылки">').val(linkUrl);

        // Добавляем текст и URL ссылки в новый элемент
        linkItem.append(newLinkText).append(newLinkUrl);

        // Добавляем новый элемент в модальное окно
        linksContent.append(linkItem);
    });
}

function loadModalDataImage(modalElement, blockElement) {
    let blockImageData = blockElement.find('img').attr('src');
    let modalImage = modalElement.find('img');

    modalImage.attr('src', blockImageData);
}

function loadModalDataText(modalElement, blockElement) {
    let blockTextData = blockElement.find('.pre-text').text();
    let modalText = modalElement.find('textarea');

    modalText.text(blockTextData);
}

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


let modalBlocks = document.querySelectorAll('.modal-block');

modalBlocks.forEach(item => {
    item.addEventListener('show.bs.modal', event => {
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
        } else {
            titleElement.text('Редактировать ' + initialTitle);
            primaryButton.text('Сохранить изменения');

            let blockElement = $('#' + idBlock);

            loadModalData(modalElement, blockElement);
        }
    });
});