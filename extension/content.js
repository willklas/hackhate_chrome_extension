/* NOTES:
   Content pages are js pages that run in the 'context' of web pages meaning it 
   can acutally interact with the data on the pages (html, css, js, etc) that the 
   browser visits. This is important and not all js pages have this access (background).
   
   '$' indicates we are using jquery
   ex: var firstHref = $("a[href^='http']").eq(0).attr("href");
   - the first '(...) is for matching/selecting an html element(s) from the page
   - the .action (everyting after '.') is some jquery action to perform on mathced element(s) 
*/

/* everything outside functions, listeners, observers, etc. will be run once when content.js is injected
   which is after the DOM has loaded
*/
console.log("content.js has been injected..."); // console can be viewed in chrome dev tools
process_images()

// global definitions
const elements_loaded       = new Set() // loaded into DOM
const elements_seen         = new Set() // seen by user (significantly in viewport)
const button_to_link        = new Map()
const button_to_image_dict  = new Map()
const element_id_to_element = new Map()
const element_to_element_id = new Map()

var num_elements_processed  = 0
var num_buttons             = 0

// listener for messages from the background
chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        if (request.name = "hate_api") {
            // console.log("hate_api resp:", request.text, request.result)
            if (request.result != "neither") {
                element = element_id_to_element.get(parseInt(request.id))
                blur_element(element, request.text)
            }
        }

    }
);

// check percentage of element in the user's viewport
function isElementInViewport(el) {
    var rect = el.getBoundingClientRect();

    var element_tot_area = (rect.bottom - rect.top) * (rect.right - rect.left);
    var element_view_area = 0;

    if ((rect.bottom > 0 && rect.top < window.innerHeight) && (rect.right > 0 && rect.left < window.innerWidth)) { // we are atleast partially in the frame
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
function extract_text_from_image(image_node) {
    //Prepare form data
    var formData = new FormData();
    // formData.append("file", fileToUpload);
    formData.append("url", image_node.src);
    formData.append("language", "eng");
    // formData.append("apikey", "3c7cd89dfb88957");
    formData.append("apikey", "eb71eea85288957");
    formData.append("isOverlayRequired", "False");

    // add this in to skip extractoin for quick testing
    // check_for_hate(image_node, "is this hate speech??? who knows")
    // return

    // Send OCR Parsing request asynchronously
    // TODO : move ajax to background like hateful api, works much better
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
            console.log("TEXT SUCCESFULLY EXTRACTED: ", parsed_text, parsed_text.length)
            check_for_hate(image_node, parsed_text)
            return
        },
        error: function (ocrParsedResult) {
            console.log("error:", ocrParsedResult)
        }
    });
}

// unblur blurred images and remove button
function unblur_image(event) {
    if (event.target.nodeName == "BUTTON") {
        console.log("unbluring image for button: ", event.target.id, event.target.nodeName)
        event.stopImmediatePropagation();
        event.stopPropagation()
        event.preventDefault();

        var button_node = event.target //document.getElementById(event.target.id)
        var image_node = button_to_image_dict.get(event.target.id)

        console.log(typeof button_node);
        console.log(typeof image_node);

        image_node.style.webkitFilter = "blur(0px)";
        button_node.parentNode.removeChild(button_node)
    }

    return
}

// external link trouble? this will get background to do it
function open_content_link(event) {
    if (event.target.nodeName == "A") {
        var node = event.target
        var link = event.target.url

        console.log("open_content_link: ", event.target.id, link, node.nodeName)

        chrome.runtime.sendMessage({"name":"open_link","url": link});
    }
    return
}

// mouse on hover animation
function button_onmouse_hover(event) {
    var button_node = document.getElementById(event.target.id)
    button_node.style.backgroundColor = 'black'
}

// mouse off hover animation
function button_offmouse_hover(event) {
    var button_node = document.getElementById(event.target.id)
    button_node.style.backgroundColor = '#555'
}

// words for helping ml classifier (only while its weak) - combine them for decent results
const islam_words    = ["islam", "sharia", "muslim", "muhammad"]
const minority_words = ["black", "asian"]
const xeno_words     = ["refugee", "brown", "immigrant"]
const lgbtq_words    = ["lesbian", "gay", "trans"]
const hateful_words  = ["back", "violent", "incest", "kill", "criminal", "anti", "faker", "terrorist", "steal", "stealing", "eww", "taking"]
// phrases for helping ml classifier (only while its weak) - if you can't get a system from above words
const lgbtq_hateful_phrases = ["so gay"]
// relevent links
islam_link      = "http://localhost:7000/islamophobia.html"
xenophobia_link = "http://localhost:7000/xenophobia.html"
lgbtq_link      = "http://localhost:7000/lgbt.html"

// blur element
function blur_element(element, text) {
    // if we are here, model infered some sort of hate speech
    
    mod_text = text.toLowerCase()

    var islam_word_check       = false
    var minority_word_check    = false
    var xeno_word_check        = false
    var lgbtq_word_check       = false
    var hateful_word_check     = false
    var lgbtq_hatephrase_check = false

    // islam word check
    for (let i = 0; i < islam_words.length; i++) {
        if (mod_text.includes(islam_words[i])) {
            console.log("what!!!!!!!!", islam_words[i])
            islam_word_check = true
            break
        }
    }
    // minority word check
    for (let i = 0; i < minority_words.length; i++) {
        if (mod_text.includes(minority_words[i])) {
            minority_word_check = true
            break
        }
    }
    // xeno word check
    for (let i = 0; i < xeno_words.length; i++) {
        if (mod_text.includes(xeno_words[i])) {
            xeno_word_check = true
            break
        }
    }
    // lgbtq word check
    console.log(mod_text)
    for (let i = 0; i < lgbtq_words.length; i++) {
        console.log(lgbtq_words[i])
        if (mod_text.includes(lgbtq_words[i])) {
            console.log("BAMMMMMMMMMM")
            lgbtq_word_check = true
            break
        }
    }
    // hateful word check
    for (let i = 0; i < hateful_words.length; i++) {
        if (mod_text.includes(hateful_words[i])) {
            hateful_word_check = true
            break
        }
    }
    // lgbtq hateful phrases check
    for (let i = 0; i < lgbtq_hateful_phrases.length; i++) {
        if (mod_text.includes(lgbtq_hateful_phrases[i])) {
            lgbtq_hatephrase_check = true
            break
        }
    }

    // default (for ties maybe?)
    link = "http://localhost:7000/SendaGiftPage.html" // local website currently hosted locally via python: "python -m http.server 7000" (from extension/popup/Main/pages/)
    
    // determine most significant hate type and link there
    // special case for xenophobia
    if (mod_text.includes("back to") && mod_text.includes("own country")) {
        link = xenophobia_link
    }
    else if (hateful_word_check) {
        if (islam_word_check) {
            link = islam_link
        }
        else if (xeno_word_check) {
            link = xenophobia_link
        }
        else if (lgbtq_word_check) {
            link = lgbtq_link
        }
    }
    else if (lgbtq_hatephrase_check) {
        link = lgbtq_link
    }
    else {
        // for now, consider it a false positve, model is still in early stages
        return
    }

    // it's official, it's hate :(
    chrome.runtime.sendMessage({ "name": "update_badge_num"});

    element.style.webkitFilter = "blur(6px)";
    num_buttons += 1

    console.log("HATE HELPER:", mod_text, link)

    // create button for hateful image
    var button_node = document.createElement("button");
    button_node.innerHTML = "🐺May contain hateful content, view?\n(learn more <a id = black url=\"\" style=\"color: red;\" href=\"" + link + "\" target=\"_blank\">here</a>)";
    button_node.id = "hate_hack_image_" + num_buttons.toString()
    button_node.onmouseover = button_onmouse_hover;
    button_node.onmouseout = button_offmouse_hover;

    button_to_image_dict.set(button_node.id, element);


    // for external link troubles
    // button_node.addEventListener('click', open_content_link);

    // create wrapper div tags to help align button in center of image
    var wrapper = document.createElement("div");
    wrapper.id = "hateful_wrapper"

    // get parent node of image node
    var parent_node = element.parentNode

    if (element.tagName == "IMG") {
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
    button_style = "position: absolute; \
                    top: 50%; \
                    left: 50%; \
                    transform: translate(-50%, -50%); \
                    -ms-transform: translate(-50%, -50%); \
                    background-color: #555; \
                    color: white; \
                    font-size: 13px; \
                    padding: 12px 24px; \
                    border: none; \
                    cursor: pointer; \
                    border-radius: 5px;"

    button_node.style = button_style
    wrapper.style = "display:inline-block;position:relative;"

    return
}

// invokes model for hate text recognition
function check_for_hate(element, text) {
    // this needs to be shorter eventually (~10) - need it right now for annoying fb stuff
    if (text.length < 20) {
        return
    }

    // ajax so much better from background versus content
    var string_id = (element_to_element_id.get(element)).toString()
    chrome.runtime.sendMessage({ "name": "hate_api", "text": text, "id": string_id });

    return
}


// get div elements with no children
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

// everytime it's called, process any unprocessed images
function process_images() {
    window.requestAnimationFrame(function () {
        // var elements_array = document.getElementsByTagName("p");
        var img_elements_array = document.querySelectorAll('img')
        // var elements_array = $('*:not(:has(*))');
        var div_elements_array = getDivElementsWithNoChildren()
        // var elements_array = img_elements_array.concat(div_elements_array)
        var elements_array = Array.from(img_elements_array).concat(Array.from(div_elements_array))
        
        for (var i = 0; i < elements_array.length; i++) {
            // elements_array[i].setAttribute("desired_attribute", "value");
            if (!elements_loaded.has(elements_array[i])) {
                num_elements_processed += 1
                elements_loaded.add(elements_array[i]);

                element_id_to_element.set(num_elements_processed, elements_array[i]);
                element_to_element_id.set(elements_array[i], num_elements_processed)

                var span_descendants = elements_array[i].querySelectorAll("div");

                tag_name = elements_array[i].tagName

                if (tag_name == "IMG") {
                    if (elements_array[i].height * elements_array[i].width > 10000) {
                        // blur_element(elements_array[i])
                        extract_text_from_image(elements_array[i])
                    }
                    else {
                        // too small
                        elements_seen.add(elements_array[i]);
                    }
                }
                else { // (tag == "SPAN")
                    // console.log("oh my my my 1: ", elements_array[i].textContent )
                    if (span_descendants.length == 0) {
                        check_for_hate(elements_array[i], elements_array[i].textContent)
                    }
                }

            }
            // if element has been loaded (hatefully processed) but not yet seen
            // else if (!elements_seen.has(elements_array[i])) {
            //     var el_view = isElementInViewport(elements_array[i]);
            //     if (el_view > .3) {
            //         elements_seen.add(elements_array[i]);
            //         console.log("telling background to invoke icon badge...")
            //         chrome.runtime.sendMessage({ "name": "update_badge" });
            //     }
            // }
        }
    });
    return;
}

// listen for scrolls 
document.addEventListener('scroll', function (e) {
    // lastKnownScrollPosition = window.scrollY;
    // console.log('Scroll event listener hit!');
    process_images()
    return;
});

