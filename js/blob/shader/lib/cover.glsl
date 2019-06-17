vec2 cover ( vec2 coord, vec2 box ) {
    
    float scale = min( 2. / box.x, 2. / box.y );
    
    vec2 scaledBox = box * scale;
    
    vec2 position = coord.xy * scale - 1.;
    
    position += (vec2(2.) - scaledBox) * .5;
    
    return position;
    
}

vec2 cover ( vec2 coord ) {
    
    return cover( coord, resolution );
    
}

#pragma glslify: export(cover)