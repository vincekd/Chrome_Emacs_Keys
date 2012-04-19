function Settings(){
    "use strict";
    var uv;
    var emacs = null;
    var defaults = {
	"cmds": {
	    "<C>-x <C>-f": "find-links-this-tab",
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
	    "<C>-x <C>-c": "remove-tab",
	    "<M>-c": "new-tab",
	    "<M>-n": "next-tab",
	    "<M>-b": "previous-tab",
	    "<C>-<M>-b": "bookmark-page",
	    "<M>-u": "toggle-chromemacs",
	    "<M>-q": "no-defaults",
	    "<C>-h": "display-help"
	},
	"modifiers": {
	    "Control": "<C>-",
	    "Alt": "<M>-",
	    "Meta": "<M>-",
	    "Win": "<M>-",
	    "ESC": "<ESC>"
	},
	"CONSTS": {
	    "links": "ChromEmacs_Links",
	    "links_span": "ChromEmacs_Links_Span",
	    "help": "ChromEmacs_Help",
	    "bar_id": "ChromEmacs_Bar",
	    "search": "ChromEmacs_Search",
	    "css": {
		"search": "ChromEmacs_Search",
		"help": "ChromEmacs_Help_Html"
	    }
	},
	"exclusions": [],
	"no_defaults": false,
	"default_state": {
	    "keydown": true,   
	    "keyup": 0,    
	    "keypress": 0, 
	    "bar": false,      
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
	    "operation": ""
	},
	//add to here if new user editable css is added
	"css": "/* Input Bar */\n#ChromEmacs_Bar{\n\n}\n/* Searching Links Color */\n.ChromEmacs_Links{\n\n}\n/* Links number values that have been matched */\n.ChromEmacs_Links_Span{\n\n}\n/* Nothing yet */\n.ChromEmacs_Search{\n\n}\n",
	//add to these when actions are added
	"_actions_": {
	    "no-defaults": "Toggle no defaults on/off",
	    "scroll-to-bottom": "Scroll to bottom of page",
	    "scroll-to-top": "Scroll to top of page",
	    "scroll-to-far-right": "Scroll to far right",
	    "scroll-to-far-left": "Scroll to far left",
	    "scroll-left": "Scroll left by 15px",
	    "scroll-right": "Scroll right by 15px",
	    "previous-line": "Scroll up by 15px",
	    "next-line": "Scroll down by 15px",
	    "scroll-down": "Scroll down by page length",
	    "scroll-up": "Scroll up by page length",
	    "find-links-this-tab": "Find links and open them on this tab",
	    "find-links-new-tab": "Find links and open them in a new tab",
	    "search-page": "Search page for a string",
	    "search-regex": "Search page for regex",
	    "execute-command": "Toggle input bar and type in command",
	    "escape": "Quit current operation",
	    "forward-history": "Go forward in your history",
	    "back-history": "Go back in your history",
	    "refresh-tab": "Reload current page",
	    "search-bookmarks": "Search bookmarks and open page",
	    "toggle-chromemacs": "Toggle chromemacs on/off for current page",
	    "remove-tab": "Quit current tab",
	    "new-tab": "Open a new tab",
	    "go-to-tab": "Go to tab in current window by index number",
	    "next-tab": "Go to next tab index or wrap around",
	    "previous-tab": "Go to previous tab index or wrap around",
	    "display-help": "Display help on current page"
	}

    };

    this.addUserCmd = function( key, action ){
	//add key validation
	uv['cmds'][key] = action;
	save();
    };

    this.removeUserCmd = function( key ){
	delete uv['cmds'][key];
	save();
    };

    this.updateUserCmd = function( key, action, old ){
	//add key validation
	delete uv['cmds'][old];
	uv['cmds'][key] = action;
	save();
    };

    this.clearUserData = function(){
	localStorage.clear();
	this.init();
    };
    
    this.addExclusion = function( str ){
	uv.exclusions.push( str );
	save();
    };

    this.removeExclusion = function( str ){
	uv.exclusions.splice( uv.indexOf( str ), 1 );
	save();
    };

    this.setNoDefaults = function( bool ){
	uv.no_defaults = (bool == true) ? true : false;
	save();
    };

    this.setUserCSS = function( css ){
	uv.css = css;
	save();
    };

    this.returnUserValues = function(){
	return uv;
    };

    function save(){
	localStorage['user_values'] = JSON.stringify( uv );
    }
    
    this.init = function(){
	if( 'user_values' in localStorage ){
	    uv = JSON.parse( localStorage.user_values );
	} else {
	    uv = $.extend( true, {}, defaults );
	    save();
	}
    };

    this.init();
}
