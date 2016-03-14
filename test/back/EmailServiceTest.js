/**
 * Created by boot on 3/13/16.
 */
var assert = require('assert');

var service = require('../../services/email_service');
describe('EmailService', function() {
    describe('use the active user template', function() {
        it('should replace correctly the template with user and url', function() {
            var builder = service.builder('aaa', service.ACTIVE_USER_TEMPLATE);
            builder.withMessageParams('mandos', 'url');
            var email = builder.build();
            assert.equal(email.to, 'aaa');
            assert.equal(email.subject, service.ACTIVE_USER_TEMPLATE.subject);
            assert.equal(email.message, 'Felicitaciones por crear tu cuenta de Shared Resources.\n' +
                'Tu usuario es mandos.\n' +
                'Puedes activar tu cuenta en url\n' +
                'Muchas gracias por utilizar nuestros servicios.\n' +
                'El equipo de Shared Resources.');
        });
    });
    describe('build subject and message with params', function() {
        it('should replace all params', function() {
            var builder = service.builder('aaa');
            var subject = 'a: %s';
            var message = 'b: %s, c: %s, d: 4';
            builder.withSubject(subject);
            builder.withMessage(message);
            builder.withSubjectParams('1');
            builder.withMessageParams('2', '3');
            var email = builder.build();
            assert.equal(email.to, 'aaa');
            assert.equal(email.subject, 'a: 1');
            assert.equal(email.message, 'b: 2, c: 3, d: 4');
        });
        it('should replace only equal number of params', function() {
            var builder = service.builder('aaa');
            var subject = 'a: %s';
            var message = 'b: %s, c: %s, d: 4';
            builder.withSubject(subject);
            builder.withMessage(message);
            builder.withMessageParams('2', '3', '5');
            var email = builder.build();
            assert.equal(email.to, 'aaa');
            assert.equal(email.subject, 'a: %s');
            assert.equal(email.message, 'b: 2, c: 3, d: 4');
        });
    });
});