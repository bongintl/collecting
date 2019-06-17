bool raymarch ( const in vec3 rayOrigin, const in vec3 rayDirection, out vec3 collision, out int stepCount ) {
    
    float latest = precis * 2.;
    float rayLength = 0.;
    
    stepCount = 0;
    
    for ( int i = 0; i < steps; ++i ) {
        
        collision = rayOrigin + rayDirection * rayLength;
        
        latest = field( collision );
        
        stepCount++;
        
        rayLength += latest;
        
        if ( latest < precis ) return true;
        if ( latest > maxDistance ) return false;
        
    }
    
    return false;
    
}

#pragma glslify: export(raymarch)