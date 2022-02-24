import $ from 'jquery' ;

class MollyGuardClass {
    $el:any =  null ; 
    initialized =  false ; 

    init(el:HTMLElement) {
      this.$el = $(el);
      this.$el.removeClass('place-uninitialized');
      this.initialized = true;
    }

    showUnlocked() {
      if (!this.initialized) { return; }
      this.$el.removeClass('place-locked');
    }

    showLocked() {
      if (!this.initialized) { return; }
      this.$el.addClass('place-locked');
    }
  }

let MollyGuard = new MollyGuardClass();
export {MollyGuard};

  