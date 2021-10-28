'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import Instructor from '../model/instructor.js';

const instructorRouter = module.exports = new Router();

instructorRouter.post('/instructor/add', (req, res, next) => {
	var instructor = new Instructor({...req.body});

	instructor.save(function (err) {
		if (err) {
			res.send(err);
		}
		else{
			res.send(instructor);
		}
	});
})

instructorRouter.get('/search/get_instructors', function(req, res){
	const query = Instructor.find();
	query.select("name email")
	query.exec(function(err, inst){
		if (err) {
			res.send(err);
		}
		else{
			res.send(JSON.stringify(inst));
		}
	});

});

instructorRouter.get('/search/instructor_by_email', (req, res) => {
	Instructor.find({email: req.query.email}, function(err, inst){
		if (err) {
			res.send(err);
		}
		else{
			res.send(JSON.stringify(inst));
		}
	});


})

instructorRouter.get('/instructor/get_instructor', (req, res) => {
	Instructor.findById(req.query.id, function(err, inst){
		if(err){
			res.status(500).send(err);
			console.log(err);
			return;
		}
		res.send(inst);
	})
})

instructorRouter.get('/instructor/remove', function(req, res){
	Instructor.findByIdAndRemove(req.query.id, function(err, instructor){
		if(err) {
			res.send(err);
		}
		else{
			res.status(200).send({success: true});
		}
	});
});
