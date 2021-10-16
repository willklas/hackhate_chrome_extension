// background.js
// background scripts have access to browser actoin like clicking the extension icon

console.log("this should run right away!")
// chrome.browserAction.setBadgeText({ tabId: myTabId, text: 'grr' });
// or to add it to all tabs:
// chrome.browserAction.setBadgeText({ text: '!' });
// chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
// or to remove it from all tabs:
// chrome.browserAction.setBadgeText({ });

// Called when the user clicks on the browser action (extension icon) - this doesn't work when we have a popup!
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
        // if( request.message_from_content == "set badge text" ) {
        if ( request.do_it == "yup" ) {
            console.log("blueeeeeeeeee")
            // console.log("background.js onMessage listener: here 2", request.url);
            // chrome.tabs.create({"url": request.url});
            chrome.browserAction.setBadgeText({ text: '!' });
            chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
        }
    }
);