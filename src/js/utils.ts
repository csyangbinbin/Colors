  /**
     * Utility for binding a bunch of events to a single element.
     * @function
     * @param {HTMLElement} target
     * @param {Object<function>} eventsDict A dictionary of event handling functions.
     *    Each key should be the name of the event to bind the handler to.
     * @param {bool} [useCapture] Whether to use event capturing.  Defaults to true.
     */
   function bindEvents(target:HTMLElement, eventsDict:any, useCapture?:boolean) {
    useCapture = useCapture === undefined ? true : useCapture;
    for (var event in eventsDict) {
      // If useCapture changes from true to false,
      // CanvasEvents.mouseup will stop working correctly
      target.addEventListener(event, eventsDict[event], true);
    }
  }

  /* @function
  * @param {number} startVal The current value
  * @param {number} endVal The target value
  * @param {number} interpolationAmount A float between 0 and 1, usually
  *    amount of passed time * some interpolation speed
  * @returns {number} The interpolated value
  */
 const  MIN_LERP_VAL = 0.05;
 function lerp(startVal:number, endVal:number, interpolationAmount:number) {
   var lerpVal = startVal + interpolationAmount * (endVal - startVal);
   if (Math.abs(endVal - lerpVal) < MIN_LERP_VAL) {
     return endVal;
   }
   return lerpVal;
 }


 interface Color{
  red:number ; 
  green:number;
  blue:number;

 }
    /**
     * Utility to parse a hex color string into a color object
     * @function
     * @param {string} hexColor A css hex color, including the # prefix
     * @returns {Color}
     */
    function  parseHexColor(hexColor:string) :Color{
      var colorVal = parseInt(hexColor.slice(1), 16);
      return {
        red: colorVal >> 16 & 0xFF,
        green: colorVal >> 8 & 0xFF,
        blue: colorVal & 0xFF,
      };
    }

    /**
     * Normalizes a given {x, y} vector to be a unit-length vector
     * This modifies the given vector object.
     * @param {Object} vector
     */
     function normalizeVector(vector:{x:number,y:number}) {
      var x = vector.x;
      var y = vector.y;
      if (!(x || y)) { return }
      var length = Math.sqrt(x * x + y * y);
      if (!length) { return }
      vector.x = x / length;
      vector.y = y / length;
    }


  export {bindEvents , lerp , parseHexColor ,normalizeVector} ; 