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
})
