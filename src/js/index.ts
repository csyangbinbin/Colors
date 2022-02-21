import "../css/style.css"

import * as PIXI from 'pixi.js'
//import Icon from '../static/images/mint.png'
//import { Application } from '@pixi/app';
//import { Application, Graphics  } from 'pixi.js';
//import { Graphics } from '@pixi/graphics';
//import {  } from '@pixi/graphics';
import "@pixi/events";

const gridSize = [1000, 1000];
const squareSize = [3, 3];
const coolDownTime = 500;
const zoomLevel = 6;
const clearColorSelectionOnCoolDown = false;
let canvasContainer:HTMLElement = document.getElementById("canvas") ;

let app = new PIXI.Application({width:800 , height:800 ,antialias:false ,  backgroundColor : 0xeeeeee}) ; 
    
canvasContainer.appendChild(app.view);

let  container = new PIXI.Container();
	
// and container to the stage
app.stage.addChild(container);

    let graphics = new PIXI.Graphics();
	graphics.beginFill(0xffffff, 1);
	graphics.drawRect(0, 0, gridSize[0] * squareSize[0], gridSize[1] * squareSize[1]);
	graphics.interactive = true;
    graphics.on('pointerdown', onDown);

    container.addChild(graphics) ;
    
    function onDown(){
        console.log("pointerdown");

    }
   /* 
    
    ndow.innerWidth,
    window.innerHeight-60, 
    { antialias: false, 
     backgroundColor : 0xeeeeee });
canvasContainer.appendChild(app.view);*/
