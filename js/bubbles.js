var BUBBLES_ARRAY = new Array();
var BUBBLES_CANVAS_CONTEXT = null;
var BUBBLES_X_START = 30;
var BUBBLES_X_END = 518;
var BUBBLES_GAP = ((BUBBLES_X_END - BUBBLES_X_START) / 25);
var BUBBLES_Y_START = 26;
var BUBBLES_Y_END = 522;
var BUBBLES_SIZE = 3;
var BUBBLES_COUNTER = 0;

var SUPER_BUBBLES = [];
// The four power-ups are now beer bottles instead of large dots.
var SUPER_BUBBLES_SIZE = 8;
var SUPER_BUBBLES_BLINK = false;
var SUPER_BUBBLES_BLINK_STATE = 0;
var SUPER_BUBBLES_BLINK_TIMER = -1;
var SUPER_BUBBLES_BLINK_SPEED = 525;

function initBubbles() {
    BUBBLES_COUNTER = 0;
    BUBBLES_ARRAY.length = 0;
    SUPER_BUBBLES.length = 0;

    var canvas = document.getElementById('canvas-bubbles');
    canvas.setAttribute('width', '550');
    canvas.setAttribute('height', '550');
    if (canvas.getContext) {
        BUBBLES_CANVAS_CONTEXT = canvas.getContext('2d');
    }
}

function getBubblesCanevasContext() {
    return BUBBLES_CANVAS_CONTEXT;
}

// Draws a small green beer bottle centered on x/y.
function drawBeerBottle(ctx, x, y) {
    ctx.save();
    ctx.translate(x, y);
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';

    // Bottle silhouette and neck
    ctx.beginPath();
    ctx.moveTo(-3, -10);
    ctx.lineTo(-3, -6);
    ctx.lineTo(-5, -3);
    ctx.lineTo(-5, 7);
    ctx.quadraticCurveTo(-5, 10, -2, 10);
    ctx.lineTo(2, 10);
    ctx.quadraticCurveTo(5, 10, 5, 7);
    ctx.lineTo(5, -3);
    ctx.lineTo(3, -6);
    ctx.lineTo(3, -10);
    ctx.closePath();
    ctx.fillStyle = '#167a3d';
    ctx.fill();
    ctx.strokeStyle = '#a7f3b7';
    ctx.lineWidth = 1.2;
    ctx.stroke();

    // Neck highlight
    ctx.beginPath();
    ctx.moveTo(-1.5, -7);
    ctx.lineTo(-1.5, -2);
    ctx.strokeStyle = '#8ce6a1';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Golden cap
    ctx.fillStyle = '#ffd34e';
    ctx.fillRect(-3.5, -12, 7, 2.5);
    ctx.strokeStyle = '#fff0a3';
    ctx.lineWidth = 0.7;
    ctx.strokeRect(-3.5, -12, 7, 2.5);

    // Cream label
    ctx.fillStyle = '#fff2c6';
    ctx.fillRect(-4, 0, 8, 5);
    ctx.fillStyle = '#c0392b';
    ctx.fillRect(-2.5, 1, 5, 1.2);
    ctx.fillStyle = '#d69a28';
    ctx.fillRect(-2, 3, 4, 0.8);

    // Small glass shine
    ctx.beginPath();
    ctx.moveTo(3, -1);
    ctx.lineTo(3, 6);
    ctx.strokeStyle = 'rgba(220,255,226,0.8)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
}

function drawBubbles() {
    var ctx = getBubblesCanevasContext();
    if (!ctx) return;
    ctx.fillStyle = '#dca5be';

    for (var line = 1, linemax = 29, i = 0, s = 0; line <= linemax; line++) {
        var y = getYFromLine(line);
        for (var x = BUBBLES_X_START, xmax = BUBBLES_X_END, bubble = 1; x < xmax; bubble++, x += BUBBLES_GAP) {
            if (canAddBubble(line, bubble)) {
                var type = '';
                var size = '';
                var correctedX = correctionX(x, bubble);
                if (isSuperBubble(line, bubble)) {
                    type = 's';
                    size = SUPER_BUBBLES_SIZE;
                    SUPER_BUBBLES[s] = line + ';' + bubble + ';' + parseInt(correctedX) + ',' + parseInt(y) + ';0';
                    s++;
                    drawBeerBottle(ctx, correctedX, y);
                } else {
                    type = 'b';
                    size = BUBBLES_SIZE;
                    ctx.beginPath();
                    ctx.arc(correctedX, y, size, 0, 2 * Math.PI, false);
                    ctx.fill();
                    ctx.closePath();
                }
                BUBBLES_COUNTER++;
                BUBBLES_ARRAY.push(parseInt(correctedX) + ',' + parseInt(y) + ';' + line + ';' + bubble + ';' + type + ';0');
                i++;
            }
        }
    }
}

function stopBlinkSuperBubbles() {
    clearInterval(SUPER_BUBBLES_BLINK_TIMER);
    SUPER_BUBBLES_BLINK_TIMER = -1;
    SUPER_BUBBLES_BLINK = false;
}

function blinkSuperBubbles() {
    if (SUPER_BUBBLES_BLINK === false) {
        SUPER_BUBBLES_BLINK = true;
        SUPER_BUBBLES_BLINK_TIMER = setInterval('blinkSuperBubbles()', SUPER_BUBBLES_BLINK_SPEED);
    } else {
        SUPER_BUBBLES_BLINK_STATE = SUPER_BUBBLES_BLINK_STATE === 0 ? 1 : 0;
        var clone = SUPER_BUBBLES.slice(0);

        for (var i = 0, imax = clone.length; i < imax; i++) {
            var s = clone[i];
            if (s.split(';')[3] === '0') {
                var sx = parseInt(s.split(';')[2].split(',')[0]);
                var sy = parseInt(s.split(';')[2].split(',')[1]);
                if (SUPER_BUBBLES_BLINK_STATE === 1) {
                    eraseBubble('s', sx, sy);
                } else {
                    drawBeerBottle(getBubblesCanevasContext(), sx, sy);
                }
            }
        }
    }
}

function setSuperBubbleOnXY(x, y, eat) {
    for (var i = 0, imax = SUPER_BUBBLES.length; i < imax; i++) {
        var bubbleParams = SUPER_BUBBLES[i].split(';');
        var testX = parseInt(bubbleParams[2].split(',')[0]);
        var testY = parseInt(bubbleParams[2].split(',')[1]);
        if (testX === x && testY === y) {
            SUPER_BUBBLES[i] = SUPER_BUBBLES[i].substr(0, SUPER_BUBBLES[i].length - 1) + '1';
            break;
        }
    }
}

function getBubbleOnXY(x, y) {
    var bubble = null;
    for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i++) {
        var bubbleParams = BUBBLES_ARRAY[i].split(';');
        var testX = parseInt(bubbleParams[0].split(',')[0]);
        var testY = parseInt(bubbleParams[0].split(',')[1]);
        if (testX === x && testY === y) {
            bubble = BUBBLES_ARRAY[i];
            break;
        }
    }
    return bubble;
}

function eraseBubble(t, x, y) {
    var ctx = getBubblesCanevasContext();
    if (!ctx) return;
    if (t === 's') {
        // Clear the full bottle including its cap and outline.
        ctx.clearRect(x - 8, y - 15, 16, 30);
    } else {
        ctx.clearRect(x - BUBBLES_SIZE, y - BUBBLES_SIZE, (BUBBLES_SIZE + 1) * 2, (BUBBLES_SIZE + 1) * 2);
    }
}

function isSuperBubble(line, bubble) {
    return ((line === 23 || line === 4) && (bubble === 1 || bubble === 26));
}

function canAddBubble(line, bubble) {
    if (((line >= 1 && line <= 4) || (line >= 9 && line <= 10) || (line >= 20 && line <= 22) || (line >= 26 && line <= 28)) && (bubble === 13 || bubble === 14)) {
        return false;
    } else if (((line >= 2 && line <= 4) || (line >= 21 && line <= 22)) && ((bubble >= 2 && bubble <= 5) || (bubble >= 7 && bubble <= 11) || (bubble >= 16 && bubble <= 20) || (bubble >= 22 && bubble <= 25))) {
        return false;
    } else if ((line >= 6 && line <= 7) && ((bubble >= 2 && bubble <= 5) || (bubble >= 7 && bubble <= 8) || (bubble >= 10 && bubble <= 17) || (bubble >= 19 && bubble <= 20) || (bubble >= 22 && bubble <= 25))) {
        return false;
    } else if (line === 8 && ((bubble >= 7 && bubble <= 8) || (bubble >= 13 && bubble <= 14) || (bubble >= 19 && bubble <= 20))) {
        return false;
    } else if ((line >= 9 && line <= 19) && ((bubble >= 1 && bubble <= 5) || (bubble >= 22 && bubble <= 26))) {
        return false;
    } else if ((line === 11 || line === 17) && (bubble >= 7 && bubble <= 20)) {
        return false;
    } else if ((line === 9 || line === 10) && (bubble === 12 || bubble === 15)) {
        return false;
    } else if (((line >= 12 && line <= 13) || (line >= 15 && line <= 16)) && (bubble === 9 || bubble === 18)) {
        return false;
    } else if (line === 14 && ((bubble >= 7 && bubble <= 9) || (bubble >= 18 && bubble <= 20))) {
        return false;
    } else if ((line === 18 || line === 19) && (bubble === 9 || bubble === 18)) {
        return false;
    } else if ((line >= 9 && line <= 10) && ((bubble >= 7 && bubble <= 11) || (bubble >= 16 && bubble <= 20))) {
        return false;
    } else if (((line >= 11 && line <= 13) || (line >= 15 && line <= 19)) && ((bubble >= 7 && bubble <= 8) || (bubble >= 19 && bubble <= 20))) {
        return false;
    } else if (((line >= 12 && line <= 16) || (line >= 18 && line <= 19)) && (bubble >= 10 && bubble <= 17)) {
        return false;
    } else if (line === 23 && ((bubble >= 4 && bubble <= 5) || (bubble >= 22 && bubble <= 23))) {
        return false;
    } else if ((line >= 24 && line <= 25) && ((bubble >= 1 && bubble <= 2) || (bubble >= 4 && bubble <= 5) || (bubble >= 7 && bubble <= 8) || (bubble >= 10 && bubble <= 17) || (bubble >= 19 && bubble <= 20) || (bubble >= 22 && bubble <= 23) || (bubble >= 25 && bubble <= 26))) {
        return false;
    } else if (line === 26 && ((bubble >= 7 && bubble <= 8) || (bubble >= 19 && bubble <= 20))) {
        return false;
    } else if ((line >= 27 && line <= 28) && ((bubble >= 2 && bubble <= 11) || (bubble >= 16 && bubble <= 25))) {
        return false;
    }
    return true;
}

function correctionX(x, bubble) {
    if (bubble === 3 || bubble === 6 || bubble === 15 || bubble === 18 || bubble === 26) {
        return x + 1;
    } else if (bubble === 21 || bubble === 24) {
        return x + 2;
    }
    return x;
}

function getYFromLine(line) {
    var y = BUBBLES_Y_START;
    if (line < 8) {
        y = BUBBLES_Y_START + ((line - 1) * 18);
    } else if (line > 7 && line < 15) {
        y = 150 + ((line - 8) * 18);
    } else if (line > 14 && line < 21) {
        y = 256 + ((line - 14) * 18);
    } else if (line > 20 && line < 26) {
        y = 362 + ((line - 20) * 18);
    } else if (line > 25 && line < 29) {
        y = 452 + ((line - 25) * 18);
    } else if (line === 29) {
        y = BUBBLES_Y_END;
    }
    return y;
}
