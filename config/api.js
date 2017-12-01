var nodemailer = require("nodemailer");

var smtpTransport = nodemailer.createTransport({
    host: "mail.vbofficeware.com.br",
    port: 25,
    secure: false,
    auth: {
        user: "rodrigo.florentino@vbofficeware.com.br",
        pass: "phenrique3"
    }
});

var correio = {

    enviaCorreio: function (req, res, next) {

        var mailOptions = {
            from: req.body.from,
            sender: req.body.from,
            to: req.body.sendTo,
            cc: req.body.copyTo,
            subject: req.body.subject,
            text: req.body.vtext,
            html: req.body.vhtml
        }

        smtpTransport.sendMail(mailOptions, function (error, response) {
            if (error) {
                res.status(500).send(error);
            } else {
                res.status(200).send("Message sent: " + JSON.stringify(response));
            }
        });
    },

};

module.exports = correio;