require('dotenv-safe').load();
var ConversationV1 = require('watson-developer-cloud/conversation/v1');

var conversation = new ConversationV1({
    username: process.env.WATSON_USER,
    password: process.env.WATSON_PASSWORD,
    version: '2018-07-10'
});

var chatbot = {

    sendMessage : function (req, callback) {

        var context;

        if (req.body.context) {
            context = req.body.context;
        } else {
            context = undefined;
        }

        var payload = {
            workspace_id: process.env.WATSON_WS,
            input: {
                text: req.body.text
            },
            context: context
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