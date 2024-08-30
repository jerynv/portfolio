$(document).ready(function () {
    var initEventsComplete = $.Deferred();

    console.log("Document is ready.");

    // Resolve initEventsComplete immediately for testing
    initEventsComplete.resolve();

    // Function to monitor dynamically added scripts

    $(window).on('load', function () {
        console.log("Window loaded.");

        document.fonts.ready.then(function () {
            console.log("Fonts ready.");

            $.when(initEventsComplete).done(function () {
                console.log("All init events and dynamic scripts loaded.");

                $(".loader").fadeOut("slow", function() {
                    $(this).remove();
                    $(".main").css("opacity", 1);
                    //remove display none from main
                });
            });
        });
    });
});
