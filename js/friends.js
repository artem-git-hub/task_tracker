$(function () {
    $('.btn-addFriend').on('click', function () {
        let button = $(this);
        button.find('i').toggleClass('bi-plus-circle bi-check-circle');
    });

    $('.btn-deleteFriend').on('click', function () {
        const friendElement = $(this).closest('.friend-item');
        const userName = friendElement.find('.friend-name').text();
        $('#modalDeleteFriend .question').text(
            `Вы уверены, что хотите удалить ${userName} из друзей проекта?`
        );
    });
});
