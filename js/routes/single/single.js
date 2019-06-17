var $ = require('jquery');
var BlobViewer = require('../../blob/viewer');
var template = require('./template.js');
var insertTemplate = require('../lib/template');

var Stat = require('./stat');
var questions = require('../../questions.json');
var answersToParams = require('../../blob/lib/answersToParams');
var answersToArray = require('../../blob/lib/answersToArray');
var oneAnswer = require('./oneAnswer');
var answersToAnimator = require('../../blob/lib/answersToAnimator');
var translate = require('../../lib/translate');

var tween = require('../../lib/tween');
var scale = require('../../lib/scale');
var clone = require('lodash/clone');

var clipboard = require('clipboard-js');

var { DB_ROOT, URL } = require('../../config');

module.exports = function ( ctx, next ) {
    
    insertTemplate( template( ctx.data.me ) )();
    
    var startWithEveryone = ctx.querystring && ctx.querystring.split('=')[1] === 'everyone';
    
    var currTab = startWithEveryone ? 1 : 0;
    
    var dataSets = [ ctx.data.me, ctx.data.everyone ];
    var answerSets = dataSets.map( answersToArray );
    
    var oneAnswerSets = answerSets.map( answerSet => {
        return answerSet.map( (a, i) => oneAnswer( answerSet, i ) );
    });
    
    //var paramSets = answerSets.map( answersToParams.bind( null, questions ) );
    
    var initialParams = answersToParams( questions, answerSets[ currTab ] );
    
    initialParams.marbleTexture = ctx.envMap;
    initialParams.camera = [ 0, 0, 5 ];
    initialParams.subtract = 1.4;
    
    var blob = new BlobViewer( ctx.gl, initialParams );
    
    function onResize () {
        
        blob.setSize( window.innerWidth, window.innerHeight );
        
    }
    
    window.addEventListener('resize', onResize);
    
    document.body.appendChild( blob.canvas );
    
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
    
    function callout( question, answer ) {
        
        if ( window.innerWidth >= 668 ) return;
        
        var percent = Math.floor( Math.abs( answer ) * 100 );
        var answerText = answer < 0 ? question.left.answer : question.right.answer;
        
        var str = `
            ${ translate( question.question ) }<br>
            ${ percent }% ${ translate( answerText ) }
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
    
    var stats = questions.map( (q, i) => {
        
        var stat = new Stat( q );
        
        // var a = currAnswers[ i ];
        
        // stat.set( a );
        
        // stat.hover( () => {
        //     var thisParam = oneAnswer( questions, currAnswers, i );
        //     animateBlob( thisParam );
        // }, () => {
        //     animateBlob( currParams );
        // });
        
        stat.appendTo( i < questions.length / 2 ? $statsCol1 : $statsCol2 );
        
        return stat;
        
    });
    
    var $tabs = $('.tab');
    
    var boundSetUniform = blob.setUniform.bind( blob );
    
    function animate ( to, extreme, duration = 500 ) {
        
        var animator = answersToAnimator( questions, blob.shader.uniforms, to, boundSetUniform, extreme );
        
        return tween( 'animateBlob', 0, 1, duration, 'quadInOut', animator );
        
    }
    
    function selectTab ( i ) {
        
        var answers = answerSets[ i ];
        var oneAnswers = oneAnswerSets[ i ];
        
        $tabs.removeClass('tab_active');
        $tabs.eq( i ).addClass('tab_active');
        
        var animateAll = animate.bind( null, answers, i === 1 );
        
        if( i !== currTab ) animateAll( 1500 );
        
        stats.forEach( (stat, j) => {
            
            stat.set( answers[ j ] );
            
            stat.hover(
                animate.bind( null, oneAnswers[ j ], i === 1, 500 ),
                animateAll.bind( null, 500 )
            )
            
            stat.click( callout.bind( null, questions[ j ], answers[ j ] ) )
            
        });
        
        currTab = i;
        
    }
    
    $tabs.eq(0).click( selectTab.bind(null, 0) );
    $tabs.eq(1).click( selectTab.bind(null, 1) );
    
    var $mainButtons = $('.buttons_main');
    var $shareButtons = $('.buttons_share');
    
    var $shareButton = $('.button_share');
    var $copyButton = $('.button_copy');
    var $cancelButton = $('.button_cancel');
    
    $shareButton.on('click', () => {
        $mainButtons.addClass('buttons_fade-out');
        $shareButtons.removeClass('buttons_fade-out');
        $statsContainer.addClass('stats_fade-out');
    });
    
    $cancelButton.on('click', () => {
        $mainButtons.removeClass('buttons_fade-out');
        $shareButtons.addClass('buttons_fade-out');
        $statsContainer.removeClass('stats_fade-out');
    })
    
    $copyButton.on('click', () => {
        clipboard.copy( location.hostname + location.pathname );
        $mainButtons.removeClass('buttons_fade-out');
        $shareButtons.addClass('buttons_fade-out');
        $statsContainer.removeClass('stats_fade-out');
    })
    
    $('.button_share-action').each( function () {
        
        var $btn = $(this);
        
        var action = $btn.data('share-action');
        
        $btn.on('click', () => {
            
            ga( 'send', 'event', 'Share', action, location.hostname + location.pathname );
            
        })
        
    })
    
    selectTab( currTab );
    
    //setTimeout( () => {

        onResize();
        blob.enableCameraControls();
        blob.tick();
        
        tween( 1.4, 0, 2500, 'quadInOut', x => blob.setUniform( 'subtract', x ) );
    
    //}, 1000)
    
    
    next();
    
}