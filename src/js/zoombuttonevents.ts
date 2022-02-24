import { Client } from "./client";
import { ZoomButton } from "./zoombutton";

let ZoomButtonEvents  = {
      'click': function(e:Event) {
          console.log("ZoomButtonEvents click");
        Client.toggleZoom();
        Client.setZoomButtonClicked();
        ZoomButton.highlight(false);
        }
}

export  {ZoomButtonEvents } ; 
  