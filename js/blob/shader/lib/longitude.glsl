float longitude ( vec3 p ) {
    
    return acos( p.z / sqrt( p.x * p.x + p.y * p.y + p.z * p.z ) );
    
}

#pragma glslify: export(longitude)