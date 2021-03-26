$(function() {

    let isInstagram = () => {
        return true;
        var url = window.location.href;

        if (url.contains("instagram.com"))
            return true;

        return false;
    };

    let instagramFeed = () => { 
        $("section article").each(_article => {

            /* 전체 다운로드 버튼 추가 */
            let _header = _article.find("header");
            _header.css("position", "relative");

            console.log( _header.html() );

            /* 사진 마다 다운로드 버튼 추가 */
            let _body = _article.children().eq(2);
            let _imgs = _body.find("li");
            _imgs.each(function() {

                let _downloadBtn = $("<button>다운로드</button>");
                _downloadBtn.css("position", "absolute");
                _downloadBtn.css("top", "10px");
                _downloadBtn.css("left", "10px");

                let _div = $(this).children().eq(0);
                _div.css("position", "relative");
                _div.append(_downloadBtn);
            });
        });
        
        $("article header")
    };

    let init = () => {

        /* check if current site is instagram */
        if (!isInstagram())
            return;
        
        instagramFeed();
    };
    setTimeout(init, 2000);
});

