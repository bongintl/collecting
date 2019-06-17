#pragma glslify: noise2 = require(glsl-noise/simplex/2d)

float crinklyNoise( vec2 p ) {
    
    return smoothstep( .6, 1., abs( noise2( p * 4. ) ) ) * 2.;
    
}

#pragma glslify: crinkle = require(./heightmapNormal.glsl, sampler=crinklyNoise)

vec3 crinklyNormal( vec3 p ) { return crinkle( p.xy ); }

#pragma glslify: export(crinklyNormal)