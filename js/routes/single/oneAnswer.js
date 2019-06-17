var scale = require('../../lib/scale');

module.exports = function( answers, index ) {
    
    return answers.map( (a, i) => {
        
        if ( i === 0 || a === 0 ) return a;
        
        var value = i === index ? 1 : .01;
        
        return a > 0 ? value : -value;
        
    });
    
}