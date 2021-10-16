/* Based on the journal by David McCoy on June 17, 2014 at the following url:
https://medium.com/@dmccoy/how-to-submit-an-html-form-to-google-sheets-without-google-forms-b833952cc175 */
function formData(){
    // variable to hold the request
    var request;
    $("#form").submit(function(event){
        var form = $(this);
        // store all the fields of the form in the varibale inputs
        var inputs = form.find("input, select, button, textarea");
        // encode the form elements as a string for submission.
        var serializedData = form.serialize();
        // disable the input fileds 
        inputs.prop("disabled", true);
        // send the form data through a post action ajax request to the goodle doc
        request = $.ajax({
        // link to the google doc    
            url: "https://script.google.com/macros/s/AKfycbypfRCBgfTw7EmJVip-pZFeCAnPFrY96E4i9H-I1vP1KeWh0kQh/exec",
        // the action type is post action   
            type: "post",
        // submit the srerilized data    
            data: serializedData
        });
        request.done(function (response, textStatus, jqXHR){
        // reset the form data
            $("#form").reset();
        })
        request.always(function () {
        // enbale the input fields 
            inputs.prop("disabled", false);
        });
        // prevent page refresh
        event.preventDefault();
    });    
}
