var ndarray = require('ndarray');
var createTexture = require('gl-texture2d');

var values = [
    119, 55, 153,
    255, 82, 141,
    218, 43, 66,
    255, 67, 56,
    255, 102, 30,
    255, 240, 2,
    246, 213, 137,
    128, 128, 128,
    113, 206, 221,
    0, 189, 162,
    49, 189, 72,
    97, 79, 167,
    239, 221, 230,
    188, 155, 154,
    39, 40, 48,
    39, 40, 48
];

module.exports = function ( gl ) {
    
    var data = ndarray( new Uint32Array( values ), [16, 1, 3] );
    
    var tex = createTexture( gl, data );
    tex.magFilter = gl.LINEAR;
    return tex;
    
}