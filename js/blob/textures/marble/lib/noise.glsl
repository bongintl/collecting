float noise ( vec3 p ) {
    
    return sin( p.x ) * sin( p.y );
    
}

#pragma glslify: export(noise)