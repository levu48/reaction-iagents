var nools = require("nools");

var flow = nools.compile(__dirname + "/focus.nools");
var Message = flow.getDefined("Message");

console.log("START");
var fired = [];

flow.getSession(new Message("hello"))
	//.focus("ag1")
	//.focus("ag2")
	.on("fire", function(ruleName) {
		fired.push(ruleName);
	})
	.match(function() {
		console.log(fired);
	});
