function Chromemacs(){
    
    //private
    var that = this;
    var keyreader = new KeyReader( that );
    
    //priviledged
    /*that.state = {
	"keydown": true,   //read keydown
	"keyup": false,    //read keyup
	"keypress": false, //read keypress
	"no_def": true,    //prevent default
	"no_prop": true,   //stop propagation
	"str": ""
    };*/


    //do these onload
    (function(){
	//$.ready( keyreader.init );
    }());


    keyreader.init();
}

Chromemacs.prototype = {
    "state": {
	"keydown": true,   //read keydown
	"keyup": false,    //read keyup
	"keypress": false, //read keypress
	"no_def": true,    //prevent default
	"no_prop": true,   //stop propagation
	"str": ""
    },
    "addStr": function( str ){
	if( str === "" ){ return; }
	this.state.str=this.state.str===""?str:this.state.str+"-"+str;
    }
};

var chromemacs = new Chromemacs();

