require('dotenv-safe').load();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
    username: process.env.WATSON_USER,
    password: process.env.WATSON_PASSWORD,
    version: '2018-09-20'
});

var chatbot = {

    sendMessage : function (req, callback) {

        var context;
        var intent = undefined;

        if (req.body.context) {
            context = req.body.context;
        } else {
            context = undefined;
        }

        if(!req.body.intent){

            var payload = {
                workspace_id: process.env.WATSON_WS,
                input: {
                    text: req.body.text
                },
                 context: context
            }

        } else {

            var payload = {
                workspace_id: process.env.WATSON_WS,
                input: {
                    text: req.body.text
                },
                intents: [{
                    confidence: 1,
                    intent: req.body.intent
                }],
                context: context
            }

        }

        conversation.message(payload, function(err, data) {

            if (err) {
                console.log("Error in sending message: ", err);
                return callback(err);
            } else {
                
                /*
                if(process.env.SHOW_LOG == 'S'){
                    console.log("Got response from Conversation:", JSON.stringify(data));
                }
                */

                return callback(null, data);
            }
        })

    }

}

module.exports = chatbot;