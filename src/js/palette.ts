import $ from 'jquery' ; 

    // Generates the color palette UI
    class PaletteClass {
      SWATCH_CLASS = 'place-swatch' ; 
      el:HTMLElement =  null ;
      initialized = false ;
  
      /**
       * Initialize the color palette UI
       * @function
       * @param {HTMLElement} el The parent element to hold the UI
       */
      init(el:HTMLElement) {
        this.el = el;
        $(el).removeClass('place-uninitialized');
        this.initialized = true;
      }
  
      /**
       * Rebuild the color swatch elements
       * @function
       * @param {string[]} colors A list of valid css color strings
       */
      generateSwatches(colors:string[]) {
        if (!this.initialized) { return; }
        $(this.el).children('.' + this.SWATCH_CLASS).remove();
        colors.forEach(function(color, index) {
          this.buildSwatch(color, index);
        }, this);
      }
  
      /**
       * Build a color swatch element.
       * @function
       * @param {string} color A valid css color string
       * @returns {HTMLElement}
       */
      buildSwatch(color:string, index:number):HTMLElement {
        if (!this.initialized) { return; }
        var div = document.createElement('div');
        $(div)
        .css('backgroundColor', color)
        .data('color', index)
        .addClass('place-swatch');
        this.el.appendChild(div);
        return div;
      }
  
      /**
       * Add a highlight class to the swatch at the given index
       * @function
       * @param {number} index The index of the swatch to add the highlight to
       */
      highlightSwatch(index:number) {
        $(this.el).children('.place-swatch').eq(index).addClass('place-selected');
      }
  
      /**
       * Clear highlights
       * @function
       */
      clearSwatchHighlights() {
        $(this.el).children('.place-swatch').removeClass('place-selected');
      }
    }
  
  let Palette = new PaletteClass() ; 
  export { Palette } ; 