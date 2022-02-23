import "../css/canvas.css"
import $ from 'jquery';
import { Camera } from "./camera";
import {Canvasse } from './canvasse' ;
import {CameraEvents} from './cameraevents' ; 
import { Client } from "./client";
import * as utils from './utils' ;

window.onload = init ; 



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


if (!container) { return; }
if(!viewer) { return ;}
if(!camera) { return ; }

Camera.init(viewer , camera) ;
Canvasse.init(canvas ,canvasWidth,canvasHeight);


    // Clamp starting coordinates to the canvas boundries
    var halfWidth = canvasWidth / 2;
    var halfHeight = canvasHeight / 2;

    var randomBuffer = parseInt((canvasWidth / 10).toString());
    var randomX = randomBuffer + parseInt((Math.random() * (canvasWidth - (randomBuffer * 2))).toString(), 10);
    var randomY = randomBuffer + parseInt((Math.random() * (canvasHeight - (randomBuffer * 2))).toString(), 10);

    var startX = Math.max(0, Math.min(canvasWidth,  randomX));
    var startY = Math.max(0, Math.min(canvasHeight,  randomY));

    console.log(`startX=${startX} , startY=${startY}`);
    // Convert those values to canvas transform offsets
    // TODO - this shouldn't be done here, it requires Canvasse.init to be called first
    var startOffsets = Client.getOffsetFromCameraLocation(startX, startY);
    console.log(`startOffsets=${startOffsets.x } _ ${startOffsets.y} `);

    let containerRect = container.getBoundingClientRect();
    Client.setContainerSize(containerRect.width, containerRect.height);

    window.onresize =  function() {
      let containerRect = container.getBoundingClientRect();
      Client.setContainerSize(containerRect.width, containerRect.height);
      console.log(`window onresize , ${containerRect.width}  , ${containerRect.height} `);
    } ; 

utils.bindEvents(container , CameraEvents['container']) ; 





















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