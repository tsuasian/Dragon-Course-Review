'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import Course from '../model/course.js';
import Watchlist from '../model/watchlist.js';
const watchlistRouter = module.exports = new Router();

watchlistRouter.post('/watchlist/add', (req, res, next) => {
	var watch_record = new Watchlist({...req.body});
	watch_record.save(function (err) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
			return;
		}
		res.send({success: true});
	});
})

watchlistRouter.get('/watchlist', (req, res, next) =>{
	var courseList = [];
	Watchlist.find({ 'student_id': req.query.user_id}, 'course_id')
	.distinct('course_id')
	.exec(function(err, courses) {
		if (err) {
			console.log(err);
			res.status(500).send(err);
			return;
		}
		for(var i=0; i<courses.length; i++){
			courseList.push(courses[i].course_id);
		}
		const query = Course.find({"id": courseList});
		query.select('id name surveyRating reviewRating description');
		query.exec(function(err, course) {
			if (err) {
				console.log(err);
				res.status(500).send(err);
				return;
			}
			res.send(JSON.stringify(course));
		});
	});
});

watchlistRouter.get('/search/get_list', function(req, res){
	const query = Watchlist.find();
	query.select("course_id student_id")
	query.exec(function(err, list){
		if (err) throw err;
		res.send(JSON.stringify(list));
	});

});

watchlistRouter.get('/course/test', function(req, res){
	const query = Course.findOne({"id": 0});
	        query.select("id name")
	        query.exec(function(err, list){
			                if (err) throw err;
			                res.send(JSON.stringify(list));
			        });
});
