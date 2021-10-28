import mongoose from 'mongoose';
import Course from '../model/course.js';
import Section from '../model/section.js';

const Schema = mongoose.Schema;

const surveySchema = mongoose.Schema({
	name: String, 
	inst_id: String,
	course: {type: Schema.Types.ObjectId, ref: 'course'},
	section: {type: Schema.Types.ObjectId, ref: 'section'},
	questions: [{ type: Schema.Types.ObjectId, ref: 'question' }],
	visibility: String,
});

const questionSchema = mongoose.Schema({
	survey: {type: Schema.Types.ObjectId, ref: 'survey'},
	type: String,
	choices: [String],
	maxRating: Number,
	question_text: String
});

const answerSchema = mongoose.Schema({
	question: {type: Schema.Types.ObjectId, ref: 'question'},
	survey: {type: Schema.Types.ObjectId, ref: 'survey'},
	answer_text: String,
	rating: Number,
	student_id: String
});

const Survey = mongoose.model('survey', surveySchema);
const Question = mongoose.model('question', questionSchema);
const Answer = mongoose.model('answer', answerSchema);

module.exports = {Survey, Question, Answer};

