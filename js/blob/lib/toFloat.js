module.exports = function toFloat( number ) {
    
    if ( Math.floor( number ) === number ) {
        
        return number + '.';
        
    } else {
        
        return String( number );
        
    }
    
}