/**
 * Created by boot on 3/13/16.
 */
var mailer = require('nodemailer');
function Mailer(password) {
    var transporter = mailer.createTransport({
        service: config.email_service,
        auth: {
            user: config.email_app,
            pass: password
        }
    });
    var mailOptions = {
        from: 'no-reply <no-reply@sharedresources.com>', // sender address
        to: '', // list of receivers
        subject: '', // Subject line
        html: '' // plaintext body
    };

    this.send = function(to, subject, text) {
        mailOptions.to = to;
        mailOptions.subject = subject;
        mailOptions.html = text;
        transporter.sendMail(mailOptions, function(error, info){
            if(error){
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    };
};

function Email(to, subject, message) {
    this.to = to;
    this.subject = subject;
    this.message = message;
};

function EmailBuilder(to) {
    var that = this;
    this.to = to;
    this.subjectTemplate  = '';
    this.messageTemplate = '';
    this.subjectParams = [];
    this.messageParams = [];
    this.withTo = function(to) {
        that.to = to;
        return that;
    };
    this.withSubject = function(subject) {
        that.subjectTemplate = subject;
        return that;
    };
    this.withMessage = function(message) {
        that.messageTemplate = message;
        return that;
    };
    this.withMessageParams = function() {
        that.messageParams = arguments;
        return that;
    };
    this.withSubjectParams = function() {
        that.subjectParams = arguments;
        return that;
    };
    this.build = function() {
        var subject = replaceAll(that.subjectTemplate, that.subjectParams);
        var message = replaceAll(that.messageTemplate, that.messageParams);
        return new Email(that.to, subject, message);
    };
    var replaceAll = function(template, params) {
        var buffer = template;
        for (var i = 0; i < params.length; i++) {
            buffer = buffer.replace('%s', params[i]);
        }
        return buffer;
    };
};
function EmailService(password) {
    this.password = password;
    this.builder = function(to, template) {
        var builder = new EmailBuilder(to);
        if (template) {
            builder.withSubject(template.subject);
            builder.withMessage(template.message);
        }
        return builder;
    };
    this.send = function(email) {
        var mailer = new Mailer(this.password);
        mailer.send(email.to, email.subject, email.message);
    };
};

EmailService.ACTIVE_USER_TEMPLATE = {
    subject: config.activate_user_email_subject,
    message: config.activate_user_email_html
};

module.exports = EmailService;
