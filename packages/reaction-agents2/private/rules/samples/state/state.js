var nools = require("nools");

var flow = nools.compile(__dirname + "/state.nools");
flow.conflictResolution(["salience", "factRecency", "activationRecency"]);
var State = flow.getDefined("State");

console.log("START");
var fired = [];

flow.getSession(
	new State("A", "NOT RUN"),
	new State("B", "NOT RUN"),
	new State("C", "NOT RUN"),
	new State("D", "NOT RUN")
	)
	.on("fire", function(ruleName) {
		fired.push(ruleName);
	})
	.match()
	.then(function() {
		console.log(fired);
	});
