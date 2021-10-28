import mongoose from 'mongoose';
import Section from './section.js';
import Instructor from './instructor.js';

const Schema = mongoose.Schema;

const joinSchema = mongoose.Schema({
	section: {type: Schema.Types.ObjectId, ref: 'section', required: true },
	instructor: { type: Schema.Types.ObjectId, ref: 'instructor', required: true }
});

const IS_Join = module.exports = mongoose.model('is_join', joinSchema)
