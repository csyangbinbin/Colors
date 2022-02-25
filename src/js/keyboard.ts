const   KEYDOWN = 1;
const   KEYDOWN_PREV = 2;
      
class KeyboardClass {

      enabled:boolean =  true ;
      // The current state of keys we are tracking.
      // This will also act as a white list – any keys tracked here will have
      // their default behavior overridden while this module is active.
      keys:{ [keyIDX:string]:number }=  {
        'UP': 0,
        'DOWN': 0,
        'LEFT': 0,
        'RIGHT': 0,
        'W': 0,
        'A': 0,
        'S': 0,
        'D': 0,
      } ; 
  
      keyNameAliases:{[keyIDX:string]:string} =  {
        'ARROWUP': 'UP',
        'ARROWDOWN': 'DOWN',
        'ARROWLEFT': 'LEFT',
        'ARROWRIGHT': 'RIGHT',
      } ; 
  
      init() {
        window.addEventListener('keydown', function (e:KeyboardEvent) {
          if (!this.enabled) { return; }
          var keyName = this.getKeyName(e.keyCode, (e as any).keyIdentifier || e.key);
          if (keyName in this.keys) {
            this.keys[keyName] |= KEYDOWN;
            //console.log (`KeyDown =${keyName}`);
            e.preventDefault();
          }
        }.bind(this));
  
        window.addEventListener('keyup', function (e:KeyboardEvent) {
          if (!this.enabled) { return; }
          var keyName = this.getKeyName(e.keyCode, (e as any).keyIdentifier || e.key);
          if (keyName in this.keys) {
            this.keys[keyName] &= ~KEYDOWN;
            //console.log(`keyUp=${keyName}`)
            e.preventDefault();
          }
        }.bind(this));
      }
  
      /**
       * Disable key tracking
       */
      disable() {
        this.enabled = false;
      }
  
      /**
       * Re-enable key tracking
       */
      enable() {
        this.enabled = true;
      }
  
      /**
       * Get the keyName given keyCode and identifier from event.
       * @function
       * @param {number} keyCode
       * @param {string} identifier
       * @returns {string}
       */
      getKeyName(keyCode:number, identifier:string) {
        if (identifier.slice(0, 2) === 'U+') {
          identifier = String.fromCharCode(keyCode);
        }
  
        identifier = identifier.toUpperCase();
        var mappedIdentifier = this.keyNameAliases[identifier];
        return mappedIdentifier ? mappedIdentifier : identifier;
      }
  
      /**
       * Tick function that needs to run continuously.
       */
      tick() {
        if (!this.enabled) { return; }
  
        for (var key in this.keys) {
          if (this.isKeyDown(key)) {
            this.keys[key] |= KEYDOWN_PREV;
          } else {
            this.keys[key] &= ~KEYDOWN_PREV;
          }
        }
      }
  
      /**
       * Returns true if the given key is held down.
       * @param {string} keyName
       * @returns {boolean}
       */
      isKeyDown(keyName:string) {
        return this.keys[keyName] & KEYDOWN;
      }
  
      /**
       * Returns true if the given key was pressed this frame.
       * @param {string} keyName
       * @returns {boolean}
       */
       isKeyPressed(keyName:string) {
        return this.keys[keyName] === KEYDOWN;
      }
  
      /**
       * Returns true if the given key was released this frame.
       * @param {string} keyName
       * @returns {boolean}
       */
         isKeyReleased(keyName:string) {
        return this.keys[keyName] === KEYDOWN_PREV;
      }    
    }

    let Keyboard = new KeyboardClass() ;
    export {Keyboard} ; 
  