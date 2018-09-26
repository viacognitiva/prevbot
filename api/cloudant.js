require('dotenv-safe').load();

var Cloudant = require('@cloudant/cloudant');
var express = require('express');
var http = require("http");

var app = express();
app.set('port', process.env.PORT || 3000);

var protocol = process.env.NODE_ENV == 'production' ? "https" : "http" ;
var cloudant_url = process.env.CLOUDANT_URL;
var cloudantDB = Cloudant(process.env.CLOUDANT_URL);

db = cloudantDB.db.use(process.env.CLOUDANT_DB);
dbOutros = cloudantDB.db.use(process.env.CLOUDANT_DBTREINO);
dbUser = cloudantDB.db.use(process.env.CLOUDANT_DBUSUARIO);
dbAval = cloudantDB.db.use(process.env.CLOUDANT_DBAVALIACAO);
dbQuestionario = cloudantDB.db.use(process.env.CLOUDANT_DBQUEST);
dbCategoria = cloudantDB.db.use(process.env.CLOUDANT_DBCATEG);

var cloudant = {

    get : function(req, res) {

        var id = req.params.id;
        console.log('id ='+id);

        db.get(id, function(err, data) {
            res.status(200).json(data);
        });
    },

    insertChat : function (req, res) {

        var dados = req.body;
        dados["dateText"] = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
        dados["treinado"] =false;

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
            treinado: false,
            data: new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
        }

        dbOutros.insert(dados,function(err, body, header) {

            if (err) {
                console.log('[dbOutros.insert] ', err.message);
            }
            res.status(200);

        });
    },

    insertUser : function (req, res) {

        var dataNow = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

        dbUser.insert({
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            chatId:req.body.chatId,
            data: dataNow },function(err, body, header) {

                if (err) {
                    return console.log('[dbUser.insert] ', err.message);
                }
                res.status(200).send("/chat");
            });
    },

    insertAval : function (req, res) {

        var dataNow = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

        dbAval.insert({
            chatId: req.body.chatId,
            nome: req.body.nome,
            email: req.body.email,
            telefone: req.body.telefone,
            gostou: req.body.gostou,
            interface: req.body.interface,
            recomenda: req.body.recomenda,
            comentario: req.body.comentario,
            data: dataNow },function(err, body, header) {

            if (err) {
                return console.log('[dbAval.insert] ', err.message);
            }
            res.status(200);
        });

    },

    getQuestionario : function (req, res) {
        
        dbQuestionario.list({include_docs: true}, function (err, data) {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(data);
        });
    },

    getCategoria : function (req, res) {

        var query = {
            "selector": {
                "range": {
                    "$elemMatch": 
                        {
                            "$gte":0,
                            "$lt": parseInt(req.params.peso)
                        }
                }
            },
            "fields": ["categoria", "investimentos", "mensagem"]
        };

        dbCategoria.find(query, function (err, data) {

            if (err) {
                res.status(501).json(err);
            } else {
                res.status(201).json(data.docs[data.docs.length-1]);
            }

        });
        
    }

};

module.exports = cloudant;