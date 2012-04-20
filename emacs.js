//TODO: finish searching page without window.find()
//TODO: focus/unfocus text fields
//TODO: disable all inputs on pageload- google
function ChromEmacs(){
    "use strict";

    var that = this;
    var state, keyreader;
 
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
	      state[info.type] !== 0 ){
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

	pos.no_def = (that.no_defaults) ? true : false;

	state.cmd = $.trim( state.cmd + " " + info.cmd );
	var action = evalState();
	var todo = {},str = state.cmd;
	if( action === false ){
	    action = "escape";
	    if( that.cmds[info.cmd] !== action ){
		state.cmd = "";
		return pos;
	    }
	} 

	if( action !== true ){
	    str = action;
	    state.cmd = "";
	    todo = executeAction( action ) || todo;
	}

	if( !todo.bubble ){
	    state.keypress++;
	    state.keyup++;
	}
	if( !todo.bar ){
	    setBarText( str, "cmd" );
	}
	if( !todo.stop ){
	    return neg;
	} else {
	    return pos;
	}
    };

    this.chromeRequest = function( cmd, fn ){
	fn = fn || function(r){console.log(r)};
	chrome.extension.sendRequest( cmd, fn );
    };

    function executeAction( action ){
	state.operation = action;
	if( !that.actions[action] ){
	    return that.chromeRequest( {"name":action} );
	} else {
	    return that.actions[action]();
	}
    }

    this.actions = {
	"no-defaults": function(){
	    that.no_defaults = !that.no_defaults;
	    return {"bar":true};
	},
	"scroll-to-bottom": function(){
	    window.scrollTo( window.scrollX, document.body.scrollHeight );
	    return {"bar":true};
	},
	"scroll-to-top": function(){
	    window.scrollTo( window.scrollX, 0 );
	    return {"bar":true};
	},
	"scroll-to-far-right": function(){
	    window.scrollTo( document.body.scrollWidth, window.scrollY );
	    return {"bar":true};
	},
	"scroll-to-far-left": function(){
	    window.scrollTo( 0, window.scrollY );
	    return {"bar":true};
	},
	"scroll-left": function(){
	    window.scrollBy( -15, 0 );
	    return {"bar":true};
	},
	"scroll-right": function(){
	    window.scrollBy( 15, 0 );
	    return {"bar":true};
	},
	"previous-line": function(){
	    window.scrollBy( 0, -15 );
	    return {"bar":true};
	},
	"next-line": function(){
	    window.scrollBy( 0, 15 );
	    return {"bar":true};
	},
	"scroll-down": function(){
	    window.scrollBy( 0, parseInt((window.innerHeight * .75), 10 ) );
	    return {"bar":true};
	},
	"scroll-up": function(){
	    window.scrollBy( 0, parseInt((window.innerHeight * -.75), 10 ) );
	    return {"bar":true};
	},
	"find-links-this-tab": function(){
	    findLinks();
	    setBarText( "", "input" );
	    state.read_keys = true;
	    state.fn = findLinksKeyReader( 'this-tab' );
	},
	"find-links-new-tab": function(){
	    findLinks();
	    setBarText( "", "input" );
	    state.read_keys = true;
	    state.fn = findLinksKeyReader( 'new-tab' );
	},
	"search-page": function(){
	    //search page
	    setBarText( "", "input" );
	    $("body").addClass( that.CONSTS.css.search );
	    state.read_keys = true;
	    state.fn = searchPage;
	    //state.fn = searchPage2;
	},
	"search-regex": function(){
	    //search page with regex
	    setBarText( "", "input" );
	    $("body").addClass( that.CONSTS.css.search );
	    state.read_keys = true;
	    state.fn = searchPage;
	},
	"execute-command": function(){
	    //TODO: finish this
	    //execute one of these commands by hand
	    setBarText( "", "input" );
	    state.read_keys = true;
	    state.fn = function( info ){
		if( info.back ){
		    state.str = state.str.slice( 0, -1 );
		} else if( info.enter ){
		    var todo = {},str = state.str;
		    reset();
		    if( str in that.cmds ){
			str = that.cmds[str];
		    }
		    todo = executeAction( str ) || {};
		    if( !todo.bar && (str in that.actions) ){
			setBarText( str, "cmd" );
		    }
		} else if( info.key.length === 1 ){
		    state.str += info.key;
		    $.each( that.cmds, function( key, val ){
			if( !match( val, state.str ) && !match( key, state.str ) ){
			    //provide user feedback
			}
		    });
		}
		setBarText( state.str, "input" );
	    };
	},
	"escape": function(){
	    reset();
	    return {"bar":true};
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
	"toggle-chromemacs": function(){
	    //turn on/off chromemacs
	    state.unbind = !state.unbind;
	    return {"bar":true};
	},
	"display-help": function(){
	    var el = helpTable();
	    var help = $("#" + that.CONSTS.help );
	    if( help.length !== 0 ){
		help.fadeOut( 'fast', function(){
		    help.remove();
		});
		return;
	    }
	    var div = '<div id="' + that.CONSTS.help + '" style="display:none;"><div></div></div>';
	    $("body").append( div );
	    var help = $("#" + that.CONSTS.help );
	    help.find( "div" ).append( el ).bind( "click", function( ev ){
		    reset();
	    });
	    $("html").addClass( that.CONSTS.css.help );
	    help.fadeIn( 'fast' );
	    return {"bar":true};
	}
    };

    function helpTable(){
	var table = $("<table />"),tbody = $("<tbody />"),tr = $("<tr />"),
	td = $("<th />");
	
	td.text( "Keys" );
	tr.append( td );
	td = $("<th />");
	td.text( "Action" );
	tr.append( td );
	td = $("<th />");
	td.text( "Description" );
	tr.append( td );
	tbody.append( tr );

	for( var i in that.cmds ){
	    if( that.cmds.hasOwnProperty( i ) && 
		(that.cmds[i] in that._actions_) ){
		tr = $("<tr />");
		td = $("<td />");
		td.text( i );
		tr.append( td );
		td = $("<td />");
		td.text( that.cmds[i] );
		tr.append( td );
		td = $("<td />");
		td.text( that._actions_[that.cmds[i]] );
		tr.append( td );
		tbody.append( tr );
	    }
	}
	table.append( tbody );
	return table;
    }

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
	o.go = false;
	if( info.back ){
	    state.str = state.str.slice( 0, -1 );
	    setBarText( state.str, "input" );
	    o.go = true;
	} else if( info.key.length === 1 ){
	    state.str += info.key;
	    setBarText( state.str, "input" );
	    o.go = true;
	}
	if( o.go || info.enter ){
	    window.find( state.str, o.cs, o.back, o.wrap,
			 o.whole, o.frames, o.dialog );
	}
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
		    openUrl( state.cur.links[link].el.get(0).href );
		} else {
		    $.each( state.cur.links, function( key, val ){
			if( match( val.txt, state.str ) ){
			    openUrl( val.el.get(0).href );
			}
		    });
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
		    openUrl( r[0].el.get(0).href );
		}
	    }
	    setBarText( state.str, "input" );
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
	state = defaultState();
	$("*").removeClass( objToArr( that.CONSTS.css ).join( " " ) );
	$("#" + that.CONSTS.help ).fadeOut( 'fast', function(){
	    $(this).remove();
	});
	clearLinks();
	toggleBar( "hidden" );
	$(document.body).focus();
    }

    function clearLinks(){
	$("." + that.CONSTS.links ).remove();
    }

    function findLinks(){
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
	    if( which === "hidden" ){
		el.remove();
	    }
	} else {
	    el = $("<div />", {
		"id": that.CONSTS.bar_id
	    });
	    el.html( "<div></div><div></div><div></div>" );
	    $("body").append( el );
	}
	return el;
    }
    
    function setBarText( str, which ){
	var el = toggleBar( "visible" );
	if( which === "cmd" ){
	    el.find( "div:nth-child(1)" ).text( str );
	} else if( which === "info" ){
	    el.find( "div:nth-child(3)" ).text( str );
	} else {
	    el.find( "div:nth-child(2)" ).text( str );
	}
    }

    function defaultState(){
	return $.extend( true, {}, that.default_state );
    }

    function getDefaults(){
	that.chromeRequest( {"name":"getSettings"}, function( resp ){
	    var us = resp.settings;
	    for( var d in us ){
		if( us.hasOwnProperty( d ) ){
		    that[d] = us[d];
		}
	    }
	    state = defaultState();
	    keyreader = new KeyReader( that );
	    if( 'css' in that ){
		$("head").append( "<style>" + that.css + "</style>" );
	    }
	});
    }

    getDefaults();
}


//utility
function objToArr( obj ){
    var arr = [],i;
    for( i in obj ){
	arr.push( obj[i] );
    }
    return arr;
}

function match( haystack, needle ){
    return (haystack.search( new RegExp( "^" + needle + ".*" ) ) !== -1);
}

var chromEmacs = new ChromEmacs();
