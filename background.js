let downloadFile = (filename, url) => {
    chrome.downloads.download({
        url      : url,
        filename : filename,
        saveAs   : false
    });
}

let downloadBlob = (filename, blob) => {
    const url = URL.createObjectURL(blob);
    chrome.downloads.download({
        url      : url,
        filename : filename,
        saveAs   : false
    });
    URL.revokeObjectURL(url);
}

chrome.runtime.onMessage.addListener( (arg, sender, sendResponse) => {
    if (arg.action === "download") {
        downloadFile(arg.filename, arg.url);
    } else if (arg.action === "downloadBlob") {
        downloadBlob(arg.filename, arg.url);
    }
});
