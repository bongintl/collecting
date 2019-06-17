require('es6-shim');
var $ = require('jquery');

$(function(){
    
    require('./routes/common');
    
    if ( document.querySelector('main').classList.contains('main_home') ) {
        
        require( './routes/home' );
        
    } else {
        
        require( './routes/artist' );
        
    }
    
})