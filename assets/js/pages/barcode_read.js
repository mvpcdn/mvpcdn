/* 
 * Js call for read barcode
 * id = 'input_barcode' 
 * include file <script src="<?php echo AURL . "js/pages/barcode_read.js"; ?>"></script>
 */
$(document).ready(function() {
    var pressed = false;
    var chars = [];
    
    $(window).on('keypress',function(e) {
        var id = $(e.target).attr('id');
        // check the keys pressed are numbers
        if (e.which >= 48 && e.which <= 57) {
            // if a number is pressed we add it to the chars array
            chars.push(String.fromCharCode(e.which));
        }
        //console.log(e.which + ":" + chars.join("|"));
        if (pressed == false) {
            setTimeout(function() {
                if (chars.length >= 10) {
                    var barcode = chars.join("");
                    $(e.target).val($(e.target).val().replace(barcode, ''));
                    // console.log("Barcode Scanned: " + barcode);
                    // assign value to some input (or do whatever you want)
                    if(id=='input_barcode'){
                        updateProName(barcode);
                    }
                }
                chars = [];
                pressed = false;
            }, 500);
        }
        pressed = true;
    });
    
});
// this bit of code just ensures that if you have focus on the input which may be in a form
// that the carriage return does not cause your form to be submitted. Some scanners submit
// a carriage return after all the numbers have been passed.
$("#barcode").keypress(function(e) {
    if (e.which === 13) {
        //console.log("Prevent form submit.");
        e.preventDefault();
    }
});

function updateProName(barcode){
    if (barcode) {
        $.ajax({
            type: "POST",
            url: SITE_URL + "product/ajaxReadBarcode/",
            data: {gtin_no: barcode, csrf_imsnaco: get_csrf_cookie()},
            dataType: "json",
            cache: false,
            success: function(response) {
                $('#input_barcode').val(response.product_name);
            }
        });
    }
}
