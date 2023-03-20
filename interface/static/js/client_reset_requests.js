
function reset_requests() {
    reset_sign_classification();
    reset_rand_sign_classification();
}

function reset_sign_classification() {
    $('#input_sign_classification').attr('value', "");
}

function reset_rand_sign_classification() {
    $('#input_rand_sign_classification').attr('value', "");
    $('#input_rand_sign_classification').css({
        "background-color": "white",
        "color": "black",
    });
}
