#pragma glslify: latitude = require(../lib/latitude.glsl);
#pragma glslify: longitude = require(../lib/longitude.glsl);
#pragma glslify: normal = require(./lib/normal.glsl, field=field)
#pragma glslify: orenn = require(glsl-diffuse-oren-nayar)
#pragma glslify: gauss = require(glsl-specular-gaussian)
#pragma glslify: rotateVec3 = require(../../lib/rotateVec3.glsl)
#pragma glslify: crinklyNormal = require(./lib/crinklyNormal.glsl);
#pragma glslify: gradientSample = require(./lib/gradientSample.glsl)
#pragma glslify: oil = require(./lib/oil.glsl)
#pragma glslify: glitter = require(./lib/glitter.glsl)
#pragma glslify: twist = require(../field/lib/twist);
#pragma glslify: spherize = require(./lib/spherize);
#pragma glslify: voronoise = require(./lib/voronoise);

const float PI = 3.14159;
const float PI2 = PI * 2.;

uniform float oiliness;
uniform samplerCube marbleTexture;
uniform sampler2D backgroundTexture;
uniform float marbleAmount;
uniform float pointsAmount;
uniform float haloAmount;
uniform float light1Intensity;
uniform float light2Intensity;
uniform float baseRed;
uniform float baseGreen;
uniform float baseBlue;
uniform float blindsAmount;
uniform float scalesAmount;

vec3 pointLight(
    vec3 p,
    vec3 nor,
    vec3 eye,
    vec3 position,
    vec3 diffuseColor,
    float roughness,
    float specularity,
    vec3 specColor
) {
    
    vec3 dir = normalize( position - p );
    
    float diffuse = orenn( dir, eye, nor, roughness, 1. );
    
    float spec = gauss( dir, eye, nor, specularity );
    
    return diffuse * diffuseColor + spec * clamp( specColor, 0., 1. );
    
}

vec3 pointLight( vec3 p, vec3 nor, vec3 eye, vec3 position, vec3 color ) {
    
    return pointLight( p, nor, eye, position, color, .15, .05, vec3(1.) );
    
}

vec3 render( in vec3 p, const in vec3 eye, const in vec3 mouse, float ao ) {
    
    vec3 rotP = p;
    vec3 n = normal( p );
    vec3 pn = normalize( normalize(p * .1) + n );
    vec3 rotN = n;
    
    if ( rotateX > 0. ) {
    
        rotP = rotateVec3( p, vec3( 1., 0, 0.), time );
        rotN = rotateVec3( n, vec3( 1., 0, 0.), time );
    
    }
    
    if ( rotateY > 0. ) {
    
        rotP = rotateVec3( p, vec3( sin(time / 2.33), 1, 0.), time );
        rotN = rotateVec3( n, vec3( sin(time / 2.33), 1, 0.), time );
    
    }
    
    //n = normalize( n - noiseNormal( normalize(cross(n, p)).xy * 5. ) * .25 );
    
    vec3 baseColor = vec3( 1. - baseRed, 1. - baseGreen, 1. - baseBlue );//gradientSample( rotP, time ) * .8;
    
    baseColor *= .5 + .5 * ( 1. - light1Intensity );
    
    vec3 marbleColor = vec3(1.) - baseColor;
    float marble = 0.;
    
    float lat = latitude( rotN ) / (PI / 2.);
    float lng = longitude( rotN ) / (PI / 2.);
    vec2 latLng = vec2( abs( lat ), lng );
    
    if ( marbleAmount > 0. ) {
    
        float marbleOpacity = clamp( marbleAmount * 20., 0., 1.);
        vec3 marbleSample = rotP + rotN;
        float marbleTex = ( textureCube( marbleTexture, marbleSample ).r ) * marbleOpacity;
        marbleColor = mix( marbleColor, vec3(1.), marbleTex );
        
        marble = 1. - smoothstep( marbleAmount - 1.2, marbleAmount, marbleTex );
    
    }
    
    vec3 diffuse = vec3(1.);
    
    //vec3 bump = crinklyNormal(p + rotN);
    //n = normalize( n + bump * .2 );
    
    vec3 emissive = mix(baseColor * .5, marbleColor, marble);//mix( vec3(0.), vec3( 1. - clamp( length( p ) * .8, 0., 1.) ), 0.);
    vec3 ambient = vec3(0.);//mix( mix( vec3(.5), vec3(.3), marbleAmount), vec3(.1), marble);// * ao;
    float roughness = mix( mix( 1., 0., marbleAmount), .3, marble);
    float specularity = .03;//mix(.03, .5, marble);
    vec3 specColor = mix(vec3(1.), vec3(0.), marble);
    
    // vec3 rotP = rotateVec3( p, vec3(.2, .9, .4), time );
    // float stripes = step( .8, fract( rotP.x * 10. ) );
    
    vec3 light = ambient * ( .1 + .9 * ( 1. - light2Intensity ) );
    
    vec3 mouseLightPosition = mouse * 3.;//vec3( camera.xy + mouse * 2., 3. );
    vec3 oilColor = vec3(0.);
    
    if ( oiliness > 0. ) {
        
        oilColor = oil( rotP, -n, mouseLightPosition );
        
    }
    
    vec3 mouseLightColor = vec3(.2) + oilColor * oiliness;
    // vec3 mouseLightPosition = vec3( mouse * 8., -4. + length(mouse) * 4. );
    vec3 mouseLight = pointLight( p, n, eye, mouseLightPosition, mouseLightColor, roughness, specularity, specColor );
    
    if ( blindsAmount > 0. ) {
        
        float blinds = clamp( sin( rotateVec3( p, vec3( -.5 ), 6. ).y * 30. ) * .5 + .5 + ( 1. - blindsAmount ), light.r, 1. );
        
        specularity *= blinds;
        
        mouseLight *= blinds;
        
    }
    
    if ( scalesAmount > 0. ) {
        
        float scales = voronoise( rotP * 15. ) * scalesAmount * .5;
        
        specularity += scales;
        
    }
    
    light += mouseLight;
    
    vec3 light1Position = mix( vec3(0., 3., 0.), vec3( 0., 1.4, 2. ), light1Intensity );
    vec3 light1Color = mix( vec3( .7, .4, .45 ), vec3( 1., .3, 0. ), light1Intensity );
    light += pointLight( p, n, eye, light1Position, light1Color, roughness, specularity, specColor );
    
    vec3 light2Position = mix( vec3(-1., -1., .7), vec3(-5., -3., 2.), light2Intensity);
    vec3 light2Color = mix( vec3( .35, .1, .05 ), vec3( 0., 0., 1. ), light2Intensity);
    light += pointLight( p, n, eye, light2Position, light2Color, roughness, specularity, light2Color );
    
    //vec2 points2 = vec2(1.) - step( vec2(.1), mod( pn.xy * vec2(20.), vec2(2.) ) );
    //float points = points2.x * points2.y * 10.;
    
    //vec2 env = envMap( -eye, n );
    
    light = clamp( light, 0., .95 );
    
    vec3 color = emissive + diffuse * light;
    
    color = mix( color, vec3( haloAmount ), mix( .4 - ao * .6, 1. - ao, haloAmount ) );
    
    if ( pointsAmount > 0. ) {
    
        float pointsThreshold = .95 - pointsAmount * .15;

        float points = smoothstep( pointsThreshold, 1.,
            1. - length(
                mod(
                    spherize( pn.xy ) * 25.,
                vec2(1.) )
            - .5 )
        );
        
        points *= ( 1. - abs(n.z) ) * 2.;
        
        color = mix( color, vec3(1.), points );
        
    }
    
    #if backgroundTexture_exists
        
        vec3 refracted = refract( -eye, pn, 1.333 );
        refracted = refract( refracted, vec3( pn.xy, -pn.z ), .75 );
        
        vec3 bg = 1. - texture2D( backgroundTexture, refracted.xy * vec2(.25, .5) + .5 ).rgb;
        
        color = mix( color, vec3(1.), bg * ( 1. - abs(n.z) ) );
    
    #endif
    
    // gamma!?
    color = pow( color, vec3(0.75) );
    
    return color;
    
}

#pragma glslify: export(render)