
function reset_requests() {
    reset_sign_classification();
    reset_rand_sign_classification();
}


function reset_sign_classification() {
    
    $.ajax({
        type: "GET",
        enctype: "multipart/form-data",
        url: API_BASE_URL + "reset_sign_classification",
        processData: false,
        contentType: false,
        cache: false,
        timeout: REQUESTS_TIMEOUT,
        complete: function (xhr) {
            let status = xhr.status;
            let response = xhr.responseJSON;
            let error_message;
            switch (status) {
                case 200:
                    $('#input_sign_classification').attr('value', "");
                    break;
                default:
                    break;
            }
        }
    });
}

function reset_rand_sign_classification() {

    $.ajax({
        type: "GET",
        enctype: "multipart/form-data",
        url: API_BASE_URL + "reset_sign_classification",
        processData: false,
        contentType: false,
        cache: false,
        timeout: REQUESTS_TIMEOUT,
        complete: function (xhr) {
            let status = xhr.status;
            let response = xhr.responseJSON;
            let error_message;
            switch (status) {
                case 200:
                    $('#input_rand_sign_classification').attr('value', "");
                    $('#input_rand_sign_classification').css({
                        "background-color": "white",
                        "color": "black",
                    });
                    break;
                default:
                    break;
            }
        }
    });
}
