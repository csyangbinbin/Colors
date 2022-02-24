import {Canvasse} from './canvasse' ; 
import { Camera } from "./camera";
import { Hand  } from './hand' ;
import {Palette} from './palette' ; 
import {CameraButton} from './camerabutton' ;
import { ZoomButton } from './zoombutton'; 
import {MollyGuard} from './mollyguard' ;
import {parseHexColor ,lerp ,normalizeVector} from './utils' ;

interface BoxSize{
    width:number;
    height:number
}

interface Coord{
  x:number;
  y:number;
}

const MAX_COLOR_INDEX = 15;
const DEFAULT_COLOR = '#FFFFFF';
const DEFAULT_COLOR_ABGR = 0xFFFFFFFF;


  // Used to keep a list of the most recent n pixel updates received.
  var recentTiles:Coord[] = [];
  var recentTilesIndex = 0;
  var maxrecentTilesLength = 100;

  var autoCameraIntervalToken:number =0 ;

  var B = 0;
  var k = 1;
  var f = .5;
  var g = 1;

  /**
   * Rossmo Formula.
   * https://en.wikipedia.org/wiki/Rossmo%27s_formula
   * Using this as a rough way of determining where the most interesting part
   * of the board might be.
   * @param {Object} a { x, y } coordinate object
   * @param {Object[]} ns array of { x, y } coordinate objects
   * @param {number} B "buffer" zone size
   * @param {number} k used to scale the entire results.  Essentially
   *    meaningless in this context since we're just selecting the max anyway.
   *    Anything greater than 0 should be fine.
   * @param {number} f configurable value, I don't understand it.
   * @param {number} g configurable value, I don't understand it.
   */
  function rossmoFormula(a:Coord, ns:Coord[], B:number, k:number, f:number, g:number) {
    return k * ns.reduce(function(acc, n) {
      const d = Math.abs(a.x - n.x) + Math.abs(a.y - n.y)
      if (!d) {
        return acc; // not sure if I need the 1 there
      } else if (d > B) {
        return acc + 1 / Math.pow(d, f);
      } else {
        return acc + Math.pow(B, g - f) / Math.pow(d, g);
      }
    }, 0); // not sure if this ought to be at least 1
  }



class ClientClass{
  AUTOCAMERA_INTERVAL= 3000;
  ZOOM_LERP_SPEED=  .2;
  PAN_LERP_SPEED=  .4;
  ZOOM_MAX_SCALE=  40;
  ZOOM_MIN_SCALE=  4;
  VOLUME_LEVEL=  .1;
  MAXIMUM_AUDIBLE_DISTANCE=   10;
  WORLD_AUDIO_MULTIPLIER=  .1;
  MAX_WORLD_AUDIO_RATE=  250;
  KEYBOARD_PAN_SPEED=  .5;
  KEYBOARD_PAN_LERP_SPEED=  .275;

  DEFAULT_COLOR_PALETTE =  [
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

    containerSize:BoxSize = {width:0,height:0 } ; 
    zoom:number = 1 ; 

    panX:number = 0 ;
    panY:number = 0 ; 

    state:Uint8Array = null ;
    enabled = true ;
    isZoomedIn = false ;
    isPanEnabled = true ;
    cooldown = 0;
    colorIndex:number = null;
    paletteColor:string= null;
    paletteColorABGR:number = 0xFFFFFFFF ; 
    palette:string[] =  null;
    paletteABGR:number[] = null ;
    autoCameraEnabled:boolean =false ; 

    // For values that can be 'lerp'ed, copies of the attribute
    // prefixed with an underscore (e.g. _zoom) are used to track
    // the current *actual* value, while the unprefixed attribute
    // tracks the *target* value.
    _panX:number = 0;
    _panY:number = 0 ; 
    _zoom:number = 1 ; 
    _currentDirection:any =  { x: 0, y: 0 } ; 
    currentDirection:any = {x:0,y:0} ; 

  /**
     * Initialize
     * @function
     * @param {boolean} isEnabled Is the client enabled.
     * @param {number} cooldown The amount of time in ms users must wait between draws.
     * @param {?number} panX Horizontal camera offset
     * @param {?number} panY Vertical camera offset
     * @param {?number} color Hex-formatted color string
     */
   init(isEnabled:boolean, cooldown:number, panX?:number, panY?:number, color?:number) {
    // If logged out, client is disabled.  If logged in, client is
    // initially disabled until we get the API response back to know
    // whether they can place.
    this.enabled = false;
    this.isZoomedIn = true;
    this.cooldown = cooldown;
    if (color) 
      this.setColor(color, false);

    this.setZoom(this.isZoomedIn ? this.ZOOM_MAX_SCALE : this.ZOOM_MIN_SCALE);
    this.setOffset(panX|0, panY|0);
   // AudioManager.setGlobalVolume(this.VOLUME_LEVEL);
    this.setColorPalette(this.DEFAULT_COLOR_PALETTE);
    Palette.generateSwatches(this.DEFAULT_COLOR_PALETTE);

    /*
    // We store whether the user has turned off audio in localStorage.
    var audioIsDisabled = !!store.safeGet('place-audio-isDisabled');
    if (audioIsDisabled) {
      this._setAudioEnabled(false);
    }

    if (!this.getZoomButtonClicked()) {
      ZoomButton.highlight(true);
    }
*/
    /*
    var isNotificationButtonEnabled = parseInt(store.safeGet('iOS-Notifications-Enabled'), 10) === 1;
    if (isNotificationButtonEnabled) {
      NotificationButton.showNotificationOn();
    }
    */

    this.state = new Uint8Array(new ArrayBuffer(Canvasse.width * Canvasse.height));
  }

 /**
     * Tick function that updates interpolated zoom and offset values.
     * Not intended for external use.
     * @function
     * @returns {boolean} Returns true if anything updated.
     */
  tick() {
    var didUpdate = false;
    if (this._zoom !== this.zoom) {
      this._zoom = lerp(this._zoom, this.zoom, this.ZOOM_LERP_SPEED);
      Camera.updateScale(this._zoom);
      didUpdate = true;
    }

    this.currentDirection.x = 0;
    this.currentDirection.y = 0;
/*
    if (Keyboard.isKeyDown('LEFT') || Keyboard.isKeyDown('A')) {
      this.currentDirection.x -= 1;
    }
    if (Keyboard.isKeyDown('RIGHT') || Keyboard.isKeyDown('D')) {
      this.currentDirection.x += 1;
    }
    if (Keyboard.isKeyDown('UP') || Keyboard.isKeyDown('W')) {
      this.currentDirection.y -= 1;
    }
    if (Keyboard.isKeyDown('DOWN') || Keyboard.isKeyDown('S')) {
      this.currentDirection.y += 1;
    }
*/
    normalizeVector(this.currentDirection);

    if (this._currentDirection.x !== this.currentDirection.x) {
      this._currentDirection.x = lerp(this._currentDirection.x, this.currentDirection.x,
                                      this.KEYBOARD_PAN_LERP_SPEED);
    }
    if (this._currentDirection.y !== this.currentDirection.y) {
      this._currentDirection.y = lerp(this._currentDirection.y, this.currentDirection.y,
                                      this.KEYBOARD_PAN_LERP_SPEED);
    }

    var moveSpeed = this.ZOOM_MAX_SCALE / this._zoom * this.KEYBOARD_PAN_SPEED;
    this.panX -= this._currentDirection.x * moveSpeed;
    this.panY -= this._currentDirection.y * moveSpeed;

    var didOffsetUpdate = false;
    if (this._panX !== this.panX) {
      this._panX = lerp(this._panX, this.panX, this.PAN_LERP_SPEED);
      didOffsetUpdate = true;
    }

    if (this._panY !== this.panY) {
      this._panY = lerp(this._panY, this.panY, this.PAN_LERP_SPEED);
      didOffsetUpdate = true;
    }

    didUpdate = didUpdate || didOffsetUpdate;

    if (didOffsetUpdate) {
      Camera.updateTranslate(this._panX, this._panY);
     // var coords = this.getCameraLocationFromOffset(this._panX, this._panY);
     // Coordinates.setCoordinates(Math.round(coords.x), Math.round(coords.y));
    }

    return didUpdate;
  }






  /**
     * Set the color palette.
     * @function
     * @param {string[]} palette An array of valid css color strings
     */
   setColorPalette(palette:string[]) {
    var isNew = this.palette === null;
    this.palette = palette;
    Palette.generateSwatches(palette);
    // The internal color palette structure stores colors as AGBR (reversed
    // RGBA) to make writing to the color buffer easier.
    var dataView = new DataView(new ArrayBuffer(4));
    // The first byte is alpha, which is always going to be 0xFF
    dataView.setUint8(0, 0xFF);
    this.paletteABGR = palette.map(function(colorString) {
      var color = parseHexColor(colorString);
      dataView.setUint8(1, color.blue);
      dataView.setUint8(2, color.green);
      dataView.setUint8(3, color.red);
      return dataView.getUint32(0);
    });

    if (!isNew) {
      // TODO - clean up
      this.setInitialState(this.state);
    }
  }


  /**
     * Sets the initial state of the canvas.
     * This accepts a Uint8Array of color indices
     * Note that if the API payload shape changes, this will need to update.
     * @function
     * @param {Uint8Array} state A Uint8Array of color indices
     */
 setInitialState(state:Uint8Array) {
  // Iterate over API response state.
  var canvas = [];

  // Safari TypedArray implementation doesn't support forEach :weary:
  var colorIndex, color;
  for (var i = 0; i < state.length; i++) {
    colorIndex = state[i];
    color = this.getPaletteColorABGR(colorIndex);
    Canvasse.setBufferState(i, color);
    // Assumes that all non-0 values in local state are *newer* than the
    // state we're loading. This might not be strictly true but eh
    if (colorIndex > 0) {
      this.state[i] = colorIndex;
    }
  }

  Canvasse.drawBufferToDisplay();
}

     /**
     * Get the css color string for the given colorIndex.
     * @function
     * @param {number} colorIndex The index of the color in the palette.
     *    This is clamped into the 0 to MAX_COLOR_INDEX range.  If the current
     *    color palette has less colors than that defined, it repeats.
     * @returns {string}
     */
      getPaletteColor(colorIndex:number):string {
        colorIndex = Math.min(MAX_COLOR_INDEX, Math.max(0, colorIndex|0));
        return this.palette[colorIndex % this.palette.length] || DEFAULT_COLOR;
      }
  
      getPaletteColorABGR(colorIndex:number):number {
        colorIndex = Math.min(MAX_COLOR_INDEX, Math.max(0, colorIndex|0));
        return this.paletteABGR[colorIndex % this.paletteABGR.length] || DEFAULT_COLOR_ABGR;
      }



  /**
     * Update the current color
     * @function
     * @param {number} color Index of color in palette.  Should be less than MAX_COLOR_INDEX
     * @param {boolean} [playSFX] Whether to play sound effects, defaults to true.
     *    Useful for initializing with a color.
     */
   setColor(colorIndex:number, playSFX:boolean) {
    playSFX = playSFX === undefined ? true : playSFX;
   // this.interact();
/*
    if (!this.enabled) {
      if (playSFX) {
        AudioManager.playClip(SFX_ERROR);
      }
      return;
    }
    */

    this.colorIndex = colorIndex;
    this.paletteColor = this.getPaletteColor(colorIndex);
    this.paletteColorABGR = this.getPaletteColorABGR(colorIndex);
    Hand.updateColor(this.paletteColor);
    if (this.isZoomedIn) {
      Hand.showCursor();
    }
    Palette.clearSwatchHighlights();
   Palette.highlightSwatch(colorIndex);

    /*
    if (playSFX) {
      AudioManager.playClip(SFX_SELECT);
    }
    */
  }




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
      this.isZoomedIn = zoomLevel === this.ZOOM_MAX_SCALE;
      if (this.isZoomedIn) {
        if (this.hasColor()) {
          Hand.showCursor();
        }
      } else {
        Hand.hideCursor();
      }
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
 
  /**
     * Track the position of a recently added tile.
     * This is called by the world module and used to power the auto-camera
     * feature
     * @function
     * @param {number} x
     * @param {number} y
     */
   trackRecentTile(x:number, y:number) {
    // TODO - may be worth measuring the impact of doing this constantly,
    // and skip it when auto-camera is disabled (which is the default).
    if (recentTiles[recentTilesIndex]) {
      // recycle existing objects once the list is full
      recentTiles[recentTilesIndex].x = x;
      recentTiles[recentTilesIndex].y = y;
    } else {
      recentTiles[recentTilesIndex] = { x: x, y: y }
    }
    recentTilesIndex = (recentTilesIndex + 1) % maxrecentTilesLength;
  }
 /**
     * Toggle the auto-camera feature
     * @function
     */
  toggleAutoCamera() {
    if (this.autoCameraEnabled) {
      this.disableAutoCamera();
    } else {
      this.enableAutoCamera();
    }
  }

    /**
     * Turn on the auto-camera feature.
     * This will attempt to move the camera to a "hot spot" at a regular
     * interval.  It uses Rossmo's formula to identify 1 pixel out of the most
     * recent n (currently 100) that is most likely to be the most interesting.
     * The same formula can be used to find serial killers, or sharks.  Neat!
     * @function.
     */
     enableAutoCamera() {
      if (this.autoCameraEnabled) { return }
      this.autoCameraEnabled = true;
      CameraButton.showDisable();

      autoCameraIntervalToken = window.setInterval(function() {
        var maxScore = 0;
        var winningIndex = 0;

        var tile, score;
        for (var i = 0; i < recentTiles.length; i++) {
          tile = recentTiles[i];
          score = rossmoFormula(tile, recentTiles, B, k, f, g);
          // TODO - we probably actually want to weight this by distance
          // from current camera location, so that a smaller, but still
          // significant activity nearby takes priority over a slightly bigger
          // one farther away.
          if (score > maxScore) {
            maxScore = score;
            winningIndex = i;
          }
        }

        if (tile) {
          this.setTargetCameraLocation(tile.x, tile.y);
        }
      }.bind(this), this.AUTOCAMERA_INTERVAL);
    }

  /**
     * Turn of the auto-camera feature.
     */
   disableAutoCamera() {
    if (!this.autoCameraEnabled) { return }
    this.autoCameraEnabled = false;
    CameraButton.showEnable();

    window.clearInterval(autoCameraIntervalToken);
  }

  /**
   * Truncate the list of recent pixels used by the autoCamera feature.
   */
  clearrecentTiles() {
    recentTiles.length = 0;
    recentTilesIndex = 0;
  }

 /**
     * Update the target camera offsets relative to the camera.
     * @function
     * @param {number} x
     * @param {number} y
     */
  setTargetCameraLocation(x:number, y:number) {
    var offsets = this.getOffsetFromCameraLocation(x, y);
    this.setTargetOffset(offsets.x, offsets.y);
  }
    /**
     * Update the target zoom level for lerping
     * Should be non-zero to avoid weirdness.
     * @function
     * @param {number} zoomLevel
     */
     setTargetZoom(zoomLevel:number) {
      this.zoom = zoomLevel;
      this.isZoomedIn = zoomLevel === this.ZOOM_MAX_SCALE;
    }

    /**
     * Update the target camera offsets for lerping
     * Used to pan the camera around.
     * @function
     * @param {number} x
     * @param {number} y
     */
     setTargetOffset(x:number, y:number) {
      this.panX = x;
      this.panY = y;
    }

       /**
     * Used to disable some features when the user interacts
     */
        interact() {
          this.disableAutoCamera();
          /*
          if (Inspector.isVisible) {
            Inspector.hide();
          }*/
        }


         /**
     * Returns whether or not the user is "holding" a color.
     * @returns {boolean}
     */
    hasColor():boolean {
      return this.paletteColor !== null;
    }

      /**
     * Toggles between the two predefined zoom levels.
     * @function
     * @param {number} [offsetX]
     * @param {number} [offsetY]
     */
       toggleZoom(offsetX?:number, offsetY?:number) {
        this.interact();
        if (this.isZoomedIn) {
          console.log("----this.isZoomedIn");
          this.setTargetZoom(this.ZOOM_MIN_SCALE);
         // AudioManager.playClip(SFX_ZOOM_OUT);
          ZoomButton.showZoomIn();
          Hand.hideCursor();
        } else {
          console.log("----NOT this.isZoomedIn");
          if (this.hasColor()) {
            Hand.showCursor();
          }
          this.setTargetZoom(this.ZOOM_MAX_SCALE);
          // Any time we are zooming in, also center camera where the user clicked
          if (offsetX !== undefined && offsetY !== undefined) {
            console.log(`offsetX=${offsetX} offsetY=${offsetY}`);
            this.setTargetOffset(offsetX, offsetY);
          }
         // AudioManager.playClip(SFX_ZOOM_IN);
          ZoomButton.showZoomOut();
        }
  
        this.isZoomedIn = this.zoom === this.ZOOM_MAX_SCALE;
      }

        /**
     * Remember that zoom button has been acknowledged
     * @function
     */
    setZoomButtonClicked() {
     // store.safeSet('place-zoom-wasClicked', '1');
    }


       /**
     * Disable the client.  Intended for temporarily disabling for
     * handling ratelimiting, cooldowns, etc.
     * @function
     */
        disable() {
          this.enabled = false;
        }
    
        /**
         * Re-enable the client.
         * @function
         */
        enable() {
          this.enabled = true;
        }
    
            /**
         * Disable the client.  Intended for temporarily disabling for
         * handling ratelimiting, cooldowns, etc.
         * @function
         */
        disablePan() {
          this.isPanEnabled = false;
        }
    
        /**
         * Re-enable the client.
         * @function
         */
        enablePan() {
          this.isPanEnabled = true;
        }

  /**
     * Clear the current color
     * @function
     */
   clearColor(playSFX:boolean) {
    playSFX = playSFX === undefined ? true : playSFX;

    Hand.clearColor();
    Hand.hideCursor();
    Palette.clearSwatchHighlights();
    this.paletteColor = null;
    this.paletteColorABGR = null;

    /*
    if (playSFX) {
      AudioManager.playClip(SFX_DROP);
    }*/
  }

            /**
     * Draw the current color to the given coordinates
     * Makes the API call and optimistically updates the canvas.
     * @function
     * @param {number} x
     * @param {number} y
     */
    drawTile(x:number, y:number) {
      this.interact();

      /*
      if (!this.paletteColor || !this.enabled) {
        AudioManager.playClip(SFX_ERROR);
        return;
      }*/

      // Disable to prevent further draw actions until the API request resolves.
      this.disable();

      MollyGuard.showLocked();
     // Timer.show();
     // Timer.setText('Painting...');
    //  AudioManager.playClip(SFX_PLACE);

      var i = Canvasse.getIndexFromCoords(x, y);
      this.state[i] = this.colorIndex;
      Canvasse.drawTileAt(x, y, this.paletteColorABGR);
      this.clearColor(false);

     // this.attemptToFireiOSLocalNotification();

      /*
      R2Server.draw(x, y, this.colorIndex)
        .then(function onSuccess(responseJSON, status, jqXHR) {
          return this.setCooldownTime(1000 * responseJSON.wait_seconds);
        }.bind(this))
        .fail(function onError(jqXHR, status, statusText) {
          this.enable();
          MollyGuard.showUnlocked();
          Timer.hide();
        }.bind(this))
        .then(function onSuccess() {
          Notifications.sendNotification('Your next tile is now available');
        })
      */
    }

}

let Client = new ClientClass() ; 
export {Client } ; 