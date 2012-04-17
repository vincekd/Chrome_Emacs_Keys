var util = {
    "remove-tab": function( tab, send ){
	chrome.tabs.remove( tab.id );
    },
    "new-tab": function( tab, send ){
	chrome.tabs.create({"active":true,
			    "pinned": false});
    },
    "go-to-tab": function( tab, send ){
	//chrome.tabs.update( tab.id, {"selected": true} );
    },
    "next-tab": function( tab, send ){
	var index = parseInt( tab.index, 10 );
	chrome.tabs.query({"index": (index+1),
			   "windowId":tab.windowId}, function( arr ){
	    if( arr.length > 0 ){
		chrome.tabs.update( arr[0].id, {"selected": true} );
	    } else {
		//wrap around
		chrome.tabs.query({"index":0,
				   "windowId":tab.windowId}, function( arr ){
		    if( arr.length > 0 ){
			chrome.tabs.update( arr[0].id, {"selected": true} );
		    }
		});
	    }
	});
    },
    "previous-tab": function( tab, send ){
	var index = parseInt( tab.index, 10 );
	if( index > 0 ){
	    chrome.tabs.query({"index": (index-1),
			       "windowId":tab.windowId}, function( arr ){
		if( arr.length > 0 ){
		    chrome.tabs.update( arr[0].id, {"selected": true} );
		} 
	    });
	} else {
	    //wrap around
	    chrome.tabs.query({"windowId":tab.windowId}, function( arr ){
		if( arr.length > 1 ){
		    //find biggest
		    var cur = arr[0];
		    for( var i = 0; i < arr.length; i++ ){
			if( arr[i].index > cur.index ){
			    cur = arr[i];
			}
		    }
		    chrome.tabs.update( cur.id, {"selected": true} );
		}
	    });
	}
    },
    "bookmark-page": function( tab, send ){
	chrome.bookmarks.getTree( function( arr ){
	    //adds to first one available - how better?
	    if( arr.length > 0 && arr[0].children.length > 0 ){
		chrome.bookmarks.create({
		    'title': tab.title,
		    'url': tab.url,
		    'parentId': arr[0].children[0].id
		});
	    }
	});
    },
    "find-links-new-tab": function( tab, send, req ){
	chrome.tabs.create({"active":false,
			    "pinned": false,
			    "url":req.url,
			    "openerTabId":tab.id
			   });
    }
};

var options = {
    "getSettings": function( tab, send, req ){
	var uv = settings.returnUserValues();
	send( {"settings":uv} );
    },
    "addUserCmd": function( tab, send, req ){
	settings.addUserCmd( req.cmd, req.action );
    },
    "removeUserCmd": function( tab, send, req){
	settings.removeUserCmd( req.cmd );
    },
    "addExclusion": function( tab, send, req ){
	settings.addExclusion( req.ex );
    },
    "removeExclusion": function( tab, send, req ){
	settings.removeExclusion( req.ex );
    },
    "setNoDefaults": function( tab, send, req ){
	settings.setNoDefaults( req.no_def );
    },
    "clearUserData": function( tab, send, req ){
	settings.clearUserData();
    },
    "getActions": function( tab, send, req ){
	var acts = settings.getActions();
	send( {"actions": acts} );
    }
}

var settings = new Settings();

chrome.extension.onRequest.addListener(
    function( request, sender, send ){
	if( util.hasOwnProperty( request.name ) ){
	    util[request.name]( sender.tab, send, request );
	} else if( options.hasOwnProperty( request.name ) ){
	    options[request.name]( sender.tab, send, request );
	} else {
	    send( {"success": false} );
	}
    });
