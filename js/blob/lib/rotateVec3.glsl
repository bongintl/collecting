#pragma glslify: rotationMatrix = require(./rotationMatrix.glsl);

vec3 rotateVec3 ( vec3 v, mat4 m ) {
    
    return ( m * vec4( v, 1. ) ).xyz;
    
}

vec3 rotateVec3 ( vec3 v, vec3 axis, float angle ) {
    
    return rotateVec3( v, rotationMatrix( axis, angle ) );

}

#pragma glslify: export(rotateVec3)