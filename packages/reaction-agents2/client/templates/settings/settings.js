Template.agentsSettings.events({
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

Template.agentsSettings.helpers({
	messages: function() {
		//return Agents.IaMessages.find({receiver: Meteor.user().username}, {sort: {ts: -1}});
		return Agents.IaMessages.find({}, {sort: {ts: -1}});
	},

	formOptions: function() {
		return this.info.form.options;
	}
});

