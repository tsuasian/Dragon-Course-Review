import mongoose from 'mongoose';

const watchlistSchema = mongoose.Schema({
	student_id: { type: String, required: true},
	course_id: { type: Number, required: true},
});

const Watchlist = module.exports = mongoose.model('watchlist', watchlistSchema)
