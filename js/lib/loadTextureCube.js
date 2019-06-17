var loadImage = require('./loadImage');
var createTextureCube = require('gl-texture-cube');

module.exports = function ( dir ) {
    
    var urls = [];
    var signs = ['pos', 'neg'];
    var axes = ['X', 'Y', 'Z'];
    
    for ( var sign of signs ) {
        
        for ( var axis of axes ) {
            
            urls.push( dir + '/' + sign + axis + '.png' );
            
        }
        
    }
    
    return function() {
    
        return loadImage( urls )()
        .then( imgs => {
            
            return {
                pos: {
                    x: imgs[0],
                    y: imgs[1],
                    z: imgs[2]
                },
                neg: {
                    x: imgs[3],
                    y: imgs[4],
                    z: imgs[5]
                }
            }
        })
    
    }
    
    
}