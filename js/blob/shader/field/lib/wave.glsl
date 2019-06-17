float wave ( float x, float freq, float speed ) {
    
    return sin( x * freq + time * speed ) * .5 - .5;
    
}

#pragma glslify: export(wave)