vec3 modPolar ( vec3 p, float repetitions ) {
    
    float angle = 2. * 3.14159265 / repetitions;
    float halfAngle = angle / 2.;
    float a = atan( p.y, p.x ) + halfAngle;
    float c = floor( a / angle );
    float r = length( p.xy );
    a = mod( a, angle ) - halfAngle;
    a *= mod( c, 2. ) * 2. - 1.;
    
    return vec3( cos( a ) * r, -sin( a ) * r, p.z );
    
}

#pragma glslify: export(modPolar)