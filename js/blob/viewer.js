var createContext = require('gl-context');
var BlobRenderer = require('./renderer');
var FPSTracker = require('./lib/fpsTracker');
var normalizeEvent = require("./lib/normalizeEvent");
var hasTouch = require('./lib/hasTouch');
var clamp = require('./lib/clamp');

var DPR = window.devicePixelRatio || 1;

module.exports = class BlobViewer extends BlobRenderer {
    
    constructor ( gl, initalParams = { colorOffset: .5 } ) {
        
        super( gl, initalParams );
        
        this.canvas = gl.canvas;
        
        this.quality = 1 / DPR;
        
        this.frameTimer = new FPSTracker( 45, .5 / DPR, this.setQuality.bind(this) );
        
        this.cameraBoundFns = this.getBoundFunctions({
            onDown: this.cameraOnDown,
            onUp: this.cameraOnUp,
            onMove: this.cameraOnMove
        });
        
        this.cameraInclination = Math.PI / 2;
        this.cameraAzimuth = Math.PI / 2;
        this.prevCameraInput = { x: 0, y: 0 };
        this.cameraDistance = Math.abs( initalParams.camera[ 2 ] );
        
        this.dragHandlers = 0;

        if ( !hasTouch() ) {
            
            var boundOnMouseMove =  normalizeEvent( this.onMouseMove.bind(this) );
            this.canvas.addEventListener( 'mousemove', boundOnMouseMove );
            
        }
        
    }
    
    onMouseMove ( point ) {
        
        point.y = this.windowHeight - point.y;
        
        point = this.windowToLocal( point );
        
        this.setUniform( 'mouse', [ point.x, point.y ] );
        
    }
    
    setSize ( w, h ) {
        
        this.windowWidth = w;
        this.windowHeight = h;
        
        var sw = w * this.quality * DPR;
        var sh = h * this.quality * DPR;
        
        super.setSize( sw, sh );
        
    }
    
    setQuality ( quality ) {
        
        this.quality = quality;
        
        this.setSize( this.windowWidth, this.windowHeight );
        
    }
    
    render ( now, dT ) {
        
        this.setUniform( 'time', this.uniformKeys.time.value + dT / 1000 );
        
        super.render();
        
    }
    
    tick () {
        
        var start = Date.now();
        
        var then = 0;
        
        var ticker = () => {
            
            var now = Date.now() - start;
            var dT = now - then;
            
            this.frameTimer.push( dT );
            
            this.render( now, dT );
            
            then = now;
            
            requestAnimationFrame( ticker );
            
        }
        
        ticker();
        
    }
    
    getBoundFunctions ( fns ) {
        
        var ret = {};
        
        for ( var name in fns ) {
            
            ret[ name ] = normalizeEvent( fns[ name ].bind( this ) );
            
        }
        
        return ret;
        
    }
    
    bind ( event, fns ) {
        
        switch ( event ) {
            
            case 'down':
                this.canvas.addEventListener('mousedown', fns.onDown);
                this.canvas.addEventListener('touchstart', fns.onDown);
                break;
                
            case 'move':
                this.canvas.addEventListener( 'mousemove', fns.onMove );
                this.canvas.addEventListener( 'touchmove', fns.onMove );
                break;

            case 'up':
                this.canvas.addEventListener( 'mouseup', fns.onUp );
                this.canvas.addEventListener( 'mouseleave', fns.onUp );
                this.canvas.addEventListener( 'touchend', fns.onUp );
                break;
                
        }
        
    }
    
    unbind ( event, fns ) {
        
        switch ( event ) {
            
            case 'down':
                this.canvas.removeEventListener('mousedown', fns.onDown);
                this.canvas.removeEventListener('touchstart', fns.onDown);
                break;
                
            case 'move':
                this.canvas.removeEventListener( 'mousemove', fns.onMove );
                this.canvas.removeEventListener( 'touchmove', fns.onMove );
                break;

            case 'up':
                this.canvas.removeEventListener( 'mouseup', fns.onUp );
                this.canvas.removeEventListener( 'mouseleave', fns.onUp );
                this.canvas.removeEventListener( 'touchend', fns.onUp );
                break;
                
        }
        
    }
    
    enableCameraControls () {
        
        this.bind( 'down', this.cameraBoundFns );
        
        this.dragHandlers++;
        
        if ( this.dragHandlers === 1 ) this.canvas.classList.add('draggable');
        
    }
    
    disableCameraControls () {
        
        if ( this.cameraInputDown ) {
            
            this.unbind('move', this.cameraBoundFns);
            this.unbind('up', this.cameraBoundFns);
            this.cameraInputDown = false;
            
        } else {
            
            this.unbind('down', this.cameraBoundFns);
            
        }
        
        this.dragHandlers--;
        
        if ( this.dragHandlers === 0 ) this.canvas.classList.remove('draggable');
        
    }
    
    cameraOnDown ( point ) {
        
        this.cameraInputDown = true;
        document.body.classList.add('dragging-camera');
        this.canvas.classList.add('dragging');
        
        this.prevCameraInput = this.windowToLocal( point );
        
        this.unbind('down', this.cameraBoundFns);
        this.bind('move', this.cameraBoundFns);
        this.bind('up', this.cameraBoundFns);
        
    }
    
    cameraOnMove ( point ) {
        
        point = this.windowToLocal( point );
        
        var dx = this.prevCameraInput.x - point.x;
        var dy = this.prevCameraInput.y - point.y;
        
        var r = this.cameraDistance;
        
        this.cameraAzimuth += dx * -3;
        this.cameraInclination = clamp( this.cameraInclination + dy * 3, .01, 2 );
        
        var sinInc = Math.sin( this.cameraInclination );
        var cosInc = Math.cos( this.cameraInclination );
        var sinAz = Math.sin( this.cameraAzimuth );
        var cosAz = Math.cos( this.cameraAzimuth );
        
        this.setUniform( 'camera', [
            r * sinInc * cosAz,
            r * cosInc,
            r * sinInc * sinAz
        ])
        
        this.prevCameraInput = point;
        
    }
    
    cameraOnUp () {
        
        this.cameraInputDown = false;
        
        document.body.classList.remove('dragging-camera');
        this.canvas.classList.remove('dragging');
        
        this.unbind('move', this.cameraBoundFns);
        this.unbind('up', this.cameraBoundFns);
        this.bind('down', this.cameraBoundFns);
        
    }
    
}