
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
    let flowValues;
    if ($('#enter-depth-radio').prop('checked') == true) {
        let y = parseFloat($('#enter-depth').val());
        flowValues = solveForAandR(y);
        $('#enter-flow').val(Math.round(flowValues[0] * 1000) / 1000);
    } else if ($('#enter-flow-radio').prop('checked') == true) {
        let finalFlow = $('#enter-flow').val();
        let yn = 0.0001;
        let tryFlow = 1;
        console.log('final flow: ' + finalFlow)
        debugger
        while (tryFlow > finalFlow + 0.00001 || tryFlow < finalFlow - 0.00001) {
            yn += yn * (finalFlow - tryFlow) / (finalFlow);
            flowValues = solveForAandR(yn);
            tryFlow = flowValues[0];
            console.log('tryflow: ' + tryFlow)
        }
        $('#enter-depth').val(Math.round(yn * 1000) / 1000);
    }
    setResults(flowValues);
}

function solveForAandR(y) {
    let a, r, i, theta, flow, t, hydraulicDepth, wettedPerimeter;
    let z1 = parseFloat($('#side-slope1').val());
    let z2 = parseFloat($('#side-slope2').val());
    let b = parseFloat($('#channel-width').val());
    let d = parseFloat($('#pipe-diameter').val());
    let lo = parseFloat($('#longitudinal-slope').val());
    let n = parseFloat($('#mannings-roughness').val());
    if ($('#nc-units').val() == 'Metric') {
        i = 1;
    } else {
        i = 1.49;
    }
    if ($('#nc-channel-type').val() == 'Trapezoidal') {
        a = (b + (z1 * y / 2) + (z2 * y / 2)) * y;
        wettedPerimeter = (b + y * Math.sqrt(Math.pow(z1, 2) + 1) + y * Math.sqrt(Math.pow(z2, 2) + 1));
        r = a / wettedPerimeter;
        t = b + z1 * y + z2 * y;
        hydraulicDepth = a / t;
    } else if ($('#nc-channel-type').val() == 'Rectangular') {
        a = b * y;
        wettedPerimeter = (2 * y + b);
        r = a / wettedPerimeter;
        t = b;
        hydraulicDepth = a / t;
    } else if ($('#nc-channel-type').val() == 'Triangular') {
        a = ((z1 * y / 2) + (z2 * y / 2)) * y;
        wettedPerimeter = (y * Math.sqrt(Math.pow(z1, 2) + 1) + y * Math.sqrt(Math.pow(z2, 2) + 1));
        r = a / wettedPerimeter;
        t = y * (z1 + z2);
        hydraulicDepth = a / t;
    } else if ($('#nc-channel-type').val() == 'Circular') {
        theta = 2 * (Math.PI - Math.acos((2 * y / d) - 1));
        wettedPerimeter = theta * d / 2;
        a = (theta - Math.sin(theta)) * Math.pow(d, 2) / 8;
        r = (1 - Math.sin(theta) / theta) * d / 4;
        t = 2 * Math.sqrt(y * (d - y));
        hydraulicDepth = ((theta - Math.sin(theta)) / (Math.sin(theta / 2))) * d / 8;
    } else if ($('#nc-channel-type').val() == 'Cross Section') {

    }
    flow = solveManningsForFlow (a, r, i, n, lo);
    let velocity = flow / a;
    let flowValues = [flow, y, velocity, a, wettedPerimeter, r, t, hydraulicDepth]
    return flowValues;
}

function solveManningsForFlow (a, r, i, n, s) {
    let flow = (i / n) * a * Math.pow(r, 2/3) * Math.sqrt(s);
    return flow
}

function setResults(flow) {
    let fut, dut, vut, aut;
    if ($('#nc-units').val() == 'Metric') {
        fut = 'm<sup>3</sup>/s';
        dut = 'm';
        vut = 'm/s<sup>2</sup>';
        aut = 'm<sup>2</sup>';
    } else {
        fut = 'ft<sup>3</sup>/s';
        dut = 'ft';
        vut = 'ft/s<sup>2</sup>';
        aut = 'ft<sup>2</sup>';
    }
    let html = `<p>Flow: ${Math.round(flow[0] * 1000) / 1000} ${fut}</p>
    <p>Normal Depth: ${Math.round(flow[1] * 1000) / 1000} ${dut}</p>
    <p>Velocity: ${Math.round(flow[2] * 1000) / 1000} ${vut}</p>
    <p>Flow Area: ${Math.round(flow[3] * 1000) / 1000} ${aut}</p>
    <p>Wetted Perimeter: ${Math.round(flow[4] * 1000) / 1000} ${dut}</p>
    <p>Hydraulic Radius: ${Math.round(flow[5] * 1000) / 1000} ${dut}</p>
    <p>Top Width: ${Math.round(flow[6] * 1000) / 1000} ${dut}</p>
    <p>Hydraulic Depth: ${Math.round(flow[7] * 1000) / 1000} ${dut}</p>`;
    $('#nc-result-div').empty().append(html);
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
