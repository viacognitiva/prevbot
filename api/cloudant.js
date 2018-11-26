require('dotenv-safe').load();

var Cloudant = require('@cloudant/cloudant');
var express = require('express');

var app = express();
app.set('port', process.env.PORT || 3000);

var cloudantDB = Cloudant(process.env.CLOUDANT_URL);

const db = cloudantDB.db.use(process.env.CLOUDANT_DB);
const dbOutros = cloudantDB.db.use(process.env.CLOUDANT_DBTREINO);
const dbUser = cloudantDB.db.use(process.env.CLOUDANT_DBUSUARIO);
const dbAval = cloudantDB.db.use(process.env.CLOUDANT_DBAVALIACAO);
const dbQuestionario = cloudantDB.db.use(process.env.CLOUDANT_DBQUEST);
const dbCategoria = cloudantDB.db.use(process.env.CLOUDANT_DBCATEG);
const dbFundos = cloudantDB.db.use(process.env.CLOUDANT_DBFUNDOS);
const dbExpec = cloudantDB.db.use(process.env.CLOUDANT_DBEXPECTATIVA);

var cloudant = {

    get : (req, res) => {

        var id = req.params.id;

        db.get(id, function(err, data) {
            res.status(200).json(data);
        });
    },

    insertChat : (req, res) => {

        var dados = req.body;
        dados["dateText"] = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});
        dados["treinado"] =false;
        dados["ativo"] = true;

        db.insert(dados,'doc_'+req.body.config.data.context.conversation_id+'_'+new Date().getTime(), function(err, body, header) {
            if (err) {
                return console.log('[db.insert] ', err.message);
            }
            res.status(201).json(body);
        });
    },

    insertOutros : (req, res) => {

        var dados = {
            idchat: req.body.idchat,
            texto: req.body.texto,
            treinado: false,
            data: new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"})
        }

        dbOutros.insert(dados,(err, body, header) => {

            if (err) {
                console.log('[dbOutros.insert] ', err.message);
            }
            res.status(201);

        });
    },

    insertUser : (req, res) => {

        var dataNow = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

        dbUser.insert({
            nome: req.body.nome,
            email: req.body.email,
            chatId:req.body.chatId,
            data: dataNow },(err, body, header) => {

                if (err) {
                    return console.log('[dbUser.insert] ', err.message);
                }
                res.status(201).send("/chat");
            });
    },

    insertAval : (req, res) => {

        var dataNow = new Date().toLocaleString("pt-BR", {timeZone: "America/Sao_Paulo"});

        dbAval.insertok({
            chatId: req.body.chatId,
            nome: req.body.nome,
            email: req.body.email,
            gostou: req.body.gostou,
            interface: req.body.interface,
            recomenda: req.body.recomenda,
            comentario: req.body.comentario,
            data: dataNow },(err, body, header) => {

            if (err) {
                return console.log('[dbAval.insert] ', err.message);
            }
            res.status(201);
        });

    },

    getQuestionario : (req, res) => {
        
        dbQuestionario.list({include_docs: true}, (err, data) => {
            if (err) {
                return res.status(500).json(err);
            }
            return res.status(200).json(data);
        });
    },

    getCategoria : (req, res) => {

        var query = {
            "selector": {
                "range": {
                    "$elemMatch": {
                        "$gte":0,
                        "$lt": parseInt(req.params.peso)
                    }
                }
            },
            "fields": ["categoria", "investimentos", "mensagem"]
        };

        dbCategoria.find(query, (err, data) => {

            if (err) {
                res.status(501).json(err);
            } else {
                res.status(200).json(data.docs[data.docs.length-1]);
            }

        });
        
    },

    getFundo : (req, res) => {

        var riscos = [];
        var valores = JSON.parse(req.params.info);

        for (var txt in valores.risco) {
            riscos.push({'risco': valores.risco[txt]})
        }

        var query = {
            "selector": {
                "$and": [
                    {
                        "$or": riscos
                    },
                    {
                        "aplicacaoMinima": {
                            "$lte": parseFloat(valores.minimo)
                        }
                    }
                ]
            },
            "fields": [
                "_id",
                "seguradora",
                "categoria",
                "nome",
                "aplicacaoMinima",
                "taxaAdm",
                "rentabilidadeMensal",
                "rentabilidadeAnual",
                "rentabilidade12Meses",
                "risco"
            ],
            "sort":[
                {"taxaAdm":"asc"}
            ]
        };

        dbFundos.find(query, (err, data) => {

            if (err) {
                res.status(501).json(err);
            } else {
                res.status(200).json(data);
            }

        });

    },

    getValorMinimo : (req,res) => {
      
        var query = {
            "selector": {
                "aplicacaoMinima": {
                    "$gt": 0
                }
            },
            "limit": 1,
            "fields": [
                "aplicacaoMinima"
            ],
            "sort": [{
                "aplicacaoMinima": "asc"
            }]
        };

        dbFundos.find(query, (err, data) => {

            if (err) {
                res.status(501).json(err);
            } else {
                res.status(200).json(data);
            }

        });

    },

    getExpectativa : (req, res) => {

        var info = JSON.parse(req.params.info);

        var query = {
            "selector": {
                "$and": [
                    {
                        "map.tipo": {
                            "$eq": info.tipo
                        }
                    },
                    {
                        "map.idade": {
                            "$eq": parseInt(info.idade)
                        }
                    }
                ]
            }
        };

        dbExpec.index({
            type: 'json',
            index: {
                fields: ['tipo','idade']
            }
        });
        
        dbExpec.find(query, (err, data) => {

            if (err) {
                res.status(501).json(err);
            } else {
                res.status(200).json(data.docs[0].map);
            }

        });
        
    }

};

module.exports = cloudant;