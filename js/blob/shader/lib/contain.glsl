vec2 contain ( vec2 coord, vec2 box ) {
    
    float scale = max( 2. / box.x, 2. / box.y );
    
    vec2 scaledBox = box * scale;
    
    vec2 position = coord.xy * scale - 1.;
    
    position += (vec2(2.) - scaledBox) * .5;
    
    return position;
    
}

vec2 contain ( vec2 coord ) {
    
    return contain( coord, resolution );
    
}

#pragma glslify: export(contain)