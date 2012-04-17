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
getActions();
getSettings();
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
	    "type": "button"
	});
	butt.text( "Delete" );
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

