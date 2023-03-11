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
                        $('#input_sign_classification').attr('value', response['sign_classification']);
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