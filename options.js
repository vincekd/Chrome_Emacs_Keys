function getSettings(){
    var obj = {
	"name": "getSettings"
    };
    chrome.extension.sendRequest( obj, function( resp ){
	settings = resp.settings;
	setUp();
    });
}

function clearUserData(){
    var obj = {
	"name": "clearUserData"
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp ); 
    });
}

function addUserCmd( cmd, action ){
    var obj = {
	"name": "addUserCmd",
	"cmd": cmd,
	"action": action
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );    
    });
};

function updateUserCmd( cmd, old ){
    //do stuff
}

function removeUserCmd( cmd ){
    var obj = {
	"name": "removeUserCmd",
	"cmd": cmd
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );    
    });
}

function addExlusion( ex ){
    var obj = {
	"name": "addExlusion",
	"ex": ex
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );    
    });
}

function removeExlusion( ex ){
    var obj = {
	"name": "removeExlusion",
	"ex": ex
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );
    });
}

function getActions(){
    var obj = {
	"name": "getActions"
    };
    chrome.extension.sendRequest( obj, function( resp ){
	actions = resp.actions;
    });
}

function setNoDefaults( tf ){ //bool
    var obj = {
	"name": "setNoDefaults",
	"no_def": tf
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );
    });    
}

var actions,settings;
getSettings();
getActions();
var cmds = $("#keybindings");
var css = $("#emacs_css");
var defs = $("#chrome_defaults");
var exclusions = $("#excluded_domains");

function setUp(){
    //add bindings for buttons
    var tr,keys,cmd,el,save,butt;

    if( settings.no_defaults === true ){
	defs.attr( "checked", "checked" );
    } else {
	defs.removeAttr( "checked" );
    }

    el = $("#cmds");
    for( var i in settings.cmds ){
	tr = $("<tr/>");
	keys = $("<td/>");
	cmd = $("<td/>");
	save = $("<td/>", {
	    "class": "Confirm_Cmd"
	});
	butt = $("<button/>", {
	    "type": "button",
	});
	butt.text( "Edit" );
	butt.bind( "click", function( ev ){
	    var el = $(ev.currentTarget);
	    if( el.text() === "Edit" ){
		var tr = el.parents( "tr" );
		var inp = tr.children(":nth-child(1)");
		var cmd = tr.children(":nth-child(2)");
		var input = $("<input/>", {
		    "type":"text",
		    "class": "cmd_input"
		});
		input.val( inp.text() );
		inp.html( input );
		var select = buildActionSelect( cmd.text() );
		cmd.html( select );
		el.text( "Save" );
	    } else {
		var tr = el.parents( "tr" )
		var inp = tr.children(":nth-child(1)");
		var cmd = tr.children(":nth-child(2)");
		var c = inp.find("input").first().val();
		var d = cmd.find( "select" ).val();
		if( c === "" ){
		    //error
		    return false;
		    //throw new Error();
		} else if( d === "" && c !== "" ){
		    removeUserCmd( c );
		    tr.remove();
		    return;
		} else {
		    //how?
		    updateUserCmd( c, c ); //?
		}
		inp.text( c );
		cmd.text( d );
		el.text( "Edit" );
	    }
	});
	save.append( butt );
	keys.text( i );
	cmd.text( settings.cmds[i] );
	tr.append( keys ).append( cmd ).append( save );
	el.append( tr );
    }
    tr = $("<tr/>");
    cmd = $("<td/>", {
	"colspan": 3,
    });
    butt = $("<button/>",{
	"type": "button",
	"id": "add_new_cmd"
    });
    butt.text( "Add new keybinding" );
    cmd.append( butt );
    tr.append( cmd );
    el.append( tr );
}

function buildActionSelect( def ){
    var el = $("<select />", {

    });
    var opt = $("<option />");
    el.append( opt );
    for( var i in actions ){
	opt = $("<option />", {
	    "value": i
	});
	if( i === def ){
	    opt.attr( "selected", "selected" );
	}
	opt.text( i );
	el.append( opt );
    }
    return el;
}

$(document).ready(function(){
    $("#accordion").children().each(function( i, el ){
	el = $(el);
	var first = el.children( ":nth-child(1)" );
	var last = el.children( ":nth-child(2)" );
	last.hide();
	first.bind( "click", function( ev ){
	    var d = $(ev.currentTarget);
	    d.parent().children( ":nth-child(2)" ).slideToggle('slow');
	});
    });
    
    $("#chrome_defaults").bind( "click", function( ev ){
	var d = $(ev.currentTarget);
	var l = (d.attr( "checked" ) === "checked") ? true : false;
	setNoDefaults( l );
    });

});