import $ from 'jquery' ; 

    class ZoomButtonClass  {
      $el:any = null;
      initialized =  false ;
  
      init(el:HTMLElement) {
        this.$el = $(el);
        this.$el.removeClass('place-uninitialized');
        this.initialized = true;
      }
  
      showZoomOut() {
        if (!this.initialized) { return; }
        this.$el.removeClass('place-zoomed-out');
      }
  
      showZoomIn() {
        if (!this.initialized) { return; }
        this.$el.addClass('place-zoomed-out');
      }
  
      highlight(enabled:boolean) {
        if (!this.initialized) { return; }
        this.$el.toggleClass('place-zoom-pulsing', enabled);
      }
    }

  let ZoomButton = new ZoomButtonClass() ; 
  export { ZoomButton } ;