//var CubemapRenderer = require('gl-render-cubemap');

var glslify = require('glslify');
var vertex = glslify.file('./cubeVertex.glsl');
var createShader = require('gl-shader');
var createGeometry = require('gl-geometry');
var mat4 = require('gl-mat4');
var createTextureCube = require('./textureCube');
var resizeGL = require('../../lib/resizeGL');
var transform = require('geo-3d-transform-mat4')

function saveArray( gl, size ){
    
    var pixels = new Uint8Array(size * size * 4);
            
    gl.readPixels( 0, 0, size, size, gl.RGBA, gl.UNSIGNED_BYTE, pixels );
    
    return pixels;
    
}

function saveCanvas ( gl, size ) {
    
    var canvas = document.createElement( 'canvas' );
    
    canvas.width = canvas.height = size;
    
    var ctx = canvas.getContext( '2d' );
    
    ctx.drawImage( gl.canvas, 0, 0 );
    
    return canvas;
    
}


module.exports = function( gl, size, fragment, uniforms ) {
    
    //var renderer = new CubemapRenderer( size );
    
    resizeGL( gl, size, size );
    gl.viewport(0, 0, size, size);
    
    var ret = {};
    
    var positions = [
        -1, -1, -1,
         1, -1, -1,
         1,  1, -1,
        -1, -1, -1,
         1,  1, -1,
        -1,  1, -1
    ]
    
    function rotatedQuad ( axis, angle ) {
        var m = mat4.create();
        var fn = 'rotate' + axis;
        mat4[ fn ]( m, m, angle );
        return transform( positions, m );
    }
    
    var deg90 = Math.PI / 2;
    
    var configs = {
        pos: {
            x: {
                forward: [1, 0, 0],
                up: [0, -1, 0],
                quad: rotatedQuad('Y', -deg90),
            },
            y: {
                forward: [0, 1, 0],
                up: [0, 0, 1],
                quad: rotatedQuad('X', deg90),
            },
            z: {
                forward: [0, 0, 1],
                up: [0, -1, 0],
                quad: rotatedQuad('Y', deg90 * 2)
            }
        },
        neg: {
            x: {
                forward: [-1, 0, 0],
                up: [0, -1, 0],
                quad: rotatedQuad('Y', deg90)
            },
            y: {
                forward: [0, -1, 0],
                up: [0, 0, -1],
                quad: rotatedQuad('X', -deg90)
            },
            z: {
                forward: [0, 0, -1],
                up: [0, -1, 0],
                quad: rotatedQuad('X', 0)
            }
        }
    }
    
    var shader = createShader( gl, vertex, fragment );
    shader.bind();
    
    for ( var u in uniforms ) shader.uniforms[ u ] = uniforms[ u ];
    
    var geometry;
    
    var view = mat4.create();
    var projection = mat4.create();
    
    var pixels;
    
    var faces = { pos: {}, neg: {} };
    
    for ( var sign in configs ) {
        
        var axes = configs[ sign ];
        
        for ( var axis in axes ) {
            
            var config = axes[ axis ];
            
            geometry = createGeometry( gl );
            
            geometry.attr( 'position', config.quad );
            
            mat4.lookAt( view, [0, 0, 0], config.forward, config.up );
            mat4.perspective( projection, Math.PI / 2, 1, .01, 10 );
            
            shader.bind();
            geometry.bind( shader );
            
            shader.uniforms.view = view;
            shader.uniforms.projection = projection;
            
            geometry.draw();
            
            faces[ sign ][ axis ] = saveArray( gl, size );
            
        }
        
    }
    
    return createTextureCube( gl, faces, size );
    
}