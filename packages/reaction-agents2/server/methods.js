
Meteor.methods({

	'init': function() {
		Agents.flow = nools.getFlow(Agents.flowName);
		Message = Agents.IaMessage;

		if (!Agents.flow) {
			var content = Assets.getText(Agents.ruleFile); // sync
			Agents.flow = nools.compile(content, {
				name: Agents.flowName,
				define: {
					Message: Message
				},
				scope: {
					Fibers: Fibers,
					Agents: Agents
				}
			});
		}

		Agents.Info = Agents.flow.getDefined("Info");
		Agents.session = Agents.flow.getSession();
		//session.dispose();

		var info = new Agents.Info();
		info.username = "Owner";
		info.text = "hello world";
		Agents.session.assert(info);
		Agents.session.match();
		console.log("NOOLS session: " + Agents.session, Agents.session.getFacts());
	},

	'writeFile': function(fileName, str) {
		var buf = new Buffer(str);

		fs.writeFile(Agents.__SERVER_ROOT_DIR + "/packages/reaction-agents/" + fileName, buf);
		console.log(Agents.__SERVER_ROOT_DIR + "/packages/reaction-agents/" + fileName);
	},

	'dbInsert2': function(obj) {
		var mesg = new Agents.IaMessage(obj);
		mesg.dbInsert();	
		
		//Meteor.wrapAsync(function(function(err,res) {}) {
		//var boundFunction = Meteor.bindEnvironment(function() {
			//var mesg = new Agents.IaMessage(obj);
			//mesg.dbInsert();	
		//}, function(e) { throw e; });
		//boundFunction();
		//});
		
	},


	'dbReset': function(group) {
		Agents.IaMessages.remove({group: group});
		Agents.IaDisplaySet.remove({});
		Agents.IaRecommendedSet.remove({});
		Agents.IaOnSalesSet.remove({});
		Agents.IaClientSet = [];
	},


	'dbInsert': function(mesg) {
		Agents.IaMessages.insert(mesg, function(err, res) {
			if ( err ) console.log ( "IaMessages.insert: ERROR = " + err ); 
    		if ( res ) console.log ( "IaMessages.insert: RESULT = " + res, ", " + mesg.info.ctx ); 
		});
	},

	'getDisplaySet': function() {
		return Agents.displaySet;
	},

	'run': function(e) {
		console.log("start run on server ...");
		session.match(function(err){
		    if(err){
		        console.error(err.stack);
		    }else{
		        console.log("done run on server.");
		    }
		})
	}

});

Agents.map = function() {
	if (str == 'hi' || str == 'hello') return 'greet';
	else if (str == 'yes' || str == 'ok') return 'agree';
	else if (str == 'buy' ) return 'buy';
	else if (str == 'sell' ) return 'sell';
}