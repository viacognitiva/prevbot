require('dotenv-safe').load();
var AssistantV1 = require('watson-developer-cloud/assistant/v1');

var assistant = new AssistantV1({
    version: '2018-09-20',
    username: process.env.WATSON_USER,
    password: process.env.WATSON_PASSWORD,
    url: process.env.APIHOSTNAME
});

var chatbot = {

    sendMessage : function (req, callback) {

        var context = undefined;

        if (req.body.context) {
            context = req.body.context;
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

        assistant.message(payload, function (err, data) {

            if (err) {
                console.log("Error in sending message: ", err);
                return callback(err);
            } else {
                return callback(null, data);
            }
        })

    }

}

module.exports = chatbot;