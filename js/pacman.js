var PACMAN_DIRECTION = 3;
var PACMAN_DIRECTION_TRY = -1;
var PACMAN_DIRECTION_TRY_TIMER = null;
var PACMAN_DIRECTION_TRY_CANCEL = 1000;
var PACMAN_POSITION_X = 276;
var PACMAN_POSITION_Y = 416;
var PACMAN_POSITION_STEP = 2;
var PACMAN_MOUNTH_STATE = 3;
var PACMAN_MOUNTH_STATE_MAX = 6;
var PACMAN_SIZE = 16;
var PACMAN_MOVING = false;
var PACMAN_MOVING_TIMER = -1;
var PACMAN_MOVING_SPEED = 15;
var PACMAN_CANVAS_CONTEXT = null;
var PACMAN_EAT_GAP = 15;
var PACMAN_GHOST_GAP = 20;
var PACMAN_FRUITS_GAP = 15;
var PACMAN_KILLING_TIMER = -1;
var PACMAN_KILLING_SPEED = 70;
var PACMAN_RETRY_SPEED = 2100;
var PACMAN_DEAD = false;

function initPacman() { 
	var canvas = document.getElementById('canvas-pacman');
	canvas.setAttribute('width', '550');
	canvas.setAttribute('height', '550');
	if (canvas.getContext) { 
		PACMAN_CANVAS_CONTEXT = canvas.getContext('2d');
	}
}
function resetPacman() { 
	stopPacman();

	PACMAN_DIRECTION = 3;
	PACMAN_DIRECTION_TRY = -1;
	PACMAN_DIRECTION_TRY_TIMER = null;
	PACMAN_POSITION_X = 276;
	PACMAN_POSITION_Y = 416;
	PACMAN_MOUNTH_STATE = 3;
	PACMAN_MOVING = false;
	PACMAN_MOVING_TIMER = -1;
	PACMAN_KILLING_TIMER = -1;
	PACMAN_DEAD = false;
	PACMAN_SUPER = false;
}
function getPacmanCanevasContext() { 
	return PACMAN_CANVAS_CONTEXT;
}

function stopPacman() { 
	if (PACMAN_MOVING_TIMER != -1) { 
		clearInterval(PACMAN_MOVING_TIMER);
		PACMAN_MOVING_TIMER = -1;
		PACMAN_MOVING = false;
	}
	if (PACMAN_KILLING_TIMER != -1) { 
		clearInterval(PACMAN_KILLING_TIMER);
		PACMAN_KILLING_TIMER = -1;
	}
}

function pausePacman() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.pause();
	}
	
	if ( PACMAN_MOVING_TIMER != -1 ) { 
		clearInterval(PACMAN_MOVING_TIMER);
		PACMAN_MOVING_TIMER = -1;
		PACMAN_MOVING = false;
	}
}
function resumePacman() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.resume();
	}
	movePacman();
}

function tryMovePacmanCancel() { 
	if (PACMAN_DIRECTION_TRY_TIMER != null) { 
		PACMAN_DIRECTION_TRY_TIMER.cancel();
		PACMAN_DIRECTION_TRY = -1;
		PACMAN_DIRECTION_TRY_TIMER = null;
	}
}
function tryMovePacman(direction) { 
	PACMAN_DIRECTION_TRY = direction;
	PACMAN_DIRECTION_TRY_TIMER = new Timer('tryMovePacmanCancel()', PACMAN_DIRECTION_TRY_CANCEL);
}

function movePacman(direction) {

	if (PACMAN_MOVING === false) { 
		PACMAN_MOVING = true;
		drawPacman();
		PACMAN_MOVING_TIMER = setInterval('movePacman()', PACMAN_MOVING_SPEED);
	}
	
	var directionTry = direction;
	var quarterChangeDirection = false;
	
	if (!directionTry && PACMAN_DIRECTION_TRY != -1) { 
		directionTry = PACMAN_DIRECTION_TRY;
	}
	
	if ((!directionTry || PACMAN_DIRECTION !== directionTry)) { 
	
		if (directionTry) { 
			if (canMovePacman(directionTry)) { 
				if (PACMAN_DIRECTION + 1 === directionTry || PACMAN_DIRECTION - 1 === directionTry || PACMAN_DIRECTION + 1 === directionTry || (PACMAN_DIRECTION === 4 && directionTry === 1) || (PACMAN_DIRECTION === 1 && directionTry === 4) ) { 
					quarterChangeDirection = true;
				}
				PACMAN_DIRECTION = directionTry;
				tryMovePacmanCancel();
			} else { 
				if (directionTry !== PACMAN_DIRECTION_TRY) { 
					tryMovePacmanCancel();
				}
				if (PACMAN_DIRECTION_TRY === -1) { 
					tryMovePacman(directionTry);
				}
			}
		}

		if (canMovePacman(PACMAN_DIRECTION)) { 
			erasePacman();
			
			if (PACMAN_MOUNTH_STATE < PACMAN_MOUNTH_STATE_MAX) { 
				PACMAN_MOUNTH_STATE ++; 
			} else { 
				PACMAN_MOUNTH_STATE = 0; 
			}
						
			var speedUp = 0;
			if (quarterChangeDirection) { 
				speedUp = 6;
			}
			
			if ( PACMAN_DIRECTION === 1 ) { 
				PACMAN_POSITION_X += PACMAN_POSITION_STEP + speedUp;
			} else if ( PACMAN_DIRECTION === 2 ) { 
				PACMAN_POSITION_Y += PACMAN_POSITION_STEP + speedUp;
			} else if ( PACMAN_DIRECTION === 3 ) { 
				PACMAN_POSITION_X -= PACMAN_POSITION_STEP + speedUp;
			} else if ( PACMAN_DIRECTION === 4 ) { 
				PACMAN_POSITION_Y -= (PACMAN_POSITION_STEP + speedUp);
			}
			
			if ( PACMAN_POSITION_X === 2 && PACMAN_POSITION_Y === 258 ) { 
				PACMAN_POSITION_X = 548;
				PACMAN_POSITION_Y = 258;
			} else if ( PACMAN_POSITION_X === 548 && PACMAN_POSITION_Y === 258 ) { 
				PACMAN_POSITION_X = 2;
				PACMAN_POSITION_Y = 258;
			}
			
			drawPacman();
			
			if ((PACMAN_MOUNTH_STATE) === 0 || (PACMAN_MOUNTH_STATE) === 3) { 
				testBubblesPacman();
				testGhostsPacman();
				testFruitsPacman();
			}
		} else { 
			stopPacman();
		}
	} else if (direction && PACMAN_DIRECTION === direction) { 
		tryMovePacmanCancel();
	}
}

function canMovePacman(direction) { 
	
	var positionX = PACMAN_POSITION_X;
	var positionY = PACMAN_POSITION_Y;
	
	if (positionX === 276 && positionY === 204 && direction === 2) return false;
	
	if ( direction === 1 ) { 
		positionX += PACMAN_POSITION_STEP;
	} else if ( direction === 2 ) { 
		positionY += PACMAN_POSITION_STEP;
	} else if ( direction === 3 ) { 
		positionX -= PACMAN_POSITION_STEP;
	} else if ( direction === 4 ) { 
		positionY -= PACMAN_POSITION_STEP;
	}
	
	for (var i = 0, imax = PATHS.length; i < imax; i ++) { 
	
		var p = PATHS[i];
		var c = p.split("-");
		var cx = c[0].split(",");
		var cy = c[1].split(",");
	
		var startX = cx[0];
		var startY = cx[1];
		var endX = cy[0];
		var endY = cy[1];

		if (positionX >= startX && positionX <= endX && positionY >= startY && positionY <= endY) { 
			return true;
		}
	}
	
	return false;
}




function drawPacman() {
    var ctx = getPacmanCanevasContext();
    var x = PACMAN_POSITION_X;
    var y = PACMAN_POSITION_Y;
    var color = "#C95798";

    // Coleta: se dibuja detrás de la cabeza.
    ctx.fillStyle = color;
    ctx.beginPath();

    if (PACMAN_DIRECTION === 1) {
        // Mira a la derecha: coleta hacia atrás y abajo.
        ctx.moveTo(x - 9, y - 5);
        ctx.quadraticCurveTo(x - 17, y - 5, x - 19, y + 5);
        ctx.quadraticCurveTo(x - 22, y + 13, x - 27, y + 10);
        ctx.quadraticCurveTo(x - 32, y + 7, x - 28, y + 2);
        ctx.quadraticCurveTo(x - 24, y - 3, x - 17, y + 1);
        ctx.lineTo(x - 9, y + 5);
    } else if (PACMAN_DIRECTION === 2) {
        ctx.moveTo(x - 5, y - 9);
        ctx.quadraticCurveTo(x - 8, y - 17, x - 14, y - 19);
        ctx.quadraticCurveTo(x - 20, y - 22, x - 16, y - 27);
        ctx.quadraticCurveTo(x - 12, y - 32, x - 7, y - 28);
        ctx.quadraticCurveTo(x - 2, y - 24, x + 3, y - 17);
        ctx.lineTo(x + 5, y - 9);
    } else if (PACMAN_DIRECTION === 3) {
        // Mira a la izquierda: coleta hacia atrás y abajo.
        ctx.moveTo(x + 9, y - 5);
        ctx.quadraticCurveTo(x + 17, y - 5, x + 19, y + 5);
        ctx.quadraticCurveTo(x + 22, y + 13, x + 27, y + 10);
        ctx.quadraticCurveTo(x + 32, y + 7, x + 28, y + 2);
        ctx.quadraticCurveTo(x + 24, y - 3, x + 17, y + 1);
        ctx.lineTo(x + 9, y + 5);
    } else {
        ctx.moveTo(x - 5, y + 9);
        ctx.quadraticCurveTo(x - 8, y + 17, x - 14, y + 19);
        ctx.quadraticCurveTo(x - 20, y + 22, x - 16, y + 27);
        ctx.quadraticCurveTo(x - 12, y + 32, x - 7, y + 28);
        ctx.quadraticCurveTo(x - 2, y + 24, x + 3, y + 17);
        ctx.lineTo(x + 5, y + 9);
    }

    ctx.closePath();
    ctx.fill();

    // Goma del pelo.
    ctx.fillStyle = "#2b2a2a";
    ctx.beginPath();

    if (PACMAN_DIRECTION === 1) {
        ctx.arc(x - 17, y + 1, 2.5, 0, Math.PI * 2);
    } else if (PACMAN_DIRECTION === 2) {
        ctx.arc(x - 5, y - 17, 2.5, 0, Math.PI * 2);
    } else if (PACMAN_DIRECTION === 3) {
        ctx.arc(x + 17, y + 1, 2.5, 0, Math.PI * 2);
    } else {
        ctx.arc(x - 5, y + 17, 2.5, 0, Math.PI * 2);
    }

    ctx.fill();

    // Cuerpo clásico y boca animada.
    ctx.fillStyle = color;
    ctx.beginPath();

    var startAngle = 0;
    var endAngle = 2 * Math.PI;
    var lineToX = x;
    var lineToY = y;

    if (PACMAN_DIRECTION === 1) {
        startAngle = (0.35 - PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        endAngle = (1.65 + PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        lineToX -= 8;
    } else if (PACMAN_DIRECTION === 2) {
        startAngle = (0.85 - PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        endAngle = (0.15 + PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        lineToY -= 8;
    } else if (PACMAN_DIRECTION === 3) {
        startAngle = (1.35 - PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        endAngle = (0.65 + PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        lineToX += 8;
    } else {
        startAngle = (1.85 - PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        endAngle = (1.15 + PACMAN_MOUNTH_STATE * 0.05) * Math.PI;
        lineToY += 8;
    }

    ctx.arc(x, y, PACMAN_SIZE, startAngle, endAngle, false);
    ctx.lineTo(lineToX, lineToY);
    ctx.fill();
    ctx.closePath();

    // Ojo.
    ctx.fillStyle = "#222222";
    var eyeX = x;
    var eyeY = y - 9;

    if (PACMAN_DIRECTION === 1) {
        eyeX = x + 3;
        eyeY = y - 9;
    } else if (PACMAN_DIRECTION === 2) {
        eyeX = x + 9;
        eyeY = y + 3;
    } else if (PACMAN_DIRECTION === 3) {
        eyeX = x - 3;
        eyeY = y - 9;
    } else {
        eyeX = x + 9;
        eyeY = y - 3;
    }

    ctx.beginPath();
    ctx.arc(eyeX, eyeY, 2, 0, Math.PI * 2);
    ctx.fill();
}





	






function erasePacman() {
    var ctx = getPacmanCanevasContext();

    var x = PACMAN_POSITION_X;
    var y = PACMAN_POSITION_Y;

    // Borra también la zona donde puede sobresalir la coleta
    ctx.clearRect(
        x - PACMAN_SIZE - 15,
        y - PACMAN_SIZE - 15,
        (PACMAN_SIZE * 2) + 30,
        (PACMAN_SIZE * 2) + 30
    );
}


function killPacman() { 
	playDieSound();

	LOCK = true;
	PACMAN_DEAD = true;
	stopPacman();
	stopGhosts();
	pauseTimes();
	stopBlinkSuperBubbles();
	PACMAN_KILLING_TIMER = setInterval('killingPacman()', PACMAN_KILLING_SPEED);
}
function killingPacman() { 
	if (PACMAN_MOUNTH_STATE > -12) { 
		erasePacman();
		PACMAN_MOUNTH_STATE --;
		drawPacman();
	} else { 
		clearInterval(PACMAN_KILLING_TIMER);
		PACMAN_KILLING_TIMER = -1;
		erasePacman();
		if (LIFES > 0) { 
			lifes(-1);
			setTimeout('retry()', (PACMAN_RETRY_SPEED));
		} else { 
			gameover();
		}
	}
}

function testGhostsPacman() { 
	testGhostPacman('blinky');
	testGhostPacman('pinky');
	testGhostPacman('inky');
	testGhostPacman('clyde');

}
function testGhostPacman(ghost) { 
	eval('var positionX = GHOST_' + ghost.toUpperCase() + '_POSITION_X');
	eval('var positionY = GHOST_' + ghost.toUpperCase() + '_POSITION_Y');
		
	if (positionX <= PACMAN_POSITION_X + PACMAN_GHOST_GAP && positionX >= PACMAN_POSITION_X - PACMAN_GHOST_GAP && positionY <= PACMAN_POSITION_Y + PACMAN_GHOST_GAP && positionY >= PACMAN_POSITION_Y - PACMAN_GHOST_GAP ) { 
		eval('var state = GHOST_' + ghost.toUpperCase() + '_STATE');
		if (state === 0) { 
			killPacman();
		} else if (state === 1) { 
			startEatGhost(ghost);
		}
	}
}
function testFruitsPacman() { 
	
	if (FRUIT_CANCEL_TIMER != null) { 
		if (FRUITS_POSITION_X <= PACMAN_POSITION_X + PACMAN_FRUITS_GAP && FRUITS_POSITION_X >= PACMAN_POSITION_X - PACMAN_FRUITS_GAP && FRUITS_POSITION_Y <= PACMAN_POSITION_Y + PACMAN_FRUITS_GAP && FRUITS_POSITION_Y >= PACMAN_POSITION_Y - PACMAN_FRUITS_GAP ) { 
			eatFruit();
		}
	}
}
function testBubblesPacman() { 
	
	var r = { x: PACMAN_POSITION_X - ( PACMAN_SIZE / 2 ), y: PACMAN_POSITION_Y - ( PACMAN_SIZE / 2 ) , width: ( PACMAN_SIZE * 2 ), height: ( PACMAN_SIZE * 2 ) };
		
	for (var i = 0, imax = BUBBLES_ARRAY.length; i < imax; i ++) { 
		var bubble = BUBBLES_ARRAY[i];
		
		var bubbleParams = bubble.split( ";" );
		var testX = parseInt(bubbleParams[0].split( "," )[0]);
		var testY = parseInt(bubbleParams[0].split( "," )[1]);
		var p = { x: testX, y: testY };
		
		if ( isPointInRect( p, r ) ) { 
			
			if ( bubbleParams[4] === "0" ) { 
				var type = bubbleParams[3];
							
				eraseBubble( type, testX, testY );
				BUBBLES_ARRAY[i] = bubble.substr( 0, bubble.length - 1 ) + "1"
				
				if ( type === "s" ) { 
					setSuperBubbleOnXY( testX, testY, "1" );
					score( SCORE_SUPER_BUBBLE );
					playEatPillSound();
					affraidGhosts();
				} else { 
					score( SCORE_BUBBLE );
					playEatingSound();
				}
				BUBBLES_COUNTER --;
				if ( BUBBLES_COUNTER === 0 ) { 
					win();
				}
			} else { 
				stopEatingSound();
			}
			return;
		}
	}
}