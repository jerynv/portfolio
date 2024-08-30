$(document).ready(function () {
    console
    $('[page]').on('mouseover', function () {
        var page = $(this).attr('page');
        var url = createUrl(page);
        $('body').append(url);
    });
    $('[page]').on('mouseout', function () {
        $('.fake-url').remove();
    });
});

function createUrl(page) {
    el = $('span').text(page)
    el.addClass('fake-url');
    el.css({
        'position': 'fixed',
        'bottom': '0',
        'left': '0',
        'color': 'white',
        'background': 'red',
        'padding': '5px',
        'border-radius': '5px',
        'margin': '5px',
        'z-index': '9999'
    });

    return el;
}