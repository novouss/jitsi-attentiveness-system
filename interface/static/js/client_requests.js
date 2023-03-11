function send_sign_label(number) {

    let form_data = new FormData();
    form_data.append("number", number);

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: API_BASE_URL + "get_sign_label",
        data: form_data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: REQUESTS_TIMEOUT,
        complete: function(xhr) {
            let status = xhr.status;
            let response = xhr.responseJSON;
            let error_message;
            switch (status) {
                case 200:
                    $("#input_recog_requirement").text(' ' + response['sign_label'] + ' with your hand');
                    break;
                default:
                    console.log(response['log'])
            }      
        }
    });
}

function send_frame_sign_classification(dataFrame) {

    let form_data = new FormData();
    form_data.append("dataURL_frame", dataFrame);

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: API_BASE_URL + "get_sign_classification",
        data: form_data,
        processData: false,
        contentType: false,
        cache: false,
        timeout: REQUESTS_TIMEOUT,
        complete: function(xhr) {
            let status = xhr.status;
            let response = xhr.responseJSON;
            let error_message;
            switch (status) {
                case 200:

                    if (response['status']) {
                        $('#input_sign_classification').attr('value', response['sign_label']);
                    }

                    if (start_capturing_and_requesting) {
                        captureScreenShot('sign_classification')
                    }
                    break;
                case 205:
                    reset_sign_classification()
                    break;
                default:
                    console.log(response['log'])
            }      
        }
    })
}

function send_frame_rand_sign_classification(dataFrame) {

    let form_data = new FormData();
    form_data.append("dataURL_frame", dataFrame);

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: API_BASE_URL + "get_sign_classification",
        data: form_data,
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
                    console.log(response)
                    if (response['status']) {
                        $('#input_rand_sign_classification').attr('value', response['sign_label']);
                    }

                    if (parseInt(response['sign_class']) === class_number) {
                        $('#input_rand_sign_classification').css({
                            "background-color": "lime",
                            "color": "black",
                        });
                        break;
                    } else {
                        $('#input_rand_sign_classification').css({
                            "background-color": "red",
                            "color": "white",
                        });
                    }
                    
                    if (start_capturing_and_requesting) {
                        captureScreenShot('rand_sign_classification');
                    }

                    break;
                case 205:
                    reset_sign_classification()
                    break;
                default:
                    console.log(response['log'])
            }      
        }
    });
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