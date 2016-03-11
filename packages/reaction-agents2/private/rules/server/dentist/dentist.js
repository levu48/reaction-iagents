import("C:/thach/dev/meteor/reaction/packages/reaction-agents/private/rules/server/arts/global.nools");
import("C:/thach/dev/meteor/reaction/packages/reaction-agents/private/rules/server/arts/define.nools");

//////  ==== DENTISTRY SERVICES ===========================

rule dentist_start {
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'start.dentist';

	} then {
		console.log("RULE dentist_start");
		focus("dentist");
	}
}

rule dentist_start2 {
	agenda-group: "dentist";
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'start.dentist';
		not (h: History h.username === m.sender);

	} then {
		console.log("RULE dentist_start2");
		assert(new History(m.sender));
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: DENTIST,
				sender: m.sender, 
				receiver: m.receiver,  
				info: {
					ctx: "dentist.categories",
					mesg: "Requesting Dentistry Services Cateogories",
					value: "dentist.categories",
				},
				ts: new Date()
			});			
		}).run();
		retract(m);

	}
}

rule dentist_start3 {
	agenda-group: "dentist";
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'start.dentist';
		h: History h.username === m.sender;

	} then {
		console.log("RULE dentist_start3");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: DENTIST,
				sender: m.sender, 
				receiver: m.receiver,  
				info: {
					ctx: "dentist.categories",
					mesg: "Requesting Dentistry Services Cateogories",
					value: "dentist.categories",
				},
				ts: new Date()
			});			
		}).run();
		retract(m);

	}
}

rule dentist_categories {
	agenda-group: "dentist";
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.ctx == 'dentist.categories';
		h: History h.username === m.sender;
	
	} then {
		console.log("RULE dentist_categories");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: DENTIST,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "dentist.category",
					mesg: "Welcome to the Dentistry Services",
					value: categories,
					form: {
						label: "At our website, we offer three navigational services:",
						options: categories_dentist,
						submit: "please choose one"
					}
				},
				ts: new Date()
			});
		}).run();
		retract(m);
	}
}

rule dentist_diagnosis {
	agenda-group: "dentist";
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.value == 'dentist.diagnosis';
		h: History h.username === m.sender;
	
	} then {
		console.log("RULE dentist_diagnosis");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: DENTIST,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "dentist.diagnosis",
					mesg: "Welcome to the Dentistry Services",
					value: categories,
					form: {
						label: "We want to diagnose you problem:",
						options: dentist_diagnosis,
						submit: "please choose one"
					}
				},
				ts: new Date()
			});
		}).run();
		retract(m);
	}
}

rule dentist_diagnosis {
	agenda-group: "dentist";
	auto-focus: true;
	when {
		m: Message m.receiver == SERVER && m.info.value == 'dentist.diagnosis.pain';
		h: History h.username === m.sender;
	
	} then {
		console.log("RULE dentist_diagnosis_pain");
		Fibers(function() {
			Meteor.call("dbInsert", {
				group: DENTIST,
				sender: SERVER, 
				receiver: m.sender,  
				info: {
					ctx: "dentist.recommendation",
					mesg: "Welcome to the Dentistry Services",
					value: "dentist_group1",
					html: {
						label: "We recommend the following services:",
						options: dentist_group1
					}
				},
				ts: new Date()
			});
		}).run();
		retract(m);
	}
}

