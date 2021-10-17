alert("hahahahah")

function turd() {
    var x = document.getElementById("myTopnav");
    if (x.className === "topnav") {
        x.className += " responsive";
    } else {
        x.className = "topnav";
    }
}

// function myFunction() {
//     var x = document.getElementById("myTopnav");
//     if (x.className === "topnav") {
//       x.className += " responsive";
//     } else {
//       x.className = "topnav";
//     }
//   }

  // triggers the function to switch between normal mode and accessibility mode for large font
  $("#accessibilityButton").click(accessibilityFunc);
  
  // loads the large size navigation bar
  window.onload = loadNavbar();
  
  //shopping cart is by default hidden and only becomes visible when an item is added 
  $(".shopcart").hide();
  
  //loads the function to get media query size and therfore apply hamburger menue function if it is a small size device
  window.onload = mediaqueryfunc();
  
  //eventlisteners for when the hamburger menue button is clicked , for small size devices 
  $("#topnavelementhamburgerbutton").click(hamburgermenuefunc);
  
  // calls the function to activate SendsGift on the navigation bar
  window.onload = sendagiftactivefunc();
  
  // loads the small size (hamburgermenue) navigation bar
  window.onload = smallnavbarfunc();

  //Food filter trigger
  $("#searchdropdown").change(searchFilter);

  //eventlisteners for mouseover tabs of the top navigation bar
  $("#topnavelementhome").mouseover(mouseoverFunc);
  $("#topnavelementabout").mouseover(mouseoverFunc);
  $("#topnavelementcontact").mouseover(mouseoverFunc);
  $("#topnavelementgallery").mouseover(mouseoverFunc);
  $("#topnavelementsendagift").mouseover(mouseoverFunc);

  //eventlisteners for mouseout tabs of the top navigation bar
  $("#topnavelementhome").mouseout(mouseoutFunc);
  $("#topnavelementabout").mouseout(mouseoutFunc);
  $("#topnavelementcontact").mouseout(mouseoutFunc);
  $("#topnavelementgallery").mouseout(mouseoutFunc);
  $("#topnavelementsendagift").mouseout(mouseoutFunc);

  //eventlisteners for click on tabs of the top navigation bar
  $("#topnavelementhome").click(activeFunc);
  $("#topnavelementabout").click(activeFunc);
  $("#topnavelementcontact").click(activeFunc);
  $("#topnavelementgallery").click(activeFunc);
  $("#topnavelementsendagift").click(activeFunc);

  //triggers the function to add item to shopping cart everytime button is clicked
  $(".addTocartButton").click(addtocartfunc);