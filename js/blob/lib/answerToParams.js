var scale = require('../lib/scale');

function getter ( f1, f2, useF2 ) {
    
    if ( useF2 ) {
        
        return x => f2 in x ? x[ f2 ] : x[ f1 ];
        
    } else {
        
        return x => x[ f1 ];
        
    }
    
}

module.exports = function answerToParams ( question, answer, extreme = false, obj = {} ) {
    
    var getMax = getter( 'max', 'extremeMax', extreme );
    var getMin = getter( 'min', 'extremeMin', extreme );
    
    var uniform, oldMin, oldMax, newMin, newMax;
    
    if ( question.left.uniform === question.right.uniform ) {
        
        uniform = question.left.uniform;
        oldMin = -1;
        oldMax = 1;
        newMin = getMax( question.left );
        newMax = getMax( question.right );
        
    } else if ( answer === 0 ) {
        
        obj[ question.left.uniform ] = question.left.baseMin || 0;
        
        obj[ question.right.uniform ] = question.right.baseMin || 0;
        
        return obj;
        
    } else if ( answer <= 0 ) {
        
        uniform = question.left.uniform;
        oldMin = 0;
        oldMax = -1;
        newMin = getMin( question.left );
        newMax = getMax( question.left );
        
        obj[ question.right.uniform ] = question.left.baseMin || 0;
        
    } else {
    
        uniform = question.right.uniform;
        oldMin = 0;
        oldMax = 1;
        newMin = getMin( question.right );
        newMax = getMax( question.right );
        
        obj[ question.left.uniform ] = question.left.baseMin || 0;
        
    }
    
    obj[ uniform ] = scale( answer, oldMin, oldMax, newMin, newMax );
    
    return obj;
    
}