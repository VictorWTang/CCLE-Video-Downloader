# Copy CCLE Video Link

## About

A Firefox addon and Python script to download videos from CCLE.

## Installation

### For Windows

1. Copy the `app\windows\ccle_video_downloader.bat.example` file to `app\windows\ccle_video_downloader.bat`. On line 3, change "`C:\Path\To\CCLE video downloader\app`" to match the location of the app folder.
2. Copy the `app\ccle_video_downloader.json.example` file to `app\ccle_video_downloader.json`. Within the file, change the `path` key to the path to the `app\windows\ccle_video_downloader.bat` file. **All backslashes (\\) in the path must be escaped by using two backslashes (\\\\).**
3. Copy the `app\windows\set_location.reg.example` file to `app\windows\set_location.reg`. On lines 4 and 7, change "`C:\\Path\\To\\CCLE video downloader\\app\\ccle_video_downloader.json`" to match the location of the `app\ccle_video_downloader.json` file. **All backslashes (\\) in the path must be escaped by using two backslashes (\\\\).** Run the file to install the required registry keys. 
4. Copy the `app\config.example` file to `app\config`. Edit the path option to set where you want to save the files to.
5. Add all files in the `add-on` folder to a `.zip` archive. To do this, select all the files in the `add-on` folder, right click, and select `Send to > Compressed (zipped) folder`.
6. In Firefox, visit the `about:debugging` page by entering it into the URL bar. Select `This Firefox` on the left menu, and click `Load Temporary Add-on...`. Select the `.zip` file created in step 5.
7. Remove the extension after downloading the videos you want.

### For Mac/Linux

TODO

## Usage

On a page with a CCLE video, press the play button of the video you want to download. A notification will appear near the top of the screen. At this point, the video will begin downloading. You may pause the video or close the tab.

## How this works

The browser add-on is composed of a background and a content-script. The background script listens for URLs that match this filter: `https://cdnapisec.kaltura.com/*a.m3u8*`. Those URLs contain the information required to download the video. When a request with a URL that matches that filter is made, the background script executes the content script in the tab from where the request was made. The content script displays a notification (a toast) and looks for the class name and video title. The notification indicates that a video has begun downloading. The class name and video title are derived from the CCLE page by using the navigation links at the top. The content script then sends the class name and video information to the background script, which then bundles that information with the video URL and sends it to the external Python script.

The external Python script receives the video information. From that, it creates (if not existing already) a sub-folder for the class, and downloads the video into that sub-folder. The script uses the Youtube-dl library. The base directory to download videos into can be configured using the `config` file in the app directory.

Communication between the Firefox add-on and the Python script is done using the "NativeMessaging" API. 

## To-do

* Test without the `tabs` permission, it might not be necessary
* Find a way to avoid using the `<all_urls>` permission
* Support pages with multiple videos (only one video will be downloaded if a page has multiple videos)
* Provide more useful notifications
* Support Mac/Linux better
* Write an initialization script that automatically generates the directory-dependent files