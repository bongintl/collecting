vec3 normal ( const in vec3 pos ) {
    
    const vec3 v1 = vec3( 1.0,-1.0,-1.0);
    const vec3 v2 = vec3(-1.0,-1.0, 1.0);
    const vec3 v3 = vec3(-1.0, 1.0,-1.0);
    const vec3 v4 = vec3( 1.0, 1.0, 1.0);
    
    return normalize(
        v1 * field( pos + v1 * 0.002 ) +
        v2 * field( pos + v2 * 0.002 ) +
        v3 * field( pos + v3 * 0.002 ) +
        v4 * field( pos + v4 * 0.002 )
    );
}

#pragma glslify: export(normal)