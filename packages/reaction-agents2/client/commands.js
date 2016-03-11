if (Meteor.isClient) {
	client = null;	// global var, null until REGISTER
	SERVER = "server";

	processCommand = function (str) {
		if (str == null) 
			return;

		if (str.trim() === 'start') {
			var obj = {
				sender: Meteor.user().username, 
				receiver: SERVER, 
				info: {
					ctx: "start",
					value: "hello",
					mesg: "hello, I would like to start"
				},
				ts: new Date()
			};

			Meteor.call("dbInsert", obj);

		} else if (str.trim() === 'start.arts') {

			console.log("command.js start.arts ..1 ", GROUP, obj);
			var obj = {
				group: GROUP,
				sender: Meteor.user().username, 
				receiver: SERVER, 
				info: {
					ctx: "start.arts",
					value: "hello arts store demo",
					mesg: "hello, I would like to start the art store demo"
				},
				ts: new Date()
			};

			Meteor.call("dbInsert", obj);
			console.log("command.js start.arts ..2 ", GROUP, obj);

		} else if (str.trim() === 'start.dentist') {
			var obj = {
				group: GROUP,
				sender: Meteor.user().username, 
				receiver: SERVER, 
				info: {
					ctx: "start.dentist",
					value: "hello dentistry services",
					mesg: "hello, I would like to start the dentistry services demo"
				},
				ts: new Date()
			};

			Meteor.call("dbInsert", obj);
			console.log("command.js start.dentist ", GROUP, obj);

		} else if (str === "write products") {
			var prods = ReactionCore.Collections.Products.find().fetch();
			var str = JSON.stringify(prods);
			Meteor.call("writeFile", Agents.productsFile, str);
			

		} else if (str === "write tags") {
			var tags = ReactionCore.Collections.Tags.find().fetch();
			var str = JSON.stringify(tags);
			Meteor.call("writeFile", Agents.tagsFile, str);

		
		}  else if (str === 'LIST') {
			console.log("RUN client " + Meteor.user().username, session);
			Meteor.call("start");
		
		} else if (str.startsWith('SEND ')) {
			var sub = str.substring(5);
			try {
				var obj = JSON.parse(sub);
				//var mesg = new Agents.IaMessage(obj);
				//mesg.dbInsert();
				Meteor.call('dbInsert', obj);

			} catch (err) {
				console.log(err);
			}

		} else if (str.startsWith("SITEMAP ")) {
			console.log(str);
			var sub = str.substring(8);
			var obj = {
				sender: Meteor.user().username, 
				receiver:"server", 
				info: {
					ctx: "request.sitemap",
					mesg: str,
					value: str
				}
			};
			Meteor.call("dbInsert", obj);

		} else if (str.startsWith("personal ")) { // e.g. personal style landscape figurative 
			console.log(str);
			var arr = str.split(" ");
			var ctx = arr.length > 0 ? arr[0].trim() : '';
			var val = arr.length > 1 ? arr[1].trim() : ctx;
			var msg = arr.length > 2 ? str.substring(ctx.length + 1 + val.length + 1).trimLeft() : val;
			var sub = str.substring(8);
			var obj = {
				group: GROUP,
				sender: Meteor.user().username, 
				receiver: Meteor.user().username, 
				info: {
					ctx: ctx + "." + val,
					value: msg,
					mesg: "Personal preferences are reset, " + msg
				},
				ts: new Date()
			};
			Meteor.call("dbInsert", obj);

		} else if (str.startsWith("client price ")) { // e.g. client price min 3
			console.log(str);
			var arr = str.split(" ");
			var ctx = arr.length > 1 ? arr[0].trim() + "." + arr[1].trim() : '';
			var val = arr.length > 2 ? arr[2].trim() : ctx;
			var msg = arr.length > 3 ? str.substring(14 + val.length).trimLeft() : val;

			var obj = {
				group: GROUP,
				sender: Meteor.user().username, 
				receiver: Meteor.user().username, 
				info: {
					ctx: ctx + "." + val,
					value: msg,
					mesg: "Find products of minimum prices, limit " + msg
				},
				ts: new Date()
			};
			Meteor.call("dbInsert", obj);

		} else {
			var arr = str.split(" ");
			var ctx = arr.length > 0 ? arr[0].trim() : '';
			var val = arr.length > 1 ? arr[1].trim() : ctx;
			var msg = arr.length > 2 ? str.substring(ctx.length + 1 + val.length + 1).trimLeft() : val;

			console.log(ctx, " AND " + val, " AND " + msg);
			var obj = {
				group: GROUP,
				sender: Meteor.user().username, 
				receiver:"server", 
				info: {
					ctx: ctx,
					value: val,
					mesg: msg
				},
				ts: new Date()
			};
			Meteor.call("dbInsert", obj);
		}
	}
}