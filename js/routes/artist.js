var $ = require('jquery');

var initGL = require('../lib/initGL');
var BlobViewer = require('../blob/viewer');
var answersToArray = require('../blob/lib/answersToArray');
var answersToParams = require('../blob/lib/answersToParams');
var answersToAnimator = require('../blob/lib/answersToAnimator');
var questions = require('../questions.json');
var template = require('./single/template.js');
var Stat = require('./single/stat');
var oneAnswer = require('./single/oneAnswer');

var tween = require('../lib/tween');
var scale = require('../lib/scale');
var clone = require('lodash/clone');

var wait = delay => new Promise( resolve => setTimeout( resolve, delay ) );

initGL( ( gl, cube ) => {
    
    var title = document.querySelector('.artist-header h1');
    var answers = answersToArray( $('main').data('params') );
    var oneAnswers = answers.map( ( a, i ) => oneAnswer( answers, i ) );
    
    var $template = $( template() );
    
    $('body').append( $template );
    
    var initialParams = Object.assign({
        marbleTexture: cube,
        camera: [ 0, 0, 5 ],
        subtract: 1.4
    }, answersToParams( questions, answers ) );
    
    var blob = new BlobViewer( gl, initialParams );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight * .95 );
        
    }
    
    function onScroll() {
        
        if ( window.pageYOffset > 0 ) {
            
            blob.canvas.style.opacity = .5;
            $statsContainer[0].style.opacity = 0;
            $statsContainer[0].style.pointerEvents = 'none';
            
        } else {
            
            blob.canvas.style.opacity = 1;
            $statsContainer[0].style.opacity = 1;
            $statsContainer[0].style.pointerEvents = 'visible';
            
        }
        
    }
    
    function animateBlob ( toParams ) {
        
        var fromParams = {};
        var uniforms = blob.shader.uniforms;
        
        for ( var p in toParams ) {
            
            fromParams[ p ] = uniforms[ p ];
            
        }
        
        return tween( 'animateBlob', 0, 1, 500, 'quadInOut', x => {
            
            for ( var p in toParams ) {
                
                blob.setUniform( p, scale( x, 0, 1, fromParams[ p ], toParams[ p ] ));
                
            }
            
        })
        
    }
    
    var $statsContainer = $('.stats');
    var $statsCol1 = $('.stats__column_1');
    var $statsCol2 = $('.stats__column_2');
    var $callout = $('.stats__callout');
    
    $statsContainer[0].style.opacity = 0;



    // her comes simons mess     
    var $bodycheck = $('body').attr('id');
    if ($bodycheck == 'no_blob') { $statsContainer.addClass('no-blob') };




    function callout( question, answer ) {
        
        if ( window.innerWidth >= 668 ) return;
        
        var percent = Math.floor( Math.abs( answer ) * 100 );
        var answerText = answer < 0 ? question.left.answer : question.right.answer;
        
        var str = `
            ${ question.question.en }<br>
            ${ percent }% ${ answerText.en }
        `;
        
        $callout
            .html( str )
            .css({
                opacity: 1,
                display: 'block'
            })
            .stop()
            .delay( 2000 )
            .fadeOut( 1000 )
        
    }
    
    var boundSetUniform = blob.setUniform.bind( blob );
    
    function animate ( to, duration = 500 ) {
        
        var animator = answersToAnimator( questions, blob.shader.uniforms, to, boundSetUniform, false );
        
        return tween( 'animateBlob', 0, 1, duration, 'quadInOut', animator );
        
    }
    
    var animateAll = animate.bind( null, answers )
    
    window.addEventListener('resize', onResize);
    window.addEventListener('scroll', onScroll);
    
    document.body.appendChild( blob.canvas );
    
    wait( 1000 ).then(() => {
        
        questions.forEach( (q, i) => {
            
            var stat = new Stat( q );
            
            stat.appendTo( i < questions.length / 2 ? $statsCol1 : $statsCol2 );
            
            stat.set( answers[ i ] );
            
            stat.hover(
                animate.bind( null, oneAnswers[ i ], 500 ),
                animateAll.bind( null, 500 )
            )
            
            stat.click( callout.bind( null, questions[ i ], answers[ i ] ) )
            
        });
        
        title.style.opacity = 0;
        
        $statsContainer[ 0 ].style.opacity = 1;
        
        onResize();
        onScroll();
        if ( !( 'ontouchstart' in window ) ) blob.enableCameraControls();
        blob.tick();
        tween( 1.4, 0, 2500, 'quadInOut', x => blob.setUniform( 'subtract', x ) );
        
    })
    
    document.body.classList.add( 'loaded' );
    
}, () => {
    
    document.body.classList.add( 'loaded' );
    
})