float rayPlaneIntersect ( vec3 rayOrigin, vec3 rayDirection, vec4 plane, out float dist ) {
    
    vec3 planeNormal = plane.xyz;
    
    float denominator = dot( rayDirection, planeNormal );
    
    dist = -( dot( rayOrigin, planeNormal ) + plane.w ) / denominator;
    
    if ( denominator == 0. || dist < 0. ) return -1.;
    
    return dist;
    
}

#pragma glslify: export(rayPlaneIntersect)