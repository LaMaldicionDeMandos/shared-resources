/**
 * Created by boot on 3/13/16.
 */
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
function EmailService() {
    this.ACTIVE_USER_TEMPLATE = {
        subject: 'Activa tu cuenta de Shared Resources',
        message: 'Felicitaciones por crear tu cuenta de Shared Resources.\n' +
        'Tu usuario es %s.\n' +
        'Puedes activar tu cuenta en %s\n' +
        'Muchas gracias por utilizar nuestros servicios.\n' +
        'El equipo de Shared Resources.'
    };
    this.builder = function(to, template) {
        var builder = new EmailBuilder(to);
        if (template) {
            builder.withSubject(template.subject);
            builder.withMessage(template.message);
        }
        return builder;
    }
};

var emailService = new EmailService();

module.exports = emailService;
