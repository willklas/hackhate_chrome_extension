/* NOTES:
   Content pages are js pages that run in the 'context' of web pages meaning it 
   can acutally interact with the data on the pages (html, css, js, etc) that the 
   browser visits. This is important and not all js pages have this access (background).
   
   '$' indicates we are using jquery
   ex: var firstHref = $("a[href^='http']").eq(0).attr("href");
   - the first '(...) is for matching/selecting an html element(s) from the page
   - the .action (everyting after '.') is some jquery action to perform on mathced element(s) 
*/


// var myHeaders = new Headers();
// myHeaders.append("Content-Type", "application/json");

// var raw = JSON.stringify({
//   "text": "This just works"
// });

// var requestOptions = {
//   method: 'POST',
//   headers: myHeaders,
//   body: raw,
//   redirect: 'follow'
// };

// fetch("http://localhost:8000/prediction", requestOptions)
//   .then(response => response.text())
//   .then(result => {
//       var test = JSON.parse(result)
//       console.log("haha", test['labels'])
//     })
//   .catch(error => console.log('error', error));



// const xhttp = new XMLHttpRequest();
// xhttp.onload = function(result) {
// //   document.getElementById("demo").innerHTML = this.responseText;
//     console.log("here ia m", xhttp.response)
// }
// xhttp.open("POST", "http://localhost:8000/prediction/");
// xhttp.send(JSON.stringify({"text": "This just works"}))

// var settings = {
//     "url": "http://localhost:8000/prediction",
//     "method": "POST",
//     "timeout": 0,
//     "headers": {
//       "Content-Type": "application/json"
//     },
//     "data": JSON.stringify({
//       "text": "This just works"
//     }),
//   };
  
//   $.ajax(settings).done(function (response) {
//     console.log("jsklfjlkas;djfl;ajdfgl;kasj", response);
//   });

// console.log("jsjflskjflksjlkd")
// $.ajax({
//     url: 'http://localhost:8000/prediction/',
//     // data: formData,
//     // dataType: 'json',
//     // cache: false,
//     contentType: 'application/json',
//     // processData: false,
//     // dataType: 'application/json',
//     "data": JSON.stringify({
//         "text": "This just works"
//       }),
//     dataType: 'application/json',
//     // Access_Control_Allow_Origin: true,
//     // crossDomain : true,
//     // headers: {  'Access-Control-Allow-Origin': 'https://www.facebook.com/' },
//     type: 'GET',
//     success: function (ocrParsedResult) {
//         //Get the parsed results, exit code and error message and details
//         // var parsed_results = (ocrParsedResult["ParsedResults"])
//         // var parsed_text = ""
//         // if (parsed_results) {
//         //     parsed_text = parsed_results[0].ParsedText
//         // }
//         console.log("fuckkkkkkkkkkkkkkkkkk",ocrParsedResult["Hello"] )
//         // const obj = JSON.parse(ocrParsedResult);
//         console.log(typeof ocrParsedResult.Hello)
//         alert("sdfsssssss")
//         // check_for_hate(image_node, parsed_text)
//         return
//     }
// });


/* everything outside functions, listeners, observers, etc. will be run once when content.js is injected
   which is after the DOM has loaded
*/
console.log("content.js has been injected..."); // console can be viewed in chrome dev tools
// wait(3)
process_images()

// listener for messages from the background
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log("content.js onMessage listener: here 1");
        // request is a parsed json object, (json string???)
        if( request.message_from_background === "clicked_browser_action" ) {
            var firstHref = $("a[href^='http']").eq(0).attr("href");
            console.log("content.js onMessage listener: here 1");

            // var activeTab = tabs[0];
            // chrome.tabs.sendMessage(activeTab.id, {"msg_from_content": firstHref});
            
            // 'chrome.runtime.sendMessage' used to send messages to background
            // chrome.runtime.sendMessage({"message_from_content": "open_new_tab", "url": firstHref});
            // chrome.runtime.sendMessage({"do_it": "yup"});

       }
    }
);

// ???
let observer = new MutationObserver(mutations => {
    // console.log("content.js observer: here 1");
    for(let mutation of mutations) {
         for(let addedNode of mutation.addedNodes) {
             if (addedNode.nodeName === "IMG") {
                //  console.log("Inserted image", addedNode);
              }
          }
     }
 });
// observer vs listener!??
observer.observe(document, { childList: true, subtree: true });

// check if element is in the user's viewport
function isElementInViewport(el) {
    // Special bonus for those using jQuery ???
    // if (typeof jQuery === "function" && el instanceof jQuery) {
    //     el = el[0];
    // }

    var rect = el.getBoundingClientRect();

    var element_tot_area  = (rect.bottom - rect.top) * (rect.right - rect.left);
    var element_view_area = 0;

    if ( (rect.bottom > 0 && rect.top < window.innerHeight) && (rect.right > 0 && rect.left < window.innerWidth) ) { // we are atleast partially in the frame
        var hor_span;
        var ver_span;
        
        // horizontal component
        if (rect.left < 0) { // scenario # 1: element is shifted partially left off view 
            hor_span = rect.right;
        }
        else if (rect.right > window.innerWidth) { // scenario # 2: element is shifted partially right off view
            hor_span = window.innerWidth - rect.left;
        }
        else { // scenario # 2: element (horizontally) is completely within the view
            hor_span = rect.right - rect.left;
        }

        // vertical component
        if (rect.top < 0) { // scenario # 1: element is shifted partially up off view 
            ver_span = rect.bottom;
        }
        else if (rect.bottom > window.innerHeight) { // scenario # 2: element is shifted partially down off view
            ver_span = window.innerHeight - rect.top;
        }
        else { // scenario # 2: element (vertically) is completely within the view
            ver_span = rect.bottom - rect.top;
        }
        
        // deduce total onscreen area
        element_view_area = ver_span * hor_span;

    }

    // return % of element area that is in the viewport
    return element_view_area / element_tot_area;
    
}

// responsilbe from getting text out of images
function extract_txt_from_image(image_node) {
    
    /*
    // method 1
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": "https://ocrly-image-to-text.p.rapidapi.com/?filename=sample.jpg&imageurl="  + image_node.src,
        "method": "GET",
        "headers": {
            "x-rapidapi-host": "ocrly-image-to-text.p.rapidapi.com",
            "x-rapidapi-key": "a91e97306bmsh98b468113e69376p1c150cjsnf5109e5092b4"
        }
    };
    
    $.ajax(settings).done(function (response) {
        console.log(response);
    });
    */
    console.log("heeeeerrrreee we areee")
    // return

    // method 2
    //Prepare form data
    var formData = new FormData();
    // formData.append("file", fileToUpload);
    formData.append("url", image_node.src);
    formData.append("language"   , "eng");
    formData.append("apikey"  , "3c7cd89dfb88957");
    formData.append("isOverlayRequired", "False");
    //Send OCR Parsing request asynchronously

    console.log("huh??")
    
    $.ajax({
        url: 'https://api.ocr.space/parse/image',
        data: formData,
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (ocrParsedResult) {
            //Get the parsed results, exit code and error message and details
            var parsed_results = (ocrParsedResult["ParsedResults"])
            var parsed_text = ""
            if (parsed_results) {
                parsed_text = parsed_results[0].ParsedText
            }
            console.log("extracted text: ", parsed_text, parsed_text.length)
            check_for_hate(image_node, parsed_text)
            return
        }
    });
}

const elements_loaded = new Set() // loaded into DOM
const elements_seen   = new Set() // seen by user (significantly in viewport)

const button_to_image_dict = new Map()
var   num_elements_processed = 0
// unblur blurred images and remove button
function unblur_image(event) {
    console.log("unbluring image for button: ", event.target.id)
    event.stopImmediatePropagation();
    event.stopPropagation()
    event.preventDefault();

    var button_node = document.getElementById(event.target.id)
    var image_node  = button_to_image_dict.get(event.target.id)

    console.log(typeof button_node);
    console.log(typeof image_node);

    image_node.style.webkitFilter = "blur(0px)";
    button_node.parentNode.removeChild(button_node)

    return
}

// mouse on hover animation
function button_onmouse_hover(event) {
    var button_node = document.getElementById(event.target.id)
    button_node.style.backgroundColor='black'
}

// mouse off hover animation
function button_offmouse_hover(event) {
    var button_node = document.getElementById(event.target.id)
    button_node.style.backgroundColor='#555'
}

// blur image
function blur_element(element) {
    // if text contains hate speech
    element.style.webkitFilter = "blur(6px)";

    // create button for hateful image
    var button_node         = document.createElement("button");
    button_node.innerHTML   = "🐺Show?";
    button_node.id          = "hate_hack_image_" + num_elements_processed.toString()
    button_node.onmouseover = button_onmouse_hover;
    button_node.onmouseout  = button_offmouse_hover;
    
    // map the button to the image so we can reference the image later with button events
    button_to_image_dict.set(button_node.id, element);
    
    // create wrapper div tags to help align button in center of image
    var wrapper = document.createElement("div");
    wrapper.id = "hateful_wrapper"

    // get parent node of image node
    var parent_node = element.parentNode
    
    if ( element.tagName == "IMG" ) {
        // option 1 -> seems to work well for facebook only
        parent_node.insertBefore(button_node, element.nextSibling);
        button_node.addEventListener('click', unblur_image);
    }
    else {
        parent_node.insertBefore(wrapper, element)
        parent_node.removeChild(element)
        wrapper.insertBefore(element, null)
        wrapper.insertBefore(button_node, null)
        button_node.addEventListener('click', unblur_image);
    }
    
    // style the button and wrapper
    button_style= "position: absolute; \
                    top: 50%; \
                    left: 50%; \
                    transform: translate(-50%, -50%); \
                    -ms-transform: translate(-50%, -50%); \
                    background-color: #555; \
                    color: white; \
                    font-size: 11px; \
                    padding: 6px 15px; \
                    border: none; \
                    cursor: pointer; \
                    border-radius: 5px;"
    
    button_node.style = button_style
    wrapper.style="display:inline-block;position:relative;"

    return
}

// 
function check_for_hate(element, text) {
    console.log("oh my my my 2")
    if (text.length < 20) {
        // blur_element(element)
        return
    }
    // if (text.toLowerCase().includes("you are the")) {
        console.log("muah mauah muahghhh", text)
        // alert("hja")
        blur_element(element)
    // }
    









    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var raw = JSON.stringify({
      "text": "This just works"
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
          var test = JSON.parse(result)
          console.log("haha", test['labels'])
        })
      .catch(error => console.log('error', error));












    /*
    $.ajax({
        url: 'custom_hate_api',
        data: text, // wrap this in json maybe?
        dataType: 'json',
        cache: false,
        contentType: false,
        processData: false,
        type: 'POST',
        success: function (ocrParsedResult) {
            result = result
            if (result == 'hate') {
                blur_element(element)
            }
        }
    });
    */


    

    return
}

const getDivElementsWithNoChildren = (target) => {
    let candidates;

    if (target && typeof target.querySelectorAll === 'function') {
        candidates = target.querySelectorAll('*');
    }
    else if (target && typeof target.length === 'number') {
        candidates = target;
    }
    else {
        candidates = document.querySelectorAll('div');
    }

    return Array.from(candidates).filter((elem) => {
        return elem.children.length === 0;
    });
};

// everytime it's called, process any unprocessed images (add button and blur)
function process_images() {
    window.requestAnimationFrame(function() {
        console.log("boo")
        // var elements_array = document.getElementsByTagName("p");
        var img_elements_array = document.querySelectorAll('img')
        // var elements_array = $('*:not(:has(*))');
        var div_elements_array = getDivElementsWithNoChildren()
        // var elements_array = img_elements_array.concat(div_elements_array)
        var elements_array = Array.from(img_elements_array).concat(Array.from(div_elements_array))
        for (var i = 0;i < elements_array.length; i++) {
            // elements_array[i].setAttribute("desired_attribute", "value");
            if (!elements_loaded.has(elements_array[i])) {
                elements_loaded.add(elements_array[i]);

                var span_descendants = elements_array[i].querySelectorAll("div");

                

                // if (elements_array[i].childNodes.length != 1) {
                //     // don't want nodes with children
                //     elements_seen.add(elements_array[i]);
                //     return
                // }

                // console.log("hahaha", elements_array[i].tagName)
                // console.log("hahaha", elements_array[i].textContent)
                // console.log("------------", elements_array[i].childNodes.length)
                

                tag = elements_array[i].tagName

                num_elements_processed += 1

                
                // check for hateful speech and (asynchonosly) apply blurring if hateful
                
                // if we have text
                // check_for_hate( elements_array[i], text )
                // else get text and the submit

                

                // console.log('Element is sig. in the viewport!', el_view);

                // track the images we have processed
                // elements_loaded.add(elements_array[i]);
                // num_elements_processed += 1
                if (tag == "IMG") {
                    if (elements_array[i].height*elements_array[i].width > 10000) {
                        // blur_element(elements_array[i])
                        extract_txt_from_image(elements_array[i])
                    }
                    else {
                        // too small
                        elements_seen.add(elements_array[i]);
                    }
                }
                else { // (tag == "SPAN")
                    // console.log("oh my my my 1: ", elements_array[i].textContent )
                    if (span_descendants.length == 0) {
                        check_for_hate( elements_array[i], elements_array[i].textContent )
                    }
                }
                

                //     console.log(".........", elements_array[i].height*elements_array[i].width)

                    
                // }



                // }
            }
            // if element has been loaded (hatefully processed) but not yet seen
            else if (!elements_seen.has(elements_array[i])) {
                var el_view = isElementInViewport(elements_array[i]);
                if (el_view > .5) {
                    elements_seen.add(elements_array[i]);
                    console.log("telling background to invoke icon badge...")
                    chrome.runtime.sendMessage({"do_it": "yup"});
                }
            }
        }
    });
    return;
}

// listen for scrolls 
document.addEventListener('scroll', function(e) {
    // lastKnownScrollPosition = window.scrollY;
    // console.log('Scroll event listener hit!');
    process_images()
    return;
});

