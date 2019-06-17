const float offset = .002;

vec3 heightmapNormal ( vec2 p ) {
    
    float up = sampler( p + vec2( 0., offset ) );
    float down = sampler( p + vec2( 0., -offset ) );
    float left = sampler( p + vec2( -offset, 0. ) ) ;
    float right = sampler( p + vec2( offset, 0. ) );
    
    vec3 v1 = normalize( vec3( offset, 0., right - left ) );
    vec3 v2 = normalize( vec3( 0., offset, up - down ) );
    
    return normalize( cross( v1, v2 ) );
    
}

#pragma glslify: export(heightmapNormal)