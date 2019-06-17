vec2 spherize( vec2 p ) {
    
    float r = length( p );
    float a = atan( p.y, p.x );
  
    r = asin( r ) / 1.570;
 
    return vec2( r * cos(a), r * sin(a) );
    
}

#pragma glslify: export(spherize)