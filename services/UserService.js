/**
 * Created by boot on 5/8/16.
 */
var q = require('q');
function UserService(db) {
    var validateExistence = function(query, shouldExist) {
        var def = q.defer();
        db.User.where(query).count().exec(function(err, result) {
            if (err) {
                def.reject(err);
            } else {
                if((shouldExist && result == 0) || (!shouldExist && result > 0)) {
                    def.reject(shouldExist ? 'not_exist' : 'exist');
                } else {
                    def.resolve();
                }
            }
        });
        return def.promise;
    };
    this.createAdmin = function(dto, owner) {
        var def = q.defer();
        var query = {email: dto.email, buildingId: owner.builderId};
        validateExistence(query, false).then(
            function() {
                var user = new db.User();
                user._id = db.ObjectId().toString();
                user.username = dto.username;
                user.password = dto.password;
                user.email = dto.email;
                user.role = 'admin';
                user.state = 'waiting';
                user.buildingId = owner.buildingId;
                user.save(function(err) {
                    if(err) {
                        def.reject(err);
                    } else {
                        def.resolve(user);
                    }
                });
                return def.promise;
                def.resolve(dto);
            },
            function(error) {
                def.reject(error);
            }
        )
        return def.promise;
    };
};

module.exports = UserService;