function Settings( emacs ){
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
	    return $.extend({}, defaultState);
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
    }()),
    user_values = {
	
    };

    function getUserValues(){
	for( var i in defaults ){
	    if( i in localStorage ){
		user_values[i] = localStorage[i];
	    } else {
		user_values[i] = defaults[i];
	    }
	}
    }

    this.init = function(){
	getUserValues();
	for( var i in user_values ){
	    if( user_values.hasOwnProperty( i ) ){
		emacs[i] = user_values[i];
	    }
	}
    };
    this.init();
}
