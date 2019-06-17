vec3 colorShift( inout vec3 color, const in vec3 shift ) {
    
    float bw = ( color.r + color.g + color.b ) / 3.; // light value
    color -= bw; // pure colour values
    color *= 0.8; // desaturate
    color += shift * ( bw - .4 ) + bw;
    
    return color;
    
}

#pragma glslify: export(colorShift);