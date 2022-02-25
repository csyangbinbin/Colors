import $ from 'jquery' ; 

class CoordinatesClass {
      $el:any = null ;
      initialized:boolean =  false ;
      lastX:number = -1 ;
      lastY:number = -1 ; 
  
      /**
       * Initialize the counter element.
       * @function
       * @param {HTMLElement} el
       * @param {number} x
       * @param {number} y
       */
      init(el:HTMLElement, x:number, y:number) {
        this.$el = $(el);
        this.$el.removeClass('place-uninitialized');
        this.initialized = true;
        this.setCoordinates(x, y);
      }
  
      /**
       * Update the display
       * @function
       * @param {number} x
       * @param {number} y
       */
      setCoordinates(x:number, y:number) {
        if (!this.initialized) { return; }
  
        if (x !== this.lastX || y !== this.lastY) {
          this.lastX = x;
          this.lastY = y;
          this.$el.text('(' + x + ', ' + y + ')');
        }
      }
    }
  

    let Coordinates = new CoordinatesClass() ;
    export { Coordinates } ; 