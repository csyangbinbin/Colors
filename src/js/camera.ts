 class CameraClass{
     zoomElement:HTMLElement = null ; 
     panElement:HTMLElement  = null ;
    
     init(zoomElement:HTMLElement  ,panElement:HTMLElement ):void {
        this.zoomElement = zoomElement ; 
        this.panElement = panElement ; 
    }

     updateScale(s:number):void{
        this.zoomElement.style.transform =  'scale(' + s + ',' + s + ')' ; 
    }

     updateTranslate(x:number,y:number):void{
        console.log(`updateTranslate=${x} ${y}`)
        this.panElement.style.transform = 'translate(' + x + 'px,' + y + 'px)' ; 
        console.log(`${ this.panElement.style.translate}`);
    }
}

let Camera = new CameraClass() ;
export { Camera} ; 