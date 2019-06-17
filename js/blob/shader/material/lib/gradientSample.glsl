#pragma glslify: rotateVec3 = require(../../../lib/rotateVec3.glsl);

uniform sampler2D colorTexture;
uniform float colorOffset;

vec3 gradientSample( vec3 p, float angle ) {

    vec3 rotP = rotateVec3( p, vec3(.2, .9, .4), angle );
    float colorCoord = colorOffset * (15./16.) + length(rotP.xy) * .05;
    float colorAmount = clamp( abs( (colorOffset - .5) * 2. ) * 10., 0., 1.);
    vec3 gradientColor = texture2D( colorTexture, vec2(colorCoord, 0.) ).rgb;
    return mix( vec3(.5), gradientColor, colorAmount );
    
}

#pragma glslify: export(gradientSample);