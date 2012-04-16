//TODO: options page: save changes to commands, css changes, defaults
//TODO: help options
//TODO: finish searching page without window.find()

function ChromEmacs(){
    //private
    var that = this;
    var userSettings = new Settings( that );
    var state = that.defaultState();
    var keyreader = new KeyReader( that );

    function evalState(){
	var str = state.cmd;
	for( var cmd in that.cmds ){
	    if( that.cmds.hasOwnProperty( cmd ) ){
		if( match( escape( cmd ), escape( str ) ) ){
		    if( cmd === str ){
			return that.cmds[cmd];
		    }
		    return true;
		}
	    }
	}
	return false;
    }

    this.evalInput = function( info ){
	//TODO: handle special keys {esc, arrows, etc.}

	var pos = {"no_prop":false,"no_def":false},
	neg = {"no_prop":true,"no_def":true};

	if( state[info.type] !== true && state[info.type] > 0 ){
	    state[info.type]--;
	    return neg;
	}

	if( state.unbind || !state[info.type] ){
	    if( (info.cmd in that.cmds) && 
		that.cmds[info.cmd] === "toggle-chromemacs" &&
	      state[info.type] ){
		that.actions[that.cmds[info.cmd]]();
		return neg;
	    } 
	    return pos;
	}

	if( info.key === info.cmd || info.cmd === "" ){
	    if( state.read_keys && info.key !== "" ){
		if( state.fn !== null ){
		    state.fn( info );
		    return neg;
		}
	    }
	    return pos;	    
	}

	pos.no_def = (state.no_defaults) ? true : false;

	state.cmd = $.trim( state.cmd + " " + info.cmd );
	var action = evalState();
	if( action === false ){
	    //that.reset();
	    state.cmd = "";
	    return pos;
	} else if( action !== true ){
	    state.keypress++;
	    state.keyup++;
	    //reset completely?
	    //reset();
	    state.cmd = "";
	    executeAction( action );
	}
	return neg;
    };

    this.chromeRequest = function( cmd, fn ){
	fn = fn || function(r){console.log(r)};
	chrome.extension.sendRequest( cmd, fn );
    };

    function executeAction( action ){
	state.operation = action;
	if( !that.actions[action] ){
	    that.chromeRequest( {"name":action} );
	} else {
	    that.actions[action]();
	}
    }

    this.actions = {
	"no-defaults": function(){
	    state.no_defaults = !state.no_defaults;
	},
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
	    findLinks();
	    toggleBar( "visible" );
	    state.read_keys = true;
	    state.fn = findLinksKeyReader( 'this-tab' );
	},
	"find-links-new-tab": function(){
	    findLinks();
	    toggleBar( "visible" );
	    state.read_keys = true;
	    state.fn = findLinksKeyReader( 'new-tab' );
	},
	"search-page": function(){
	    //search page
	    toggleBar( "visible" );
	    $("body").addClass( that.CONSTS.css.search );
	    state.read_keys = true;
	    state.fn = searchPage;
	    //state.fn = searchPage2;
	},
	"search-regex": function(){
	    //search page with regex
	    toggleBar( "visible" );
	    $("body").addClass( that.CONSTS.css.search );
	    state.read_keys = true;
	    state.fn = searchPage;
	},
	"execute-command": function(){
	    //execute one of these commands by hand
	    toggleBar( "visible" );
	    state.fn = function( info ){
		//finish
	    };
	},
	"escape": function(){
	    //esc/C-g - to exit out of any of these
	    reset();
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
	},
	"toggle-chromemacs": function(){
	    //turn on/off chromemacs
	    state.unbind = !state.unbind;
	}
    };

    function searchPage2( info ){
	state.str += info.key;
	var arr = [];
	$(":visible").filter(":contains('" + state.str + "')").each(function( j, e ){
	    var el = $(e);
	    if( el.text().search( new RegExp( state.str ) ) !== -1 ){
		for( var i = 0; i < arr.length; i++ ){
		    if( $.contains( arr[i], e ) ){
			arr.splice( i, 1 );
		    }
		}
		arr.push( e );
	    }
	});
	//cycle through arr, replace str with spans
	for( var i = 0; i < arr.length; i++ ){
	    var el = $(arr[i]);
	    if( el.children().length === 0 ){
		var html = el.text().replace( new RegExp( "(" + state.str + ")" ), function( str, p1 ){
		    var str = "";
		    $.each(p1.split( "" ), function( i, el ){
			str += "<span class='" + that.CONSTS.search + "'>" + el + "</span>";
		    });
		    return str;
		});
		el.html( html );
	    }
	}
    }

    function searchPage( info ){
	var o = state.cur.sopts;
	if( info.back ){
	    state.str = state.str.slice( 0, -1 );
	    setBarText( state.str );
	} else if( info.key.length === 1 ){
	    state.str += info.key;
	    setBarText( state.str );
	}
	var t = window.find( state.str, o.cs, o.back, o.wrap,
			     o.whole, o.frames, o.dialog );
    }

    function findLinksKeyReader( tab ){
	return function( info ){
	    var r,link = that.CONSTS.links + "_" + state.str;
	    if( info.back ){
		state.str = state.str.slice( 0, -1 );
		link = that.CONSTS.links + "_" + state.str;
		$.each( state.cur.discards, function( key, val ){
		    if( match( key, link ) || match( val.txt, state.str ) ){
			state.cur.links[key] = state.cur.discards[key];
			$("#" + key ).show();
			$("." + that.CONSTS.links_span + state.str.length ).
			    removeClass( that.CONSTS.links_span );
			delete state.cur.discards[key];
		    }
		});
	    } else if( info.enter ){
		if( link in state.cur.links ){
		    //openUrl( state.cur.links[link].el.attr( "href" ) );
		    openUrl( state.cur.links[link].el.get(0).href );
		}
	    } else if( info.key.length === 1 ){
		state.str += info.key;
		link = that.CONSTS.links + "_" + state.str;
		r = [];
		$.each( state.cur.links, function( key, val ){
		    var m = match( key, link );
		    if( !m && !match( val.txt, state.str ) ){
			state.cur.discards[key] = state.cur.links[key];
			$("#" + key ).hide();
			delete state.cur.links[key];
		    } else {
			if( m ){
			    $("#" + key ).find("." + that.CONSTS.links_span + (state.str.length-1) )
				.addClass( that.CONSTS.links_span );
			}
			r.push( val );
		    }
		});

		if( r.length === 1 ){
		    //openUrl( r[0].el.attr( "href" ) );
		    openUrl( r[0].el.get(0).href );
		}
	    }
	    setBarText( state.str );
	    function openUrl( u ){
		if( tab === "this-tab" ){
		    url( u, true );
		} else if( tab === "new-tab" ){
		    url( u, false );
		    reset();
		}
	    }
	};
    }

    function reset(){
	state = that.defaultState();
	$("*").removeClass( that.objToArr( that.CONSTS.css ).join( " " ) );
	clearLinks();
	toggleBar( "hidden" );
	$(document).focus();
    }

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
	    div = $("<span/>",{
		"class": that.CONSTS.links,
		"id": that.CONSTS.links + "_" + i
	    });
	    state.cur.links[that.CONSTS.links + "_" + i] = 
		{"el":el, "txt": el.text()};
	    pos.left = (pos.left-15 < 0 )? 0 : pos.left - 15;
	    pos.top = (pos.top-10 < 0 )? 0 : pos.top - 10;
	    div.css({
		"left": pos.left,
		"top": pos.top
	    });
	    var str = "";
	    $.each(i.toString().split( "" ), function( j, e ){
		str += "<span class='" + that.CONSTS.links_span + j + "'>" + e + "</span>";
	    });
	    div.html( str );
	    $("body").prepend( div );
	});
    }

    function url( url, tab ){
	if( tab ){
	    window.location.href = url;
	} else {
	    that.chromeRequest({"name":state.operation,"url":url});
	}
    }
    
    function toggleBar( which ){
	which = which || "";
	var el = $( "#" + that.CONSTS.bar_id );
	if( el.length > 0 || which === "hidden" ){
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
    "objToArr": function( obj ){
	var arr = [],i;
	for( i in obj ){
	    arr.push( obj[i] );
	}
	return arr;
    }
};

var chromEmacs = new ChromEmacs();
