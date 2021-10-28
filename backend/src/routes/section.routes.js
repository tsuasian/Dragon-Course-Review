'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import Section from '../model/section.js';
import Course from '../model/course.js';

const sectionRouter = module.exports = new Router();

sectionRouter.post('/section/add', (req, res, next) => {
	console.log('hit /section/add')


	console.log(req.body)
	var courseName = req.body.name
	console.log(courseName)
	var courseId = null

	Course.find({ 'name': courseName }, 'id', function (err, course) {
		if (err) {
			console.log("No such course")
		}
		console.log(course[0].id)
		courseId = course[0].id

		var section = new Section({'courseId': courseId.toString(), ...req.body})

		section.save(function (err) {
			console.log("Saved")
		});
	})
})

sectionRouter.get('/section', (req, res, next) => {
	console.log('hit /sections')
	console.log("Course: " + req.query.name)

	var courseName = req.query.name
	var courseId = null

	Course.find({ 'name': courseName}, 'id', function (err, course) {
		if (err) {
			res.status(500).send(err);
			return;
		}
		if (course === undefined || course.length == 0) {
			console.log("No such course")
			res.send("No sections")
		} else {
			courseId = course[0]._id
		}
		console.log(course)

		Section.find({ 'courseId': courseId}, 'number reviewRating surveyRating', function (err, section) {
		if (err) {
			console.log(err)
			return;
		}
		for(var i = 0; i < section.length; i++) {
			console.log(section[i])
		}
		res.send(JSON.stringify(section));
	})
	})
})

sectionRouter.get('/search/section', (req, res) => {
	var query = Section.find()
	query.exec(function(err, sections){
		                if (err) throw err;
		                res.send(JSON.stringify(sections));
	});
})

sectionRouter.get('/section/remove', function(req, res){
                Section.findByIdAndRemove(req.query.id, function(err, section){
                                        if(err) throw err;
                                        return res.status(200).send({success: true});
                                });
});
