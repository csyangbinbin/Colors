import { Client } from './client' ; 
import { Coordinates } from './coordinates';
import { Cursor  } from './cursor' ; 

 function getCoordsFromEvent(e:MouseEvent) {
    return { 
         x: e.clientX + window.scrollX,  
        y: e.clientY + window.scrollY};
}

function dumpCoord(msg:string,val:{x:number,y:number}){
    console.log(`${msg} x=${val.x} y=${val.y}`);
}

const E_KEY = 69 ;

let CameraEvents = {

    'container':{
        'mousedown':function(e:MouseEvent){
            let coords = getCoordsFromEvent(e) ; 
            Cursor.setCursorDown(coords.x, coords.y);   
        } ,
        'mouseup':function(e:MouseEvent){
            let coords = getCoordsFromEvent(e) ; 
            Cursor.setCursorUp(coords.x, coords.y);
        } ,
        'mousemove':function(e:MouseEvent){
            
            let coords = getCoordsFromEvent(e) ; 
            var offsetLeft = e.currentTarget ? (e.currentTarget as HTMLElement) .offsetLeft : 0;
            var offsetTop = e.currentTarget ? (e.currentTarget as HTMLElement).offsetTop : 0;

            var tileCoords = Client.getLocationFromCursorPosition(
                coords.x - offsetLeft,
                coords.y - offsetTop
              );
              console.log(`tileCoords=${tileCoords.x} ${tileCoords.y}`) ;
              Coordinates.setCoordinates(tileCoords.x ,tileCoords.y)  ;

            var activeTileCoords = Client.getCursorPositionFromLocation(tileCoords.x, tileCoords.y);
            Cursor.setActiveTilePosition(
                activeTileCoords.x + offsetLeft,
                activeTileCoords.y + offsetTop
              );

            if (!Cursor.isDown) {
                Cursor.setTargetPosition(coords.x, coords.y);
                return;
              }  
          
              Client.interact();

            let oldOffsetX = (Cursor.x - Cursor.downX) /Client.zoom; 
            let oldOffsetY = (Cursor.y - Cursor.downY) /Client.zoom; 

            // Then update the cursor position so we can do the same on
            // the next mousemove event
             Cursor.setPosition(coords.x, coords.y);


            let newOffsetX = (coords.x -Cursor.downX)/Client.zoom ; 
            let newOffsetY  = (coords.y - Cursor.downY)/Client.zoom ; 

              // And update the offset.  Important to know that Client
        // expects offset coordinates in canvas-space, which is why
        // we are only calculating an offset relative to the current
        // camera position and scaling that to the zoom level.
        Client.setOffset(
            Client.panX - oldOffsetX + newOffsetX,
            Client.panY - oldOffsetY + newOffsetY
          );
        }
    } ,
    
    'document': {
      'keydown': function(e:KeyboardEvent) {
        if (e.which === E_KEY) {
          Client.toggleZoom();
        }
      }
    } ,

} ; 

export {CameraEvents} ; 