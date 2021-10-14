// 'content' page is a js page that runs in the 'context' of web pages meaning it 
// can acutally interact with the data on the pages that the browser visits.
// This is important and not all extension js pages have this access

// alert("hi, this is conent.js!")

// '$' indicates we are using jquery, 
// first '(...) is for matching/selecting an html element(s) from the page
// .action - everyting after '.' is some jquery action to perform on mathced element(s)
// var firstHref = $("a[href^='http']").eq(0).attr("href");

// everything outside functions, listeners, observers, etc. will be run once when content.js is injected
console.log("content.js has been injected..."); // console can be viewed in chrome dev tools
do_stuff()

// content.js
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
            chrome.runtime.sendMessage({"message_from_content": "open_new_tab", "url": firstHref});

       }
    }
);

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

function isElementInViewport(el) {
    // Special bonus for those using jQuery ???
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    }

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

const elements_seen      = new Set()
const elements_processed = new Set()
function do_stuff() {
    window.requestAnimationFrame(function() {
        // var arrOfPtags = document.getElementsByTagName("p");
        var arrOfPtags = document.querySelectorAll('img')
        for (var i = 0;i < arrOfPtags.length; i++){
            // arrOfPtags[i].setAttribute("desired_attribute", "value");
            if (!elements_seen.has(arrOfPtags[i])) {
                var el_view = isElementInViewport(arrOfPtags[i]);
                if (el_view > .2) {
                    console.log('Element is sig. in the viewport!', el_view);
                    arrOfPtags[i].style.webkitFilter = "blur(6px)";
                    elements_processed.add(arrOfPtags[i])




                    // org_html = document.getElementById("slidesContainer").innerHTML;
                    org_html = arrOfPtags[i].innerHTML;
                    new_html = "<div class='container'>" + org_html + "<button class='btn'>Button</button></div>";
                    // document.getElementById("slidesContainer").innerHTML = new_html;
                    arrOfPtags[i].innerHTML = new_html;

                    // <div class="container">
                    // <img src="img_snow.jpg" alt="Snow">
                    // <button class="btn">Button</button>
                    // </div>





                }
                else {
                    arrOfPtags[i].style.webkitFilter = "blur(0px)";
                }
            }
            elements_seen.add(arrOfPtags[i])
        }
    });
    return;
}

document.addEventListener('scroll', function(e) {
    // lastKnownScrollPosition = window.scrollY;
    do_stuff()
    return;
});

