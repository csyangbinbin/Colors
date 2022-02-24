
import $ from 'jquery';
import { Client } from './client';

  
    // Events pushed from the server over websockets, primarily representing
    // actions taken by other users.
    // Events coming from the color palette UI
    let PaletteEvents =   {
      'click': function(e:MouseEvent) {
        var color = $(e.target).data('color');
        if (typeof color !== "undefined") {
          Client.setColor(color,false);
        }
      },
    };
  
  export {PaletteEvents} ; 