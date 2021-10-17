/* ##################################################### Common between all pages ###################################### */

    /*************************************************** Navigation Bar*********************************************/
        // this function writes the html code for the navogation bar 
        function loadNavbar(){

            $("#navMenue").html(

                '<div class="topnav" id="myTopnav">' +

                    '<a href="HomePage.html" id="topnavelementhome" style="text-decoration:none">Home</a>' +

                    '<a href="SendaGiftPage.html" id="topnavelementsendagift" style="text-decoration:none">Send a Gift</a>' +

                    '<a href="GalleryPage.html" id="topnavelementgallery" style="text-decoration:none">Gallery</a>' +

                    '<a href="HomePage.html#about" id="topnavelementabout" style="text-decoration:none">About</a>' +

                    '<a href="HomePage.html#contact" id="topnavelementcontact" style="text-decoration:none">Contact</a>' +

                    '<a href="javascript:void(0);" id="topnavelementhamburgerbutton" class="hamburgermenuebutton">' +

                        '<i class="fa fa-bars"></i>' +

                    '</a>' +

                '</div>'   );

        }           

    /***************************************************JS functions for Navigation Bar*******************************************************************/

        // this functions flips the activate class between home,about,contact, when these pages are triggered from the Home page

        function activateforhomepage(){

            // calls the function to activate about on the navigation bar when called from outside of homepage  

            if(window.location.href.indexOf("about") > -1) {

            aboutactivefunc();

            }

            // calls the function to activate contact on the navigation bar when called from outside of homepage    

            else if(window.location.href.indexOf("contact") > -1) {

            contactactivefunc();

            }

            // calls the function to activate home on the navigation bar when called from outside of homepage   

            else{

            homeactivefunc();}

        }

        // this function is triggered when the hamburger menue icon is clicked

        function hamburgermenuefunc() {

            $("#myTopnav").addClass("hamburgermenue");

            // display all elements of the navigation bar in the vertical hamburgur menue when the dropdown icon is clicked  
            
            var menu=$('.hamburgermenue a');
            
            menu.show();  

            menu.css("float","none");

            menu.css("textAlign","left");

        }

        

        // this function changes the text color and back gorund color of the elements on the navigation bar, as user hovers over and out

        function mouseoverFunc()

            //check if it is not the current active page

            { if (this.className !== "active"){

                // change color and background color of top nav elements, when mouse is over(user is hovering)

                $(this).css("color", "black");

                $(this).css("backgroundColor","#E5E8E8");

                }
            }
        

            //check that is its not the current active page

            function mouseoutFunc()

            { if (this.className!=="active"){

                // change color and background color of top nav elements, when mouse is out

                $(this).css("color", "white");
                $(this).css("backgroundColor","#333");

        }

        }

        

        // removes the active characteristics from a top nav element which was active but not anymore

        function noneactiveFunc(element){

            element.addClass("noneactive");

            element.css("background-color", "#333")

            element.css("color","white");

        }

        // the following functions chanage the text color and background color and add class active, to the top navigation elements which is currently active

        function galleryactivefunc(){

            $("#topnavelementgallery").css("background-color","#F5CBA7");

            $("#topnavelementgallery").css("color","black");

            $("#topnavelementgallery").addClass("active");


        }
        // the following functions chanage the text color and background color and add class active, to the top navigation elements which is currently active

        function sendagiftactivefunc(){

            $("#topnavelementsendagift").css("background-color","#F5CBA7");

            $("#topnavelementsendagift").css("color","black");

            $("#topnavelementsendagift").addClass("active");


        }
        // the following functions chanage the text color and background color and add class active, to the top navigation elements which is currently active

        function homeactivefunc(){

            $("#topnavelementhome").css("background-color","#F5CBA7");

            $("#topnavelementhome").css("color","black");

            $("#topnavelementhome").addClass("active");   

        }
        // the following functions chanage the text color and background color and add class active, to the top navigation elements which is currently active


        function aboutactivefunc(){

            $("#topnavelementabout").css("background-color","#F5CBA7");

            $("#topnavelementabout").css("color","black");

            $("#topnavelementabout").addClass("active");     
        

        }
        // the following functions chanage the text color and background color and add class active, to the top navigation elements which is currently active

        function contactactivefunc(){

            $("#topnavelementcontact").css("background-color","#F5CBA7");

            $("#topnavelementcontact").css("color","black");

            $("#topnavelementcontact").addClass("active");    

        }

        

        //this functin activates Contact and About when clicked from Home page

        function activeFunc(){

        //first noneactive the current active page 


        if ($("#topnavelementhome").attr('class')=== "active"){

            noneactiveFunc($("#topnavelementhome"));

        }
        //first noneactive the current active page 

        if ($("#topnavelementabout").attr('class')=== "active"){

            noneactiveFunc($("#topnavelementabout"));

        }
        //first noneactive the current active page 

        if ($("#topnavelementcontact").attr('class')=== "active"){

            noneactiveFunc($("#topnavelementcontact"));

        }

        // then add the css properties of active page to the current page

            this.style.backgroundColor = "#F5CBA7";

            this.style.color = "black";

            this.className ="active";

        }

    /*****************************************JS functions for Navigation Bar for small size devices ***********************************/

        function mediaqueryfunc(){

            // using media query identify small size device

            var devicesize = window.matchMedia("(max-width: 600px)");

            // for small size device

            if (devicesize.matches){

            // make the hamburger icon visible   

                $("#topnavelementhamburgerbutton").css("display","block");}

            // for non small size device

            else{

            // make the hamburger icon invisible   

                $("#topnavelementhamburgerbutton").css("display","none");}

        } 

        function smallnavbarfunc(){

        if($("#topnavelementhamburgerbutton").css("display")==="block"){

                // if send a gift is the active page, make the nav bar element for all other pages invisible

                if(document.getElementById("topnavelementsendagift").className=== "active"){
                    $(".topnav a").eq(0).hide();
                    $(".topnav a").eq(2).hide();
                    $(".topnav a").eq(3).hide();
                    $(".topnav a").eq(4).hide();

                }

                // if gallery is the active page, make the nav bar element for all other pages invisible

                else if(document.getElementById("topnavelementgallery").className=== "active"){
                
                    $(".topnav a").eq(0).hide();
                    $(".topnav a").eq(1).hide();
                    $(".topnav a").eq(3).hide();
                    $(".topnav a").eq(4).hide();            

                }

                // if home page is the active page, make the nav bar element for all other pages invisible

                else if(document.getElementById("topnavelementhome").className=== "active"){

                    $(".topnav a").eq(1).hide();
                    $(".topnav a").eq(2).hide();
                    $(".topnav a").eq(3).hide();
                    $(".topnav a").eq(4).hide();                        

                }    

                // if about page, make the nav bar element for all other pages invisible

                else if(document.getElementById("topnavelementabout").className=== "active"){

                    $(".topnav a").eq(0).hide();
                    $(".topnav a").eq(1).hide();
                    $(".topnav a").eq(2).hide();
                    $(".topnav a").eq(4).hide();            
            

                }

                // if contact is the active page, make the nav bar element for all other pages invisible

                else if(document.getElementById("topnavelementcontact").className=== "active"){

                    $(".topnav a").eq(0).hide();
                    $(".topnav a").eq(1).hide();
                    $(".topnav a").eq(2).hide();
                    $(".topnav a").eq(3).hide();            


                }                 

            }
        }

        /******************************************************Accessibility Mode ***********************************************/
        function accessibilityFunc(){
        var currentMode;
        currentMode= $("#accessibilityButton").text().trim();
        if (currentMode==="Large Font"){
                $("p,tr,h1,h2,h3,h4,button").css("font-size","150%");
                $("a").css("font-size","110%");
                $("h1").css("font-size","350%");
                $("#accessibilityButton").text("Normal Font");
        }
            else if (currentMode==="Normal Font"){
                $("p,tr,h1,h2,h3,h4,a,button").css("font-size","100%");
                $("h1").css("font-size","180%");
                $("#accessibilityButton").text("Large Font");
        }

    }

/* #################################################### Home Page ###################################################### */

 /**************************************************** Contact US *************************************************************/
        // add rewuired property to fileds of the contact form
        function contactform(){
        $(".inputfieldprop").prop("required", true);
        }
        // function for popup for confirmation once a contact form is submitted
        function openpopup() {
            var firstname= $(".inputfieldprop").eq(0).val()!=="";
            var lastname= $(".inputfieldprop").eq(1).val()!=="";
            var email= $(".inputfieldprop").eq(2).val()!=="";
            var text= $(".inputfieldprop").eq(3).val()!=="";
            // check if all of the mandatory fields are non-empty
            if (firstname & lastname & email & text){
                // generate a random combination of numbers and letters, 5 characters long
                var ConfirmationId= Math.random().toString(36).substring(2, 7).toUpperCase();
                // write the random number which is the confirmation ID,in the confirmation pop-up
                $("#popupText").text("Thank you for your donation! Your cofirmation number is " + ConfirmationId);
                // pop up apears while fading in
                $(".popup").fadeIn(300);
            }
        }
        // close the pop-up while fade out
        function closepopup() {
                $(".popup").fadeOut(300);
            }
 
    /*************************************************** AJAX to submit data from contact us form *****************************************/



    /***************************************************External JS for Email Validation***************************************************/

        /*Advanced Email Check credit-

        By JavaScript Kit (http://www.javascriptkit.com)

        Over 200+ free scripts here!*/

        /* sourceL http://www.javascriptkit.com/script/script2/acheck.shtml

        accessed on July 27th, 2018 */

        

        function checkemail(){

            var entery=document.contactform.emailVerified.value;

            // this regular expression matches for  0 to 66 characters followed by @ follwed by 2 to 6 charachters followed a period

            //followed by two letters or more (.com,.ca, etc)

            var filter=/^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i

            // if the entry is not a match fo the regular expression

            if (!filter.test(entery)){
                alert("Please input a valid email address!");

            }     
        }
    /********************************************************External JS for auto-tab******************************************************/

        /*

        Auto tabbing script- By JavaScriptKit.com

        http://www.javascriptkit.com

        This credit MUST stay intact for use

        */

        /* sourceL http://www.javascriptkit.com/script/script2/autotab.shtml

        accessed on July 27th, 2018 */

        //This block of code focuses on the second filed once first field has a value with length 3

        $(document).ready(function(){

            $("#phoneFirst").keyup(function(){

                if ($(this).val().length==$(this).attr("maxlength")){$("#phoneSecond").focus();}

            });

        });

        

        //This block of code focuses on the third filed once second field has a value with length 3

        $(document).ready(function(){

            $("#phoneSecond").keyup(function(){

                if ($(this).val().length==$(this).attr("maxlength")){$("#phoneThird").focus();}

            });

        });  

    /* ----------------------------------------------------- Facebook Share button ------------------------------------ */
        /* this function  Loads Facebook SDK for JavaScript 
         this code is an opensource plugin provided by facebook developers website
         https://developers.facebook.com/docs/plugins/share-button/ */
        (function(d, s, id) {
            var js, fjs = d.getElementsByTagName(s)[0];
            if (d.getElementById(id)) {
                return;
            }
            js = d.createElement(s); 
            js.id = id;
            js.src = 'https://connect.facebook.net/en_US/sdk.js#xfbml=1&version=v3.1';
            fjs.parentNode.insertBefore(js, fjs);
        }
        (document, 'script', 'facebook-jssdk'));    

/* #################################################### Gallery Page ################################################## */
    /******************************************************Searchbar Gallery Page ********************************************/
    function searchbar(){
        // the search starts as the user types in the bar. for every letter entered search is triggered
        // no need for pressing enter to trigger search
        $("#searchbar").keyup(function(){
        var id= $(".item p");
        // hide all the items
        $(".item").hide();
        // get the value of the search bar, which is the user input, and save it as the key
        var key= "ID: #" + $("#searchbar").val();
        for (var i = 0, length = id.length; i < length; i++){ 
            var thisid= $(".item").eq(i);
            // trim the extra space at the end of the text for the confirmation id
            var trimmedthisid= $(".item p").eq(i).text().trim();
            // compare the trimmed confirmation id with the user inout
            if (trimmedthisid===key){
                // make the items that matched the key visibile on the screen
                thisid.show();
                }
            }
        })
    };
    // finction to display all the items once the refresh button is clicked
    function SearchbarRefresh(){
        $(".item").show();
        $("#searchbar").val("");
    }

/* ################################################## Send a Gift Page ####################################### */
    /*************************************************** Shopping Cart*********************************************/

        // to increment the number of items in the shopping cart create an object shopping cart with property count by defulat set to zero

        var shoppingcart = {
        // initialize count and price to zero
            count:0,
            price:0,

        };

        //this function is triggered when addtocartbutton is clikced

        function addtocartfunc(){  

            // the shopping cart icon becomes visible while sliding down

            $(".shopcart").slideDown();

            // variable count gets incremented by one to keep the count of how mnay items are in the shopping cart

            shoppingcart.count+=1;

            // the count is written to the text of the <li> element on the html page

            $("#countnumber").text(shoppingcart.count);

            // using the JQuery Pulse plugin, the shopping cart will pulse every time a new item is added to the cart
            $("#countnumber").pulse({ opacity: [0,1]}, {times: 1 });

        

            //increment the total price everytime an item is added to the cart

            shoppingcart.price+=20;

            var totalPrice=shoppingcart.price;

            var totalNumber=shoppingcart.count;

            //store the total price of the cart using cookie

            document.cookie = totalPrice;

        }

        function addtotalprice(){

            // get the cookie which is the total price, from the send a gift page

            var x = document.cookie;

            // the total price is written to the text of the element on the html page

            $("#totalprice").text("Total Price: "+ x + "$");

        }

        
    /*************************************************** Search Filters on Send a Gift page*********************************************/
        function searchFilter(){

            // get the current value of the drop down

            var userSelection= $("#searchdropdown").val();

            // if the value is nofilter, display all the items from all categories

            if(userSelection==="nofilter"){
            //loop through the list of the html elements, for each className, and make it visible
                $(".edu").show();

                $(".med").show();

                $(".food").show();
            // rearrange the items on the page after the search filter is applied    
                $(".others").show();
                $(".edu").css("margin-top","+7%");  
                $(".other").css("margin-top","+7%");
                $(".med").css("margin-top","+1%");        

            }



            if (userSelection==="Food"){

            // if the value is Food, display only the food items and hide all the other items

                $(".edu").hide();

                $(".med").hide();

                $(".food").show();

                // rearrange the items on the page after the search filter is applied
                $(".others").hide();
                $(".edu").css("margin-top","+7%");  
                $(".other").css("margin-top","+7%"); 
                $(".med").css("margin-top","+1%");       
        
            }



            else if (userSelection==="Education"){
            // if the value is Education, display only the education items and hide all the other items   

            $(".food").hide();

            $(".med").hide();

            $(".edu").show();  

            // rearrange the items on the page after the search filter is applied
            $(".others").hide();   
            $(".edu").css("margin-top","-7%");  
            $(".other").css("margin-top","+7%"); 
            $(".med").css("margin-top","+1%");   


            }  

            

            else if (userSelection==="Medication"){

            // if the value is Medication, display only the medication items and hide all the other items 

                $(".food").hide();

                $(".edu").hide();

                $(".med").show();

                // rearrange the items on the page after the search filter is applied
                $(".others").hide();      
                $(".med").css("margin-top","-1%"); 
                $(".edu").css("margin-top","+7%");
                $(".other").css("margin-top","+7%");    
        
            }       

            else if (userSelection==="Others"){

            // if the value is others, display only the others items and hide all the other items 

                $(".food").hide();
                $(".edu").hide();
                $(".med").hide();
                $(".others").show(); 

                // rearrange the items on the page after the search filter is applied   
                $(".other").css("margin-top","-7%"); 
                $(".edu").css("margin-top","+7%"); 
                $(".med").css("margin-top","+1%");    
        
            }    
        }


    





 

