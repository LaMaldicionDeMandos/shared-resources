/**
 * Created by boot on 5/9/16.
 */
var EmailService = require('../services/email_service');
var UserService = require('../services/UserService');
var userService = new UserService(db);
var emailService = new EmailService(process.env.APP_PASSWORD);
var ACTIVE_USER_URL = config.host + '/user/active/';
exports.new = function(req, res) {
    var owner = req.user;
    var user = req.body;
    userService.createAdmin(user, owner).then(
        function(_user) {
            var email = emailService.builder(_user.email, EmailService.ACTIVE_ADMIN_TEMPLATE)
                .withMessageParams(_user.username, ACTIVE_USER_URL + _user._id, _user.password).build();
            emailService.send(email);
            res.status(201).send(_user);
        },
        function(error) {
            res.status(400).send(error);
        }
    );
    console.log('New Admin User');
};

exports.list = function(req, res) {
    var owner = req.user;
    userService.findAdmins(owner).then(
        function(admins) {
            res.send(admins);
        },
        function(error) {
            res.status(400).send(error);
        }
    );
    console.log('Get admins');
};

exports.edit = function(req, res) {
    var owner = req.user;
    var user = req.body;
    userService.editAdmin(user, owner).then(
        function(_user) {
            res.status(200).send(_user);
        },
        function(error) {
            res.status(400).send(user);
        }
    );
    console.log('Edit admin');
};