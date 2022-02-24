import $ from 'jquery'; 
  
    class CameraButtonClass {
      $el:any =  null ;
      $container:any = null;
      enabled =  false;
  
      /**
       * Initialize the camera button.
       * The button is hidden by default and removed from the DOM to be
       * extra sneaky.
       * @function
       * @param {HTMLElement} el The button element
       */
      init(el:HTMLElement) {
        this.$el = $(el);
        this.$container = this.$el.parent();
        this.$el.hide();
        this.$el.detach();
      }
  
      /**
       * Enable the button, adding it back to the DOM and making it visible
       * @function
       */
      enable() {
        if (this.enabled) { return; }
        this.enabled = true;
        this.$container.append(this.$el);
        this.$el.show();
      };
  
      /**
       * Disable the button, hiding it and removing it from the DOM
       */
      disable() {
        if (!this.enabled) { return; }
        this.enabled = false;
        this.$el.hide();
        this.$el.detach();
      }
  
      showEnable() {
        this.$el.removeClass('place-following');
      }
  
      showDisable() {
        this.$el.addClass('place-following');
      }
    }


  let CameraButton = new CameraButtonClass() ;
  export {CameraButton} ; 