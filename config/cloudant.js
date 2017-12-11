require('dotenv-safe').load();

var Cloudant = require('cloudant');
var fs = require('fs');

var cloudant_url = process.env.CLOUDANT_URL;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var user = process.env.CLOUDANT_USER;
var password = process.env.CLOUDANT_PASSWORD;

if(process.env.VCAP_SERVICES) {

    services = JSON.parse(process.env.VCAP_SERVICES);

    if(services.cloudantNoSQLDB) {
        cloudant_url = services.cloudantNoSQLDB[0].credentials.url;  //Get URL and other paramters
        user = services.cloudantNoSQLDB[0].credentials.username;
        password = services.cloudantNoSQLDB[0].credentials.password;
        console.log("Name = " + services.cloudantNoSQLDB[0].name);
        console.log("URL = " + services.cloudantNoSQLDB[0].credentials.url);
        console.log("username = " + services.cloudantNoSQLDB[0].credentials.username);
        console.log("password = " + services.cloudantNoSQLDB[0].credentials.password);
    }
}

var dbname = process.env.CLOUDANT_DB;
var cloudant = Cloudant({url:cloudant_url,account:user,password:password});
db = cloudant.db.use(dbname);

var cloudant = {

    get : function(req, res) {

        var id = req.params.id;
        console.log('id ='+id);
        db.get(id, function(err, data) {
               res.status(200).json(data);
        });
    },

    gravaUsuario : function (req, res) {

        var dataNow = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

        db.insert({ idchat: req.body.idchat,
                    nome: req.body.nome,
                    email: req.body.email,
                    telefone: req.body.telefone,
                    data: dataNow },
            'doc_'+req.body.idchat+'_'+new Date().getTime(), function(err, body, header) {

                if (err) {
                    return console.log('[db.insert] ', err.message);
                }
               res.status(200).send("/chat");

        });
    },
};

module.exports = cloudant;