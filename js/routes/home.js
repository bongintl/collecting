var $ = require('jquery');

var initGL = require('../lib/initGL');
var BlobViewer = require('../blob/viewer');
var questions = require('../questions.json');
var answersToParams = require('../blob/lib/answersToParams');

if ( 'ontouchstart' in window ) {
    
    document.body.classList.add( 'loaded' );
    
} else {

    initGL( ( gl, cube ) => {
        
        var params = {
            marbleTexture: cube,
            camera: [ 0, 0, 4 ]
        }
        
        var blob = new BlobViewer( gl, params );
        
        blob.defines.renderShadow = 0;
        
        var $items = $('.artist').toArray().map( el => $(el) );
        
        $items.forEach( $item => {
            
            var params = answersToParams( questions, $item.data('params') );
            
            $item.mouseenter( () => {
                
                blob.setUniform( 'time', 0 );
                
                blob.setUniforms( params );
                
                $item.append( blob.canvas );
                
            })
            
        })
        
        function onResize () {
            
            var size = $items[0].width() * 1.32;
            
            blob.setSize( size, size );
            
        }
        
        window.addEventListener( 'resize', onResize )
        
        onResize();
        blob.tick();
        
        document.body.classList.add( 'loaded' );
        
    }, () => {
        
        document.body.classList.add( 'loaded' );
        
    })

}