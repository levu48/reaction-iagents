

Router.map(function() {
	return this.route('dashboard/agents', {
		controller: ShopAdminController,
		path: 'dashboard/agents',
		template: 'agents',
		/*
		waitOn: function() {
			return ReactionCore.Subscriptions.Packages;
		},
		subscriptions: function() {
			return Meteor.subscribe("Agents");
		}
		*/
	});
});

Router.map(function() {
	return this.route('agents/demo/arts', {
		controller: ShopController,
		path: 'agents/demo/arts',
		template: 'demoArts',
		data: { "group": "arts" }
	});
});

Router.map(function() {
	return this.route('agents/demo/dentist', {
		controller: ShopController,
		path: 'agents/demo/dentist',
		template: 'demoDentist',
		data: { "group": "dentist"}
	});
});

Router.map(function() {
	return this.route('agents/demo/search', {
		controller: ShopController,
		path: 'agents/demo/search',
		template: 'demoSearch',
		data: { "group": "search"}
	});
});

Router.map(function() {
	return this.route('agents/test', {
		controller: ShopController,
		path: 'agents/test',
		template: 'test',
		data: { "group": "test"}
	});
});
