function ChromEmacs(){
    
    //private
    var that = this;
    var state = that.defaultState();
    var keyreader = new KeyReader( that );

    
    this.evalState = function(){
	var str = state.cmd;
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

    this.evalInput = function( info ){
	var ret = {"no_prop":false,"no_def":false};
	if( ! state[info.type] ){
	    return ret;
	}

	if( info.type === "keyup" ){
	    //user input for active operations
	    if( info.key === info.cmd && info.key !== "" ){
		if( state.fn !== null ){
		    state.fn( info );
		}
	    }
	    return ret;
	} else if( info.type === "keydown" ){
	    //actions from keybindings
	    state.cmd = trim( state.cmd + " " + info.cmd );
	    var action = that.evalState();
	    if( action === false ){
		state.cmd = "";
		return ret;
	    } else if( action !== true ){
		that.executeInput( action );
	    }
	    ret.no_prop = true;
	    ret.no_def = true;
	    return ret;
	}
	return state;
    };

    this.chromeRequest = function( cmd, fn ){
	fn = fn || function(r){console.log(r)};
	chrome.extension.sendRequest( cmd, fn );
    };

    this.executeInput = function( action ){
	state.cmd = "";
	state.operation = action;
	if( ! that.actions[action] ){
	    that.chromeRequest( {"name":action} );
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
	    window.scrollBy( 0, -15 );x
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
	    that.actions['find-links']( "this-tab" );
	},
	"find-links": function( tab ){
	    //find/num links
	    findLinks();
	    toggleBar( "visible" );
	    state.keyup = true;
	    state.fn = function( info ){
		var r,link = that.CONSTS.links + "_" + state.str;
		if( info.back ){
		    state.str = state.str.slice( 0, -1 );
		    link = that.CONSTS.links + "_" + state.str;
		    $.each( state.cur.discards, function( key, val ){
			if( match( key, link ) || match( val.txt, state.str ) ){
			    state.cur.links[key] = state.cur.discards[key];
			    $("#" + key ).show();
			    delete state.cur.discards[key];
			}
		    });
		} else if( info.enter ){
		    if( link in state.cur.links ){
			openUrl( state.cur.links[link].el.attr( "href" ) );
		    }
		} else if( info.key.length === 1 ){		    
		    state.str += info.key;
		    link = that.CONSTS.links + "_" + state.str;
		    r = [];
		    $.each( state.cur.links, function( key, val ){
			if( !match( key, link ) && !match( val.txt, state.str ) ){
			    state.cur.discards[key] = state.cur.links[key];
			    $("#" + key ).hide();
			    delete state.cur.links[key];
			} else {
			    r.push( val );
			}
		    });
		    if( r.length === 1 ){
			openUrl( r[0].el.attr( "href" ) );
		    }
		}
		function openUrl( u ){
		    if( tab === "this-tab" ){
			url( u, true );
		    } else if( tab === "new-tab" ){
			url( u, false );
			that.actions['escape']();
		    }
		}
	    };
	},
	"find-links-new-tab": function(){
	    that.actions['find-links']( "new-tab" );
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
	    toggleBar( "visible" );
	    //bindBar( "execute" );
	},
	"escape": function(){
	    //esc/C-g - to exit out of any of these
	    state = that.defaultState();
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
	
    function match( haystack, needle ){
	return (haystack.search( new RegExp( "^" + needle + ".*" ) ) !== -1);
    }

    function clearLinks(){
	state.links = {};
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
		"id": that.CONSTS.links + "_" + i
	    });
	    state.cur.links[that.CONSTS.links + "_" + i] = {"el":el, "txt": el.text()};
	    div.css({
		"left": pos.left-5,
		"top": pos.top-5
	    }).text( i );
	    
	    $("body").prepend( div );
	});
    }

    function url( url, tab ){
	if( tab ){
	    //window.location.href = url;
	    window.open( url );
	} else {
	    //handle relative page links
	    that.chromeRequest({"name":state.operation,"url":url});
	}
    }
    
    function toggleBar( which ){
	which = which || "";
	var el = $( "#" + that.CONSTS.bar_id );
	if( el.length > 0 ){
	    if( which === "visible" ){
		return true;
	    } else if( which === "hidden" ){
		el.remove();
		state.bar = false;
	    }
	} else {
	    var div = $("<input/>", {
		"type": "text"
	    }).attr( "id", that.CONSTS.bar_id );
	    $("body").append( div );
	    state.bar = true;
	    div.focus();
	}
    }
    
    function setBarText( str ){
	$("#" + that.CONSTS.bar_id ).val( str );
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
	    "bar": false,      //task bar enabled
	    "str": "",
	    "cmd": "",
	    "fn": null,
	    "cur": {
		"links": {},
		"discards": {}
	    },
	    "operation": ""
	}
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
	"ESC ESC": "escape",
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
	"Win": "<M>-",
	"ESC": "<ESC>"
    }
};

var chromEmacs = new ChromEmacs();

//utilities
function trim( str ){
    return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );
}
