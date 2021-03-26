$(function() {

    let isInstagram = () => {
        return true;
        var url = window.location.href;

        if (url.contains("instagram.com"))
            return true;

        return false;
    };


    let init = () => {

        /* check if current site is instagram */
        /*
        if (!isInstagram())
            return;
        */

        $(".container").append("<button>Phil Goo Kang</button>");
    };

    init();
});

