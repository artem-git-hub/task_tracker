$('select[name="projectStatus"]').on('change', function () {
    let selector = $(this);
    let selectedStatus = selector.val();
    let statusCircle = selector.parent().find('.status-circle');

    switch (selectedStatus) {
        case 'active':
            statusCircle.removeClass().addClass('status-circle status-active');
            break;
        case 'completed':
            statusCircle
                .removeClass()
                .addClass('status-circle status-completed');
            break;
        case 'closed':
            statusCircle.removeClass().addClass('status-circle status-closed');
            break;
        case 'frozen':
            statusCircle.removeClass().addClass('status-circle status-frozen');
            break;
        case 'not-started':
            statusCircle
                .removeClass()
                .addClass('status-circle status-not-started');
            break;
        case 'undefined':
            statusCircle
                .removeClass()
                .addClass('status-circle status-undefined');
            break;
    }
});
