'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import Review from '../model/review.js';
import Course from '../model/course.js';

const reviewRouter = module.exports = new Router();

reviewRouter.post('/review/add', (req, res, next) => {
	console.log(req.body);
	var review = new Review({...req.body});
	review.save(function (err, review) {
		if (err) {
			res.status(500).send(err);
		}
		else {
			getAverage(req.body.course_id);
			res.send(review);
		}
	});
})

function getAverage(val){
	var num = parseInt(val, 10);
	Review.aggregate([{$match: { course_id: num}}, {$group: { _id: "$course_id", average: {$avg: "$course_rating"}}}], function(err, result){
		if(err){
			console.log(err);
		}
		console.log(result)
		var newReviewRating = result[0].average;
		console.log(newReviewRating);	
		const filter = {id: num};
		const update = {reviewRating: newReviewRating};
		Course.findOneAndUpdate(filter, update, function(err, result){
			if(err){
				console.log(err);
			}
			console.log(result);
		});
	})
}

reviewRouter.get('/get_reviews', function(req, res){
	const query = Review.find({ 'course_id' : req.query.course_id});
	query.select("id time content course_rating course_id")
	query.exec(function(err, reviews){
		if (err) throw err;
		console.log(reviews.time);
		res.json(reviews);
	});

});

reviewRouter.get('/get_all_reviews', function(req, res){
        const query = Review.find();
        query.select("id time content course_rating course_id section_id")
        query.exec(function(err, reviews){
                if (err) throw err;
                console.log(reviews.time);
                res.json(reviews);
        });

});

reviewRouter.get('/remove', function(req, res){
	Review.findByIdAndRemove(req.query.id, function(err, review){
		if(err) throw err;
		return res.status(200).send({success: true});
	});
});
