require('dotenv-safe').load();

var Cloudant = require('cloudant');
var express = require('express');
var request = require('request');
var http = require("http");

var app = express();
app.set('port', process.env.PORT || 3000);

var protocol = process.env.NODE_ENV == 'production' ? "https" : "http" ;

var cloudant_url = process.env.CLOUDANT_URL;
var services = JSON.parse(process.env.VCAP_SERVICES || "{}");
var user = process.env.CLOUDANT_USER;
var password = process.env.CLOUDANT_PASSWORD;

if(process.env.VCAP_SERVICES) {

    services = JSON.parse(process.env.VCAP_SERVICES);

    if(services.cloudantNoSQLDB) {
        cloudant_url = services.cloudantNoSQLDB[0].credentials.url;
        user = services.cloudantNoSQLDB[0].credentials.username;
        password = services.cloudantNoSQLDB[0].credentials.password;
    }
}

var cloudantDB = Cloudant({url:cloudant_url, account:user, password:password});
db = cloudantDB.db.use(process.env.CLOUDANT_DB);
dbOutros = cloudantDB.db.use(process.env.CLOUDANT_DBTREINO);

var cloudant = {

    get : function(req, res) {

        var id = req.params.id;
        console.log('id ='+id);

        db.get(id, function(err, data) {
            res.status(200).json(data);
        });
    },

    getOutros : function(req, res){

        dbOutros.list({include_docs:true},function(err, data) {
            if(err){
                return console.log('[dbOutros.getOutros] ', err.message);
                res.status(500);
            }
            res.status(200).json(data);
        });

    },

    insertChat : function (req, res) {

        var dados = req.body;
        dados["dateText"] = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
        datos["treinado"] ='false';

        db.insert(dados,'doc_'+req.body.config.data.context.conversation_id+'_'+new Date().getTime(), function(err, body, header) {
            if (err) {
                return console.log('[db.insert] ', err.message);
            }
            res.status(201).json(body);
        });
    },

    insertOutros : function (req, res) {

        var dados = {
            idchat: req.body.idchat,
            texto: req.body.texto,
            treinado: 'false',
            data: new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
        }

        dbOutros.insert(dados,function(err, body, header) {

            if (err) {
                console.log('[dbTreino.insert] ', err.message);
            }
            res.status(200);

        });
    }

};

module.exports = cloudant;