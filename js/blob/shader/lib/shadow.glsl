const float opacity = .3;
const vec2 position = vec2(0., .5);
const vec2 size = vec2(4., 16.);

float shadow( vec3 p ) {
    
    //float shad = clamp( length( (p + position) * size ), 0., 1.);
    
    //shad = pow( shad, 2. );
    
    float shad = 0.;
    
    for ( int i = 0; i < 5; i++ ) {
        
        float y = float( i - 1 ) + float( i ) * ( 2. / 5. );
        
        shad = max( shad, field( vec3( p.x, 0, p.z ) ) );
        
    }
    
    shad = smoothstep(-2., .5, shad);
    
    
    //shad = clamp((shad + 1.) / 2., 0., 1.);
    
    //float shad = step( 0., field( vec3( ground.x, 0., ground.y ) ) );
    
    return opacity - shad * opacity;
    
}

#pragma glslify: export(shadow)