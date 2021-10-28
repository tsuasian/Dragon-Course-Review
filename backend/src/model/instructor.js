import mongoose from 'mongoose';
const Schema = mongoose.Schema
import User from './user.js';

const InstructorSchema = new Schema({
	name: {type: String},
	email: {type: String},
	user: {type: Schema.Types.ObjectId, ref: 'User'},
	created: {type: Date, default: () => new Date()}
});

const Instructor = mongoose.model('instructor', InstructorSchema)

module.exports = Instructor;
