vec3 hueToRGB ( float hue ) {
    
    float r = abs( hue * 6. - 8. ) - 1.;
    float g = 2. - abs( hue * 6. - 2. );
    float b = 2. - abs( hue * 6. - 4. );
    return clamp( vec3( r, g, b ), 0., 1. );
    
}

vec3 halve ( float x, vec3 v1, vec3 v2 ) {
    
    float st = step( 0., x );
    
    return v1 * st + v2 * (1. - st );
    
}

vec3 oil ( vec3 p, vec3 n, vec3 light ) {
    
    vec3 l1 = normalize(light);
    
    vec3 c1 = normalize( cross(n,p) );
    
    vec3 c2 = normalize( cross(c1, light) );
    
    return cross( c1, c2 );
    
}

#pragma glslify: export(oil)