/**
 * Created by boot on 4/6/16.
 */
exports.modals = function(req, res) {
    var view = req.params.view;
    res.render('modals/' + view);
};