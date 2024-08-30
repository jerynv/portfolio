export function appendXHR(componentFile, target) {
    $("<div>").load(componentFile, function () {
        target.append($(this).html());
    });
}

export function cssLoader(href) {
    $("head").append('<link rel="stylesheet" href="' + href + '">');
}

export function jsLoader(src) {
    $("head").append('<script src="' + src + '"></script>');
}