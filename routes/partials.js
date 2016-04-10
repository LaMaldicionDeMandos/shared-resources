/**
 * Created by boot on 4/10/16.
 */
exports.partials = function(req, res) {
    res.render('partials/' + req.params.view);
};