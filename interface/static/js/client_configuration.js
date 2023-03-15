
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
    
    disable_debug_panel()
    initJitsi()

    $("#btn_start_comparing").click(function() {
        // Enable user Webcam
        enable_floating_webcam();
        
        // The captureWebcam function loads before the webcam could be enable.
        // Wait for 2 seconds to make sure video is loaded.
        setTimeout(function() {
            // Run sign_recognition
            start_capturing_and_requesting = true;
            captureWebcam('sign_classification');
        }, 2000);

    })
    
    $("#btn_start_rand_comparing").click(function() {
        // Enable user Webcam
        enable_floating_webcam();

        // Wait for 2 seconds to make sure video is loaded.
        setTimeout(function() {
            // Run rand_sign_classification
            start_capturing_and_requesting = true;
            class_number = Math.floor(Math.random() * 10);
            send_sign_label(class_number);
            captureWebcam('rand_sign_classification');
        }, 2000);

    })

    $("#btn_stop_comparing").click(function() {
        reset_sign_classification();
        start_capturing_and_requesting = false;
        disable_floating_webcam();
    })    
    
    $("#btn_stop_rand_comparing").click(function() {
        reset_rand_sign_classification();
        start_capturing_and_requesting = false;
        disable_floating_webcam();
    })

    // Webcam Properties
    $("#webcam-popup").draggable();
    $('#close-webcam-popup').click(function() {
        reset_sign_classification();
        reset_rand_sign_classification();
        disable_floating_webcam();
    });
}

function enable_floating_webcam() {
    $('#webcam-popup').prop("hidden", false)
    $('#webcam-popup').show();

    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        // Display the webcam stream on the canvas
        var video = document.getElementById('webcam-video');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
        };
    })
    .catch(function(err) {
        console.log("Error accessing webcam: " + err);
    });
}

function disable_floating_webcam() {
    $('#webcam-popup').prop("hidden", true)
    $('#webcam-popup').hide();

    const video = document.getElementById('webcam-video');
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });

    video.srcObject = null;
}

function captureWebcam(application) {
    
    const dataURL = getWebcamDataURL();

    if (application === 'sign_classification') {
        send_frame_sign_classification(dataURL);
    } else if (application === 'rand_sign_classification') {
        send_frame_rand_sign_classification(dataURL);
    }
    
}

function getWebcamDataURL() {
    const video = $('#webcam-video')[0];

    if (!(video.srcObject && video.srcObject.active)) {
        return null;
    }

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0)

    return canvas.toDataURL();
    
}

function enable_debug_panel(){
    $("#debugging_panel").prop("hidden", false)
} 

function disable_debug_panel(){
    $("#debugging_panel").prop("hidden", true)
}
