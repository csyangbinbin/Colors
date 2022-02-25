import "../css/canvas.css"
import $ from 'jquery';
import { Camera } from "./camera";
import {Canvasse } from './canvasse' ;
import {CameraEvents} from './cameraevents' ; 
import { Client } from "./client";
import { Hand } from "./hand";
import {Palette} from './palette' ; 
import { MollyGuard } from "./mollyguard";
import {PaletteEvents} from './paletteevents' ; 
import {ZoomButton} from './zoombutton' ; 
import {CameraButton} from './camerabutton' ; 
import { ZoomButtonEvents } from "./zoombuttonevents";
import {Cursor} from './cursor' ; 
import {CanvasEvents} from './canvasevents' ;
import { Coordinates } from "./coordinates";

import * as utils from './utils' ;

window.onload = init ; 



 /**
   * Utility for kicking off an animation frame loop.
   * @function
   * @param {function} fn The function to call on each frame
   * @returns {function} A function that cancels the animation when called
   */
  function startTicking(fn:Function) {
    var token = requestAnimationFrame(function tick() {
      fn();
      token = requestAnimationFrame(tick);
    });

    return function cancel() {
      cancelAnimationFrame(token);
    }
  }

  let DEFAULT_COLOR_PALETTE = [
    '#FFFFFF', // white
    '#E4E4E4', // light grey
    '#888888', // grey
    '#222222', // black
    '#FFA7D1', // pink
    '#E50000', // red
    '#E59500', // orange
    '#A06A42', // brown
    '#E5D900', // yellow
    '#94E044', // lime
    '#02BE01', // green
    '#00D3DD', // cyan
    '#0083C7', // blue
    '#0000EA', // dark blue
    '#CF6EE4', // magenta
    '#820080', // purple
  ] ; 

/************************** */
function init(){
console.log("Start Canvas Init ....");

let canvasWidth = 1000 ; 
let canvasHeight = 1000;
let canvas:HTMLCanvasElement = document.getElementById("place-canvasse") as HTMLCanvasElement;
let Btn_1 = document.getElementById("btn1");
let Btn_2 = document.getElementById("btn2");
let viewer = document.getElementById('place-viewer');
let camera = document.getElementById('place-camera');
let container = document.getElementById('place-container');
let hand = document.getElementById('place-hand');
let handCursor = document.getElementById('place-hand-cursor');
let handSwatch = document.getElementById('place-hand-swatch');
let palette = document.getElementById('place-palette');
let mollyGuard = document.getElementById('place-molly-guard');
let zoomButton = document.getElementById('place-zoom-button');
let cameraButton = document.getElementById('place-camera-button');
let coordinates = document.getElementById('place-coordinates');

let isUserLoggedIn = false ; 
let cooldownDuration=1000 ; 


if (!container) { return; }
if(!viewer) { return ;}
if(!camera) { return ; }

Camera.init(viewer , camera) ;

  // Hack to fix slightly older versions of Safari, where the viewer element
    // defaults to fitting within the container width.
    $(viewer).css({
        flex: '0 0 ' + canvasWidth + 'px',
      });
  



Canvasse.init(canvas ,canvasWidth,canvasHeight);
CameraButton.init(cameraButton);
CameraButton.enable();
Hand.init(hand, handSwatch, handCursor);
Palette.init(palette);
ZoomButton.init(zoomButton);


    // Clamp starting coordinates to the canvas boundries
    var halfWidth = canvasWidth / 2;
    var halfHeight = canvasHeight / 2;

    var randomBuffer = parseInt((canvasWidth / 10).toString());
    var randomX = randomBuffer + parseInt((Math.random() * (canvasWidth - (randomBuffer * 2))).toString(), 10);
    var randomY = randomBuffer + parseInt((Math.random() * (canvasHeight - (randomBuffer * 2))).toString(), 10);

    var startX = Math.max(0, Math.min(canvasWidth,  randomX));
    var startY = Math.max(0, Math.min(canvasHeight,  randomY));
  
    Coordinates.init(coordinates, startX, startY);


    //console.log(`startX=${startX} , startY=${startY}`);
    // Convert those values to canvas transform offsets
    // TODO - this shouldn't be done here, it requires Canvasse.init to be called first
    var startOffsets = Client.getOffsetFromCameraLocation(startX, startY);
    //console.log(`startOffsets=${startOffsets.x } _ ${startOffsets.y} `);


    Client.init(isUserLoggedIn, cooldownDuration, startOffsets.x, startOffsets.y);


    let containerRect = container.getBoundingClientRect();
    Client.setContainerSize(containerRect.width, containerRect.height);

    window.onresize =  function() {
      let containerRect = container.getBoundingClientRect();
      Client.setContainerSize(containerRect.width, containerRect.height);
      console.log(`window onresize , ${containerRect.width}  , ${containerRect.height} `);
    } ; 



   
   // Palette.generateSwatches(DEFAULT_COLOR_PALETTE);
    MollyGuard.init(mollyGuard);

utils.bindEvents(container , CameraEvents['container']) ; 
utils.bindEvents(palette, PaletteEvents);
utils.bindEvents(zoomButton, ZoomButtonEvents);
utils.bindEvents(camera, CanvasEvents);


startTicking(function() {
 // Keyboard.tick();
  Client.tick();
  Cursor.tick();
  var cameraDidUpdate = Camera.tick();
  var canvasDidUpdate = Canvasse.tick();
/*
  if (usingBlurryCanvasFix && (cameraDidUpdate || canvasDidUpdate)) {
    redrawDisplayCanvas();
  }
  */
}) ; 




/*
var minLoadingX = startX - 2;
var loadingWidth = 5;
var loadingDir = 1;
var loadingX = 0;
var loadingY = startY;
var loadingTicks = 0;
var loadingTicksPerFrame = 10;

var loadingAnimationCancel = startTicking(function() {
    console.log(`loadingAnimation=${loadingTicks} ${minLoadingX} ${loadingY}`);
  loadingTicks = (loadingTicks + 1) % loadingTicksPerFrame;
  // only show when ticks is 0
  if (loadingTicks) { return; }
  // erase tile from the previous frame
  Canvasse.drawRectToDisplay(minLoadingX, loadingY, loadingWidth, 1, 'grey');
  // increment position
  loadingX = (loadingX + loadingDir) % loadingWidth;
  // draw new tile
  Canvasse.drawTileToDisplay(minLoadingX + loadingX, loadingY, 'black');
});*/



















Btn_1.addEventListener("click" ,click_1);
Btn_2.addEventListener("click" ,click_2);


var ctx = canvas.getContext("2d");

for(let i=0;i<=canvasHeight;i+=10){
    ctx.beginPath() ; 
    ctx.moveTo(0,i);
    ctx.lineTo(canvasWidth,i);
    ctx.stroke() ;
}

for(let i=0;i<=canvasWidth;i+=10){
    ctx.beginPath() ; 
    ctx.moveTo(i,0);
    ctx.lineTo(i,canvasHeight);
    ctx.stroke() ;
}




}


function click_1(){
   Client.setZoom(40) ; 
}

function click_2(){
    Client.setZoom(10) ; 
}