(function () {
  // Show a toast on the screen for 3 seconds
  function showToast() {
    const toast = document.createElement("div");
    toast.textContent = "Downloading video...";
    toast.style.backgroundColor = "#26a353";
    toast.style.color = "white";
    toast.style.textAlign = "center";
    toast.style.padding = "12px";
    toast.style.borderRadius = "5px";
    toast.style.border = "solid #165e30";
    toast.style.borderWidth = "0px 2px 2px 0px";
    toast.style.position = "fixed";
    toast.style.margin = "auto";
    toast.style.left = "0";
    toast.style.right = "0";
    toast.style.top = "100px";
    toast.style.width = "190px";
    toast.style.pointerEvents = "none";
    toast.style.userSelect = "none";

    document.body.appendChild(toast);

    window.setTimeout(function () {
      toast.remove();
    }, 3000);
  }

  // Find the name of the class and possibly of the lecture
  function getVideoInfo() {
    const videoInfo = {
      className: "unknown_class",
      title: "unknown_title"
    };

    // The breadcrumb list is a naivgation helper near the top of the page
    // Example: My sites / 201C-THEATER106-2 / Week 1 / Lecture 2: Early American Forms (27 min)
    const breadcrumbList = document.querySelector("#page-navbar ol");
    if (breadcrumbList == null || breadcrumbList.querySelectorAll("li").length < 2) {
      console.log("CCLE Video Downloader: cannot find class name");
      return videoInfo;
    }

    // The list has elements other than the list items, so we need to filter 
    //  those out
    // FIXME: Find a way to not repeat this part (repeated above)
    const listElements = breadcrumbList.querySelectorAll("li");

    // Now we know that the breadcrumb list exists and has the class name in it
    // The second element in the breadcrumbList is a list item that holds an
    //  a element that holds the name of the class
    const classNameHolderText = listElements[1].querySelector("a").textContent;

    // The name in the link has an additional few characters that indicate the 
    //  quarter and section of the class; we want to remove those characters
    //  Example: 201C-THEATER106-2
    //  Here, the 201C- refers to Summer session C of 2020
    //  The -2 means that it is the second section of the class (is that right? Not sure)
    const positionOfFirstDash = classNameHolderText.indexOf("-");
    const positionOfLastDash = classNameHolderText.lastIndexOf("-");
    if (positionOfLastDash === -1 || positionOfFirstDash === positionOfLastDash) {
      console.log("CCLE Video Downloader: cannot find class name");
      return videoInfo;
    }
    videoInfo.className = classNameHolderText.substring(
      positionOfFirstDash + 1,
      positionOfLastDash);

    // If there is no breadcrumb after the class name, then we cannot find any
    //  information about the title of the video
    if (listElements.length < 3) {
      return videoInfo;
    }

    // Finally, we gather the title of the video by concatenating the contents
    //  of the last elements in the breadcrumb list
    // For our example of: 
    // My sites / 201C-THEATER106-2 / Week 1 / Lecture 2: Early American Forms (27 min)
    // The title then becomes: Week 1 - Lecture 2: Early American Forms (27 min)
    // Of course, this is an invalid filename, but we will let the download
    //  script handle that problem
    videoInfo.title = listElements[2].querySelector("a").textContent;
    for (let i = 3; i < listElements.length; i++) {
      videoInfo.title += " - " + listElements[i].querySelector("a").textContent;
    }

    return videoInfo;
  }

  console.log("CCLE Video Downloader: Finding video info...");
  const videoInfo = getVideoInfo();
  
  // At the moment, the notification text is "Downloading video..."
  // This is a bit of a lie because we don't know if the video has actually
  //  begun downloading, there might be an error that prevents the download from
  //  actually happening, at which point the message becomes... unhelpful
  console.log("CCLE Video Downloader: Showing toast notification...");
  showToast();

  // The background script which launches this script is waiting for the "return
  //  value" of the script, which is the video info
  console.log("CCLE Video Downloader: Sending info to background script...");
  return videoInfo;
})();