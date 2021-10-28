import mongoose from 'mongoose';
const Schema = mongoose.Schema

const UserSchema = new Schema({
	username: {
		type: String,
		required: true
	},
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
  email: {
    type: String,
    required: true,
    unique: true
  },
	password: {
		type: String,
		required: true
	},
  created: {
    type: Date,
    default: () => new Date()
  }
});

const User = mongoose.model('User', UserSchema)

module.exports = User;
