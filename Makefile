APPNAME = CCLE Video Downloader

default: add-on/manifest.json add-on/background.js add-on/grab-info-and-notify.js
	7z a -tzip "$(APPNAME).zip" ./add-on/manifest.json ./add-on/background.js ./add-on/grab-info-and-notify.js

clean:
	rm -f "$(APPNAME).zip*"