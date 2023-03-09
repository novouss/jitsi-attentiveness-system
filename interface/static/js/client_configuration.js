
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
    $("#btn_init_jitsi").click(function () {
        $("#id_div_btn_start_jitsi").remove();
        $("#ul_navs_index").prop("hidden", false);
        $("#id_div_btn_acquire_frame").prop("hidden", false);
        initJitsi()
    })

    $("#btn_acquire_frame").click(function() {
        for (var b in window) {

            if (b === 'api_jitsi') {
                api_jitsi.isVideoAvailable().then(available => {
                    if (api_jitsi.getParticipantsInfo().length !== 0) {
                        $("#id_div_results_sign_recognition").prop("hidden", false);
                        $("#p_status_recognition").text('Identifying...');
                        $("#id_div_btn_reset_sign_recognition").prop("hidden", false);
                        captureScreenShot('sign_classification');   
                    }
                })
            }
        }
    })

    $("#btn_finish_comparing").click(function() {
        start_capturing_add_requesting = false;
        $("#p_status_comparison").text('Not running...');
    })

}

function captureScreenShot(which_application) {
    let screenShot = api_jitsi.captureLargeVideoScreenshot().then(dataURL => {
        let dataFrame = dataURL.dataURL

        if (which_application === 'sign_classification') {
            send_frame_sign_classification(dataFrame);
        } else if (which_application === 'rand_sign_classification') {
            send_frame_rand_sign_classification(dataFrame)
        }
    });
}