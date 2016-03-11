//import(Agents._SERVER_ROOT_DIR + Agents.ruleDir + "global.nools");
//import(Agents.rulesGlobal);
import("C:/thach/dev/meteor/reaction/packages/reaction-agents/private/rules/server/arts/global.nools");
import("C:/thach/dev/meteor/reaction/packages/reaction-agents/private/rules/server/arts/define.nools");


//////  ==== ART STORE ====================================


rule hello_assertHistory {
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'start.arts';
		not (h: History h.username === m.sender);

	} then {
		console.log("RULE hello_assertHistory");
		assert(new History(m.sender));
		focus(ARTS);
	}
}

rule hello {
	agenda-group: "arts"; /// Nools BUG! if use global ARTS will crash session.match()!!! Why?
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'start.arts';
		h: History h.username === m.sender;
	
	} then {
		console.log("RULE hello");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: ARTS,
				sender: m.sender, 
				receiver: m.receiver,  
				info: {
					ctx: "main",
					mesg: "Requesting categories",
					value: "categories",
				},
				ts: new Date()
			});			
		}).run();
		retract(m);
	}
}


rule main {
	agenda-group: ARTS;
	auto-focus: true;
	salience: 10;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'main';
		h: History h.username == m.sender;

	} then {
		console.log("RULE main");
		h.history[m.info.value] = true;
		modify(h);
		retract(m);
		
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: ARTS,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "category",
					mesg: "Welcome to the Fine Arts Store",
					value: categories,
					form: {
						label: "Our website contains these main categories:",
						options: categories,
						submit: "please choose one"
					}
				},
				ts: new Date()
			});
		}).run();
		
	}
}


rule requestCategory {
	agenda-group: ARTS;
	auto-focus: true;
	salience: 10;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'category';
		h: History h.username == m.sender;

	} then {
		console.log("RULE requestCategory");
		h.history[m.info.value] = true;
		modify(h);

		Fibers(function() {
			Agents.displayProducts(m.info.value);
			Meteor.call("dbInsert", {
				group: ARTS,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "category.results",
					mesg: "Products from your requested category, " + m.info.value,
					value: m.info.value,
					html: {
						label: "These are products of category: " + m.info.value,
						options: Agents.IaDisplaySet.find().fetch()
					}
				},
				ts: new Date()
			});
		}).run();

		retract(m);
	}
}


rule categoryWatercolor {
	agenda-group: ARTS;
	auto-focus: true;
	salience: 15;
	when {
		//s: String s == 'INACTIVE';
		m: Message m.receiver == SERVER && m.info.ctx == 'category' && m.info.value == 'watercolor';
		h: History h.username == m.sender;

	} then {
		console.log("RULE categoryWatercolor");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: ARTS,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "products.by.artist",
					mesg: "Our watercolor collections contain both classic masters and up and coming young artists.",
					value: "category watercolor",
					form: {
						label: "You can take a look at these:",
						options: watercolorMain,
						submit: "please choose one"
					}
				},
				ts: new Date()
			});
		}).run();
	}
}


rule categoryOil {
	agenda-group: ARTS;
	auto-focus: true;
	salience: 15;
	when {
		//s: String s == 'INACTIVE';
		m: Message m.receiver == SERVER && m.info.ctx == 'category' && m.info.value == 'oil';
		h: History h.username == m.sender;

	} then {
		console.log("RULE categoryOil");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: ARTS,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "products.by.artist",
					mesg: "Our oil paintings collections contain both classic masters and up and coming young artists.",
					value: "category oil",
					form: {
						label: "You can take a look at these:",
						options: oilMain,
						submit: "please choose one"
					}
				},
				ts: new Date()
			});

		}).run();
	}
}


rule productsByArtist {
	agenda-group: ARTS;
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'products.by.artist';
		h: History h.username == m.sender;

	} then {
		console.log("RULE products.by.artist");
		h.history[m.info.value] = true;
		modify(h);

		Fibers(function() {
			Agents.getProducts({artist: m.info.value});
			Meteor.call("dbInsert", {
				group: ARTS,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "products.by.artist.results",
					mesg: "Products list from artist: " + m.info.value,
					value: "Agents.IaDisplaySet",
					html: {
						label: "Artworks from artist: " + m.info.value,
						options: Agents.IaDisplaySet.find().fetch()
					}
				},
				ts: new Date()
			});
		}).run();

		retract(m);
	}
}

rule onSales {
	agenda-group: ARTS;
	auto-focus: true;
	when {
		h: History h.history['Charles Reid'] === true && h.history['Pablo Picasso'] === true;

	} then {
		console.log("RULE onSales");
		Fibers(function() {
			Agents.IaOnSalesSet.remove({});
			Agents.addToOnSalesSet("Standing Nude by Charles Reid");
			Agents.addToOnSalesSet("The Old Guitarist by Picasso");
		}).run();
	}
}