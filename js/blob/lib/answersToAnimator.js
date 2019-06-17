var answerToAnimator = require('./answerToAnimator');

module.exports = function ( questions, fromParams, toAnswers, setter, extreme ) {
    
    var fns = questions.map( (question, i) => {
        
        return answerToAnimator( question, fromParams, toAnswers[ i ], setter, extreme );
        
    })
    
    return function ( x ) {
        
        fns.forEach( fn => fn( x ) );
        
    }
    
}