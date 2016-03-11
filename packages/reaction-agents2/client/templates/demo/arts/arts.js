Template.demoArts.events({
	'click .command': function(e) {
		var el = document.getElementById('commandText');
		if (el !== null) {
			var str = el.value;
		    processCommand(str);
		}
		el.value = "";
		el.focus();
	}
});

Template.demoArts.helpers({	
	messages: function() {
		return Agents.IaMessages.find({group: "arts"}, {sort: {ts: -1}});
	},

	formOptions: function() {
		return this.info.form.options;
	}
});

Template.registerHelper( "equals", function(v1, v2) {
	return (v1 === v2);
});

Template.registerHelper( "getImageName", function(prodId) {
	return ReactionCore.Collections.Media.find({"metadata.productId":prodId}).fetch()[0].original.name;
});

Template.registerHelper("getProductPriceRange", function(prodId) {
	return getProductPriceRange(prodId);
});

Template.registerHelper("getOnSalesPrice", function(prodId) {
	return 0.5 * getProductPriceRange(prodId);
});

Template.registerHelper("getImageId", function(prodId) {
	return ReactionCore.Collections.Media.find({"metadata.productId":prodId}).fetch()[0]._id;
});

Template.registerHelper("getProductTitle", function(prodId) {
	//return ReactionCore.Collections.Products.findOne(prodId).title;
	return ReactionCore.Collections.Products.findOne(prodId).metafields[0]["value"];
});

Template.registerHelper("getProductAuthor", function(prodId) {
	return ReactionCore.Collections.Products.findOne(prodId).metafields[1]["value"];
});

Template.registerHelper("getMinPrices", function() {
	if (!Session.get("minPrices"))
		return null;

	var quantity = Session.get("minPrices");
	var arr = Agents.IaDisplaySet.find().fetch();

	for (var i=0; i<arr.length; i++) {
		var price = getProductPriceRange(arr[i]._id);

		if (typeof price === 'string') {
			var str = price.split("-");
			arr[i].price = parseFloat(str[0].trim());

		} else {
			arr[i].price = price;
		}
	}

	var res = arr.sort(function(a,b) {
					if (a.price > b.price) return 1;
					if (a.price < b.price) return -1;
					return 0;
				});

	if (res.length  > quantity) 
		return res.splice(0, quantity);
	return res;
});

Template.productsListing.helpers({
	products: function() {
		return ReactionCore.Collections.Products.find();
	},

	media: function() {
		return ReactionCore.Collections.Media.find();
	},

	displaySet: function() {
		//return Agents.displaySet;
		//return Meteor.call('getDisplaySet');
		return Agents.IaDisplaySet.find();
	},

	onSalesSet: function() {
		return Agents.IaOnSalesSet.find();
	},

	clientSet: function() {
		console.log("Agents.IaClientSet: ", Agents.IaClientSet);
		return Session.get("clientSet");
	},

	categories: function() {
		return Session.get("categories");
	}
});


Template.displayClientSet.helpers({
	clientSetKey: function() {
		return this[0]
	},

	clientSetArray: function() {
		return this[1];
	}
});