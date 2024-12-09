$(function () {
    $('#editModal .btn-submit-modal').on('click', () => {
        let userName = $('#userName').val();
        let userLogin = $('#userLogin').val();
        let aboutText = $('#aboutText').val();
        let imageFile = $('#editModal').find('input[type="file"]')[0].files[0];

        $.ajax({
            url: '/profile/update',
            type: 'POST',
            data: JSON.stringify({
                name: userName,
                login: userLogin,
                about: aboutText,
                image: imageFile,
            }),
            success: (response) => {
                console.log('Данные успешно сохранены:', response);
            },
            error: function (error) {
                console.error('Ошибка отправки данных:', error);
            },
        });

        let modal = bootstrap.Modal.getInstance($('#editModal')[0]);
        modal.hide();
    });

    $('#editModal').on('show.bs.modal', function (event) {
        let modalElement = $(event.currentTarget);
        let userName = $('#name').text();
        let userLogin = $('#login').text();
        let aboutText = $('#about').text();
        let avatarSrc = $('.profile-avatar img').attr('src');

        modalElement.find('input[type="file"]').val(null);

        $('#userName').val(userName);
        $('#userLogin').val(userLogin);
        $('#aboutText').val(aboutText.trim());
        $('#imagePreview').attr('src', avatarSrc);
    });
});

function previewImage(event) {
    const file = event.target.files[0];

    if (file && file.type.match('image.*')) {
        const reader = new FileReader();

        reader.onload = function (e) {
            $('#imagePreview').attr('src', e.target.result);
        };

        reader.readAsDataURL(file);
    } else {
        alert('Пожалуйста, выберите изображение.');
        $(event.target).val(null);
    }
}
