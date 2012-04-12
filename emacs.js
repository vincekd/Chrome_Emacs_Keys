function ChromEmacs(){
    
    //private
    var that = this;
    that.state = {
	"keydown": true,   //read keydown
	"keyup": false,    //read keyup
	"keypress": false, //read keypress
	"no_def": true,    //prevent default
	"no_prop": true,   //stop propagation
	"str": "",
	"cur": {
	    "links": {}
	},
	"operation": "",
	"bar": false
    };

    //(that.defaultState());
    //var actions = new Actions( that );
    var keyreader = new KeyReader( that );

    
    this.evalState = function(){
	var str = that.state.str;
	for( var cmd in that.cmds ){
	    if( that.cmds.hasOwnProperty( cmd ) ){
		if( cmd.search( new RegExp( "^" + str ) ) !== -1 ){
		    if( cmd === str ){
			return that.cmds[cmd];
		    }
		    return true;
		}
	    }
	}
	return false;
    };

    this.chromeRequest = function( cmd, fn ){
	fn = fn || function(r){console.log(r)};
	chrome.extension.sendRequest({"name":cmd}, fn );
    };

    this.executeInput = function( action ){
	that.clearInput();
	that.state.operation = action;
	if( ! that.actions[action] ){
	    that.chromeRequest( action );
	    
	} else {
	    that.actions[action]();
	}
    };

    this.actions = {
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
	    findLinks();
	    toggleBar( "visible" );
	    that.state.keypress = true;
	    console.log( that );
	    console.log( this );
	},
	"find-links-new-tab": function(){
	    //find/num links
	    findLinks();
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
	    that.state = that.defaultState();
	    clearLinks();
	    toggleBar( "hidden" );
	},
	"forward-history": function( count ){
	    window.history.go( count||1 );
	},
	"back-history": function( count ){
	    window.history.go( -(count||1) );
	},
	"refresh-tab": function(){
	    window.location.reload();
	},
	"go-to-tab": function( action, num ){
	    //need index number
	},
	"search-bookmarks": function( action ){
	    //search bookmarks to load
	}
    };

    function clearLinks(){
	$("." + that.CONSTS.links ).remove();
    }

    function findLinks(){
	//clearLinks();
	var y = window.scrollY, sc = $(window).height();
	$("a[href]:visible").filter(function(){
	    var el = $(this), pos = el.offset();
	    //on screen
	    if( pos.top < y || pos.top > (y + sc) ){
		return false;
	    }
	    //if it's not hidden
	    return el.css( "visibility" ) !== "hidden" && 
		el.css( "opacity" ) !== 0;
	}).each(function( i, el ){
	    el = $(el);
	    var pos = el.offset(),
	    div = $("<div/>",{
		"class": that.CONSTS.links,
		"value": el.text(),
		"id": that.CONSTS.links + "_" + i
	    });
	    that.state.cur.links[i] = {"el":el, "txt": el.text()};
	    div.css({
		"left": pos.left-5,
		"top": pos.top-5
	    }).text( i );
	    
	    $("body").prepend( div );
	});
    }
    
    function toggleBar( which ){
	which = which || "";
	var el = $( "#" + that.CONSTS.bar_id );
	if( el.length > 0 ){
	    if( which === "visible" ){
		return true;
	    } else if( which === "hidden" ){
		el.remove();
		that.state.bar = false;
	    }
	} else {
	    var div = $("<input/>", {
		"type": "text"
	    }).attr( "id", that.CONSTS.bar_id );
	    $("body").append( div );
	    that.state.bar = true;
	    div.focus();
	}
    }

}

ChromEmacs.prototype = {
    "CONSTS": {
	"links": "ChromEmacs_Links",
	"bar_id": "ChromEmacs_Bar"
    },
    "defaultState": function(){
	return {
	    "keydown": true,   //read keydown
	    "keyup": false,    //read keyup
	    "keypress": false, //read keypress
	    "no_def": true,    //prevent default
	    "no_prop": true,   //stop propagation
	    "str": "",
	    "cur": {
		"links": {}
	    },
	    "operation": "",
	    "bar": false
	};
    },
    "cmds": {
	"<C>-d": "find-links-this-tab",
	"<C>-D": "find-links-new-tab",
	"<C>-b": "back-history",
	"<C>-f": "forward-history",
	"<C>-p": "previous-line",
	"<C>-n": "next-line",
	"<C>-v": "scroll-down",
	"<M>-v": "scroll-up",
	"<C>-s": "search-page",
	"<M>-s": "search-regex",
	"<M>->": "scroll-to-bottom",
	"<M>-<": "scroll-to-top",
	"<M>-x": "execute-command",
	"<C>-g": "escape",
	"<C>-x <C>-x": "remove-tab",
	"<C>-c": "new-tab",
	"<M>-n": "next-tab",
	"<M>-b": "previous-tab",
	"<C>-<M>-b": "bookmark-page"
    },
    "modifiers": {
	"Control": "<C>-",
	"Alt": "<M>-",
	"Meta": "<M>-",
	"Win": "<M>-"
    },
    "addInput": function( str ){
	var that = this;
	that.state.str = trim( that.state.str + " " + str );
    },
    "clearInput": function(){
	var that = this;
	that.state = that.defaultState();
    }
};

var chromEmacs = new ChromEmacs();

//utilities
function trim( str ){
    return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );
}