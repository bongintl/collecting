float latitude( vec3 p ) {
    
    return atan( p.y, p.x + .0002 );
    
}

#pragma glslify: export(latitude)