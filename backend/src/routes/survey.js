'use strict'

import { Router } from 'express';
import bodyParser from 'body-parser';
import { Survey, Question, Answer } from '../model/survey.js';
import Course from '../model/course.js';
import Section from '../model/section.js';
const surveyRouter = module.exports = new Router();

surveyRouter.post('/survey/add', (req, res, next) => {
	var survey = new Survey({...req.body});
	survey.questions = [];

	survey.save(function (err) {
		if (err) {
			res.status(500).send(err)
		}
		else{
			console.log("Saved")
			res.send(survey);
		}
	});
})

surveyRouter.post('/question/add', (req, res, next) => {
	var question = new Question({...req.body});
	console.log(req.body);
	question.save(function (err) {
		if (err) {
			res.status(500).send(err);
		}
		else{
			Survey.findById(req.body.survey, function(err, docs){
				if (err) {
					res.status(500).send(err);
				}
				else{
					if(docs === null){
                        			res.status(400).send({success: false});
                        			return;
					}
					docs.questions.push(question);
					docs.save(function(err){
						if (err) {
							res.status(500).send(err);
						}
						else {
							res.send(question);
						}
					});
				}
			});
		} 
	});
});

async function updateRating(survey_id){
	var survey = await Survey.findById(survey_id);
	var surveys = await Survey.find({course: survey.course});
	var answers = await Answer.find({"survey": { $in: surveys.map((survey) => survey._id)},
					 "question": {$type: 10}
					})
	//Type 10 means null type.
	var course = await Course.findById(survey.course);
	course.surveyRating = answers.map((answer) => answer.rating).reduce((a, b) => (a+b)) / answers.length;
	var fin = await course.save();
	console.log(fin);
	//Could do same for section but not necessary at this time.

}

surveyRouter.post('/answer/add', function(req, res, next){
	var answer = new Answer(req.body);
	answer.save(function(err, answer){
		if ( err ) {
			res.status(500).send(err);
		}
		else {
			console.log(answer.question);
			if(answer.question == null){
				try{
					updateRating(answer.survey);
				}
				catch(err) {
					console.log("Error updating rating.", err);
				}
			}
			res.send({success: true});
		}
	});
});

surveyRouter.post('/survey/set_visibility', function(req, res, next){
	console.log(req.body);
	Survey.findById(req.body.survey, function(err, survey){
                if(err) {
                        res.status(500).send(err);
			return;
                }
		console.log(survey);
		if(survey === null){
			res.status(400).send({success: false});
			return;
		}
		survey.visibility = req.body.visibility;
		survey.save(function(err) {
			if(err) {
                                res.status(500).send(err);
			}
                        else{
				res.send({success: true});
			}
		});
	});	
});

surveyRouter.post('/survey/set_section', function(req, res, next){
        Survey.findById(req.body.survey, function(err, survey){
                if(err) {
                        res.status(500).send(err);
                }
                survey.section = req.body.section;
		survey.course = req.body.course;
                survey.save(function(err) {
                        if(err) {
                                res.status(500).send(err);
                        }
                        else{
                                res.send({success: true});
                        }
                });
        });
});

surveyRouter.get('/get_surveys_by_instructor', function(req, res){
	Survey.find({inst_id: req.query.inst_id})
		.populate('questions')
		.populate({path: 'section', populate: {path: "courseId"}})
		.exec(function(err, doc){
		if (err) {
			res.status(500).send(err);
		}
		else{
			res.json(doc);
		}
	});
});

surveyRouter.get('/get_surveys_by_course', function(req, res){
        Survey.find({course: req.query.course_id})
		.populate('questions')
		.populate({path: 'section', populate: {path: "courseId"}})
		.exec(function(err, doc){
                if (err){ 
			res.status(500).send(err);
		}
		else {
                	res.json(doc);
		}
        });
});

surveyRouter.get('/survey/get', function(req, res){
	Survey.find()
		.populate("questions")
		.populate({path: 'section', populate: {path: "courseId"}})
		.exec(function(err, doc){
		if (err) {
			res.status(500).send(err);
		}
		else { 
			res.json(doc);
		}
	});
});

surveyRouter.get('/survey/get_by_id', function(req, res){
	Survey.findById(req.query.survey)
	.populate("questions")
	.populate({path: 'section', populate: {path: 'courseId'}})
	.exec(function(err, survey){
		if (err) {
			res.status(500).send(err);
		}
		else{
			res.json(survey);
		}
	})
})

surveyRouter.get('/survey/get_answers', function(req, res){
	Answer.find().exec(function(err, doc){
		if(err) {
			res.status(500).send(err);
		}
		else {
			res.json(doc);
		}
	});
});

surveyRouter.get('/survey/get_rating_by_course', function(req, res){
		Survey.find({course: req.query.course_id})
		.exec(function(err, surveys){
			if(err){
				res.status(500).send(err);
				return;
			}
			//Type 10 is Null type.
			Answer.find({"survey": { $in: surveys.map((survey) => survey._id)}, "question": {$type: 10}})
			.exec(function(err, answers){
				if(err){
					res.status(500).send(err);
					return;
				}

				var ratings = answers.map((answer) => answer.rating);
				res.send({"ratings": ratings})
				/*
				if(answers.length == 0){
					res.send({"survey_rating": "N/A"})
					return;
				}
				var avg_rating = 0;
				for(var answer of answers){
					avg_rating += answer.rating;
				}
				avg_rating = avg_rating / answers.length;
				res.send({"survey_rating": avg_rating})
				*/
			})
		})
})

surveyRouter.post('/survey/update', function(req, res){
	console.log(req.body);
	Survey.findById(req.body.survey, function(err, survey){
		if(err) {
			res.status(500).send(err);
		}
		else {
			for( var question of req.body.questions ){
				Question.findByIdAndUpdate(question._id, {question_text: question.question_text, survey: question.survey, type: question.type}, function(err, docq){
					if(err) console.log(err);
				});
			}
			survey.questions = req.body.questions
			survey.name = req.body.name;
			survey.save(function(err) {
				if(err) {
					console.log(err);
					res.status(500).send(err);
				}
				else{
					res.send({success: true});
				}
			})

		}
	});
});



async function getQuestionAnswers(survey_id){
	var survey = await Survey.findById(survey_id).populate('questions');
	console.log("survey:", survey);
	var qa = [];
	for(var i=0; i<survey.questions.length; i++){
		var question = survey.questions[i];
		console.log("question:", question);
		var answers = await Answer.find({question: question._id});
		console.log("answer:", answers);
		qa.push({question: question, answers: answers})
		/*for(var j=0; j<answers.length; j++){
			var answer = answers[j];
			answer.question_test = question;
			console.log("answer:", answer);
			qa.push(answer)
		}*/

	}
	return qa;
}

surveyRouter.get('/survey/get_question_answers', function(req, res){
	getQuestionAnswers(req.query.id)
	.then((qa) => res.json(qa))
	.catch((err) => {
		console.log(err);
		res.status(500).send(err);
	})
})

surveyRouter.get('/survey/remove', function(req, res){
	Survey.findByIdAndRemove(req.query.id, function(err, section){
		if(err) {	
			res.status(500).send(err);
		}
		else{
			res.status(200).send({success: true});
		}
	});
});

surveyRouter.get('/survey/question/remove', function(req, res){
        Question.findByIdAndRemove(req.query.id, function(err, question){
                if(err) {
                        res.status(500).send(err);
                }
                else{
                        res.status(200).send({success: true});
			Survey.findById(question.survey, function(err, survey){
				if(err){
					res.status(500).send(err);
				}
				else{
					survey.questions = survey.questions.filter((q) => (q._id != req.query.id));
					survey.save(function(err){
						if(err) res.status(500).send(err);
					});
				}
			});
                }
        });
});
