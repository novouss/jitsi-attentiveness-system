function send_frame_sign_comparison(dataFrame) {

    let form_data = new FormData();
    form_data.append("dataURL_frame", dataFrame);

    $.ajax({
        type: "POST",
        enctype: "multipart/form-data",
        url: API_BASE_URL + "get_sign",
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
                    if (start_capturing_and_requesting) {
                        captureScreenShot('sign_comparison')
                    }
                    break;
                default:
                    reset_face_comparison()
            }      
        }
    })
}

function reset_sign_recognition() {
    if (!start_capturing_and_requesting) {
        // reset values
        $.ajax({
            type: "GET",
            enctype: "multipart/form-data",
            url: API_BASE_URL + "reset_face_comparison",
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
                        break;
                    default:
                        break;
                }
            }
        });
    }
}