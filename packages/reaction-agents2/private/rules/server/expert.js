global categories =  [
		{ key: 'watercolor', value: 'watercolor'},
		{ key: 'acrylic', value: 'acrylic'},
		{ key: 'oil', value: 'oil'},
		{ key: 'sculpture', value: 'sculpture'},
		{ key: 'all', value: 'all'}
	];


define Info {
	username: '',
	text: '',
	constructor: function(username, text) {
		this.username = username;
		this.text = text;
	}
}

rule hello {
	when {
		m: Message m.receiver == 'server' && Agents.mapping(m.info.mesg) == 'greet';

	} then {
		console.log("RULE hello");

		var prods = ReactionCore.Collections.Products.find().fetch();
		Agents.IaDisplaySet.remove({});
		Agents.IaRecommendedSet.remove({});

		for(var i=0; i<prods.length; i++) {
			Agents.IaDisplaySet.insert({ 
				_id: prods[i]._id,
				title: prods[i].title
			});
		}

		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: "ask.categories",
				mesg: "hello, how may we help you?",
				value: categories,
				form: {
					label: "we offer artworks in the following medium:",
					options: categories,
					submit: "please choose one"
				}
			},
			ts: new Date()
		});
	}
}

rule categoriesAnswer {
	when {
		m: Message m.receiver == 'server' && m.info.ctx == 'ask.categories.answer' && Agents.mapping(m.info.mesg) == 'fashion';
		not(m2: Message m.receiver == 'server' && m.info.ctx == 'ask.location.answer');

	} then {
		console.log("RULE categoriesAnswer");
		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: "ask.location",
				mesg: "where are you located?",
				form: {
					label: "Which of the following cities:",
					options: ["Garden Grove, CA", "Santa Ana, CA", "Los Angeles, CA", "Santa Monica, CA"],
					submit: "please choose one"
				}
			},
			ts: new Date()
		});
	}
}


rule suggestPlace {
	when {
		m: Message m.receiver == 'server' && m.info.ctx == 'ask.categories.answer' && m.info.mesg == 'clothes' ;
		m2: Message m2.receiver == 'server' && m.sender == m2.sender && m2.info.ctx == 'ask.location.answer' && Agents.mapping(m2.info.mesg) == 'Orange County, CA';

	} then {
		console.log("RULE suggestPlace");
		var prods = ReactionCore.Collections.Products.find().fetch();
		var pNames = [];
		for (var i=0; i<prods.length; i++) {
			pNames.push(prods[i].title);
		}
		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: "answer.location",
				mesg: "You should go to South Coast Plaza, Costa Mesa, CA",
				form: {
					label: "We have the following products:",
					options: pNames,
					submit: "please choose one"
				}
			},
			ts: new Date()
		});
		retract(m);
		retract(m2);
	}
}

rule suggestPlace2 {
	when {
		m: Message m.receiver == 'server' && m.info.ctx == 'ask.categories.answer' && m.info.mesg == 'clothes' ;
		m2: Message m2.receiver == 'server' && m.sender == m2.sender && m2.info.ctx == 'ask.location.answer' && Agents.mapping(m2.info.mesg) == 'Los Angeles, CA';

	} then {
		console.log("RULE suggestPlace");
		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: "answer.location",
				mesg: "You should go to Rodeo Drive, Los Angeles, CA"
			},
			ts: new Date()
		});
		retract(m);
		retract(m2);
	}
}


rule test {
	when {
		m: Info m.username == 'Owner';

	} then {
		console.log("RULE test");
		var prod = ReactionCore.Collections.Products.findOne();
		console.log("PRODUCT _id: " + prod._id);
		console.log("PRODUCT _description: " + prod.description);
	}
}

rule fineArtsProducts {
	when {
		m: Message m.receiver == 'server' && m.info.ctx == 'ask.categories.answer' && Agents.mapping(m.info.mesg) == 'fine arts' ;

	} then {
		console.log("RULE fineArtsProducts");
		var prods = ReactionCore.Collections.Products.find().fetch();
		Agents.IaDisplaySet.remove({});
		Agents.IaRecommendedSet.remove({});

		for(var i=0; i<prods.length; i++) {
			var medium = prods[i].metafields[2].value;
			if (medium && medium.toLowerCase() == m.info.mesg.toLowerCase()) {
				Agents.IaDisplaySet.insert({ 
					_id: prods[i]._id,
					title: prods[i].title
				});
			}
		}

		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: "answer.products",
				mesg: "Fine arts (" + m.info.mesg + ")",
				form: {
					label: "We have the following products:",
					options: Agents.displaySet,
					submit: "please choose one"
				}
			},
			ts: new Date()
		});
		retract(m);
	}
}


rule requestSitemap {
	salience: 10;
	when {
		m: Message m.receiver == 'server' && m.info.ctx == 'request.categories';

	} then {
		console.log("RULE requestSitemap");
		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: "request.products.category",
				mesg: "Here is our sitemap.",
				value: categories,
				form: {
					label: "The sitemap contains following major categories:",
					options: categories,
					submit: "please choose one"
				}
			},
			ts: new Date()
		});
	}
}

rule requestCategory {
	salience: 10;
	when {
		m: Message m.receiver == 'server' && m.info.ctx == 'request.products.category';

	} then {
		console.log("RULE requestCategory");
		var prods = ReactionCore.Collections.Products.find().fetch();
		Agents.IaDisplaySet.remove({});
		Agents.IaRecommendedSet.remove({});

		if (m.info.value.toLowerCase() === 'all') {
			for (var i=0; i<prods.length; i++) {
				Agents.IaDisplaySet.insert({ 
					_id: prods[i]._id,
					title: prods[i].title
				});
			}
		} else {
			for(var i=0; i<prods.length; i++) {
				var medium = prods[i].metafields[2].value;
				if (medium && medium.toLowerCase() == m.info.value.toLowerCase()) {
					Agents.IaDisplaySet.insert({ 
						_id: prods[i]._id,
						title: prods[i].title
					});
				}
			}
		}
		Meteor.call("dbInsert", {
			sender: "server", 
			receiver: m.sender,  
			info: {
				ctx: m.info.ctx + ".response",
				mesg: "Products from your requested category, " + m.info.value,
				value: m.info.value,
			},
			ts: new Date()
		});
	}
}

