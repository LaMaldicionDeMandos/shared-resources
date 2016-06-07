/**
 * Created by boot on 4/10/16.
 */
exports.profile = function(req, res) {
    var id = req.params.id;
    res.render('partials/profile', {profileId: id});
};
exports.partials = function(req, res) {
    res.render('partials/' + req.params.view);
};