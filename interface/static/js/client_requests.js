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
                    $("#btn_acquire_frame").prop('disabled', false);
                    if (response['status']) {
                        $('#input_sign_classification').attr('value', response['sign_classification']);
                    }
                    break;
                case 205:
                    reset_sign_classification()
                    $("#p_status_recognition").text('Stopped and not running...');
                    $("#btn_acquire_frame").prop('disabled', false);
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
                    $("#p_status_recognition").text('Stopped and not running...');
                    $("#btn_acquire_frame").prop('disabled', false);
                    break;
                default:
                    break;
            }
        }
    });
 
}