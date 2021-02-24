
/////////Linear Interpolation///////////////////////////////////////
function showLinearInterpolation() {
    $('.tool').each(function () {
        $(this).css('display', 'none');
    });
    $('#linear-interp').css('display', 'flex');
}

function linearInterpolation() {
    let x1 = parseFloat($('#x1-input').val());
    let x2 = parseFloat($('#x2-input').val());
    let x3 = parseFloat($('#x3-input').val());
    let y1 = parseFloat($('#y1-input').val());
    let y3 = parseFloat($('#y3-input').val());
    let y2 = y1 + ((x2 - x1) * (y3 - y1) / (x3 - x1));
    $('#interp-result').empty().append(y2.toPrecision(3));
}

////////Normal and Critical Depth///////////////////////////////////

function showNormalAndCriticalDepth() {
    $('.tool').each(function () {
        $(this).css('display', 'none');
    });
    $('#normal-critical-depth').css('display', 'flex');
}

function normalAndCriticalDepth() {
    let a, r, i, theta;
    let z1 = parseFloat($('#side-slope1').val());
    let z2 = parseFloat($('#side-slope2').val());
    let b = parseFloat($('#channel-width').val());
    let d = parseFloat($('#pipe-diameter').val());
    let lo = parseFloat($('#longitudinal-slope').val());
    let n = parseFloat($('#mannings-roughness').val());
    if ($('#enter-depth-radio').prop('checked') == true) {
        let y = parseFloat($('#enter-depth').val());
        if ($('#nc-units').val() == 'Metric') {
            i = 1;
        } else {
            i = 1.49;
        }
        if ($('#nc-channel-type').val() == 'Trapezoidal') {
            a = (b + (z1 * y / 2) + (z2 * y / 2)) * y;
            r = a / (b + y * Math.sqrt(z1 ^ 2 + 1))
        } else if ($('#nc-channel-type').val() == 'Rectangular') {
            a = b * y;
            r = a / (2 * y + b);
            solveManningsForFlow (a, r, i, n, lo);
        } else if ($('#nc-channel-type').val() == 'Triangular') {
        } else if ($('#nc-channel-type').val() == 'Circular') {
            a = d ^ 2 * Math.PI / 4;
            theta = 2 * Math.PI - 2 * Math.acos((y - d / 2) / (d / 2));

        } else if ($('#nc-channel-type').val() == 'Cross Section') {

        }
    }

}

function solveManningsForFlow (a, r, i, n, s) {
    let flow = (i / n) * a * r ^ 2/3 * Math.sqrt(s);
    console.log(flow)
}


function setChannelType() {
    let sideSlope1 = true;
    let sideSlope2 = true;
    let channelWidth = true;
    let pipeDiameter = true;
    if ($('#nc-channel-type').val() == 'Trapezoidal') {
        sideSlope1 = false;
        sideSlope2 = false;
        channelWidth = false;
    } else if ($('#nc-channel-type').val() == 'Rectangular') {
        channelWidth = false;
    } else if ($('#nc-channel-type').val() == 'Triangular') {
        sideSlope1 = false;
        sideSlope2 = false;
    } else if ($('#nc-channel-type').val() == 'Circular') {
        pipeDiameter = false;
    } else if ($('#nc-channel-type').val() == 'Cross Section') {
        alert('define a cross section')
    } else {
        alert('Invalid Channel Shape')
    }
        $('#side-slope1').prop( "disabled", sideSlope1 ).val('');
        $('#side-slope2').prop( "disabled", sideSlope2 ).val('');
        $('#channel-width').prop( "disabled", channelWidth ).val('');
        $('#pipe-diameter').prop( "disabled", pipeDiameter ).val('');
}

function flowVsDepth () {
    if ($('#enter-depth').prop('disabled') == true) {
        $('#enter-depth').prop('disabled', false);
        $('#enter-flow').prop('disabled', true).val('');
    } else {
        $('#enter-depth').prop('disabled', true).val('');
        $('#enter-flow').prop('disabled', false);
    }
}

//////////////////////////Hide All/////////////////////////////////

function showNone() {
    $('.tool').each(function () {
        $(this).css('display', 'none');
    });
}

/*
$(document).ready(function() {
    $('#nc-channel-type').change(setChannelType);
})*/
