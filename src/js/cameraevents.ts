import { Client } from './client' ; 

 function getCoordsFromEvent(e:MouseEvent) {
    return { 
         x: e.clientX + window.scrollX,  
        y: e.clientY + window.scrollY};
}

function dumpCoord(msg:string,val:{x:number,y:number}){
    console.log(`${msg} x=${val.x} y=${val.y}`);
}

let Cursor = {
       x:0,
       y:0,
       downX:0,
       downY:0 ,
       isDown:false
}


let CameraEvents = {
   


    'container':{
        'mousedown':function(e:MouseEvent){
            let coords = getCoordsFromEvent(e) ; 
            dumpCoord('container-mousedown' , coords);
            Cursor.downX  = coords.x ; 
            Cursor.downY = coords.y;
            Cursor.x = coords.x ; 
            Cursor.y = coords.y ; 
            Cursor.isDown = true ; 
            
        } ,
        'mouseup':function(e:MouseEvent){
            let coords = getCoordsFromEvent(e) ; 
            dumpCoord('container-mouseup' , coords);
            Cursor.isDown = false ; 
        } ,
        'mousemove':function(e:MouseEvent){

            if(!Cursor.isDown) 
                return ; 

            let coords = getCoordsFromEvent(e) ; 
            var offsetLeft = e.currentTarget ? (e.currentTarget as HTMLElement) .offsetLeft : 0;
            var offsetTop = e.currentTarget ? (e.currentTarget as HTMLElement).offsetTop : 0;

            var tileCoords = Client.getLocationFromCursorPosition(
                coords.x - offsetLeft,
                coords.y - offsetTop
              );

            var activeTileCoords = Client.getCursorPositionFromLocation(tileCoords.x, tileCoords.y);

           // dumpCoord('container-mousemove' , coords);
           // console.log(`tileCoords=${tileCoords.x} , ${tileCoords.y}`);
           // console.log(`activeTileCoords=${activeTileCoords.x} , ${activeTileCoords.y}`);

            let oldOffsetX = (Cursor.x - Cursor.downX) /Client.zoom; 
            let oldOffsetY = (Cursor.y - Cursor.downY) /Client.zoom; 

                Cursor.x = coords.x ;
                Cursor.y = coords.y ; 


            let newOffsetX = (coords.x -Cursor.downX)/Client.zoom ; 
            let newOffsetY  = (coords.y - Cursor.downY)/Client.zoom ; 


console.log(` oldOffsetX=${oldOffsetX} , oldOffsetY=${oldOffsetY}`);
console.log(`- newOffsetX=${newOffsetX} , newOffsetY=${newOffsetY}`);

              // And update the offset.  Important to know that Client
        // expects offset coordinates in canvas-space, which is why
        // we are only calculating an offset relative to the current
        // camera position and scaling that to the zoom level.
        Client.setOffset(
            Client.panX - oldOffsetX + newOffsetX,
            Client.panY - oldOffsetY + newOffsetY
          );

           // 
           // console.log(`offsetLeft]${offsetLeft} ,offsetTop=${offsetTop}`);
        }
    }
    

} ; 

export {CameraEvents} ; 