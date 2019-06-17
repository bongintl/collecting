vec3 hash3(in vec3 p) {
    vec3 q = vec3(dot(p, vec3(127.1, 311.7, 189.2)),
                  dot(p, vec3(269.5, 183.3, 324.7)),
                  dot(p, vec3(419.2, 371.9, 128.5)));
    return fract(sin(q) * 43758.5453);
}

float noise( in vec3 x ) {
    // adapted from IQ's 2d voronoise:
    // http://www.iquilezles.org/www/articles/voronoise/voronoise.htm
    vec3 p = floor(x);
    vec3 f = fract(x);

    const float s = 32.0;
    float va = 0.0;
    float wt = 0.0;
    for (int k=-2; k<=1; k++)
    for (int j=-2; j<=1; j++)
    for (int i=-2; i<=1; i++) {
        vec3 g = vec3(float(i), float(j), float(k));
        vec3 o = hash3(p + g);
        vec3 r = g - f + o + 0.5;
        float d = dot(r, r);
        float w = pow(1.0 - smoothstep(0.0, 1.414, sqrt(d)), s);
        va += o.z * w;
        wt += w;
     }
     return va / wt;
}

#pragma glslify: export(noise)