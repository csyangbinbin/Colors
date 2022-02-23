import {Canvasse} from './canvasse' ; 
import { Camera } from "./camera";

interface BoxSize{
    width:number;
    height:number
}

class ClientClass{

    containerSize:BoxSize = {width:0,height:0 } ; 
    zoom:number = 1 ; 
    _zoom:number = 1 ; 
    panX:number = 0 ;
    panY:number = 0 ; 
    _panX:number = 0;
    _panY:number = 0 ; 
   /**
     * Get the current canvas size.
     * @function
     * @returns {BoxSize}
     */
    getCanvasSize() {
        return {
          width: Canvasse.width,
          height: Canvasse.height,
        };
      }
     /**
     * Set the current container size.
     * @function
     * @param {number} width
     * @param {number} height
     */
      setContainerSize(width:number, height:number) {
        this.containerSize.width = width;
        this.containerSize.height = height;
      }
  
      /**
       * Get the current canvas size.
       * @function
       * @returns {BoxSize}
       */
      getContainerSize():BoxSize {
        return this.containerSize;
      }


 /**
     * Given the position in the container element, get the tile coordinate.
     * @function
     * @param {number} x
     * @param {number} y
     */
     getLocationFromCursorPosition(x:number, y:number) {
    var canvasSize = this.getCanvasSize();
    var containerSize = this.getContainerSize();
    return {
      x: Math.round(x / this.zoom + canvasSize.width / 2 - containerSize.width / (2 * this.zoom) - this.panX),
      y: Math.round(y / this.zoom + canvasSize.height / 2 - containerSize.height / (2 * this.zoom) - this.panY),
    };
    }
    

       /**
     * Given the location of the tile, give its position on screen
     * @function
     * @param {number} x
     * @param {number} y
     */
        getCursorPositionFromLocation(x:number, y:number) {
            var canvasSize = this.getCanvasSize();
            var containerSize = this.getContainerSize();
            return {
              x: this.zoom * (x - canvasSize.width / 2 + containerSize.width / (2 * this.zoom) + this.panX),
              y: this.zoom * (y - canvasSize.height / 2 + containerSize.height / (2 * this.zoom) + this.panY),
            };
          }

    /**
     * Update the current zoom level.
     * Should be non-zero to avoid weirdness.
     * @function
     * @param {number} zoomLevel
     */
     setZoom(zoomLevel:number) {
        this._zoom = this.zoom = zoomLevel;
        /*
        this.isZoomedIn = zoomLevel === this.ZOOM_MAX_SCALE;
        if (this.isZoomedIn) {
          if (this.hasColor()) {
            Hand.showCursor();
          }
        } else {
          Hand.hideCursor();
        }
        */
        Camera.updateScale(this._zoom);
      }

       /**
     * Update the current camera offsets.
     * Used to pan the camera around.
     * The x and y values are offsets for the canvas rather than camera
     * positions, which may be unintuitive to use.  For example, to
     * position the camera in the top left corner of a 1000x1000 canvas,
     * you would call:
     *
     *    r.place.setOffset(500, 500);
     *
     * which pushes the canvas down and to the right 500px, putting its
     * top left corner in the center of the screen.  If this is confusing,
     * use the setCameraPosition method instead.
     * @function
     * @param {number} x
     * @param {number} y
     */
    setOffset(x:number, y:number) {
        this._panX = this.panX = x;
        this._panY = this.panY = y;
        Camera.updateTranslate(this._panX, this._panY);
        //var coords = this.getCameraLocationFromOffset(this._panX, this._panY);
        //Coordinates.setCoordinates(Math.round(coords.x), Math.round(coords.y));
      }


       /**
     * Given an absolute canvas coordinat, get canvas offsets.
     * See the setCameraLocation method description for more details.
     * @function
     * @param {number} x
     * @param {number} y
     */
    getOffsetFromCameraLocation(x:number, y:number) {
        let size = this.getCanvasSize();
        return { x: -(x - size.width / 2),  y: -(y - size.height / 2) };
      }
  
      /**
       * Given canvas offsets, get the camera coordinates.
       * The inverse of getOffsetFromCameraLocation.
       * @function
       * @param {number} x
       * @param {number} y
       */
      getCameraLocationFromOffset(x:number, y:number) {
        let size = this.getCanvasSize();
        return { x: size.width / 2 - x, y: size.height / 2 - y };
      }
 
}

let Client = new ClientClass() ; 
export {Client } ; 