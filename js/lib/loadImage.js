module.exports = function loadImage( url ) {
    
    return function () {
        
        if( Array.isArray( url ) ) {
            
            return Promise.all( url.map( u => loadImage(u)() ) );
            
        }
        
        var img = new Image();
        
        return new Promise(resolve => {
            
            img.onload = () => resolve( img );
            
            img.src = url;
            
        })
    
    }
    
}