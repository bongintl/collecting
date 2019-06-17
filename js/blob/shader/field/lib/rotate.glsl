vec3 rotate( vec3 pos, float speed ) {
    vec3 p = normalize( pos );
    float a = speed * time;
    float c = cos(a);
    float s = sin(a);
    mat2 m = mat2(c,-s,s,c);
    vec2 xz = m * pos.xz;
    return vec3( xz.x, pos.y, xz.y );
}

#pragma glslify: export(rotate)