function capture_webcam(application) {

    const dataURL = get_webcam_dataurl();
    start_capturing_and_requesting = true;

    if (application === 'sign_classification') {
        start_sign_classification(dataURL);
    } else if (application === 'sign_attentiveness_classification') {
        sign_attentiveness(dataURL);
    }   
}

function get_webcam_dataurl() {
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
            capture_webcam(mode);
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