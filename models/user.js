var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;

var userSchema = new Schema({
	local: {
		name: { type: String },
		email: { type: String },
		password: { type: String }
	},
	facebook: {
		id: String,
		token: String,
		email: String,
		name: String
	}
});

userSchema.methods.generateHash = function(password) {
	    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
 return bcrypt.compareSync(password, this.local.password);
};

userSchema.statics.isValidName = function(name) {
	var pattern = /^[0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;
	return name.length > 1 && !pattern.test(name);
};


// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);
