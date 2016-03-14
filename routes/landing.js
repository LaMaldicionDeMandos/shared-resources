/**
 * Created by boot on 3/12/16.
 */
var authenticationService = require('../services/authenticationService');
exports.register = function(req, res) {
    var user = req.body;
    if (!authenticationService.validateRegisterCredentials(user)) {
        res.status(400).send("invalid");
    }
    else {
        var promise = authenticationService.existUser(user);
        promise.then(
            function (result) {
                if (result) {
                    res.status(400).send("already_exist_user");
                } else {
                    authenticationService.create(user).then(
                        function () {
                            res.status(201).send();
                        },
                        function (err) {
                            res.status(400).send(err);
                        }
                    );
                }
            },
            function (err) {
                res.status(400).send(err);
            }
        );
    }
};