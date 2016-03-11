Meteor.startup(function() {

	Agents.IaMessages.remove({});
	Agents.IaDisplaySet.remove({});
	Agents.IaRecommendedSet.remove({});
	Agents.IaOnSalesSet.remove({});
	Agents.IaClientSet = [];


	//Meteor.call("init");
	Agents.addRulesRegistry(Agents.flowName, "private/rules/server/arts/arts.js");
	Agents.flow = Agents.rulesRegistry[Agents.flowName].flow;
	Agents.session = Agents.flow.getSession();

	Agents.addRulesRegistry("arts", "private/rules/server/arts/arts.js");
	Agents.addRulesRegistry("dentist", "private/rules/server/dentist/dentist.js");

	Agents.IaMessages.find().observe({
		added: function(message) {
			if (message.receiver === "server" && message.group && Agents.rulesRegistry[message.group].session) {
				Agents.rulesRegistry[message.group].session.assert(new Agents.IaMessage(message));
				Agents.rulesRegistry[message.group].session.match();
			}
		}
	});

	// Turn on to be "true" when you need
	// to init products and tags data.
	var INIT_PRODUCTS = false; 

	if (INIT_PRODUCTS) {

		(function() {
			var str = Assets.getText(Agents.tagsFile);
			var arr = JSON.parse(str);
			ReactionCore.Collections.Tags.remove({});
			arr.forEach(function(el, i, arr) {
				ReactionCore.Collections.Tags.insert(el);
			});
		})();

		(function() {
			var str = Assets.getText(Agents.productsFile);
			var arr = JSON.parse(str);
			ReactionCore.Collections.Products.remove({});
			arr.forEach(function(el, i, arr) {
				ReactionCore.Collections.Products.insert(el);
			});
		})();
	}

});
