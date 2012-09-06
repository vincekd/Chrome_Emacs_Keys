function KeyReader( emacs ){
    
    var that = this;
    document.addEventListener( "keydown", keyread, true );
    document.addEventListener( "keyup", keyread, true );
    document.addEventListener( "keypress", keyread, true );

    function keyread( ev ){
	stopEvent( ev, emacs.evalInput( getKeyInfo( ev ) ) );
    }

    function stopEvent( ev, state ){
	if( state.no_def ){
	    ev.preventDefault();
	}
	if( state.no_prop ){
	    ev.stopPropagation();
	}
	return false;
    }

    function getKeyInfo( ev ){

	var key,info = {
	    "ctrl": ev.ctrlKey,
	    "alt": ev.altKey,
	    "shift": ev.shiftKey,
	    "meta": ev.metaKey,
	    "enter": false,
	    "back": false,
	    "esc": false,
	    "type": ev.type,
	    "key": "",
	    "cmd": ""
	};

	key = info.key = ev.keyIdentifier;
	if( ev.keyCode === 27 ){ //escape char
	    info.esc = true;
	    info.cmd = key;
	    return info;
	} else if( ev.keyCode === 8 ){ //backspace
	    info.back = true;
	    info.cmd = key;
	    return info;
	} else if( ev.keyCode === 13 ){
	    info.enter = true;
	    info.cmd = key;
	    return info;
	}


	if( key.slice( 0, 2 ) !== "U+" ){
	    return info;
	} else if( key in that.correctKeys ){
	    key = ev.shiftKey ? that.correctKeys[key][1] : 
		that.correctKeys[key][0];
	}
	
	key = "0x" + key.slice( 2 );
	key = parseInt( key, 16 );



	key = String.fromCharCode( key );
	key = ev.shiftKey ? key : key.toLowerCase();
	info.key = key;
	getModified( info );
	return info;
    }

    function getModified( obj ){
	var str = obj.ctrl ? (emacs.modifiers["Control"]||"") : "";
	str += obj.alt ? (emacs.modifiers["Alt"]||"") : "";
	str += obj.meta ? (emacs.modifiers["Meta"]||"") : "";
	str += obj.key;
	obj.cmd = str;
    }

    //keys don't work correctly on windows/linux?
    this.correctKeys = {
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
    };
    
}
