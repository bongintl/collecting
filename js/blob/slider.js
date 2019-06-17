var BlobViewer = require("./viewer");

module.exports = class BlobSlider extends BlobViewer {
    
    constructor ( gl, renderScale, params ) {
        
        super( gl, renderScale, params );
        
        this.value = 0;
        this.sliderInputDown = false;
        this.dragX = 0;
        this.prevDragXs = [];
        this.velocity = 0;
        this.max = 1;
        
        this.sliderBoundFns = this.getBoundFunctions({
            onDown: this.sliderOnDown,
            onUp: this.sliderOnUp,
            onMove: this.sliderOnMove
        })
        
    }
    
    enableSlider () {
        
        this.bind( 'down', this.sliderBoundFns );
        
        if( this.dragHandlers === 0 ) this.canvas.classList.add('draggable');
        
        this.dragHandlers++;
        
        this.sliderEnabled = true;
        
    }
    
    disableSlider () {
        
        if ( this.sliderInputDown ) {
            
            this.unbind('move', this.sliderBoundFns);
            this.unbind('up', this.sliderBoundFns);
            this.sliderInputDown = false;
            
        } else {
            
            this.unbind('down', this.sliderBoundFns);
            
        }
        
        this.velocity = 0;
        
        this.dragHandlers--;
        
        if ( this.dragHandlers === 0 ) this.canvas.classList.remove('draggable');
        
        this.sliderEnabled = false;
        
    }
    
    pushPrev ( x ) {
        
        this.prevDragXs.push( { x, time: Date.now() } );
        
    }
    
    sliderOnDown ( point ) {

        this.sliderInputDown = true;
        this.prevDragXs = [];
        this.pushPrev( point.x );
        this.velocity = 0;
        
        this.canvas.classList.add('dragging');
        
        this.unbind('down', this.sliderBoundFns);
        this.bind('move', this.sliderBoundFns);
        this.bind('up', this.sliderBoundFns);
        
    }
    
    sliderOnMove ( point ) {
        
        var delta = point.x - this.prevDragXs[ this.prevDragXs.length - 1 ].x;
        
        var valueDelta = this.screenToBlobDepth( { x: delta, y: 0 } ).x / this.max;
        
        this.set( Math.min( Math.max( this.value + valueDelta, -1 ), 1 ) );
        
        this.pushPrev( point.x );
        
    }
    
    sliderOnUp ( point ) {
        
        this.pushPrev( point.x );
        
        this.sliderInputDown = false;
        
        this.canvas.classList.remove('dragging');
        
        if ( this.prevDragXs.length >= 2 ) {
            
            var tooOld = Date.now() - 100;
            
            var prevs;
            
            for ( var i = this.prevDragXs.length - 1; i >= 0; i-- ) {
                
                var obj = this.prevDragXs[ i ];
                
                if ( obj.time <= tooOld && i < this.prevDragXs.length - 2 ) {
                    
                    prevs = this.prevDragXs.slice( i + 1 );
                    break;
                    
                }
                
            }
            
            if ( !prevs ) prevs = this.prevDragXs;
    
            var newestPoint = prevs[ prevs.length - 1 ];
            var oldestPoint = prevs[ 0 ];
            
            var dx = this.screenToValue( newestPoint.x - oldestPoint.x );
            var dt = newestPoint.time - oldestPoint.time;
            
            if ( dt !== 0 ) this.velocity = dx / dt;
        
        }
        
        this.unbind('move', this.sliderBoundFns);
        this.unbind('up', this.sliderBoundFns);
        this.bind('down', this.sliderBoundFns);
        
    }
    
    render ( now, dT ) {
        
        this.velocity *= .98;
        
        var v = this.value + this.velocity * dT;
        v = Math.max( Math.min( v, 1 ), -1 );
        
        if ( v !== this.value ) this.set( v );

        super.render( now, dT );
        
    }
    
    setSize ( w, h ) {
        
        super.setSize( w, h );
        
        var maxPx = window.innerWidth * .3;
        
        this.max = this.screenToBlobDepth( { x: maxPx, y: 0 } ).x;
        
        if ( this.sliderEnabled ) this.doCamera();
        
    }
    
    set ( value ) {
        
        this.value = value;
        
        this.doCamera();
        
        if ( this.onChange ) this.onChange( value );
        
    }
    
    windowToValue ( x ) {
        
        return this.windowToBlobDepth( { x, y: 0 } ).x / this.max;
        
    }
    
    screenToValue ( x ) {
        
        return this.screenToBlobDepth( { x, y: 0 } ).x / this.max;
        
    }
    
    valueToScreen ( v ) {
        
        v *= this.max;
        
        v /= 6 / ( Math.PI / 2 );
        
        v /= this.getScale();
        
        return v;
        
    }
    
    doCamera () {
        
        var x = this.value * -this.max;
        
        this.setUniform( 'camera', [ -x, 0, -6 ] )
        this.setUniform( 'target', [ -x, 0, 0 ] )
        
    }
    
}