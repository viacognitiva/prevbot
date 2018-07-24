var	express	= require('express');
var	bodyParser = require('body-parser');
var helmet = require('helmet');

require('dotenv-safe').load();

module.exports = function() {

    var	app	= express();
    app.set('port', process.env.PORT || 3000);

    //middleware
    app.use(express.static('./app'));
    app.use(bodyParser.urlencoded({extended:true}));
    app.use(bodyParser.json());

    app.use(helmet());

    //app.disable('x-powered-by');
    app.use(helmet.hidePoweredBy({setTo: 'PHP 5.5.14'})); //troca powerd-by for uma informação falsa
    //app.use(helmet.frameguard()); //bloqueia o uso de i-frame
    app.use(helmet.xssFilter()); //bloqueia o uso de XSS
    app.use(helmet.noSniff()); // não permite o carregamento de MIME types inválidos

	return app;
};