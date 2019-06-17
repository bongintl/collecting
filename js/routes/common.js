function $ ( elements ) {
    
    if ( typeof elements === 'string' ) {
        
        elements = document.querySelectorAll( elements )
        
    }
    
    return Array.prototype.slice.call( elements ).filter( el => el.nodeType !== 3 );
    
}

$( '.grid_equal-height' ).forEach( grid => {
    
    var items = $( grid.childNodes );
    
    var equalize = () => {
        
        items.forEach( item => item.style.height = '' );
        
        var max = Math.max( ...items.map( item => item.clientHeight ) );
        
        items.forEach( item => item.style.height = max + 'px' );
        
    }
    
    equalize();
    
    window.addEventListener( 'resize', equalize );
    
});

