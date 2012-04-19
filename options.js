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
	window.location.reload();
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

function updateUserCmd( cmd, action, old ){
    var obj = {
	"name": "updateUserCmd",
	"cmd": cmd,
	"old": old,
	"action": action
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );    
    });
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

function setNoDefaults( tf ){ //bool
    var obj = {
	"name": "setNoDefaults",
	"no_def": tf
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );
    });
}

function setUserCSS( css ){
    var obj = {
	"name": "setUserCSS",
	"css": css
    };
    chrome.extension.sendRequest( obj, function( resp ){
	console.log( resp );
    });
}

var settings;
getSettings();
var cmds = $("#keybindings");
var css = $("#emacs_css");
var defs = $("#chrome_defaults");
var exclusions = $("#excluded_domains");

function setUp(){
    //add bindings for buttons
    var tr,keys,cmd,el,save,butt;

    //set no default after we get settings returned
    if( settings.no_defaults === true ){
	defs.attr( "checked", "checked" );
    } else {
	defs.removeAttr( "checked" );
    }

    //set user styles
    $("#emacs_css").val( settings.css );

    //set user CMDS
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
	butt.bind( "click", editSaveCmd );
	save.append( butt );
	//TODO: replace text with disabled select
	keys.text( i );
	cmd.text( settings.cmds[i] );
	tr.append( keys ).append( cmd ).append( save );
	el.append( tr );
    }
}

function buildActionSelect( def ){
    var el = $("<select />", {

    });
    var opt = $("<option />");
    el.append( opt );
    for( var i in settings._actions_ ){
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

function editSaveCmd( ev ){
    if( ev.button !== 0 ){ return; }
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
	tr.attr( "cmd", inp.text() );
	tr.attr( "action", cmd.text() );
	inp.html( input );
	var select = buildActionSelect( cmd.text() );
	cmd.html( select );
	el.text( "Save" );
    } else {

	var tr = el.parents( "tr" ),
	inp = tr.children(":nth-child(1)"),
	cmd = tr.children(":nth-child(2)"),
	c = $.trim( inp.find("input").first().val() ),
	d = $.trim( cmd.find( "select" ).val() ),
	action = $.trim( tr.attr( "action" ) ),
	old = $.trim( tr.attr( "cmd" ) );

	if( action === d && c === old ){
	    console.log( ctrl )
	} else if( c === "" ){
	    removeUserCmd( old );
	    tr.remove();
	} else if(d === "" ){
	    return false;
	} else {
	    updateUserCmd( c, d, old );
	}
	inp.text( c );
	cmd.text( d );
	el.text( "Edit" );
    }
}

$(document).ready(function(){
    //initiate accordion
    $("#accordion").children().each(function( i, el ){
	el = $(el);
	var first = el.children( ":nth-child(1)" );
	var last = el.children( ":nth-child(2)" );
	last.hide();
	first.bind( "click", function( ev ){
	    if( ev.button !== 0 ){ return; }
	    var d = $(ev.currentTarget);
	    d.parent().children( ":nth-child(2)" ).slideToggle('slow');
	});
    });

    //chrome defaults on/off
    $("#chrome_defaults").bind( "click", function( ev ){
	if( ev.button !== 0 ){ return; }
	var d = $(ev.currentTarget);
	var l = (d.attr( "checked" ) === "checked") ? true : false;
	setNoDefaults( l );
    });

    //clear user data
    $("#clearUserData").bind( "click", function( ev ){
	if( ev.button !== 0 ){ return; }
	var con = confirm( "Are you sure you want to clear all your data?" );
	if( con === true ){
	    clearUserData();
	}
    });

    //Add new keybinding
    $("#add_new_cmd").bind( "click", function( ev ){
	if( ev.button !== 0 ){ return; }
	var tr = $("<tr/>"),
	keys = $("<td/>"),
	cmd = $("<td/>"),
	save = $("<td/>", {
	    "class": "Confirm_Cmd"
	}),
	butt = $("<button/>", {
	    "type": "button",
	});
	butt.text( "Edit" );
	butt.bind( "click", editSaveCmd );
	tr.append( keys ).append( cmd ).append( butt );
	$("#cmds").append( tr );
    });

    //user css
    $("#save_user_css").bind( "click", function( ev ){
	var el = $(ev.currentTarget).siblings( "textarea" );
	setUserCSS( el.val() );
    });

});