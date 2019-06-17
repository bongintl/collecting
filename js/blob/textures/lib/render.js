var createShader = require('gl-shader');
var createFBO = require('gl-fbo');
var fillScreen = require('a-big-triangle');

var glslify = require('glslify');
var vertex = glslify.file('../../lib/vertex.glsl');

module.exports = function texture( gl, size, frag, params ) {
    
    var prevWidth = gl.drawingBufferWidth;
    var prevHeight = gl.drawingBufferHeight;
    
    var fbo = createFBO( gl, size, {depth: false} );
    
    var shader = createShader( gl, vertex, frag );
    
    shader.bind();
    
    shader.uniforms.resolution = size;
    
    shader.uniforms.p1 = params[ 0 ];
    shader.uniforms.p2 = params[ 1 ];
    shader.uniforms.p3 = params[ 2 ];
    shader.uniforms.p4 = params[ 3 ];
    shader.uniforms.p5 = params[ 4 ];
    
    fbo.bind();
    
    fillScreen( gl );
    
    var texture = fbo.color[0];

    gl.bindFramebuffer( gl.FRAMEBUFFER, null );
    gl.viewport( 0, 0, prevWidth, prevHeight );
    
    return texture;
    
}