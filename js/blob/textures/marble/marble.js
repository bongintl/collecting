var renderCube = require('../lib/renderCube');
var frag = require('glslify').file('./fragment.glsl');

module.exports = function( gl ) {
    
    // var params = {
    //     p1: Math.random() * 2 + 1,
    //     p2: Math.random() * 2 + 1,
    //     p3: Math.random() * 2 + 1,
    //     p4: Math.random() * 3 + 2,
    //     p5: Math.random() * 7 + 2,
    //     p6: Math.random() * 3 + 2,
    //     p7: Math.random() * .5
    // };
    
    // console.log( params );
    
    var params = {
        p1: 2.074765273689597,
        p2: 2.859592812601852,
        p3: 2.326425988241034,
        p4: 2.6164129333222608,
        p5: 2.365112246122555,
        p6: 3.4946367371334106,
        p7: 0.1424710247634855
    }
    
    return renderCube( gl, 512, frag, params );
    
}