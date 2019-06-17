precision highp float;

uniform vec2 resolution;
uniform vec2 mouse;
uniform float time;
uniform vec3 camera;
uniform vec3 target;
uniform float planeDistance;

const int RAYMARCH_STEPS = 40;
const float RAYMARCH_PRECISION = .01;
const float RAYMARCH_MAX_DISTANCE = 9.;

uniform float rotateX;
uniform float rotateXStartTime;
uniform float rotateY;
uniform float rotateYStartTime;

const float fov = 1.4142135624; // 45 degrees

#pragma glslify: field = require(./field/field.glsl,time=time,rotateX=rotateX,rotateY=rotateY,rotateXStartTime=rotateXStartTime,rotateYStartTime=rotateYStartTime,mouse=mouse,camera=camera)

#pragma glslify: material = require( ./material/material.glsl,time=time,field=field,camera=camera,background=background,rotateX=rotateX,rotateY=rotateY,rotateXStartTime=rotateXStartTime,rotateYStartTime=rotateYStartTime)

#pragma glslify: contain = require( ./lib/contain.glsl, resolution = resolution)
#pragma glslify: cover = require( ./lib/cover.glsl, resolution = resolution)
#pragma glslify: lookAt = require( glsl-look-at )
#pragma glslify: raymarch = require( ./lib/raymarch.glsl, field = field, steps = RAYMARCH_STEPS, precis = RAYMARCH_PRECISION, maxDistance = RAYMARCH_MAX_DISTANCE)
#pragma glslify: rayPlaneIntersect = require( ./lib/rayPlaneIntersect.glsl )
#pragma glslify: shadow = require( ./lib/shadow.glsl, time=time,field=field)

void main () {
    
    vec2 p = contain( gl_FragCoord.xy );
    
    mat3 camMat = lookAt( camera, target, 0. );
    vec3 rayDirection = normalize( camMat * vec3( p, fov ) );
    vec3 collision;
    
    vec3 m = camMat * vec3( mouse, -3. );
    
    int steps;
    
    vec3 color = vec3(0.);
    float alpha = 0.;
    
    float planeIntersectDistance;
    
    if ( raymarch( camera, rayDirection, collision, steps ) ) {
        
        float ao = float(steps - 1) / float(RAYMARCH_STEPS - 1);
        
        ao = pow( 1. - smoothstep( .05, .9, ao ), 2.) * .65 + .35;
        
        color = material( collision, -rayDirection, m, ao );
        alpha = 1.;
        
    } else if( -1. != rayPlaneIntersect( camera, rayDirection, vec4( 0., 1., 0., planeDistance ), planeIntersectDistance ) ) {
        
        #if renderShadow
        
            vec3 pShadow = camera + rayDirection * planeIntersectDistance;
        
            alpha = shadow( pShadow );
        
        #endif
        
    }
    
    if ( false ) {
    
        alpha = 1.;
        
        color = vec3( float(steps - 1) / float(RAYMARCH_STEPS - 1) );
    
    }
    
    gl_FragColor = vec4( color, alpha );
    
}