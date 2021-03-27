$(function() {

    let convertBlobToUrl = async (blobUrl) => {
        // var blob = new Blob(["Hello, world!"], { type: 'text/plain' });
        // var blobUrl = URL.createObjectURL(blob);

        // var fileReader = new FileReader();
        // fileReader.onload = function(e) {callback(e.target.result);}
        // fileReader.readAsDataURL(blobUrl);

        // let bbb = await fetch(blobUrl).then(r => r.blob());

        // $.get(blobUrl).then(function(data) {
        //   var blob = new Blob([data], { type: 'video/mp4' });
        //   console.log(blob);
        // });

        // var blobToBase64 = function(blob, callback) {
        //     var reader = new FileReader();
        //     reader.onload = function() {
        //         var dataUrl = reader.result;
        //         var base64 = dataUrl.split(',')[1];
        //         console.log(base64);
        //         // callback(base64);
        //     };
        //     reader.readAsDataURL(blob);
        // };
        //
        // blobToBase64(blobUrl);

        // const objectURL = URL.createObjectURL(blobUrl);
        // console.log(objectURL);

        // var xhr = new XMLHttpRequest;
        // // xhr.responseType = 'blob';
        // xhr.responseType = 'arraybuffer';
        //
        // xhr.onload = function() {
        //     var recoveredBlob = xhr.response;
        //
        //     var reader = new FileReader;
        //
        //     reader.onload = function(e) {
        //         console.log("reader", reader);
        //         // console.log("aaaaaaaa => ", blobAsDataUrl);
        //         // var blobAsDataUrl = reader.result;
        //         // window.location = blobAsDataUrl;
        //     };
        //
        //     reader.readAsDataURL(recoveredBlob);
        // };
        // xhr.open('GET', blobUrl, true);
        // xhr.send();


        // var xhr = new XMLHttpRequest();
        // xhr.open('GET', blobUrl, true);
        // xhr.responseType = 'blob';
        // xhr.onload = function(e) {
        //     if (this.status == 200) {
        //         var myBlob = this.response;
        //         console.log(myBlob);
        //     // myBlob is now the blob that the object URL pointed to.
        //     }
        // };
        // xhr.send();


        const deferred = createDeferred<Blob>();
        const xhr = new XMLHttpRequest();

        xhr.responseType = "blob";
        xhr.onload = () => deferred.resolve(xhr.response);
        xhr.onerror = deferred.reject;

        xhr.open("GET", blobUrl, true);
        xhr.send();

        const blobFromFetch = await deferred.promise;

        console.log(blobFromFetch);
    }

    let isInstagram = () => {
        return true;
        var url = window.location.href;

        if (url.contains("instagram.com"))
            return true;

        return false;
    };

    let instagramFeed = () => {

        let _articles = $("section").find("article");

        for(let i = 0; i < _articles.length; i++) {

            let _article = $(_articles[i]);

            /* 전체 다운로드 버튼 추가 */
            let _header = _article.find("header");
            _header.css("position", "relative");
            let _links = _header.find("a");
            let _instagramID = $(_links[0]).attr("href").replaceAll("/", "");

            /* 사진 마다 다운로드 버튼 추가 */
            let _body = _article.children().eq(2);
            let _imgs = _body.find("img");

            for (let j = 0; j < _imgs.length; j++) {

                let _img = $(_imgs[j]);
                let _wrapper = _img.parent();
                let _srcsets = _img.attr("srcset");
                let _video = _wrapper.find("video");


                let _downloadBtn = $("<button>다운로드</button>");
                _downloadBtn.css("position", "absolute");
                _downloadBtn.css("top", "10px");
                _downloadBtn.css("left", "10px");
                _downloadBtn.css("z-index", "99999");


                if (typeof _srcsets !== 'undefined' && _srcsets !== false) {
                    let _imgUrl = "", _imgSize = 0, _imgName = "";

                    _srcsets = (_srcsets.split(",")).map(_srcset => {
                        let row = _srcset.split(" ");
                        row[1] = parseInt(row[1].replace("w", "").replace("px", ""));
                        return row;
                    });
                    for (let u = 0; u < _srcsets.length; u++)
                        if (u == 0 || _imgSize < _srcsets[u][1])  {
                            _imgSize = _srcsets[u][1];
                            _imgUrl = _srcsets[u][0];
                            _imgName = _imgUrl.split("/")
                            _imgName = (_imgName[_imgName.length-1].split("?"))[0]
                        }

                    _downloadBtn.attr("download-action", "download");
                    _downloadBtn.attr("download-url", _imgUrl);
                    _downloadBtn.attr("download-name", _instagramID + "_" + _imgName);
                } else {
                    let _videoUrl = _video.attr("src");
                    let _videoName = _videoUrl.split("/");
                    _videoName = (_videoName[_videoName.length-1].split("?"))[0];

                    convertBlobToUrl(_videoUrl);
                    _downloadBtn.attr("download-action", "downloadBlob");
                    _downloadBtn.attr("download-url", _videoUrl);
                    _downloadBtn.attr("download-name", _instagramID + "_" + _videoName + ".mp4");
                }

                _downloadBtn.on('click', (e) => {
                    let btn = $(e.currentTarget);
                    let payload = {
                        "action"    : btn.attr("download-action"),
                        "filename"  : btn.attr("download-name"),
                        "url"       : btn.attr("download-url")
                    };
                    chrome.runtime.sendMessage(payload);
                });
                _wrapper.css("position", "relative");
                _wrapper.append(_downloadBtn);
            };
        };

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
