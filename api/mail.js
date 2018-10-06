require('dotenv-safe').load();
var nodemailer = require('nodemailer');
var inlineCss = require('nodemailer-juice');

var usuario = process.env.MAIL_USER;
var senha = process.env.MAIL_PASSWORD;
var assunto = process.env.MAIL_SUBJECT;

var smtpTransport = nodemailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: parseInt(process.env.MAIL_PORT, 10),
    secure: true,
    auth: {
        user: usuario,
        pass: senha
    }
});

smtpTransport.use('compile', inlineCss());

var correio = {

    enviaCorreio: function (req, res, next) {

        var css = '';
        var txtHtml = '';        


        txtHtml ='<b>E-mail:</b><br>' + req.body.email + '<br>' +
            '<br><b>Nome:</b><br>' + req.body.nome + '<br>' +
            '<br><b>Aporte:</b><br>' + parseFloat(req.body.valorInvest).toLocaleString('pt-br',{style:'currency',currency: 'BRL'}) + '<br>' +
            '<br><b>Questionário:</b>';

        for(var x=0; x < req.body.questoes.length; x++){
            txtHtml+= '<br>' + req.body.questoes[x].pergunta + '<br>' + req.body.questoes[x].resposta + '<br>';
        }

        txtHtml+= '<br><b>Perfil: </b>' + req.body.categoria + '<br>';
        txtHtml+= '<br><b>Fundos: </b><br>';

        for(var y=0; y < req.body.fundos.length; y++){
            txtHtml+= req.body.fundos[y].seguradora + ': ' + req.body.fundos[y].nome + '<br>';
        }

        var mailOptions = {
            from: 'PREVBOT <' + usuario + '>',
            sender: 'PREVBOT <' + usuario + '>',
            to: process.env.MAIL_SENDTO,
            subject: assunto,
            text: '',
            html: css + txtHtml
        };

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send('Message sent: ' + JSON.stringify(response));
            }
        });
    },

};

module.exports = correio;
