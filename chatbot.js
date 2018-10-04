const app = require('./api/express')();
const chatbot = require('./api/bot.js');
const params = require('./api/parameters.js');
const discovery = require('./api/discovery.js');
const nlu = require('./api/nlu.js');
const textToSpeech = require('./api/text-to-speech.js');
const cloudant = require('./api/cloudant.js');
const email = require('./api/mail.js');

// =====================================
// WATSON CONVERSATION FOR ANA =========
// =====================================
app.post('/api/watson', function (req, res) {
    processChatMessage(req, res);
});

app.get('/api/discovery/:texto/:full', function (req, res) {
    discovery.get(req, res);
});

app.get('/api/nlu/:texto/:url', function (req, res) {
   nlu.analisar(req, res);
});

app.post('/api/synthesize', (req, res, next) => {
    textToSpeech.converter(req, res , next);
});

app.get('/api/showSound', function (req, res) {
    params.showSound(req,res);
});

app.get('/api/showLog', function (req, res) {
    params.showLog(req, res);
});

app.post('/api/outros', function (req, res) {
    cloudant.insertOutros(req,res);
});

app.post('/api/gravar', function (req, res) {
    cloudant.insertChat(req,res);
});

app.post('/api/user', function (req, res) {
    cloudant.insertUser(req,res);
});

app.post('/api/aval', function (req, res) {
    cloudant.insertAval(req,res);
});

app.post('/api/sendmail', function (req, res) {
    email.enviaCorreio(req, res);
})

app.get('/api/getquest', function (req, res) {
    cloudant.getQuestionario(req,res);
});

app.get('/api/getcateg/:peso', function (req, res) {
    cloudant.getCategoria(req, res);
});

app.get('/api/getfundos/:info', function (req, res) {
    cloudant.getFundo(req,res);
});

function processChatMessage(req, res) {

    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            res.status(err.code || 500).json(err);
        }
        else {
            res.status(200).json(data);
        }
    });

}

app.listen(app.get('port'), function() {
    console.log('ChatBot is running on port', app.get('port'));
});