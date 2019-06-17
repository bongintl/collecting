var normalize = require('./normalize');

module.exports = function scale ( x, oldMin, oldMax, newMin, newMax ) {
    
    return newMin + normalize( x, oldMin, oldMax ) * ( newMax - newMin );
    
}