  /**
     * Utility for binding a bunch of events to a single element.
     * @function
     * @param {HTMLElement} target
     * @param {Object<function>} eventsDict A dictionary of event handling functions.
     *    Each key should be the name of the event to bind the handler to.
     * @param {bool} [useCapture] Whether to use event capturing.  Defaults to true.
     */
   function bindEvents(target:HTMLElement, eventsDict:any, useCapture?:boolean) {
    useCapture = useCapture === undefined ? true : useCapture;
    for (var event in eventsDict) {
      // If useCapture changes from true to false,
      // CanvasEvents.mouseup will stop working correctly
      target.addEventListener(event, eventsDict[event], true);
    }
  }

  export {bindEvents}