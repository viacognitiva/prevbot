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

smtpTransport.use('compile', inlineCss())

var correio = {

    enviaCorreio: function (req, res, next) {

        var enviarP = '';
        var css = '';
        var txtHtml = '';        

        var mailOptions = {
            from: 'PREVBOT <' + usuario + '>',
            sender: 'PREVBOT <' + usuario + '>',
            to: process.env.MAIL_SENDTO,
            subject: assunto,
            text: '',
            html: css + '<b>E-mail: </b>' + req.body.email + '<br><b>Nome: </b>' + req.body.nome +
            '<br><b>Aporte: </b>' + parseFloat(req.body.valorInvest).toLocaleString('pt-br',{style:'currency',currency: 'BRL'}) + 
            '<br><b>Perfil: </b>' + req.body.categoria + 
            '<br><b>Fundos: </b>' + req.body.fundos
        }

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