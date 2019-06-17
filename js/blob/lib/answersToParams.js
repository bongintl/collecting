var isPlainObject = require('lodash/isPlainObject');
var answerToParams = require('./answerToParams');
var answersToArray = require('./answersToArray');

module.exports = function( questions, answers, extreme ) {
    
    if ( !Array.isArray( answers ) ) {
        
        answers = answersToArray( answers );
        
    }
    
    var params = {};
    
    questions.forEach( (question, i) => {
        
        var answer = answers[ i ];
        
        answerToParams( question, answer, extreme, params );
        
    });
    
    return params;
    
}