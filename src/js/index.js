import * as PIXI from 'pixi.js';
let canvasContainer = document.getElementById("canvas") ;
let gridLines = null ; 
let app  = null ; 
let container  = null ; 

const gridSize = [1000, 1000];
const squareSize = [3, 3];
function setupStage()
{
	// Setting up canvas with Pixi.js
	 app = new PIXI.Application(window.innerWidth,
							   window.innerHeight-60, 
							   { antialias: false, 
								backgroundColor : 0xeeeeee });
	canvasContainer.appendChild(app.view);
	
	// create a container for the grid
	// container will be used for zooming
	 container = new PIXI.Container();
	
	// and container to the stage
	app.stage.addChild(container);

	// graphics is the cavas we draw the 
	// pixels on, well also move this around
	// when the user drags around
let 	graphics = new PIXI.Graphics();
	graphics.beginFill(0xffffff, 1);
	graphics.drawRect(0, 0, gridSize[0] * squareSize[0], gridSize[1] * squareSize[1]);
	graphics.interactive = true;
	
	// setup input listeners, we use
	// pointerdown, pointermove, etc 
	// rather than mousedown, mousemove,
	// etc, because it triggers on both
	// mouse and touch
	//graphics.on('pointerdown', onDown);
	//graphics.on('pointermove', onMove);
	//graphics.on('pointerup', onUp);
	//graphics.on('pointerupoutside', onUp);
	
	// move graphics so that it's center
	// is at x0 y0
	graphics.position.x = -graphics.width/2;
	graphics.position.y = -graphics.height/2;
	
	
			
	// place graphics into the container
	//container.addChild(graphics);
	
	 gridLines = new PIXI.Graphics();
	gridLines.lineStyle(0.5, 0x888888, 1);
	gridLines.alpha = 0;
	
	gridLines.position.x = graphics.position.x;
	gridLines.position.y = graphics.position.y;
	
	for(let i = 0; i <= gridSize[0]; i++)
	{
		drawLine(0, 
				 i * squareSize[0], 
				 gridSize[0] * squareSize[0], i * squareSize[0])	
	}
	for(let j = 0; j <= gridSize[1]; j++)
	{
		drawLine(j * squareSize[1], 0, j * squareSize[1], gridSize[1] * squareSize[1])
	}
	
	container.addChild(gridLines);
	
	// start page resize listener, so 
	// we can keep the canvas the correct
	// size
	window.onresize = onResize;
	
	// make canvas fill the screen.
	onResize();
	
	// add zoom button controls
	//zoomInButton.addEventListener("click", () => { toggleZoom({x: window.innerWidth / 2, y: window.innerHeight / 2}, true) });
//	zoomOutButton.addEventListener("click", () => { toggleZoom({x: window.innerWidth / 2, y: window.innerHeight / 2}, false) });
}

function drawLine(x, y, x2, y2)
{
	
		gridLines.moveTo(x, y);
		gridLines.lineTo(x2, y2);
	
}


function onResize(e)
{
    console.log("onResize");
	// resize the canvas to fill the screen
	app.renderer.resize(window.innerWidth, window.innerHeight);
	
	// center the container to the new
	// window size.
	container.position.x = window.innerWidth / 2;
	container.position.y = window.innerHeight / 2;
}


setupStage() ; 