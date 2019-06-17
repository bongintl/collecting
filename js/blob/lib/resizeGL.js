if ( typeof window !== 'undefined' ) {
    
    module.exports = ( gl, width, height ) => {
            
        gl.canvas.width = width;
        gl.canvas.height = height;
        
    }
    
} else {
    
    module.exports = ( gl, width, height ) => {
            
        var ext = gl.getExtension('STACKGL_resize_drawingbuffer');
        
        ext.resize( width, height );
        
    }
    
}