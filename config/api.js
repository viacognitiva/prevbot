require('dotenv-safe').load();
var nodemailer = require('nodemailer');
var inlineCss = require('nodemailer-juice');

var usuario = process.env.MAIL_USER;
var senha = process.env.MAIL_PASSWORD;
var enviado = 'Mister Xper '

var smtpTransport = nodemailer.createTransport({
    host: process.env.MAIL_SMTP,
    port: parseInt(process.env.MAIL_PORT,10),
    secure: false,
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

        if(req.body.sendTo == '-'){
            enviarP = usuario
        }else{
            enviarP = req.body.sendTo;
        }

        var mailOptions = {
            from: enviado + '<'+ usuario + '>',
            sender: enviado + '<'+ usuario + '>',
            to: enviarP,
            subject: req.body.subject,
            text: req.body.vtext,
            html: css + req.body.vhtml
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