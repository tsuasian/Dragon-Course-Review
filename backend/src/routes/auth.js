'use strict'
var express = require('express')
var router = express.Router()
import bodyParser from 'body-parser';
import passport from 'passport';
import LocalStrategy from 'passport-local'
import session from 'express-session'
import User from '../model/user.js';

export default function(passport) {

	router.get('/ping', (req, res, next) => {
	  console.log('hit /')
	  res.send("hello")
	})

	router.post('/signup', (req, res, next) => {
	  console.log(req.body)
		User.find({username: req.body.username})
		.then( (uniqueuser) => {
			if (uniqueuser.length !== 0) {
				console.log('user already exists', uniqueuser);
				res.send("username taken")
			} else if (req.body.username == "" ){
				console.log("username null");
				res.send("empty username")
			} else {
					//otherwise, save the result
					let user = {};
					user.username = req.body.username
					user.firstName = req.body.firstName
					user.lastName = req.body.lastName
					user.email = req.body.email
					user.password = req.body.password
					let newUser = new User(user)
					newUser.save()
					.then(function(user){
						console.log('SUCCESS', user);
						res.send(user);
					})
					.catch(function(error){
						console.log("ERROR", error);
						res.send(error)
					})
				}
			});
	})

	router.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (!err && user) {
        req.login(user, (err) => {
          if (err) {
            res.status(501)
              .json({ success: false, err: err });
          } else {
            res.status(200)
              .json({ success: true, user: user })
          }
        })
      } else {
        res.status(420)
          .json({ success: false })
      }
    })(req, res, next);
  });
	// router.post('/login', passport.authenticate('local'), (req, res) => {
	// 	console.log("req user", req.user)
	// });


  router.get('/getUser', (req, res, next) => {
    res.json({user: req.user})
  })

  router.get('/logout', function(req, res) {
    console.log('hit logout route');
    req.logout();
  });

	return router
}
