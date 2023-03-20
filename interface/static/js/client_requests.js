
function send_sign_label(number) {
    return new Promise(function(resolve, reject) {
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
                        resolve(response['sign_label']);
                    case 408:
                        reject(new Error("Request timed out"));
                        break;
                    default:
                        reject(new Error("Request failed"));
                }      
            }
        });
    })
}

function send_sign_classification(dataFrame) {
    return new Promise(function(resolve, reject) {
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
                        resolve(response);
                        break;
                    case 408:
                        reject(new Error("Request timed out"));
                        break;
                    default:
                        reject(new Error("Request failed"));
                }      
            }
        });
    });
}