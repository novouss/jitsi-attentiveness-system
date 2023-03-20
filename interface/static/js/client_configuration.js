
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

function init_config() {
    
    hide_notification();
    initJitsi();

    start_capturing_and_requesting = false;

    $('#webcam-popup').draggable();
}

function show_notification(message) {
    $('.notification-text').find('span').remove();

    const notificationText = $('.notification-text');
    const notificationContainer = $('.notification-container');

    const text = [
        $('<span>', {text: message[0], css: {'color': 'white'}}),
        $('<span>', {text: message[1] + ' ', css: {'color': 'yellow'}}).prop('id', 'action'),
        $('<span>', {text: ' ', css: {'color': 'yellow'}}).prop('id', 'counter'),
        $('<span>', {text: message[2] , css: {'color': 'white'}}),
    ];

    notificationText.append(...text);
    notificationContainer.show();
}

function hide_notification() {
    $('.notification').removeClass('slide-up').addClass('slide-down');
    
    setTimeout(function() {
        $('.notification').removeClass('slide-down');
        $('.notification-container').hide();
        $('.notification-text').find('span').remove();
        
    }, 500); // 0.5 seconds (Refer to styles.css)
}

function start_notification_timer(duration) {
    timer = setInterval(function() {
        const counter = $('#counter');
        counter.text(' (' + duration + ') ');

        duration--;

        if (duration < 0) {
            $('#action').css('color', 'red');
            $('#counter').css('color', 'red');
            hide_notification();
            disable_floating_webcam();
            clearInterval(timer);
        }
    }, 1000) // 1 second in milliseconds
}

function stop_notification_timer() {
    clearInterval(timer);
}

function start_sign_classification(dataFrame) {

    send_sign_classification(dataFrame)
    .then(function(results) {

        var messages = ['You\'ve performed a ', results['sign_label'], results['sign_class']];
        show_notification(messages);

    })
    .catch(function(error) {
        console.log(error);
    });


    if (start_capturing_and_requesting) {
        setTimeout(function() {
            capture_webcam('sign_classification');
        }, 500);
    }
}

function sign_attentiveness(dataFrame) {
    
    send_sign_classification(dataFrame)
    .then(function(results) {

        if (parseInt(results['sign_class']) === class_number) {
            $('#action').css('color', 'lime');
            $('#counter').css('color', 'lime');
            start_capturing_and_requesting = false;
            disable_floating_webcam();
            stop_notification_timer();
            hide_notification();
        }
    
        if (start_capturing_and_requesting) {
            setTimeout(function() {
                capture_webcam('sign_attentiveness_classification');
            }, 500);
        }
    })
    .catch(function(error) {
        console.log(error);
    });
}

function start_sign_attentiveness(number) {

    class_number = number;

    if (number == null) {
        class_number = Math.floor(Math.random() * 10);
    }

    send_sign_label(class_number)
    .then(function(sign_label) {
        var messages = ['Please perform a ', sign_label, 'with your hand.'];
        show_notification(messages);
        start_notification_timer(NOTIFICATION_DURATION);
    })
    .catch(function(error) {
        console.log(error);
    });

    enable_floating_webcam('sign_attentiveness_classification');
}
