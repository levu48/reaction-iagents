var nools = require("nools");

var flow = nools.compile(__dirname + "/halt.nools");
console.log("START");
var session = flow.getSession();
session.matchUntilHalt().then( 
	function() {
		console.log("ALL DONE");
	}, 
	function(err) {
		console.log(err.stack);
	});