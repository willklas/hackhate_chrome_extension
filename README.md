# hackhate_chrome_extension
- extension holds info for chrome extension, to use, enable developer mode in 'chrome://extensions' and load 'unpacked' extension by selecting the 'extension' folder
    - manafest defines all the basic info and scripts needed for the extension
    - popup contains the html/css/js for the popup/drop down screen for the chrome extension (when you click on the icon)
    - background js defines background script for controlling browser actions
    - content js is for code interacting with the web page
    - *** local website currently hosted locally via python: "python -m http.server 7000" (from extension/popup/Main/pages/)
- ml stuff includes docker material needed to create docker image for hosting the ml classifying api