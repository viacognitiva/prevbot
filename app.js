/**
 * Module dependencies.
 */
var express = require('express'),
    routes = require('./routes/index.js'),
    http = require('http'),
    path = require('path'),
    fs = require('fs');

var cfenv = require('cfenv');
var chatbot = require('./config/bot.js');
var cloudant = require('./config/cloudant.js');
var discovery = require('./config/discovery.js');
var nlu = require('./config/nlu.js');
var textToSpeech = require('./config/text-to-speech.js');
var correio = require('./config/api');

var app = express();

var bodyParser = require('body-parser');
var methodOverride = require('method-override');
var errorHandler = require('errorhandler');

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());
app.use(methodOverride());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/style', express.static(path.join(__dirname, '/views/style')));


// development only
if ('development' == app.get('env')) {
    app.use(errorHandler());
}

app.get('/', routes.chat);
app.get('/discovery', routes.discovery);
app.get('/nlu', routes.nlu);
app.get('/som', routes.textToSpeech);

app.post('/salvar', cloudant.gravaUsuario);
app.post('/sendmail',correio.enviaCorreio);

// =====================================
// WATSON CONVERSATION FOR ANA =========
// =====================================
app.post('/api/watson', function (req, res) {
    processChatMessage(req, res);
}); // End app.post 'api/watson'

//http://localhost:9000/api/cloudant/viacognitiva
app.get('/api/cloudant/:id', function (req, res) {
    cloudant.get(req, res);
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

function processChatMessage(req, res) {
    chatbot.sendMessage(req, function (err, data) {
        if (err) {
            console.log("Error in sending message: ", err);
            res.status(err.code || 500).json(err);
        }
        else {
            var context = data.context;
            res.status(200).json(data);
        }
    });
}

http.createServer(app).listen(app.get('port'), '0.0.0.0', function() {
    console.log('Express server listening on port ' + app.get('port'));
});