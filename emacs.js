function Chromemacs(){
    
    //private
    var that = this;
    that.state = that.defaultState();
    var actions = new Actions();
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

    this.executeInput = function( action ){
	if( ! actions[action] ){
	    console.log( "No such command" );
	    return false;
	}
	actions[action]();
	that.clearInput();
    }

    keyreader.init();
}

Chromemacs.prototype = {
    "defaultState": function(){
	return {
	    "keydown": true,   //read keydown
	    "keyup": false,    //read keyup
	    "keypress": false, //read keypress
	    "no_def": true,    //prevent default
	    "no_prop": true,   //stop propagation
	    "str": ""
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

var chromemacs = new Chromemacs();

//utilities
function trim( str ){
    return str.replace( /^\s+/, "" ).replace( /\s+$/, "" );
}