// background.js
// background scripts have access to browser actoin like clicking the extension icon

// Called when the user clicks on the browser action.
chrome.browserAction.onClicked.addListener(
    function(tab) {
        console.log("background.js onClicked listener: here 1");
        // Send a message to the active tab
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            var activeTab = tabs[0];
            // 'chrome.tabs.sendMessage' used to send messages to content
            chrome.tabs.sendMessage(activeTab.id, {"message_from_background": "clicked_browser_action"});
        });
  });

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("background.js onMessage listener: here 1");
        if( request.message_from_content == "open_new_tab" ) {
            console.log("background.js onMessage listener: here 2", request.url);
            chrome.tabs.create({"url": request.url});
        }
    }
);