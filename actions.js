function Actions( emacs ){
    
    
    this.sendChromeRequest = function( cmd, fn ){
	chrome.extension.sendRequest({"name":cmd}, fn );
    }
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
    "remove-tab": function(){
	//console.log( arguments.callee );
	//var that = this;
	//that.sendChromeRequest( arguments.callee, function(){} );
    },
    "next-tab": function(){

    },
    "refresh-tab": function(){

    },
    "previous-tab": function(){

    },
    "go-to-tab": function(){

    },
    "new-tab": function(){

    },
    "bookmark-page": function(){

    },
    "search-bookmarks": function(){

    }
}