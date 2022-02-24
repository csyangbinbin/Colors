import $ from 'jquery' ;

class CameraClass{
     zoomElement:HTMLElement = null ; 
     panElement:HTMLElement  = null ;
     isDirty:boolean =false ; 
    
     init(zoomElement:HTMLElement  ,panElement:HTMLElement ):void {
        this.zoomElement = zoomElement ; 
        this.panElement = panElement ; 
    }
    tick() {
        if (this.isDirty) {
          this.isDirty = false;
          return true;
        }
        return false;
      }

     updateScale(s:number):void{
         this.isDirty = true;
      $(this.zoomElement).css({
        transform: 'scale(' + s + ',' + s + ')',
      });
    }


     updateTranslate(x:number,y:number):void{
        this.isDirty = true;
        $(this.panElement).css({
          transform: 'translate(' + x + 'px,' + y + 'px)',
        });
    }
}

let Camera = new CameraClass() ;
export { Camera} ; 