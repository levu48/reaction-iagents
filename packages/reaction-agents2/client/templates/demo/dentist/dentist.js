Template.demoDentist.events({
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

Template.demoDentist.helpers({	
	messages: function() {
		return Agents.IaMessages.find({group: "dentist"}, {sort: {ts: -1}});
	},

	formOptions: function() {
		return this.info.form.options;
	}
});

