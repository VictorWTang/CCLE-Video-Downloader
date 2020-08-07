(function () {
  function receiveVideoInfo(videoInfo, url) {
    console.log("CCLE Video Downloader: Video info received by background script");
    videoInfo.url = url;
    
    console.log("CCLE Video Downloader: Sending info to downloader...");
    console.log("CCLE Video Downloader: videoInfo: " + videoInfo);
    const sending = browser.runtime.sendNativeMessage(
      "ccle_video_downloader",
      videoInfo
    );
    
    sending.then(function(response) {
      console.log("CCLE Video Downloader: " + response);
    }, function(error) {
      console.log(`CCLE Video Downloader: ${error}`);
    });
  }

  function logURL(requestDetails) {
    const url = requestDetails.url;
    
    // The page appears to make two requests that match the url filter
    // One of them returns a long json file, while the other contains the actual
    //  m3u8 file that we need
    // The requests are identical aside from two extra parameters inlcuded in
    //  the json request
    // One of those parameters is "responseformat=jsonp", so we filter that one out
    if (!url.includes("responseFormat=jsonp")) {
      console.log("CCLE Video Downloader: Executing in-tab script");
      const executing = browser.tabs.executeScript(
          requestDetails.tabID, {
          file: "grab-info-and-notify.js"
        });
      executing.then(function (result) {
        receiveVideoInfo(result[0], url);
      });
    }
  }

  browser.webRequest.onBeforeRequest.addListener(
    logURL, {
      urls: ["https://cdnapisec.kaltura.com/*a.m3u8*"]
    }
  );

})();