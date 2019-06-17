module.exports = function clamp( x, min, max ) {
    
    if ( min === undefined ) min = 0;
    if ( max === undefined ) max = 1;
    
    return Math.max( min, Math.min( max, x ) );
    
}