
function initJitsi() {
    var rand = Math.floor(Math.random() * 10000000) + 100000;

    const domain = 'meet.jit.si';
    const options = {
        roomName: 'Room_' + rand.toString(),
        parentNode: document.querySelector('#div_iframe_jitsi'),
    };

    api_jitsi = new JitsiMeetExternalAPI(domain, options);

    var height_window = $(window).height();
    $("#div_container_of_body_elements").height(height_window);
    $("#div_iframe_jitsi").height(height_window);
}

function init_jitsi_config() {
    
    $("#ul_navs_index").prop("hidden", false);
    initJitsi()

    $("#btn_start_comparing").click(function() {
        for (var b in window) {
            if (b === 'api_jitsi') {
                api_jitsi.isVideoAvailable().then(available => {
                    if (api_jitsi.getParticipantsInfo().length !== 0) {
                        start_capturing_and_requesting = true;
                        captureScreenShot('sign_classification');
                    }
                })
            }
        }
    })
    
    $("#btn_start_rand_comparing").click(function() {
        for (var b in window) {
            if (b === 'api_jitsi') {
                api_jitsi.isVideoAvailable().then(available => {
                    if (api_jitsi.getParticipantsInfo().length !== 0) {
                        start_capturing_and_requesting = true;

                        class_number = Math.floor(Math.random() * 10);
                        send_sign_label(class_number);
                        captureScreenShot('rand_sign_classification');
                    }
                })
            }
        }
    })

    $("#btn_stop_comparing").click(function() {
        start_capturing_and_requesting = false;
    })    
    
    $("#btn_stop_rand_comparing").click(function() {
        $('#input_rand_sign_classification').css({
            "background-color": "red",
            "color": "white",
        });
        start_capturing_and_requesting = false;
    })
}

function captureScreenShot(which_application) {
    let screenShot = api_jitsi.captureLargeVideoScreenshot().then(dataURL => {
        let dataFrame = dataURL.dataURL

        if (which_application === 'sign_classification') {
            send_frame_sign_classification(dataFrame);
        } else if (which_application === 'rand_sign_classification') {
            // TODO: Add dynamic size
            send_frame_rand_sign_classification(dataFrame)
        }
    });
}