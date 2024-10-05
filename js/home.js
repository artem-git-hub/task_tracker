function collapseExpandTextToggle(element) {
    const toggleText = $(element).find('.toggleText');

    if (toggleText.html().includes('Развернуть')) {
        toggleText.html('Свернуть <i class="bi bi-chevron-up"></i>');
    } else {
        toggleText.html('Развернуть <i class="bi bi-chevron-down"></i>');
    }
}