function showLinearInterpolation () {
    $('.tool').each(function () {
        $(this).css('display', 'none');
    });
    $('#linear-interp').css('display', 'flex');
}

function linearInterpolation () {
    let x1 = parseFloat($('#x1-input').val());
    let x2 = parseFloat($('#x2-input').val());
    let x3 = parseFloat($('#x3-input').val());
    let y1 = parseFloat($('#y1-input').val());
    let y3 = parseFloat($('#y3-input').val());
    let y2 = y1 + ((x2 - x1) * (y3 - y1) / (x3 - x1));
    $('#interp-result').empty().append(y2.toPrecision(3));
}

function showNone () {
    $('.tool').each(function () {
        $(this).css('display', 'none');
    });
}