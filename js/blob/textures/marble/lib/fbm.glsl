#pragma glslify: rotationMatrix = require(../../../lib/rotationMatrix.glsl);
#pragma glslify: rotateVec3 = require(../../../lib/rotateVec3.glsl);
// #pragma glslify: noise = require(./noise.glsl);
#pragma glslify: noise = require(glsl-noise/simplex/3d);


float fbm( vec3 p, mat4 m ) {
    
    float f = 0.0;
    f += 0.500000*(0.5+0.5*noise( p )); p = rotateVec3( p*2.02, m );
    f += 0.250000*(0.5+0.5*noise( p )); p = rotateVec3( p*2.03, m );
    f += 0.125000*(0.5+0.5*noise( p )); p = rotateVec3( p*2.01, m );
    f += 0.062500*(0.5+0.5*noise( p )); p = rotateVec3( p*2.04, m );
    f += 0.031250*(0.5+0.5*noise( p )); p = rotateVec3( p*2.01, m );
    f += 0.015625*(0.5+0.5*noise( p ));
    return f/0.96875;
    
}

float fbm( vec3 p, vec3 axis, float a ) {
    
    return fbm( p, rotationMatrix( axis, a ) );
    
}

float fbm( vec3 p ) {
    
    return fbm( p, vec3( .0, .0, 1. ), p1 );
    
}

#pragma glslify: export(fbm)