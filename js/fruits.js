var FRUITS_CANVAS_CONTEXT = null;
var LEVEL_FRUITS_CANVAS_CONTEXT = null;
var FRUITS_SIZE = 30;

var FRUITS_POSITION_X = 276;
var FRUITS_POSITION_Y = 310;

var FRUIT_MINIMUM_START = 15;
var FRUIT_CANCEL_TIMER = null;
var FRUIT_CANCEL_SPEED = 7500;
var FRUIT = null;



function initFruits() {
	var canvas = document.getElementById('canvas-fruits');
	canvas.setAttribute('width', '550');
	canvas.setAttribute('height', '550');

	if (canvas.getContext) {
		FRUITS_CANVAS_CONTEXT = canvas.getContext('2d');
	}

	var levelCanvas = document.getElementById('canvas-level-fruits');
	levelCanvas.setAttribute('width', '265');
	levelCanvas.setAttribute('height', '30');

	if (levelCanvas.getContext) {
		LEVEL_FRUITS_CANVAS_CONTEXT = levelCanvas.getContext('2d');
	}

	var ctx = getLevelFruitsCanevasContext();
	ctx.clearRect(0, 0, 265, 30);

	var instruments = [
		"electricGuitar", "acousticGuitar", "keyboard",
		"drum", "flute", "saxophone", "violin",
		"trumpet", "bass", "maracas", "harmonica", "battery"
	];

	var count = Math.min(Math.max(LEVEL, 1), 12);
	var start = Math.max(0, count - 7);

	for (var i = start; i < count; i++) {
		var position = 6 + ((i - start) * 37);
		drawFruit(ctx, instruments[i], position, 15, 25);
	}
}







function getFruitsCanevasContext() { 
	return FRUITS_CANVAS_CONTEXT;
}
function getLevelFruitsCanevasContext() { 
	return LEVEL_FRUITS_CANVAS_CONTEXT;
}

function eatFruit() {
	playEatFruitSound();

	var scores = {
		electricGuitar: 100,
		acousticGuitar: 200,
		keyboard: 300,
		drum: 500,
		flute: 700,
		saxophone: 1000,
		violin: 1500,
		trumpet: 2000,
		bass: 2500,
		maracas: 3000,
		harmonica: 4000,
		battery: 5000
	};

	var s = scores[FRUIT] || 100;

	score(s, "fruit");
	cancelFruit();
}

function fruit() { 
	
	if (TIME_FRUITS === 2 && $("#board .fruits").length > 0) { 
		$("#board .fruits").remove();
	}
	if (TIME_FRUITS > FRUIT_MINIMUM_START) { 
		if (anyGoodIdea() > 3) { 
			oneFruit();
		}
	}
}
function oneFruit() {
	if (FRUIT_CANCEL_TIMER === null) {
		var ctx = getFruitsCanevasContext();

		var instruments = [
			"electricGuitar", "acousticGuitar", "keyboard",
			"drum", "flute", "saxophone", "violin",
			"trumpet", "bass", "maracas", "harmonica", "battery"
		];

		var index = Math.min(Math.max(LEVEL, 1), 12) - 1;
		FRUIT = instruments[index];

		drawFruit(
			ctx,
			FRUIT,
			FRUITS_POSITION_X,
			FRUITS_POSITION_Y,
			FRUITS_SIZE
		);

		FRUIT_CANCEL_TIMER = new Timer(
			"cancelFruit()",
			FRUIT_CANCEL_SPEED
		);
	}
}


function cancelFruit() { 
	eraseFruit();
	FRUIT_CANCEL_TIMER.cancel();
	FRUIT_CANCEL_TIMER = null;
	TIME_FRUITS = 0;
}

function eraseFruit() { 

	var ctx = getFruitsCanevasContext();
	//ctx.translate(FRUITS_POSITION_X - (FRUITS_SIZE / 2), FRUITS_POSITION_Y - (FRUITS_SIZE / 2));
	//ctx.save();
	//ctx.globalCompositeOperation = "destination-out";
	
	//ctx.beginPath();
	//ctx.translate(FRUITS_POSITION_X - (FRUITS_SIZE / 2), FRUITS_POSITION_Y - (FRUITS_SIZE / 2));
	ctx.clearRect(FRUITS_POSITION_X - (FRUITS_SIZE), FRUITS_POSITION_Y - (FRUITS_SIZE), FRUITS_SIZE * 2, FRUITS_SIZE * 2);
	//ctx.fill();
	//ctx.closePath();
	
	//ctx.restore();
}


function drawFruit(ctx, f, x, y, size) {
	ctx.save();
	drawInstrument(ctx, f, x, y, size);
	ctx.restore();
}

function drawInstrument(ctx, type, x, y, size) {
	ctx.save();
	ctx.translate(x - size / 2, y - size / 2);
	ctx.scale(size / 30, size / 30);

	var colors = {
		electricGuitar: "#ed4ca5",
		acousticGuitar: "#d98b43",
		keyboard: "#48b8ff",
		drum: "#ff4b4b",
		flute: "#b9e6ff",
		saxophone: "#ffd447",
		violin: "#a75a2a",
		trumpet: "#ffbf32",
		bass: "#a66cff",
		maracas: "#55d879",
		harmonica: "#70d9df",
		battery: "#d65cff"
	};

	var c = colors[type] || "#ed4ca5";

	ctx.lineJoin = "round";
	ctx.lineCap = "round";
	ctx.lineWidth = 2;
	ctx.strokeStyle = "#252039";
	ctx.fillStyle = c;

	function line(x1, y1, x2, y2, color, width) {
		ctx.beginPath();
		ctx.strokeStyle = color || "#fff";
		ctx.lineWidth = width || 1.5;
		ctx.moveTo(x1, y1);
		ctx.lineTo(x2, y2);
		ctx.stroke();
	}

	function circle(cx, cy, r, color) {
		ctx.beginPath();
		ctx.fillStyle = color;
		ctx.arc(cx, cy, r, 0, Math.PI * 2);
		ctx.fill();
		ctx.strokeStyle = "#252039";
		ctx.lineWidth = 1.5;
		ctx.stroke();
	}

	switch (type) {
		case "electricGuitar":
		case "bass":
			// Mástil y clavijero
			ctx.fillStyle = "#d8b17a";
			ctx.fillRect(12, 3, 5, 17);
			ctx.strokeRect(12, 3, 5, 17);

			ctx.fillStyle = "#e8d4ad";
			ctx.fillRect(10, 1, 9, 5);
			ctx.strokeRect(10, 1, 9, 5);

			// Cuerpo de guitarra
			ctx.fillStyle = c;
			ctx.beginPath();
			ctx.moveTo(12, 15);
			ctx.bezierCurveTo(5, 10, 3, 17, 7, 21);
			ctx.bezierCurveTo(3, 28, 13, 30, 15, 24);
			ctx.bezierCurveTo(19, 30, 27, 26, 23, 20);
			ctx.bezierCurveTo(27, 14, 20, 11, 16, 16);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "#f4e7cb";
			ctx.fillRect(12, 16, 5, 8);
			ctx.strokeRect(12, 16, 5, 8);
			line(14, 2, 14, 25, "#fff", 0.7);
			line(12, 9, 17, 9, "#252039", 1);
			line(12, 12, 17, 12, "#252039", 1);
			circle(14.5, 20, 2, "#252039");
			break;

		case "acousticGuitar":
			ctx.fillStyle = "#8b572d";
			ctx.fillRect(13, 2, 4, 16);
			ctx.strokeRect(13, 2, 4, 16);

			ctx.fillStyle = "#e9bd75";
			ctx.beginPath();
			ctx.moveTo(13, 14);
			ctx.bezierCurveTo(5, 10, 4, 17, 8, 21);
			ctx.bezierCurveTo(3, 28, 13, 30, 15, 24);
			ctx.bezierCurveTo(20, 30, 27, 25, 22, 20);
			ctx.bezierCurveTo(26, 14, 20, 11, 17, 15);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			circle(15, 21, 3, "#754329");
			ctx.fillStyle = "#754329";
			ctx.fillRect(12, 17, 6, 2);
			line(15, 2, 15, 24, "#fff", 0.8);
			break;

		case "keyboard":
			ctx.fillStyle = "#34364c";
			ctx.fillRect(2, 7, 26, 16);
			ctx.fillStyle = "#f7f4ff";
			ctx.fillRect(4, 9, 22, 11);
			ctx.strokeRect(4, 9, 22, 11);

			for (var k = 1; k < 7; k++) {
				line(4 + k * 3.1, 9, 4 + k * 3.1, 20, "#34364c", 1);
			}
			[6, 9, 15, 18, 21].forEach(function (kx) {
				ctx.fillStyle = "#34364c";
				ctx.fillRect(kx, 9, 2, 6);
			});

			ctx.fillStyle = "#ff648f";
			ctx.fillRect(5, 3, 20, 3);
			ctx.fillStyle = "#fff";
			ctx.fillRect(7, 4, 3, 1);
			ctx.fillRect(12, 4, 3, 1);
			ctx.fillRect(17, 4, 3, 1);
			break;

		case "drum":
			ctx.fillStyle = c;
			ctx.fillRect(5, 8, 20, 15);
			ctx.fillRect(8, 23, 2, 5);
			ctx.fillRect(20, 23, 2, 5);
			ctx.strokeRect(5, 8, 20, 15);

			ctx.fillStyle = "#ffe9e9";
			ctx.beginPath();
			ctx.ellipse(15, 8, 10, 4, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();

			ctx.beginPath();
			ctx.ellipse(15, 23, 10, 4, 0, 0, Math.PI * 2);
			ctx.stroke();

			line(7, 13, 23, 13, "#fff", 1);
			break;

		case "flute":
			ctx.save();
			ctx.translate(15, 15);
			ctx.rotate(-0.55);
			ctx.fillStyle = c;
			ctx.fillRect(-12, -3, 24, 6);
			ctx.strokeRect(-12, -3, 24, 6);
			for (var h = -7; h <= 7; h += 5) {
				circle(h, 0, 1, "#30334b");
			}
			ctx.restore();
			break;

		case "saxophone":
			ctx.beginPath();
			ctx.moveTo(10, 3);
			ctx.lineTo(15, 3);
			ctx.lineTo(15, 17);
			ctx.bezierCurveTo(15, 22, 23, 18, 23, 23);
			ctx.bezierCurveTo(23, 28, 14, 29, 12, 25);
			ctx.bezierCurveTo(10, 22, 13, 20, 17, 22);
			ctx.lineTo(18, 25);
			ctx.strokeStyle = "#8b5a15";
			ctx.lineWidth = 5;
			ctx.stroke();

			ctx.strokeStyle = c;
			ctx.lineWidth = 3;
			ctx.stroke();

			[8, 12, 16].forEach(function (sy) {
				circle(12, sy, 1.3, "#fff1a0");
			});
			break;

		case "violin":
			ctx.fillStyle = c;
			ctx.beginPath();
			ctx.moveTo(13, 2);
			ctx.lineTo(17, 2);
			ctx.lineTo(17, 10);
			ctx.bezierCurveTo(24, 9, 25, 16, 20, 18);
			ctx.bezierCurveTo(26, 24, 21, 29, 16, 25);
			ctx.bezierCurveTo(11, 29, 5, 24, 10, 18);
			ctx.bezierCurveTo(5, 14, 7, 10, 13, 10);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();
			line(15, 2, 15, 26, "#fff0c9", 0.8);
			circle(15, 19, 2, "#4b2a20");
			line(4, 5, 24, 25, "#e8e0d1", 1.5);
			break;

		case "trumpet":
			ctx.fillStyle = c;
			ctx.fillRect(3, 12, 17, 6);
			ctx.strokeRect(3, 12, 17, 6);

			ctx.beginPath();
			ctx.moveTo(19, 10);
			ctx.lineTo(26, 6);
			ctx.lineTo(26, 24);
			ctx.lineTo(19, 20);
			ctx.closePath();
			ctx.fill();
			ctx.stroke();

			[7, 12, 17].forEach(function (tx) {
				line(tx, 8, tx, 12, "#fff2a8", 1.5);
				circle(tx, 8, 1.5, "#fff2a8");
			});
			break;

		case "maracas":
			ctx.save();
			ctx.translate(10, 12);
			ctx.rotate(-0.55);
			ctx.fillStyle = c;
			ctx.beginPath();
			ctx.ellipse(0, 0, 6, 9, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.fillRect(-1.5, 7, 3, 9);
			ctx.strokeRect(-1.5, 7, 3, 9);
			ctx.restore();

			ctx.save();
			ctx.translate(21, 12);
			ctx.rotate(0.55);
			ctx.fillStyle = "#8c63ed";
			ctx.beginPath();
			ctx.ellipse(0, 0, 6, 9, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();
			ctx.fillRect(-1.5, 7, 3, 9);
			ctx.strokeRect(-1.5, 7, 3, 9);
			ctx.restore();
			break;

		case "harmonica":
			ctx.fillStyle = "#c7d2df";
			ctx.fillRect(3, 10, 24, 11);
			ctx.strokeRect(3, 10, 24, 11);

			ctx.fillStyle = c;
			ctx.fillRect(5, 7, 20, 4);
			ctx.strokeRect(5, 7, 20, 4);

			for (var n = 0; n < 7; n++) {
				ctx.fillStyle = "#424b60";
				ctx.fillRect(5 + n * 3, 13, 2, 5);
			}
			line(5, 22, 25, 22, "#fff", 1);
			break;

		case "battery":
			// Mini batería con bombo, toms y platillos
			ctx.fillStyle = "#b6c5dc";
			ctx.beginPath();
			ctx.ellipse(15, 21, 8, 7, 0, 0, Math.PI * 2);
			ctx.fill();
			ctx.stroke();

			circle(9, 11, 4, c);
			circle(19, 10, 4, "#ffb347");

			line(5, 4, 26, 4, "#e8d16a", 2);
			line(7, 4, 7, 9, "#b8c4d8", 1.5);
			line(24, 4, 24, 9, "#b8c4d8", 1.5);
			line(15, 15, 15, 27, "#b8c4d8", 1.5);
			line(8, 28, 22, 28, "#b8c4d8", 1.5);
			break;
	}

	ctx.restore();
}



function drawKey(ctx, x, y, size) { 
	ctx.translate(x - (size / 2), y - (size / 2));
	
	ctx.fillStyle = "#52c4cc";
	ctx.beginPath();
	ctx.rect(size / 3, 5, (size - (size / 3)), size / 3);
	ctx.rect((size / 6) * 3, 2, (size - ((size / 3) * 2)), size / (size / 3));
	ctx.fill();
	
	ctx.fillStyle = "#000";
	ctx.beginPath();
	ctx.rect((size / 6) * 3, (size / 6), (size - ((size / 3) * 2)), size / 10);
	ctx.fill();
	
	ctx.strokeStyle = "#ccc";
	ctx.lineWidth = "3";
	
	ctx.beginPath();
	ctx.moveTo((size / 2) + 2, size - 4);
	ctx.lineTo((size / 2) + 2, size / 2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((size / 2) + 7, size - 4);
	ctx.lineTo((size / 2) + 7, size / 2);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((size / 2) + 4, size - 4);
	ctx.lineTo((size / 2) + 4, size - 1);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((size / 2) + 5, size - 4);
	ctx.lineTo((size / 2) + 5, size - 1);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((size / 2) + 9, (size / 2) + 2);
	ctx.lineTo((size / 2) + 9, (size / 2) + 5);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo((size / 2) + 10, (size / 2) + 8);
	ctx.lineTo((size / 2) + 10, (size / 2) + 11);
	ctx.stroke();

	
	ctx.closePath();
}

function drawBell(ctx, x, y, size) { 

	ctx.translate(x - (size / 2), y - (size / 2));
	
	ctx.oval(size / 2, size / 2, size / 1, size - 5);
	ctx.fillStyle = "#fff200";
	ctx.fill();
	
	ctx.beginPath();
	ctx.rect(4, size - (size / 2.5) - 3, size - 8, (size / 2.5) - 1);
	ctx.fill();
	
	ctx.fillStyle = "#52c4cc";
	ctx.beginPath();
	ctx.rect(4 + 2, size - 6, (size - 12), 5);
	ctx.fill();
	
	ctx.fillStyle = "#8c8c8c";
	ctx.beginPath();
	ctx.rect(size / 2, size - 6, 5, 5);
	ctx.fill();
	
	ctx.closePath();
	
	ctx.strokeStyle = "#bbb";
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.moveTo(15, 7);
	ctx.arcTo(8, 7, 8, 30, 9);
	ctx.stroke();
	
	ctx.closePath();
}
function drawGalboss(ctx, x, y, size) { 

	ctx.translate(x - (size / 2), y - (size / 2) + 1);

	ctx.strokeStyle = "#868df5";
	ctx.lineWidth = "5";
	
	ctx.beginPath();
	ctx.moveTo((size / 2), (size / 2) + (size / 4));
	ctx.arcTo(size - 1, (size / 2) + 4, size - 1, (size / 2) + 1, (size / 3));
	ctx.lineTo(size - 1, 4);
	ctx.stroke();
	ctx.closePath();
	
	ctx.beginPath();
	ctx.moveTo((size / 2), (size / 2) + (size / 4));
	ctx.arcTo(1, (size / 2) + 4, 1, (size / 2) + 1, (size / 3));
	ctx.lineTo(1, 4);
	ctx.stroke();
	ctx.closePath();
	
	ctx.strokeStyle = "#ffff00";
	ctx.lineWidth = "6";
	
	ctx.beginPath();
	ctx.moveTo(size / 2, (size / 2) - 2);
	ctx.lineTo(size / 2, size);
	ctx.stroke();
	
	ctx.fillStyle = "#ffff00";
	
	ctx.beginPath();
	ctx.arc((size / 2), size / 3.5, size / 2.5, 0, Math.PI * 1);
	ctx.fill();
	ctx.closePath();
	
	ctx.strokeStyle = "#000";
	ctx.lineWidth = "3";
	
	ctx.beginPath();
	ctx.moveTo(size / 2 - (size / 6), (size / 2) + 1);
	ctx.lineTo(size / 2 - (size / 6), size);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(size / 2 + (size / 6), (size / 2) + 1);
	ctx.lineTo(size / 2 + (size / 6), size);
	ctx.stroke();
	
	ctx.strokeStyle = "#ff3f3f";
	ctx.lineWidth = "4";
	
	ctx.beginPath();
	ctx.moveTo(size / 2, (size / 2));
	ctx.lineTo((size / 2), 2);
	ctx.stroke();
	
	ctx.moveTo((size / 2) + 1, 2);
	ctx.lineTo((size / 2) - 8, (size / 2) - (size / 6));
	ctx.stroke();
	
	ctx.moveTo((size / 2) - 1, 2);
	ctx.lineTo((size / 2) + 8, (size / 2) - (size / 6));
	ctx.stroke();
	
	ctx.closePath();
	
}
function drawMelon(ctx, x, y, size) { 

	ctx.translate(x - (size / 2), y - (size / 2));
	
	ctx.fillStyle = "#198122";
	ctx.beginPath();
	ctx.moveTo(size / 2, size / 6);
	ctx.arc(size / 2, size / 6, size / 1.15, 1.1, 2.5, true);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "#ACFB77";
	ctx.moveTo(size / 2, size / 6);
	ctx.arc(size / 2, size / 6, size / 1.3, 1.1, 2.5, true);
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "#F92F2F";
	ctx.moveTo(size / 2, size / 6);
	ctx.arc(size / 2, size / 6, size / 1.7, 1.1, 2.5, true);
	ctx.fill();
	ctx.closePath();

	var mod = size / 23;
	ctx.beginPath();
	ctx.fillStyle = "black";
	ctx.moveTo(12 * mod, 9 * mod);
	ctx.arc(12 * mod, 9 * mod, size / 12, 1.1, 2.5, true);
	ctx.moveTo(13 * mod, 12 * mod);
	ctx.arc(13 * mod, 12 * mod, size / 12, 1.1, 2.5, true);
	ctx.moveTo(10.5 * mod, 12 * mod);
	ctx.arc(10.5 * mod, 12 * mod, size / 12, 1.1, 2.5, true);
	ctx.fill();
	ctx.closePath();
}
function drawApple(ctx, x, y, size) { 

	ctx.translate(x - (size / 2), y - (size / 2) - 2);
	
	ctx.fillStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(size / 2, size / 2 + size / 9, (size / 2.1), Math.PI * 2, -Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();

	ctx.fillStyle = "#ff0000";
	ctx.beginPath();
	ctx.arc(9, size - 3, (size / 4.5), Math.PI * 2, -Math.PI * 2, true);
	ctx.arc(size - 8, size - 3, (size / 4.5), Math.PI * 2, -Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();
	
	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(size / 2, size / 6, (size / 7), Math.PI * 2, -Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();

	var mod = size / 23;
	ctx.strokeStyle = "#24da1c";
	ctx.lineWidth = 2;
	ctx.beginPath();
	
	ctx.beginPath();
	ctx.moveTo(13 * mod + 2, (size / 9) + 4);
	ctx.lineTo( (13 * mod) - (size / 4), (size / 9) + 1);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(13 * mod + 2, (size / 9) + 4);
	ctx.lineTo( (13 * mod) - (size / 2.5), (size / 9) + 3);
	ctx.stroke();
	
	ctx.strokeStyle = "#bbb";
	ctx.lineWidth = "2";
	ctx.beginPath();
	ctx.moveTo(12, 11);
	ctx.arcTo(5, 11, 5, 30, 7);
	ctx.stroke();
	
	
	
	ctx.closePath();
}

function drawOrange(ctx, x, y, size) { 

	ctx.translate(x - (size / 2), y - (size / 2) - 1);

	ctx.fillStyle = "#fcb424";
	ctx.beginPath();
	ctx.arc(size / 2, size / 2 + size / 9, (size / 2.2), Math.PI * 2, -Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();

	ctx.fillStyle = "black";
	ctx.beginPath();
	ctx.arc(size / 2, size / 6, (size / 7), Math.PI * 2, -Math.PI * 2, true);
	ctx.fill();
	ctx.closePath();

	var mod = size / 23;
	ctx.strokeStyle = "#24da1c";
	ctx.lineWidth = 2.5;
	ctx.beginPath();
	ctx.moveTo(size / 2, size / 3);
	ctx.lineTo(size / 2, size / 8);
	ctx.lineTo(9 * mod, size / 9);
	ctx.stroke();
	
	ctx.beginPath();
	ctx.moveTo(9 * mod, (size / 9));
	ctx.lineTo( (9 * mod) + (size / 3), (size / 9) - 2);
	ctx.stroke();
	
	ctx.closePath();
}

function drawStrawberry(ctx, x, y, size) { 
	
	ctx.translate(x - (size / 2), y - (size / 2) + 2);
	
	ctx.beginPath();
	ctx.fillStyle = "#ff0000";

	ctx.moveTo(size / 2, size - size / 18)
	ctx.bezierCurveTo(0, size / 1.3, 0, -size / 9, size / 2, size / 6)
	ctx.moveTo(size / 2, size - size / 18)
	ctx.bezierCurveTo(size, size / 1.3, size, -size / 9, size / 2, size / 6)
	
	ctx.fill();
	ctx.closePath();

	ctx.fillStyle = "white";

	ctx.fillRect(size / 4, size / 3, size / 18, size / 16)
	ctx.fillRect(size / 2, size / 4, size / 18, size / 16)
	ctx.fillRect(size - size / 3.5, size / 2.4, size / 18, size / 16)
	ctx.fillRect(size - size / 2.2, size / 2, size / 18, size / 16)
	ctx.fillRect(size / 2.6, size / 1.3, size / 18, size / 16)
	ctx.fillRect(size / 3, size / 1.8, size / 18, size / 16)
	ctx.fillRect(size / 1.6, size / 1.4, size / 18, size / 16)

	ctx.beginPath();
	ctx.fillStyle = "#24DA1D";

	var mod = size / 23;
	ctx.moveTo(6 * mod, 2 * mod);
	ctx.lineTo(1 * mod, 8 * mod);
	ctx.lineTo(6 * mod, 6 * mod);
	ctx.lineTo(11 * mod, 11 * mod);
	ctx.lineTo(16 * mod, 6 * mod);
	ctx.lineTo(21 * mod, 8 * mod);
	ctx.lineTo(17 * mod, 2 * mod);

	ctx.moveTo(size / 2, 2 * mod);
	ctx.lineTo(8 * mod, 0 * mod);
	ctx.lineTo(15 * mod, 0 * mod);
	ctx.lineTo(size / 2, 2 * mod);
	
	ctx.fill();
	ctx.closePath();
}
function drawCherry(ctx, x, y, size) {  
	
	ctx.translate(x - (size / 2), y - (size / 2) + 1);
	
	ctx.beginPath();
	ctx.fillStyle = "#ff0000";

	ctx.arc(size / 8, size - (size / 2.8), size / 4, Math.PI * 2, -Math.PI * 2, true);
	ctx.arc(size - size / 3, size - (size / 4), size / 4, Math.PI * 2, -Math.PI * 2, true);

	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.fillStyle = "#670303";

	ctx.arc(size / 7.2, size - (size / 2.25), size / 14, Math.PI * 2, -Math.PI * 2, true);
	ctx.arc(size - size / 3, size - (size / 3), size / 14, Math.PI * 2, -Math.PI * 2, true);

	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.strokeStyle = "#959817";
	ctx.lineWidth = 2;

	ctx.moveTo(size / 8, size - (size / 2));
	ctx.bezierCurveTo(size / 6, size / 1.5, size / 7, size / 4, size - size / 4, size / 8);
	ctx.moveTo(size - size / 2.5, size - size / 3);
	ctx.bezierCurveTo(size / 1.3, size / 1.5, size / 3, size / 2.5, size - size / 4, size / 8);

	ctx.stroke();
	ctx.closePath();

	ctx.fillStyle = "#959817";
	ctx.fillRect(size - size / 3, size / 12, size / 9, size / 9);
	ctx.closePath();
}
