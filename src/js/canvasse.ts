class CanvasseClass{
    public width:number = 0 ; 
    public height:number = 0 ;
    public el:HTMLCanvasElement = null ; 
    public ctx:CanvasRenderingContext2D = null ;
    public isBufferDirty:boolean =false ; 
    public isDisplayDirty:boolean = false ; 
    private buffer:ArrayBuffer = null ; 
    private readBuffer:Uint8ClampedArray = null ; 
    private writeBuffer:Uint32Array = null ; 

    init(el:HTMLCanvasElement , width:number , height:number){
        this.width = width ;
        this.height = height ; 
        
        this.el =el ; 
        this.el.width = width ; 
        this.el.height = height;   
        this.ctx = this.el.getContext('2d');
        (this.ctx as any).mozImageSmoothingEnabled = false;
        (this.ctx as any).webkitImageSmoothingEnabled = false;
        (this.ctx as any).msImageSmoothingEnabled = false;
        this.ctx.imageSmoothingEnabled = false;
  
        // This array buffer will hold color data to be drawn to the canvas.
        this.buffer = new ArrayBuffer(width * height * 4);
        // This view into the buffer is used to construct the PixelData object
        // for drawing to the canvas
        this.readBuffer = new Uint8ClampedArray(this.buffer);
        // This view into the buffer is used to write.  Values written should be
        // 32 bit colors stored as AGBR (rgba in reverse).
        this.writeBuffer = new Uint32Array(this.buffer);
    }


    /**
     * Tick function that draws buffered updates to the display.
     * @function
     * @returns {boolean} Returns true if any updates were made
     */
    tick():boolean{
        if(this.isBufferDirty){
            this.drawBufferToDisplay() ;
            return true ; 
        }
        return false ; 
    }

    getIndexFromCoords(x:number, y:number):number {
        return y * this.width + x;
      }


    setBufferState(i:number , color:number){
        this.writeBuffer[i] = color ;
        this.isBufferDirty = true ; 
    }

    drawBufferToDisplay(){
        let imageData = new ImageData(this.readBuffer  , this.width , this.height) ; 
        this.ctx.putImageData(imageData,0,0);
        this.isBufferDirty = false ; 
    }
    
    drawTileToBuffer(x:number,y:number , color:number){
        let i = this.getIndexFromCoords(x,y);
        this.setBufferState(i , color);
    }

    clearRectFromDisplay(x:number , y:number , width:number,height:number){
        this.ctx.clearRect(x,y,width,height) ;
        this.isDisplayDirty = true ; 
    }

    drawRectToDisplay(x:number, y:number,width:number,height:number,color:string){
        this.ctx.fillStyle = color ;
        this.ctx.fillRect(x,y,width,height);
        this.isDisplayDirty = true ; 
    }

    drawTileToDisplay(x:number, y:number,color:string){
        this.ctx.fillStyle = color ;
        this.ctx.fillRect(x,y,1,1);
        this.isDisplayDirty = true ; 
    }

    drawTileAt(x:number , y:number, color:number){
        this.drawTileToBuffer(x,y,color) ; 
    }
}

let Canvasse = new CanvasseClass() ; 
export {Canvasse} 