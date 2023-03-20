console.log('Hello World');
function initJitsi() {
    var rand = Math.floor(Math.random() * 10000000) + 100000;

    const domain = 'meet.jit.si';
    const options = {
        roomName: 'Room_' + rand.toString(),
        parentNode: document.querySelector('#div_iframe_jitsi'),
    };

    api_jitsi = new JitsiMeetExternalAPI(domain, options);

    var height_window = $(window).height();
    $('#div_container_of_body_elements').height(height_window);
    $('#div_iframe_jitsi').height(height_window);
}

function captureWebcam(application) {
    const dataURL = getWebcamDataURL();

    if (application === 'sign_classification') {
        start_capturing_and_requesting = true;
        start_sign_classification(dataURL);
    } else if (application === 'rand_sign_classification') {
        // send_frame_rand_sign_classification(dataURL);
    }   
}

function getWebcamDataURL() {
    const video = $('#webcam-video')[0];

    if (!(video.srcObject && video.srcObject.active)) {
        return null;
    }

    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    return canvas.toDataURL();   
}

function init_config() {
    
    disable_debug_panel();
    hide_notification();
    initJitsi();

    start_capturing_and_requesting = false;

    $('#btn_start_comparing').click(function() { 
        enable_floating_webcam('sign_classification');
    });
    
    $('#btn_start_rand_comparing').click(function() {
        start_capturing_and_requesting = true;
        class_number = Math.floor(Math.random() * 10);
        message = ['Please perform a ', send_sign_label(class_number), 'with your hand.'];
        show_notification(message);
        enable_floating_webcam('rand_sign_classification');
    });

    $('#btn_stop_comparing').click(function() {
        start_capturing_and_requesting = false;
        reset_requests();
        disable_floating_webcam();
    });   
    
    $('#btn_stop_rand_comparing').click(function() {
        start_capturing_and_requesting = false;
        reset_requests();
        disable_floating_webcam();
    });

    // Webcam Properties
    $('#webcam-popup').draggable();
    $('#close-webcam-popup').click(function() {
        reset_requests();
        disable_floating_webcam();
    });
}

function show_notification(message) {
    const notificationText = $('.notification-text');
    const notificationContainer = $('.notification-container');

    const text = [
        $('<span>', {text: message[0], css: {'color': 'white'}}),
        $('<span>', {text: message[1] + ' ', css: {'color': 'yellow'}}),
        $('<span>', {text: ' ', css: {'color': 'yellow'}}).prop('id', 'counter'),
        $('<span>', {text: message[2] , css: {'color': 'white'}}),
    ];

    notificationText.append(...text);
    notificationContainer.show();
}

function start_timer(duration) {
    const duration = NOTIFICATION_DURATION;
    
    let timer = setInterval(function() {
        const counter = $('#counter');
        counter.text(' (' + duration + ') ' )

        duration--;

        if (duration < 0) {
            hide_notification();
            clearInterval(timer);
        }
    }, 1000);
}

function hide_notification() {
    $('.notification-container').hide();
}

function enable_floating_webcam(mode) {
    $('#webcam-popup').prop('hidden', false);
    
    // FIXME: There's a bug that the draggable webcam does not update upon resize, or has no maximum bounding box.
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(function(stream) {
        // Display the webcam stream on the canvas
        var video = document.getElementById('webcam-video');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
            video.play();
            
            if (mode == null) {
                return;
            }
            
            captureWebcam(mode);
        };
    })
    .catch(function(err) {
        console.log("Error accessing webcam: " + err);
    });
}

function disable_floating_webcam() {
    $('#webcam-popup').prop('hidden', true);

    const video = document.getElementById('webcam-video');
    const mediaStream = video.srcObject;
    const tracks = mediaStream.getTracks();

    tracks.forEach(function(track) {
        track.stop();
    });

    video.srcObject = null;
}

function enable_debug_panel(){
    $('#debugging_panel').prop('hidden', false)
} 

function disable_debug_panel(){
    $('#debugging_panel').prop('hidden', true)
}

// TODO: Create a function that creates a notification that instructs the user to perform a task, else they're marked failed.
// TODO: Remove legacy code, use web browser console for applications.
// TODO: Remove all code related to close-btn.

function start_sign_classification(dataFrame) {

    const results = send_sign_classification(dataFrame);
    var messages = ['', results['sign_label'], results[sign_class]];
    show_notification(messages);

    if (start_capturing_and_requesting) {
        setTimeout(function() {
            captureWebcam('sign_classification');
        });
    }
}