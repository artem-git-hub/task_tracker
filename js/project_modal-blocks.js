let modalBlocks = document.querySelectorAll('.modal-block');

modalBlocks.forEach(item => {
    item.addEventListener('show.bs.modal', event => {
        let modalElement = event.currentTarget;

        let button = event.relatedTarget;
        let idBlock = button.getAttribute('data-bs-block');

        let titleElement = modalElement.querySelector('.modal-title');
        let primaryButton = modalElement.querySelector('.btn-primary');

        // Определяем исходный заголовок в зависимости от типа
        let initialTitle;
        switch (modalElement.id) {
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
            titleElement.textContent = 'Добавить ' + initialTitle;
            primaryButton.textContent = 'Добавить блок';
        } else {
            titleElement.textContent = 'Редактировать ' + initialTitle;
            primaryButton.textContent = 'Сохранить изменения';
        }
    });
});