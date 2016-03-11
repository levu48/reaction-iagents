Package.describe({
	summary: "Reaction Agents - Rule-based expert systems for Reaction Commerce.",
	name: "levu48:reaction-agents",
	version: "0.0.5",
	git: "https://github.com/levu48/reaction-agents.git"
});

Package.onUse(function(api) {
	api.versionsFrom('METEOR@1.2');
	api.use("meteor-platform@1.2.1");
	api.use("templating");
	api.use("less");
	api.use("reactioncommerce:core@0.9.0",["client","server"]);
	api.use("http");
	api.use("meteorhacks:npm");
	///api.use("npm-container");

	api.export("Agents");
	//api.addFiles('private/rules/server/expert.js', 'server', {isAsset: true});
	//api.addFiles('private/rules/server/arts/arts.js', 'server', {isAsset: true});
	//api.addAssets('private/rules/server/expert.js', 'server');
	api.addAssets('private/rules/server/expert.js', 'server');
	api.addAssets('private/rules/server/arts/arts.js', 'server');
	api.addAssets('private/rules/server/dentist/dentist.js', 'server');
	api.addAssets('private/data/products.txt', 'server');
	api.addAssets('private/data/tags.txt', 'server');

	api.addFiles([
		"common/models.js",
		"common/mapping.js",
		"common/collections.js", // any unique collections
		"common/routing.js" // add routing for administration templates
	], ["client", "server"]);

	api.addFiles([
		"server/register.js",
		"server/methods.js",
		"server/startup.js"
	], ["server"]); // register as a reaction package

	api.addFiles([
		"client/templates/head/head.html",
		
		"client/subscriptions.js",
		"client/commands.js",
	    "client/templates/agents.html",

	    "client/templates/demo/common.html",
	    "client/templates/settings/settings.html",

	    "client/templates/demo/arts/arts.html",
	    "client/templates/demo/arts/arts.js",

	   	"client/templates/demo/dentist/dentist.html",
	   	"client/templates/demo/dentist/dentist.js",

	   	"client/templates/demo/search/search.html",
	   	"client/templates/demo/search/search.js",

	   	"client/templates/settings/settings.js",
	   	"client/templates/layout/header/header.html",
	   	"client/templates/layout/layout.html",

	    "client/templates/test/test.html",
	    "client/templates/test/test.js"
	], ["client"]);
});
