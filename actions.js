function Actions( emacs ){
    
    

    

}

Actions.prototype = {
    "scroll-to-bottom": function(){
	window.scrollTo( window.scrollX, document.body.scrollHeight );
    },
    "scroll-to-top": function(){
	window.scrollTo( window.scrollX, 0 );
    },
    "scroll-to-far-right": function(){
	window.scrollTo( document.body.scrollWidth, window.scrollY );
    },
    "scroll-to-far-left": function(){
	window.scrollTo( 0, window.scrollY );
    },
    "scroll-left": function(){
	window.scrollBy( -15, 0 );
    },
    "scroll-right": function(){
	window.scrollBy( 15, 0 );
    },
    "previous-line": function(){
	window.scrollBy( 0, -15 );
    },
    "next-line": function(){
	window.scrollBy( 0, 15 );	
    },
    "scroll-down": function(){
	window.scrollBy( 0, parseInt((window.innerHeight * .75), 10 ) );
    },
    "scroll-up": function(){
	window.scrollBy( 0, parseInt((window.innerHeight * -.75), 10 ) );
    },
    "find-links-this-tab": function(){
	//find/num links
	//findLinks();
    },
    "find-links-new-tab": function(){
	//find/num links
	//findLinks();
    },
    "search-page": function(){
	//search page
	//toggleBar( "visible" );
	//bindBar( "search" );
    },
    "search-regex": function( re ){
	//search page with regex
	//toggleBar( "visible" );
	//bindBar( "search" );
    },
    "execute-command": function(){
	//execute one of these commands by hand
	//toggleBar( "visible" );
	//bindBar( "execute" );
    },
    "escape": function(){
	//esc/C-g - to exit out of any of these
	//clearLinks();
	//toggleBar( "hidden" );
    },
    "forward-history": function( count ){
	window.history.go( count||1 );
    },
    "back-history": function( count ){
	window.history.go( -(count||1) );
    },
    "remove-tab": function( action ){
	that.chromeRequest( action );
    },
    "next-tab": function( action ){
	that.chromeRequest( action );	
    },
    "refresh-tab": function(){
	window.location.reload();
    },
    "previous-tab": function( action ){
	that.chromeRequest( action );
    },
    "go-to-tab": function( action, num ){
	//need index number
    },
    "new-tab": function( action ){
	that.chromeRequest( action );
    },
    "bookmark-page": function( action ){
	that.chromeRequest( action );	
    },
    "search-bookmarks": function( action ){
	//search bookmarks to load
    }
}