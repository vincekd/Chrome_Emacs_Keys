var util = {
    "remove-tab": function( tab, send ){
	chrome.tabs.remove( tab.id );
    },
    "new-tab": function( tab, send ){
	chrome.tabs.create({"active":true,
			    "pinned": false});
    },
    "go-to-tab": function( tab, send ){
	chrome.tabs.update( tab.id, {"selected": true} );
    },
    "next-tab": function( tab, send ){
	chrome.tabs.query({"index": (tab.index+1)}, function( arr ){
	    if( arr.length > 0 ){
		chrome.tabs.update( arr[0].id, {"selected": true} );
	    } else {
		//wrap around
		chrome.tabs.query({"index":0}, function( arr ){
		    if( arr.length > 0 ){
			chrome.tabs.update( arr[0].id, {"selected": true} );
		    }
		});
	    }
	});
    },
    "previous-tab": function( tab, send ){
	if( (tab.index-1) >= 0 ){
	    chrome.tabs.query({"index": (tab.index-1)}, function( arr ){
		if( arr.length > 0 ){
		    chrome.tabs.update( arr[0].id, {"selected": true} );
		} 
	    });
	} else {
	    //wrap around
	    chrome.tabs.query({}, function( arr ){
		send( {"tabs":"hi"} );
		if( arr.length > 0 ){
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
    }
};

chrome.extension.onRequest.addListener(
    function( request, sender, send ){
	if( util.hasOwnProperty( request.name ) ){
	    util[request.name]( sender.tab, send );
	} else {
	    send( {"success": false} );
	}
    });
