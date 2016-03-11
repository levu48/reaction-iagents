define Info {
    username: '',
    text: '',
    constructor: function(username, text) {
        this.username = username;
        this.text = text;
    }
}

rule answerLocation {
    when {
        s: String s == 'INACTIVE';
        m: Message m.sender == 'server' && m.info.ctx == 'ask.location';
    }
    then {
		Meteor.call("dbInsert", {
            sender: Meteor.user().username,
            receiver: "server",
            info: {
                ctx: m.info.ctx + ".answer",
                mesg: "Garden Grove, CA"
            }
		});
        console.log("RULE answerLocation, Garden Grove, CA");
		retract(m);
    }
}

rule answerLocation2 {
    when {
        s: String s == 'INACTIVE';
        m: Message m.sender == 'server' && m.info.ctx == 'ask.location';
    }
    then {
        Meteor.call("dbInsert", {
            sender: Meteor.user().username,
            receiver: "server",
            info: {
                ctx: m.info.ctx + ".answer",
                mesg: "Santa Monica, CA"
            }
        });
        console.log("RULE answerLocation, Santa Monica, CA");
        retract(m);
    }
}



rule noLocation {
    when {
        //s: String s == 'INACTIVE';
        m: Message m.sender == 'server' && m.cmd == 'REQUEST' && m.info.msg == 'request for location';
    }
    then {
		Meteor.call('send', Meteor.user().username, 'server', 'LOCATION', {
			msg: 'response location, null',
			location: null
		});
		retract(m);
    }
}

rule personalPreferences {
    salience: 10;
    when {
        m: Message m.sender == 'server' && m.cmd == 'REQUEST';
        p: Personal p.isKey(m.info.key) && p[m.info.key] != null || undefined;
    
    } then {
        Meteor.call('send', Meteor.user().username, 'server', m.info.key, {
            msg: 'response',
            key: m.info.key,
            val: p[m.info.key]
        });
        retract(m);
    }
}

rule testPersonal {
    when {
        p: Personal;

    } then {
        console.log(p);
    }
}


rule answerPurposeBuyClothes {
    when {
        s: String s == 'INACTIVE';
        m: Message m.sender == 'server' && m.info.ctx == 'asking.purpose.buy';
    }
    then {
        Meteor.call('dbInsert', {
            sender: Meteor.user().username,
            receiver: 'server',
            info: {
                ctx: 'answer.purpose.buy',
                mesg: 'clothes'
            }
        });
        console.log("RULE answerPurposeBuy, Clothes");
        retract(m);
    }
}

rule answerPurposeBuyClothes_2{
    when {
        m: Message m.sender == 'server' && m.info.ctx == 'asking.purpose.buy';
    }
    then {
        var str = m.info.mesg + '\n' + m.info.form.label + '\n' + m.info.form.options + '\n' + m.info.form.submit;
        console.log(str);
        console.log("RULE answerPurposeBuy, Please select");
    }
}
