var answerToParams = require('./answerToParams');
var scale = require('./scale');

function scaler1D ( from, to, setter, uniform ) {
    
    return function ( x ) {
        
        var value = scale( x, 0, 1, from, to );
        
        setter( uniform, value );
        
    }
    
}

function getter ( f1, f2, useF2 ) {
    
    if ( useF2 ) {
        
        return x => f2 in x ? x[ f2 ] : x[ f1 ];
        
    } else {
        
        return x => x[ f1 ];
        
    }
    
}

module.exports = function ( question, paramsFrom, answerTo, setter, extreme ) {
    
    var getMax = getter( 'max', 'extremeMax', extreme );
    var getMin = getter( 'min', 'extremeMin', extreme );
    
    if ( question.left.uniform === question.right.uniform ) {
        
        var min = getMax( question.left );
        var max = getMax( question.right );
        
        var uniform = question.left.uniform;
        
        var paramFrom = paramsFrom[ uniform ];
        var paramTo = scale( answerTo, -1, 1, min, max );
        
        return scaler1D( paramFrom, paramTo, setter, uniform );
        
    }
    
    var fromLeft = paramsFrom[ question.left.uniform ] > 0;
    var toLeft = answerTo < 0;
    
    if ( fromLeft === toLeft || answerTo === 0 ) {
        
        var side = fromLeft ? question.left : question.right;
        
        var uniform = side.uniform;
        var min = getMin( side );
        var max = getMax( side );
        
        var paramFrom = paramsFrom[ side.uniform ];
        var paramTo = scale( Math.abs( answerTo ), 0, 1, min, max );
        
        return scaler1D( paramFrom, paramTo, setter, uniform );
        
    } else {
        
        var fromSide = fromLeft ? question.left : question.right;
        var toSide = answerTo < 0 ? question.left : question.right;
        
        var toMin = getMin( toSide );
        var toMax = getMax( toSide );
        
        var fromUniform = fromSide.uniform;
        var toUniform = toSide.uniform;
        
        var paramFrom = paramsFrom[ fromUniform ];
        var paramTo = scale( Math.abs( answerTo ), 0, 1, toMin, toMax );
        
        var range = paramFrom + paramTo;
        var threshold = paramFrom / range;
        
        var toBaseMin = toSide.baseMin || 0;
        var fromBaseMin = fromSide.baseMin || 0;
        
        var fromPrev = paramsFrom[ fromSide.uniform ];
        var toPrev = paramsFrom[ toSide.uniform ];
        
        return function ( x ) {
            
            if ( x < threshold ) {
                
                setter( toUniform, toPrev );
                setter( fromUniform, scale( x, 0, threshold, paramFrom, fromBaseMin ) );
                
            } else {
                
                setter( fromUniform, fromBaseMin );
                setter( toUniform, scale( x, threshold, 1, toPrev, paramTo ) );
                
            }
            
        }
        
    }
    
}