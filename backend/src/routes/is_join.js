'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import Section from '../model/section.js';
import Instructor from '../model/course.js';
import IS_Join from '../model/is_join.js';
import Watchlist from '../model/watchlist.js';
import Course from '../model/course.js';
const isRouter = module.exports = new Router();

isRouter.get('/search/is', (req, res) => {
	var query = IS_Join.find().populate({path: 'section', populate: {path: 'courseId'}}).populate('instructor');
	query.exec(function(err, sections){
		                if (err) throw err;
		                res.send(JSON.stringify(sections));
	});
})

isRouter.get('/get_sections_by_instructor', (req, res) => {
	var query = IS_Join.find({instructor: req.query.id}).populate({path: 'section', populate: {path: 'courseId'}}).populate('instructor');
        query.exec(function(err, sections){
                                if (err) throw err;
                                res.send(JSON.stringify(sections));
        });
})

isRouter.get('/get_is_watchlist', (req, res) =>{
	Watchlist.find({'student_id': req.query.user_id}, 'course_id', function(err, courses) {
		if(err){
			console.log(err);
			res.status(500).send(err);
			return;
		}
		Course.find({'id': {'$in': courses.map((course) => course.course_id)}}, function(err, doc){
			if(err){
				console.log(err);
				res.status(500).send(err);
				return;
			}
			var course_db_ids = doc.map((course) => course._id)
			Section.find({"courseId": {"$in": course_db_ids}}, function(err, sections){
				if(err){
					console.log(err);
					res.status(500).send(err);
					return;
				}
				var query = IS_Join.find({section: {"$in": sections.map((section) => section._id)}}).populate({path: 'section', populate: {path: 'courseId'}}).populate('instructor'); 
				query.exec(function(err, is){
					if(err){
						console.log(err);
						res.status(500).send(err);
						return;
					}
					var dictionary = Object.assign({}, ...doc.map((x) => ({[x._id]: {"course": x, "instructors": []}})));
					for(var inst of is){
						console.log("dictionary", dictionary)
						var c = dictionary[inst.section.courseId._id];
						if(c.instructors.includes(inst.instructor.name))
							continue;
						var newi = c.instructors.concat([inst.instructor.name])
						c.instructors = newi;
						dictionary[inst.section.courseId._id] = c;
					}
					
					res.send(Object.values(dictionary));
				});

			})
		})
	})
})

isRouter.get('/get_instructors_by_course', (req, res) => {
	Section.find({'courseId': req.query.id})
	.exec(function(err, sections){
		if (err) {
			res.status(500).send(err);
			return;
		}
		if(sections.length == 0){
			res.status(400).send({});
			return;
		}
		var section = sections[0];
		var query = IS_Join.find({section: section._id}).populate({path: 'section', populate: {path: 'courseId'}}).populate('instructor');
        	query.exec(function(err, sections){
			if (err) {
				res.status(500).send(err);
				return;
			}
                        res.send(JSON.stringify(sections));
		})

	});
})


isRouter.get('/get_instructors_by_section', (req, res) => {
	var query = IS_Join.find({section: req.query.id}).populate({path: 'section', populate: {path: 'courseId'}}).populate('instructor');
        query.exec(function(err, sections){
                                if (err) throw err;
                                res.send(JSON.stringify(sections));
        });
})

isRouter.get('/is/remove', function(req, res){
	                IS_Join.findByIdAndRemove(req.query.id, function(err, course){
				                                        if(err) throw err;
				                                        return res.status(200).send({success: true});
				                                });
});
