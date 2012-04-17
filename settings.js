function Settings( emacs ){
    "use strict";
    var uv;
    var defaults = {
	"cmds": {
	    "<C>-D": "find-links-this-tab",
	    "<C>-d": "find-links-new-tab",
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
	    "<ESC> <ESC>": "escape",
	    "<C>-x <C>-x": "remove-tab",
	    "<M>-c": "new-tab",
	    "<M>-n": "next-tab",
	    "<M>-b": "previous-tab",
	    "<C>-<M>-b": "bookmark-page",
	    "<M>-u": "toggle-chromemacs",
	    "<M>-q": "no-defaults"
	},
	"modifiers": {
	    "Control": "<C>-",
	    "Alt": "<M>-",
	    "Meta": "<M>-",
	    "Win": "<M>-",
	    "ESC": "<ESC>"
	},
	"defaultState": function(){
	    return $.extend(true, {}, defaultState);
	},
	"CONSTS": {
	    "links": "ChromEmacs_Links",
	    "links_span": "ChromEmacs_Links_Span",
	    "bar_id": "ChromEmacs_Bar",
	    "search": "ChromEmacs_Search",
	    "css": {
		"search": "ChromEmacs_Search"
	    }
	},
	"exclusions":[]
    },
    defaultState = (function(){
	var def = {
	    "keydown": true,   //read keydown
	    "keyup": 0,    //read keyup
	    "keypress": 0, //read keypress
	    "no_defaults": false,    //prevent default
	    "bar": false,      //task bar enabled
	    "read_keys": false,
	    "str": "",
	    "cmd": "",
	    "fn": null,
	    "unbind":false,
	    "cur": {
		"links": {},
		"discards": {},
		"sopts": {
		    "cs": false,
		    "back": false,
		    "wrap": true,
		    "whole": false,
		    "frames": true,
		    "dialog": false
		}
	    },
	    "operation": "",
	};
	return def;
    }());

    this.addUserCmd = function( key, action ){
	//localStorage['cmds'][key] = action;
	uv['cmds'][key] = action;
	save();
    };

    this.removeUserCmd = function( key ){
	delete uv['cmds'][key];
    };

    this.clearUserData = function(){
	localStorage.clear();
    };

    function save(){
	localStorage['user_values'] = JSON.stringify( uv );
    }

    this.show = function(){
	console.log( uv );
    };
    
    this.init = function(){

	if( 'user_values' in localStorage ){
	    uv = JSON.parse( localStorage.user_values );
	} else {
	    uv = $.extend( true, {}, defaults );
	    save();
	}

	for( var d in uv ){
	    if( uv.hasOwnProperty( d ) ){
		if( emacs ){
		    emacs[d] = uv[d];
		}
	    }
	}
    };
    this.init();
}
