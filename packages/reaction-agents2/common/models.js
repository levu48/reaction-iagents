if (Meteor.isServer) {
	nools = Meteor.npmRequire("nools");
	Fibers = Meteor.npmRequire("fibers");
	fs = Meteor.npmRequire("fs");
}

Agents = {
	//ruleFile: "private/rules/server/expert.js",
	rulesGlobal: "C:/thach/dev/meteor/reaction/packages/reaction-agents/private/rules/server/arts/global.nools",
	rulesDefine: "C:/thach/dev/meteor/reaction/packages/reaction-agents/private/rules/server/arts/define.nools",
	ruleDir: "packages/reaction-agents/private/rules/server/arts/",
	ruleFile: "private/rules/server/arts/arts.js",

	productsFile: "private/data/products.txt",
	tagsFile: "private/data/tags.txt",

	//__SERVER_ROOT_DIR: (Meteor.isServer ? fs.realpathSync('.') : ""),
	__SERVER_ROOT_DIR: "C:/thach/dev/meteor/reaction/",
	DEFAULT_GROUP: 'main',

	flowName: "server",

	rulesRegistry: {},

	flow: {},
	session: {},
	util: {},
	fMap: [],

	addRulesRegistry: function(name, filePath) {
		let flow = nools.getFlow(name);
		let content = Assets.getText(filePath); // sync
		flow = nools.compile(content, {
				name: name,
				define: {
					Message: Agents.IaMessage
				},
				scope: {
					Fibers: Fibers,
					Agents: Agents
				}
			});
		this.rulesRegistry[name] = { flow: flow, session: flow.getSession() };
	},


	Info: function(username, text) {
		this.username = username;
		this.text = text;
	},

	IaMessages: new Meteor.Collection("IaMessages"),
	IaDisplaySet: new Meteor.Collection("IaDisplaySet"),
	IaRecommendedSet: new Meteor.Collection("IaRecommendedSet"),
	IaOnSalesSet: new Meteor.Collection("IaOnSalesSet"),

	IaClientSet: [],
	
	IaMessage: function(obj) {
		this.group = obj.group || this.DEFAULT_GROUP;
		this.sender = obj.sender;
		this.receiver = obj.receiver;
		this.info = obj.info;
		this.ts = new Date();
	},

	addMapping: function(func) {
		if (this.fMap) this.fMap.push(func);
		else this.fMap = [func];
	},

	mapping: function(str) {
		if (this.fMap) {
			var tmp = null;
			for (var i=0; i< this.fMap.length; i++) {
				tmp = this.fMap[i](str);
				if (tmp) return tmp;
			}
		}
	},

	getCatValue: function(str, arr) {
		for (var i=0; i<arr.length; i++) {
			if (str === arr[i].value) {
				return arr[i].key;
			}
		}
	},

	// given a keyword, return an array of objects contains that keyword.
	containsKey: function(key, prodArr) {
		var arr = [];
		for(var i=0; i<prodArr.length; i++) {
			if (Agents.keywords(prodArr[i]).indexOf(key) !== -1) {
				arr.push(prodArr[i]);
			}
		}
		return arr;
	},

	// given a Product, return the keywords associated with that Product.
	keywords: function(prod) {
		var obj = {};
		var pObj = ReactionCore.Collections.Products.findOne(prod._id);
		for (var i=0; i<pObj.metafields.length; i++) {
			var str = pObj.metafields[i].value.toLowerCase();
			if (!obj[str]) {
				obj[str] = true;
			}
		}
		var keys = Object.keys(obj);
		var arr = [];
		for (var i=0; i< keys.length; i++) {
			var key = keys[i];
			arr.push(key);
		}
		return arr;
	},

	displayProducts: function(category) {
		var prods = ReactionCore.Collections.Products.find().fetch();
		Agents.IaDisplaySet.remove({});
		Agents.IaRecommendedSet.remove({});
		if (!category) {
			return;
		}

		var cat = category.trim().toLowerCase();

		if (cat === 'all') {
			for (var i=0; i<prods.length; i++) {
				Agents.IaDisplaySet.insert({ 
					_id: prods[i]._id,
					title: prods[i].title
				});					
			}

		} else {
			for(var i=0; i<prods.length; i++) {
				var medium = prods[i].metafields[2].value;
				if (medium && medium.toLowerCase() == cat) {
					Agents.IaDisplaySet.insert({ 
						_id: prods[i]._id,
						title: prods[i].title
					});
				}
			}
		}
	},

	getProducts: function(obj) {
		Agents.IaDisplaySet.remove({});
		Agents.IaRecommendedSet.remove({});

		var prods = ReactionCore.Collections.Products.find().fetch();
		if (obj.artist) {
			for(var i=0; i<prods.length; i++) {
				var artist = prods[i].metafields[1].value;
				if (artist && artist.toLowerCase() == obj.artist.toLowerCase()) {
					Agents.IaDisplaySet.insert({ 
						_id: prods[i]._id,
						title: prods[i].title
					});
				}
			}
		}
		return Agents.IaDisplaySet.find().fetch();
	},

	getProduct: function(title) {
		var prod = ReactionCore.Collections.Products.findOne({title: title});
		return prod;
	},

	addToOnSalesSet: function(title) {
		var prod = this.getProduct(title);
		if (prod) {
			Agents.IaOnSalesSet.insert({
				_id: prod._id,
				title: prod.title
			});
		}
	}

};



Agents.IaMessage.prototype.dbInsert = function() {
	var obj = {
		sender: this.sender,
		receiver: this.receiver,
		info: this.info,
		ts: (this.ts ? this.ts : new Date())
	};
	/*
	check(obj, {
		sender: String,
		receiver: String,
		info: Object,
		ts: Date
	});
	*/

	
	Agents.IaMessages.insert(obj, function( error, result) { 
   		if ( error ) console.log ( "IaMessages.insert: ERROR = " + error ); //info about what went wrong
    	if ( result ) console.log ( "IaMessages.insert: RESULT = " + result ); //the _id of new object if successful
  	});
  	
};

Agents.IaMessage.prototype.dbInsert2 = function(obj, cb) {
	Agents.IaMessages.insert(obj, cb);
};




