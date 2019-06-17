const eases = require('eases');

const rAF = require('./rAF');

var DEFAULT_EASING = 'linear';

function tween(){
    
    var name, from, to, duration, easing, cb;
    
    switch ( arguments.length ) {
        
        case 2:
            from = 0;
            to = 1;
            duration = arguments[0];
            easing = DEFAULT_EASING;
            cb = arguments[1];
            break;
            
        case 3:
            from = 0;
            to = 1;
            duration = arguments[0];
            easing = arguments[1];
            cb = arguments[2];
            break;
            
        case 4:
            from = arguments[0];
            to = arguments[1];
            duration = arguments[2];
            easing = DEFAULT_EASING;
            cb = arguments[3];
            break;
            
        case 5:
            from = arguments[0];
            to = arguments[1];
            duration = arguments[2];
            easing = arguments[3];;
            cb = arguments[4];
            break;
        
        case 6:
            name = arguments[0];
            from = arguments[1];
            to = arguments[2];
            duration = arguments[3];
            easing = arguments[4];
            cb = arguments[5];
            break;
        
    }
    
    if ( typeof easing === 'string' ) {
        easing = eases[easing];
        if( !easing ) throw new Error(`Easing ${easing} not found`);
    }
    
    const distance = to - from;
        
    const startTime = Date.now();
    const endTime = startTime + duration;
    
    if( name ) rAF.stop( name );

    return new Promise( resolve => {
        
        const ticker = ( now, dT ) => {
            
            if( now < endTime ) {
                
                let progress = ( now - startTime ) / duration;
                
                progress = easing(progress);
                
                return cb( from + distance * progress, progress );
                
            } else {
                
                cb( to, 1 );
                
                resolve();
                
                return false;
                
            }
            
        }
        
        if( name ){
            
            rAF.start( name, ticker )
            
        } else {
            
            rAF.start( ticker )
            
        }
    
    });
    
}

tween.stop = function( name ) {
    return rAF.stop(name);
}

module.exports = tween;