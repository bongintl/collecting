#pragma glslify: sdSphere = require(glsl-sdf-primitives/sdSphere);
#pragma glslify: sdBox = require(glsl-sdf-primitives/sdBox);
#pragma glslify: twist = require(./lib/twist);
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d);
#pragma glslify: latitude = require(../lib/latitude.glsl);
#pragma glslify: longitude = require(../lib/longitude.glsl);
#pragma glslify: wave = require(./lib/wave.glsl, time=time);
#pragma glslify: rotateVec3 = require(../../lib/rotateVec3.glsl);
#pragma glslify: modPolar = require(../lib/modPolar.glsl);

const float radius = 1.4;

uniform float subtract;

uniform float noise1Amount;
uniform float wave1Amount;

uniform float scale1;
uniform float speed1;
uniform float speed1StartTime;
uniform float scale2;
uniform float speed2;
uniform float speed2StartTime;

uniform float noise2Amount;
uniform float wave2Amount;

uniform float divideAmount;
uniform float spikesAmount;

uniform float gridAmount;
uniform float hollowAmount;

uniform float twistAmount;
uniform float absBlend;

uniform float symmetryAmount;

float invPow( float x, float exponent ) {
    
    return 1. - pow( 1. - x, exponent );
    
}

float ramp( float x ) {
    
    float low = x * 2.;
    float high = (x - .5) * 2.;
    
    float st = 1. - step( .5, x );
    
    return st * low + ( 1. - st ) * ( 1. - high );
    
}

float smin( float a, float b, float k ) {
    float h = clamp( 0.5+0.5*(b-a)/k, 0.0, 1.0 );
    return mix( b, a, h ) - k*h*(1.0-h);
}

float field ( vec3 p ) {
    
    //p = rotate(p, .5);
    
    if ( symmetryAmount > 0. ) {
    
        p = modPolar( p, symmetryAmount * 10. );
    
    }
    
    vec3 pRotated = p;
    
    if ( rotateX > 0. ) {
    
        float rotateXTime = max( time - rotateXStartTime, 0. );
        float rotateXProgress = rotateXTime * rotateX;
        
        pRotated = rotateVec3( p, vec3( 1., 0., 0.), rotateXProgress );
        
    }
    
    if ( rotateY > 0. ) {
    
        float rotateYTime = max( time - rotateYStartTime, 0. );
        float rotateYProgress = rotateYTime * rotateY;
        
        pRotated = rotateVec3( p, vec3( sin( rotateYTime / 2.33), 1, 0.), rotateYProgress );
    
    }
    
    vec3 pTwist = pRotated;
    
    if ( twistAmount > 0. ) {
    
        pTwist = twist( pRotated, twistAmount * 3.14 );
    
    }
    
    float sphere = sdSphere( p, radius );
    
    float majorDistort = 0.;
    
    if ( noise1Amount > 0. ) {
    
        float noiseSpeed1Time = max( time - speed1StartTime, 0. );
        float noiseSpeed2Time = max( time - speed2StartTime, 0. );
        
        vec3 noise1Time = vec3( noiseSpeed1Time, noiseSpeed2Time, 0. );
        
        //vec3 noise1Scale = vec3( .42 + scale1 * .4, .42 + scale2 * .4, (scale1 + scale2) / 2. );
        
        vec3 noise1Scale = vec3( .42 + scale1 * .4, .42 + scale2 * .4, (scale1 + scale2) / 2. );
        
        noise1Scale *= .1 + 9. * pow(1. - noise1Amount, 3.);
        vec3 noise1Speed = vec3( speed1, speed2, 0. );// * noise1Scale;
        
        majorDistort = snoise3( vec3( (pTwist * noise1Scale ) + noise1Time * noise1Speed ) ) * pow( noise1Amount, 1.1 );
        
    }
    
    if ( wave1Amount > 0. ) {
    
        float waveSpeed1Time = max( time - speed1StartTime, 0. );
        float waveSpeed2Time = max( time - speed2StartTime, 0. );
        
        vec3 wave1Scale = vec3( .5 + scale1 * .7, .5 + scale2 * .7, .5 );
        //wave1Scale *= 5. * pow(1. - wave1Amount, 4.);
        
        float wave1Speed1 = speed1;
        float wave1Speed2 = speed2;

        float lng = longitude( pTwist + sin(waveSpeed2Time * wave1Speed2 * 10.) * .1 );
        
        float lngWave1 = sin( lng * wave1Scale.x * 7. + -waveSpeed1Time * wave1Speed1 * 10. );
        float lngWave2 = sin( lng * wave1Scale.y * 3. + waveSpeed2Time * wave1Speed2 * 10. );
    
        majorDistort = (lngWave1 + lngWave2) * wave1Amount;
        
        // float amp = wave1Amount * .5;
        // float freq = 2.;
        
        // for ( int i = 0; i < 7; i++ ) {
            
        //     majorDistort += sin( pTwist.x * freq + waveSpeed1Time * freq * speed1 ) * amp;
            
        //     freq *= 1. + 2. * (1. - wave1Amount);
        //     amp *= .5 * wave1Amount;
            
        // }
        
    }
    
    sphere += mix( majorDistort, abs(majorDistort), absBlend );
    
    // #if noise2Amount_nonzero
    
    //     float pulse = pow( sin( time ) * .5 + .5, 20. );
    
    //     sphere += snoise3( p * 12. ) * noise2Amount * pulse;
    
    // #endif
    
    // #if wave2Amount_nonzero
    
    //     float pulse2 = pow( sin( time + 3.21 ) * .5 + .5, 20. );
    
    //     sphere += sin( p.y * 100. * pulse2 ) * wave2Amount;
    
    // #endif
    
    // #if noise2Amount_nonzero
    
    //     float amt = noise2Amount * pow( sin( time ) * .5 + .5, 20. );
    
    //     sphere += snoise( vec4( (p + sin( speed2 * time ) ) * scale2, time * .0007 ) ) * amt;
    
    // #endif
    
    // #if spikesAmount_nonzero
        
    //     float pi = 3.141592;
        
    //     float freq = 3.141 + (6.281 * (1. - spikesAmount));
        
    //     float spikesLongitude = longitude( pTwist ) + time * .3;
    //     float spikesLatitude = latitude( pTwist );
        
    //     float lngSpikes = ramp( mod( spikesLongitude * freq, 1.) );
    //     float latSpikes = ramp( mod( spikesLatitude * freq, 1.) );
        
    //     //float spikeWave = sin( clamp( (spikesLatitude - pi * .25) * 3., pi * -.5, pi * 1.5) ) * .5 + .5;
        
    //     float spikeWave = pow( sin( length(pRotated.xy) * 10. + time * .3 ) * .5 + .5, 3.);
        
    //     sphere -= latSpikes * lngSpikes * pow( spikesAmount, 2. ) * .2 * spikeWave;
        
    // #endif
    
    // #if hollowAmount_nonzero
        
    //     sphere = max( -(sphere + (1. - hollowAmount) * 2.), sphere );
        
    // #endif
    
    if ( divideAmount > 0. ) {
    
        float dividePosition = sin(time * .3);
    
        vec3 rotP2 = rotateVec3( mix( pRotated, pTwist, 1. - min(1., abs(dividePosition)) ), vec3( sin(time / 2.33), 1., 0.), time );
        
        //float leftDivideSize = divideAmount * invPow(-min( dividePosition, 0. ), 3.) * 4. + .25 * divideAmount;
        float leftDivideSize = ( invPow( -min( dividePosition, 0. ), 2.) * 1.5 + .25 ) * divideAmount;
        float rightDivideSize = ( invPow( max( dividePosition, .0 ), 2. ) * 1.5 + .25 ) * divideAmount;//divideAmount * invPow(max( dividePosition, 0. ), 3.) * 4. - .25 * divideAmount;
        
        //max( -(rotP2.x + leftDivideSize), rotP2.x - rightDivideSize );
        //float gap = rotP2.x - rightDivideSize;
        rotP2.x += dividePosition * 1.5;
        
        float gap = max( -rotP2.x - leftDivideSize, rotP2.x - rightDivideSize );
        
        float box = sdBox( p, vec3(10., 1., 1.) );
        
        //sphere = max( gap, box );
        
        sphere = max( -gap, sphere );
    
    }
    
    if ( gridAmount > 0. ) {
    
        float width = .25;
        
        vec3 planes = abs( mod( pTwist, width ) - .5 * width );
        
        float dPlanes = min( min( planes.x, planes.y ), planes.z );
        dPlanes -= width * gridAmount * .5 * ( sin( p.x * 2. + time ) - .5 );
        //dPlanes *= p.x;
        
        //sphere += planes;
        
        sphere = max( sphere, -dPlanes );
        
        //sphere = length( vec2(sphere, planes) ) - width * gridAmount;
    
    }
    
    sphere += subtract;
    
    //vec3 mouseLightPosition = mouse * 2.;
    
    //sphere = min( sphere, sdSphere( p - mouseLightPosition, .1 ) );
    
    //sphere = min( sphere, sdSphere( p - vec3(0., 3., 0.), .1 ) );
    
    //sphere = min( sphere, sdSphere( p - vec3(-1., -1., .7), .1 ) );
    
    // if ( moonAmount > 0. ) {
    
    //     float orbitRadius = sin( time * 3.74 ) * .5 + 2. * moonAmount;
    
    //     vec3 orbit = vec3( sin(-time) * orbitRadius, cos(-time) * orbitRadius, 0. );
    
    //     float moon = sdSphere( p + orbit, .2 * moonAmount );
    
    //     sphere = smin(sphere, moon, 1.);
    
    // }
    
    return sphere;
    
}

#pragma glslify: export(field)