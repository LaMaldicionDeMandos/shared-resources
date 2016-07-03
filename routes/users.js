/**
 * Created by boot on 5/9/16.
 */
var UserService = require('../services/UserService');
var userService = new UserService(db);
exports.findById = function(req, res) {
    var id = req.params.id;
    userService.findById(id).then(
        function(user) {
            res.send(user);
        },
        function(error) {
            res.status(400).send(error);
        }
    );
    console.log('Find User by Id');
};

exports.update = function(req, res) {
    var user = req.body;
    var owner = req.user;
    userService.update(user, owner).then(
        function(user) {
            res.send(user);
        },
        function(error) {
            res.status(400).send(error);
        }
    );
    console.log('Find User by Id');
};

exports.findMe = function(req, res) {
    var id = req.user._id;
    userService.findById(id).then(
        function(user) {
            res.send(user);
        },
        function(error) {
            res.status(400).send(error);
        }
    );
    console.log('Find User by Id');
};