#pragma glslify: random = require(glsl-random/lowp)

vec3 glitter( vec3 p ) {
    
    return pow( vec3(
        random( p.xy ),
        random( p.yz ),
        random( p.xz )
    ), vec3(3.));
    
}

#pragma glslify: export(glitter)