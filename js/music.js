$(function () {
    $('#loadPlaylist').on('click', function () {
        let link = $('#playlistLink').val().trim();
        let regex =
            /^(?:(?:https?:\/\/)?music\.yandex\.ru\/users\/([^\/]+)\/playlists\/(\d+))$/;

        let match = link.match(regex);
        if (match) {
            let user = match[1];
            let playlistId = match[2];

            if (/[<>]/.test(user)) {
                alert(
                    'Имя пользователя в ссылке не может содержать недопустимые символы.'
                );
                return;
            }

            let src = `https://music.yandex.ru/iframe/playlist/${user}/${playlistId}`;
            $('#playlistFrame')
                .attr('src', src)
                .removeClass('d-none')
                .addClass('d-block');
        } else {
            alert(
                'Неверный формат ссылки: принимаются только ссылки на плейлисты Яндекс-музыки.'
            );
        }
    });
});
