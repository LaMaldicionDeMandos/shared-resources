/**
 * Created by boot on 3/12/16.
 */
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var UserSchema = new Schema({_id:String, username:String, password:String, email:String, role: String, state:String,
    buildingId:String});
var BuildingSchema = new Schema({_id:String});


var User = mongoose.model('User', UserSchema);
var Building = mongoose.model('Building', BuildingSchema);

var db = function(credentials) {
    mongoose.connect(credentials);
    var Schema = mongoose.Schema;
    console.log('Connecting to mongodb');
    this.mongoose = mongoose;
    this.Schema = Schema;
    this.ObjectId = mongoose.Types.ObjectId;
    this.User = User;
    this.Building = Building;
};

process.on('exit', function() {
    console.log('Desconnecting db');
    mongoose.disconnect();
});

module.exports = db;