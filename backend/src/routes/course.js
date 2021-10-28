'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import Course from '../model/course.js';

const courseRouter = module.exports = new Router();

courseRouter.post('/course/add', (req, res, next) => {
	console.log('hit /course/add')

	console.log(req.body)

	var course = new Course({...req.body});

	course.save(function (err) {
		if (err) return handleError(err);
		console.log("Saved")
	});

	Course.create(req.body)
	.then(token => res.send(token))
	.catch(next)
})

courseRouter.get('/course', (req, res, next) => {
	console.log('hit /')
	console.log("Course: " + req.query.name)

	Course.find({ 'name': req.query.name}, 'id name title section number reviewRating surveyRating description instructorDescr', function (err, course) {
		if (err) return handleError(err);
		for(var i = 0; i < course.length; i++){
			console.log(course[i])
		}
		res.send(JSON.stringify(course));
	})

})

courseRouter.get('/search/course', (req, res, next) =>{
        let re= new RegExp(req.query.name, 'i')
        Course.find({$or: [{name: re}, {title: re}]}, "name title surveyRating reviewRating description").exec(
        	function(err, courses){
        		if(err) throw err;
       			res.send(JSON.stringify(courses));
        	}
	);        
});

courseRouter.get('/search/get_courses', function(req, res){
	const query = Course.find();
	query.select("id name title")
	query.sort("title name")
	query.exec(function(err, courses){
		if (err) throw err;
		res.send(JSON.stringify(courses));
	});

});

courseRouter.get('/course/remove', function(req, res){
	        Course.findByIdAndRemove(req.query.id, function(err, course){
			                if(err) throw err;
			                return res.status(200).send({success: true});
			        });
});
