import mongoose from 'mongoose';
import Course from './course.js';


const sectionSchema = mongoose.Schema({
	courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course', required: true },
	quarter: { type: String, required: true },
	number: { type: String, required: true },
	reviewRating: { type: Number },
	surveyRating: { type: Number },
	description: { type: String },
	crn: { type: String },
	instructorDescr: { type: String }
});

sectionSchema.methods.getName = function () {
	console.log(this.name);
	return this.name;
}

const Section = module.exports = mongoose.model('section', sectionSchema)
