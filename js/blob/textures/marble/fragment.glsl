precision highp float;

varying vec3 vPosition;

uniform float p1;
uniform float p2;
uniform float p3;
uniform float p4;
uniform float p5;
uniform float p6;
uniform float p7;

#pragma glslify: fbm6 = require(./lib/fbm.glsl, p1=p1);

float noiseOrder2( vec3 p, vec3 offset ) {
    
    float x = fbm6( p * p1 + offset.x );
    float y = fbm6( p * p2 + offset.y );
    float z = fbm6( p * p3 + offset.z );
    
    return fbm6( p + vec3(x, y, z) );
    
}

vec4 noiseOrder3( vec3 p, vec3 offset ) {
    
    float x = noiseOrder2( p * p3 + offset.x, vec3( 2.2, 5.1, -2.52 ) ) * 2.;
    float y = noiseOrder2( p * p4 + offset.y, vec3( 4.7, -.9, .87 ) );
    float z = noiseOrder2( p * p6 + offset.z, vec3( 1.32, -2.4, -.29 ) );
    
    return vec4( fbm6( p + vec3(x, y, z) ), x, y, z );
    
}

void main () {
    
    vec3 p = normalize(vPosition);
    
    // vec2 p = gl_FragCoord.xy / resolution;
    
    //vec4 color = noiseOrder3(p, vec3(1.2, 3.3, .4));//noiseOrder3( p * p7, vec3(1.2, 3.3, .4) );
    
    vec3 color = noiseOrder3( p * p7 * .5, vec3(1.2, 3.3, .4) ).rgb * 1.5;
    
    color = pow( color, vec3( 2. ) );
    
    //color = smoothstep( .25, 1., color );
    //color = 1. - smoothstep( .25, 1., 1. - color );
    
    vec3 low = color * 2.;
    vec3 high = (color - .5) * 2.;
    
    vec3 st = vec3( 1. - step( .5, color ) );
    
    color = st * low + ( vec3(1.) - st ) * ( vec3(1.) - high );
    
    //olor = pow( color, 0.5545 );
    
    gl_FragColor = vec4( color * .9, 1. );
    
    // gl_FragColor = vec4( p, 1. );
    
}