// background.js - run right aways
// background scripts have access to browser actoin like clicking the extension icon

// global variables
var num_hate = 0

// Called when the user clicks on the browser action (extension icon) - this doesn't work when we have a popup!
// chrome.browserAction.onClicked.addListener(
//     function (tab) {
//         console.log("background.js onClicked listener: here 1");
//         // Send a message to the active tab
//         chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
//             var activeTab = tabs[0];
//             // 'chrome.tabs.sendMessage' used to send messages to content
//             chrome.tabs.sendMessage(activeTab.id, { "message_from_background": "clicked_browser_action" });
//         });
//     });

// listen for messages (json) from content scripts
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log("background.js onMessage listener: here 1");
        // if (request.name == "update_badge") {
        // console.log("background.js onMessage listener: here 2", request.url);
        // chrome.tabs.create({"url": request.url});
        // chrome.browserAction.setBadgeText({ text: '0' });
        // chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
        // }
        if (request.name == "hate_api") { // submit extracted text from website to hatefull api
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");

            var raw = JSON.stringify({
                "text": request.text
            });

            var requestOptions = {
                method: 'POST',
                headers: myHeaders,
                body: raw,
                redirect: 'follow'
            };

            fetch("http://localhost:8000/prediction", requestOptions)
                .then(response => response.text())
                .then(result => {
                    var parsed_json = JSON.parse(result)
                    var labels_arr  = parsed_json['labels']
                    var confs_arr   = parsed_json['scores'] // order: [hate_speech, neither, offensive_language]
                    
                    var hate_speech_conf        = parseFloat(confs_arr[0])
                    var neither_conf            = parseFloat(confs_arr[1])
                    var offensive_language_conf = parseFloat(confs_arr[2])

                    console.log("HATEFUL API REPONSE: ", hate_speech_conf, neither_conf, offensive_language_conf, parsed_json)

                    var hate    = false
                    var neither = false
                    var offense = false

                    // this is temporary, .3 is weak but so is model and we are getting too
                    // many false negatvies. There is a temporary word filter in content to help
                    // with false positives
                    if (hate_speech_conf > 0.3) {
                        hate = true
                    }
                    if (offensive_language_conf > 0.3) {
                        offense = true
                    }

                    // something like below should be used when model is better

                    // for (let i = 0; i < labels_arr.length; i++) {
                    //     if (labels_arr[i] == "neither") {
                    //         neither = true
                    //     }
                    //     if (labels_arr[i] == "hate_speech") {
                    //         hate = true
                    //     }
                    //     if (labels_arr[i] == "offensive_language") {
                    //         offense = true
                    //     }
                    // }

                    var result = "neither"
                    // if (neither) {
                    //     result = "neither"
                    // }
                    if (hate || offense) { // hate or offense > 0.5
                        result = "hate"
                    }

                    // Send a message to the active tab
                    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
                        var activeTab = tabs[0];
                        // 'chrome.tabs.sendMessage' used to send messages to content
                        chrome.tabs.sendMessage(activeTab.id, { "name": "hate_api", "id": request.id, "result": result, "text": request.text });
                    });

                })
                .catch(error => console.log('error', error));
        }
        else if (request.name == "update_badge_num") {
            num_hate += 1
            chrome.browserAction.setBadgeText({ text: num_hate.toString() });
            chrome.browserAction.setBadgeBackgroundColor({ color: 'red' });
        }
        // when links to new tabs wont work in content scripts
        // else if (request.name == "open_link") {
        //     chrome.tabs.create({ url: request.url });
        // }
        return
    }
);