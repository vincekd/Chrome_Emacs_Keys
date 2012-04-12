function KeyReader( emacs ){
    
    var that = this;
    var state = emacs.state;

    this.init = function(){
	document.addEventListener( "keydown", keydown, true );
	document.addEventListener( "keyup", keyup, true );
	document.addEventListener( "keypress", keypress, true );
    };

    function keydown( ev ){
	if( ! state.keydown ){
	    return;
	}
	//var str = getKeyInfo( ev );
	var action,str = getKeyInfo( ev );
	emacs.addInput( str );
	action = emacs.evalState();
	if( action === false ){
	    emacs.clearInput()
	    return;
	}
	stopEvent( ev );
	if( action === true ){
	    return;
	}
	emacs.executeInput( action );
    }

    function keyup( ev ){
	if( ! state.keyup ){
	    return;
	}
    }

    function keypress( ev ){
	if( ! state.keypress ){
	    return;
	}
    }
    
    function stopEvent( ev ){
	if( state.no_def ){
	    ev.preventDefault();
	}
	if( state.no_prop ){
	    ev.stopPropagation();
	}
	return false;
    }

    function getKeyInfo( ev ){
	//return ctrl, alt, meta, shift, & letter

	/*
	var key,str = ev.ctrlKey ? "C-" : "";
	if( ev.altKey || ev.metaKey ){
	    str += "M-";
	}*/

	/*var key,info = {
	    "ctrl": ev.ctrlKey,
	    "alt": ev.altKey,
	    "shift": ev.shiftKey,
	    "meta": ev.metaKey,
	    "esc": false,
	    "key": ""
	};*/
	var key,str = ev.ctrlKey ? (emacs.modifiers["Control"]||"") : "";
	str += ev.altKey ? (emacs.modifiers["Alt"]||"") : "";
	str += ev.metaKey ? (emacs.modifers["Meta"]||"") : "";

	key = ev.keyIdentifier; 
	if( key.slice( 0, 2 ) !== "U+" ){
	    //return key;
	    //info.key = emacs.modifiers[key] || ""; //key
	    return "";
	} else if( that.correctKeys.hasOwnProperty( key ) ){
	    key = ev.shiftKey ? that.correctKeys[key][1] : 
		that.correctKeys[key][0];
	}
	
	key = "0x" + key.slice( 2 );
	key = String.fromCharCode( parseInt( key, 16 ) );
	key = ev.shiftKey ? key : key.toLowerCase();
	
	str += key;

	return str;
    }
}

KeyReader.prototype = {
    //keys don't work correctly on windows/linux?
    "correctKeys": {
	"U+00C0": ["U+0060", "U+007E"], // `~
	"U+00BD": ["U+002D", "U+005F"], // -_
	"U+00BB": ["U+003D", "U+002B"], // =+
	"U+00DB": ["U+005B", "U+007B"], // [{
	"U+00DD": ["U+005D", "U+007D"], // ]}
	"U+00DC": ["U+005C", "U+007C"], // \|
	"U+00BA": ["U+003B", "U+003A"], // ;:
	"U+00DE": ["U+0027", "U+0022"], // '"
	"U+00BC": ["U+002C", "U+003C"], // ,<
	"U+00BE": ["U+002E", "U+003E"], // .>
	"U+00BF": ["U+002F", "U+003F"] // /?
    }
};
