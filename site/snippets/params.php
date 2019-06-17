<?php
    
    $root = "http://95.85.37.181/";
    
    $json = file_get_contents( $root . $id );
    
    $data = json_decode( $json, true );
        
    $params = $data[ 'me' ];
    
    echo esc( json_encode( $params ), 'attr' );
    
?>