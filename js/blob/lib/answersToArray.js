module.exports = function( data ) {
    
    var ret = [];
    
    for ( var i = 0; i < 20; i++ ) {
        
        ret[ i ] = data[ 'answer_' + i ] || 0;
        
    }
    
    return ret;
    
}