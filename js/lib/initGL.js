var createContext = require('gl-context');

var loadTextureCube = require('./loadTextureCube');

var isIE11 = !!window.MSInputMethodContext && !!document.documentMode;

module.exports = function initGL ( cb, error ) {
    
    var canvas = document.createElement('canvas');
    
    try {
        
        if ( isIE11 ) throw new Error();
        
        var gl = createContext( canvas, { preserveDrawingBuffer: true } );
        
        document.body.classList.add('gl');
        
        loadTextureCube('./assets/images/marble/')()
        .then( cube => cb( gl, cube ) );
        
    } catch( e ) {
        
        if ( error ) error();
        
    }
    
}