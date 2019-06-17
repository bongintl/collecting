var createShader = require('gl-shader');
var fillScreenForever = require('./lib/fillScreenForever');

var glslify = require('glslify');
var vertex = glslify.file('./lib/vertex.glsl');
var fragment = glslify.file('./shader/main.glsl');

var resizeGL = require('./lib/resizeGL');

var map = require('lodash/map');
var clone = require('lodash/clone');

var createTexture = require('gl-texture2d');
var createTextureCube = require('./textures/lib/textureCube');
var createColorTexture = require('./textures/colors');
var createMarbleTexture = require('./textures/marble/marble');

var attributes = [
    { name: 'position', type: 'vec2' }
];

var uniformTypes = {
    
    resolution: 'vec2',
    mouse: 'vec2',
    time: 'float',
    camera: 'vec3',
    target: 'vec3',
    planeDistance: 'float',
    colorTexture: 'sampler2D',
    marbleTexture: 'samplerCube',
    backgroundTexture: {
        type: 'sampler2D',
        define: true
    },
    
    subtract: 'float',
    
    rotateX: {
        type: 'float',
        timed: true,
        value: .1
    },
    rotateY: {
        type: 'float',
        timed: true,
        value: .1
    },
    
    noise1Amount: {
        type: 'float'
    },
    wave1Amount: {
        type: 'float',
    },
    
    scale1: 'float',
    scale2: 'float',
    
    speed1: {
        type: 'float',
        timed: true,
        value: .1
    },
    speed2: {
        type: 'float',
        timed: true,
        value: .1
    },
    
    twistAmount: {
        type: 'float',
        define: true
    },
    absBlend: 'float',
    
    divideAmount: 'float',

    gridAmount: 'float',
    hollowAmount: 'float',
    
    colorOffset: {
        type: 'float',
        value: .5
    },
    
    oiliness: 'float',
    
    marbleAmount: 'float',
    
    pointsAmount: 'float',
    
    symmetryAmount: 'float',
    
    squeezeAmount: 'float',
    
    blindsAmount: 'float',
    scalesAmount: "float",
    
    light1Intensity: 'float',
    light2Intensity: 'float',
    haloAmount: 'float',
    
    baseRed: 'float',
    baseGreen: 'float',
    baseBlue: 'float'
    
}

var defaultUniforms = map( uniformTypes, (value, key) => {
    
    var ret = { name: key }
    
    if ( typeof value === 'string' ) {
        
        ret.type = value;
        ret.value = zero( ret.type );
        ret.timed = false;
        
    } else {
        
        ret.type = value.type;
        ret.value = value.value || zero( value.type );
        ret.timed = value.timed || false;

    }
    
    return ret;
    
});

defaultUniforms.forEach( u => {
    
    if ( u.timed ) {
        
        defaultUniforms.push({
            name: u.name + "StartTime",
            type: 'float',
            timed: false,
            value: 0
        });
        
    }
    
})

function zero ( type ) {
    
    switch ( type ) {
        
        case 'float':
            return 0;
            
        case 'vec2':
            return [ 0, 0 ];
            
        case 'vec3':
            return [ 0, 0, 0 ];
            
        case 'sampler2D':
        case 'samplerCube':
            return null;
        
    }
    
}

function isZero ( value ) {
    
    if ( Array.isArray( value ) ) {
        
        return value.every( v => v === 0 );
        
    } else {
        
        return value === 0 || value === null;
        
    }
    
}

function getDefines ( uniforms ) {
    
    var defines = {};
    
    uniforms.forEach( u => {
        
        if ( u.type.indexOf('sampler') > -1 ) {
            
            var exists = u.value !== null;
            
            defines[ u.name + '_exists' ] = exists ? 1 : 0;
            
        }

    });
    
    return defines;
    
}

function prependDefines( defines, shader ) {
    
    var ret = '';
    
    for ( var key in defines ) {
        
        ret += `#define ${ key } ${ defines[key] }\n`;
        
    }
    
    return ret + '\n\n' + shader;
    
}

module.exports = class BlobRenderer {
    
    constructor ( gl, uniforms, size ) {
    
        this.gl = gl;
        this.uniforms = uniforms || {};
        
        this.gl.disable( gl.DEPTH_TEST );
        this.gl.enable( gl.BLEND );
        
        var textures = 0;

        this.uniforms = defaultUniforms.map( u => {
            
            var ret = clone(u);
            
            ret.default = u.value;
            
            if ( ret.name in uniforms ) {
                
                let value = uniforms[ ret.name ];
                
                if ( u.type === 'sampler2D' ) {
                    
                    ret.tex = createTexture( gl, value );
                    ret.value = textures++;
                    
                } else if ( u.type === 'samplerCube' ) {
                    
                    ret.tex = createTextureCube( gl, value );
                    ret.value = textures++;
                    
                } else {
                    
                    ret.value = value;
                    
                }
                
            }
            
            return ret;
            
        });
        
        this.uniformKeys = {};
        this.uniforms.forEach( u => this.uniformKeys[ u.name ] = u );
        
        this.uniformKeys.colorTexture.value = textures++;
        this.uniformKeys.colorTexture.tex = createColorTexture( gl );
        
        this.uniformKeys.planeDistance.value = this.uniformKeys.camera.value[ 2 ] / 2;
        
        this.defines = getDefines( this.uniforms );
        this.defines.renderShadow = 1;
        this.defines.renderBlob = 1;
        this.definesNeedUpdate = true;
        
        this.uniforms.forEach( u => this.setUniform( u.name, u.value ) );
        
        this.draw = fillScreenForever( this.gl );
        
        this.width = 0;
        this.height = 0;
        this.windowWidth = 0;
        this.windowHeight = 0;
        
        // this.clearShader = createShader( gl, vertex, "void main(){ gl_FragColor = vec4(1., 1., 1., .3); }");
        
    }
    
    render () {
        
        if ( this.definesNeedUpdate ) {
            
            var frag = prependDefines( this.defines, fragment );
            
            if ( !this.shader ) {
                
                this.shader = createShader( this.gl, vertex, frag, this.uniforms, attributes );
                
                this.uniforms.forEach( u => {
                    if( !u.tex ) return;
                    u.tex.generateMipmap();
                    u.tex.magFilter = this.gl.LINEAR;
                    u.tex.minFilter = this.gl.LINEAR;
                });
                
            } else {
                
                this.shader.update( vertex, frag );
                
            }
            
            this.shader.bind();
            
            this.uniforms.forEach( u => {
                
                if( u.tex ) u.tex.bind( u.value );
                
                this.shader.uniforms[ u.name ] = u.value;
                
            });
            
            this.definesNeedUpdate = false;
            
        }
        
        this.draw();
        
    }
        
    setUniform ( name, value ) {
        
        var u = this.uniformKeys[ name ];
        
        var prevValue = u.value;
        
        if ( prevValue === value ) return;
        
        if ( value === 'default' ) value = u.default;
        
        u.value = value;
        
        // if ( u.define ) {
            
        //     var defineName = name + '_nonzero';
        //     var defineIsZero = this.defines[ defineName ] !== 1;
        //     var valueIsZero = isZero( value );
            
        //     if ( defineIsZero !== valueIsZero ) {
                
        //         this.defines[ defineName ] = valueIsZero ? 0 : 1;
        //         //this.definesNeedUpdate = true;
                
        //         if ( valueIsZero && u.timed ) u.startTime = 0;
                
        //     }
            
        // }
        
        if ( u.timed ) {
            
            var startTimeName = name + 'StartTime';
            var startTimeUniform = this.uniformKeys[ startTimeName ];
            var startTime = startTimeUniform.value;
            var now = this.uniformKeys.time.value;
            
            // https://www.wolframalpha.com/input/?i=x+*+(+t+-+z+)+%3D+y+*+(+t+-+w+)
            var st = ( -now * prevValue + now * value + prevValue * startTime ) / value;
            
            if ( value === 0 ) st = 0;
            
            //if ( name === 'rotateY' ) console.log( now - st, value );
            
            this.setUniform( startTimeName, st );
            
        }
        
        if ( this.shader ) this.shader.uniforms[ name ] = value;
        
    }
        
    setUniforms ( obj ) {
        
        for ( var key in obj ) this.setUniform( key, obj[ key ] );
        
    }
    
    setSize ( w, h ) {
        
        this.width = w;
        this.height = h;
        
        resizeGL( this.gl, w, h );
        
        this.gl.viewport( 0, 0, w, h );
        
        this.setUniform( 'resolution', [ w, h ] );
        
    }
    
    getScale () {
        
        var ww = this.windowWidth;
        var wh = this.windowHeight;
        
        return Math.max( 2 / ww, 2 / wh );
        
    }
    
    screenToLocal ( point, scale ) {
        
        if ( !scale ) scale = this.getScale();
        
        point.x = point.x * scale;
        point.y = point.y * scale;

        return point;
        
    }
    
    windowToLocal ( point ) {
        
        var scale = this.getScale();
        
        point = this.screenToLocal( point, scale );
        
        var w = this.windowWidth * scale;
        var h = this.windowHeight * scale;
        
        point.x -= 1;
        point.y -= 1;
        
        point.x += ( 2 - w ) * .5;
        point.y += ( 2 - h ) * .5;
        
        return point;
        
    }
    
    localToBlobDepth ( point ) {
        
        var scale = 6 / ( Math.PI / 2 );
        
        point.x *= scale;
        point.y *= scale;
        
        return point;
        
    }
    
    windowToBlobDepth ( point ) {
        
        return this.localToBlobDepth( this.windowToLocal( point ) );
        
    }
    
    screenToBlobDepth ( point ) {
        
        return this.localToBlobDepth( this.screenToLocal( point ) );
        
    }
    
}