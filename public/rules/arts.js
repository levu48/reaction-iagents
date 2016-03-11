global category = 'watercolor';

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



rule computeClientSet {
    when {
        m: Message m.info.ctx === 'category.results' || m.info.ctx === 'products.by.artist.results';
        p: Personal p.style !== null && p.style !== undefine;

    } then {
        console.log("RULE computeClientSet");
        Agents.IaClientSet = [];
        for (var i=0; i<p.style.length; i++) {
            var key = p.style[i];
            var arr = Agents.containsKey(key, Agents.IaDisplaySet.find().fetch());
            console.log("i = " + i + ": key = " + key, arr);
            if (arr.length > 0) {
                Agents.IaClientSet.push([key, arr]);
            }
        }
        assert("new Client Set");
        retract(m);
    }
}

rule displayClientSet {
    when {
        s: String s === 'new Client Set';

    } then {
        console.log("RULE displayClientSet");
        for (var i=0; i<Agents.IaClientSet.length; i++) {
            Meteor.call("dbInsert", {
                group: "arts",
                sender: Meteor.user().username, 
                receiver: Meteor.user().username,  
                info: {
                    ctx: "client.refine",
                    value: "refine",
                    mesg: "Client filters through personal preferences:",
                    html: {
                       label: "Personal prefernces: " + Agents.IaClientSet[i][0],
                        options: Agents.IaClientSet[i][1]
                    }
                },
                ts: new Date()
            });
        }
        retract(s);
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



