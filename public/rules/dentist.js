global LANGUAGE = 'farsi';
global RACE = 'iran';

define Info {
    username: '',
    text: '',
    constructor: function(username, text) {
        this.username = username;
        this.text = text;
    }
}

rule refineSelection {
    when {
        m: Message m.info.ctx === 'dentist.recommendation';

    } then {
        console.log("RULE refineSelection");
        var res = [];
        var arr = m.info.html.options;
        
        for (var i=0; i<arr.length; i++) {
            var lang = arr[i].language;
            var race = arr[i].race;
            
            if (race.toLowerCase() === RACE && lang.indexOf(LANGUAGE) >=0 ) {
               res.push(arr[i]);
            }
            
        }
        console.log("results ", res);

        Meteor.call("dbInsert", {
            group: "dentist",
            sender: m.receiver,
            receiver: m.receiver,
            info: {
                ctx: "client.refine",
                mesg: "Client rules further refine:",
                value: "iran farsi",
                html: {
                    label: "These services are of race " + RACE.toUpperCase() + " and language " + LANGUAGE.toUpperCase(),
                    options: res
                }
            },
            ts: new Date()
        });
        retract(m);
        
    }
}

rule clean {
    when {
        m: Message m.info.ctx === 'client.refine' || m.info.ctx === 'dentist.category' 
        || m.info.ctx === 'dentist.diagnosis' ; //|| m.info.ctx = 'dentist.recommendation';

    } then {
        console.log("RULE clean ", m.info.ctx);
        retract(m);
    }
}