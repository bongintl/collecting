function clamp( x, min, max ) {
    
    if ( min === undefined ) min = 0;
    if ( max === undefined ) max = 1;
    
    return Math.max( min, Math.min( max, x ) );
    
}

function normalize( x, min, max ) {
    
    return clamp( (x - min) / (max - min), 0, 1);
    
}

module.exports = function scale ( x, oldMin, oldMax, newMin, newMax ) {
    
    return newMin + normalize( x, oldMin, oldMax ) * ( newMax - newMin );
    
}