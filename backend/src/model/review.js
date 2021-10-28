import mongoose from 'mongoose';
const AutoIncrement = require('mongoose-sequence')(mongoose);

const reviewSchema = mongoose.Schema({
	id: { type: Number , unique: true},
	content: {type: String, required: true},
	course_rating: {type: Number, required: true},
	course_id: {type: Number},
	section_id: {type: String},
	time : { type : Date, get: fmt_date, default: Date.now }
}, {toJSON: {getters: true}});

function fmt_date(date){
	return (1900 + date.getYear())
               + "/" + String(date.getMonth()+1).padStart(2, '0')
               + "/" + String(date.getDate()).padStart(2, '0');
	
}

reviewSchema.plugin(AutoIncrement, {inc_field: 'id'});

const Review = module.exports = mongoose.model('review', reviewSchema)
