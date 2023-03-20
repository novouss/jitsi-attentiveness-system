
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
                    return response['sign_label'];
                default:
                    console.log(response['log']);
                    return null;
            }      
        }
    });
}

function send_sign_classification(dataFrame) {

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
                    return response;
                default:
                    console.log(response['log']);
                    return null;
            }      
        }
    });    
}