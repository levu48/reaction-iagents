global category = 'watercolor';

define Info {
    username: '',
    text: '',
    constructor: function(username, text) {
        this.username = username;
        this.text = text;
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

rule requestCategory {
    when {
        m: Message m.sender === 'server' && m.info.ctx === 'request.categories.response' && Agents.getCatValue(category, m.info.value) != undefined;

    } then {
        console.log("RULE requestCategory");
        Meteor.call("dbInsert", {
            sender: Meteor.user().username, 
            receiver: "server",  
            info: {
                ctx: "request.category",
                value: category,
                mesg: "Please provide me the products in category " + category
            },
            ts: new Date()
        });
    }
}

rule refineSelection {
    when {
        m: Message m.info.ctx === 'request.products.category.response';
        p: Personal p.style != null && p.style != undefined;

    } then {
        console.log("RULE refineSelection");
        Agents.IaClientSet = [];
        for (var i=0; i<p.style.length; i++) {
            var key = p.style[i];
            var arr = Agents.containsKey(key, Agents.IaDisplaySet.find().fetch());
            console.log("i = " + i + ": key = " + key, arr);
            if (arr.length > 0) {
                Agents.IaClientSet.push([key, arr]);
            }
        }
        console.log(Agents.IaClientSet);
        Session.set("clientSet", Agents.IaClientSet);
    }
}

rule personalStyle {
    when {
        m: Message m.info.ctx === 'personal.style' && m.info.value != undefined && m.info.value != null;
        p: Personal p.style != null && p.style != undefined;

    } then {
        console.log("RULE personalStyle");
        p.style = m.info.value.split(" ");
        modify(p);
        retract(m);
    }
}

rule minPrices {
    when {
        m: Message m.info.ctx === 'client.price.min' && m.info.value != undefined && m.info.value != null;

    } then {
        console.log("RULE minPrices");
        Session.set("minPrices", m.info.value);
        retract(m);
    }
}

rule displaySet {
    when {
        m: Message m.info.ctx === 'arts.results' && m.info.value === 'Agents.IaDisplaySet';
    } then {
        console.log("RULE displaySet ..1");
        
        Meteor.call("dbInsert", {
            group: "arts",
            sender: Meteor.user().username, 
            receiver: Meteor.user().username,  
            info: {
                ctx: "arts.results.displaySet",
                mesg: "Products list from server:",
                value: "arts.results.displaySet",
                html: {
                    label: "You can take a look at these:",
                    options: Agents.IaDisplaySet.find().fetch()
                }
            },
            ts: new Date()
        });
        
        console.log("Rule displaySet ..2");
        retract(m);
    }
}

