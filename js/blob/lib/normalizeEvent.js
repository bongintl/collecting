module.exports = function normalizeEvent( fn ) {
    
    return function ( event ) {
        
        //console.log(event.type);
        
        if ( event.type.indexOf( 'touch' ) !== -1 ) {
            
            var touch = event.targetTouches[0] || event.changedTouches[0];
            
            fn( { x: touch.clientX, y: touch.clientY } );
            
        } else {
            
            fn( { x: event.offsetX, y: event.offsetY } );
            
        }
        
    }
    
}