'use strict'

import cors from 'cors';
import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import authRouter from '../routes/auth';
import courseRouter from '../routes/course';
import sectionRouter from '../routes/section.routes.js';
import reviewRouter from "../routes/review";
import watchlistRouter from "../routes/watchlist";
import surveyRouter from "../routes/survey";
import instructorRouter from "../routes/instructor";
import isRouter from "../routes/is_join";

const path = require('path');
const fs = require('fs');
const app = express();
const router = express.Router();
const session = require('express-session')
import passport from 'passport';
import LocalStrategy from 'passport-local';
import MongoStore from 'connect-mongo'
import User from '../model/user.js';
import Course from '../model/course.js'
import Section from '../model/section.js'
import Instructor from '../model/instructor.js'
import IS_Join from '../model/is_join.js'
// env variables
const PORT = process.env.PORT || 3000; //Hardcoding for now
const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mern-starter";

// mongoose
if (! fs.existsSync('./env.sh')) {
  throw new Error('env.sh file is missing');
}
if (! process.env.MONGODB_URI) {
  throw new Error("MONGODB_URI is not in the environmental variables. Try running 'source env.sh'");
}
mongoose.connection.on('connected', function() {
  console.log('Success: connected to MongoDb!');
});
mongoose.connection.on('error', function() {
  console.log('Error connecting to MongoDb. Check MONGODB_URI in env.sh');
  process.exit(1);
});
mongoose.connect(MONGODB_URI);

app.use(bodyParser.json(), cors())
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.json({extended: false}))
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(session({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true,
  cookie: { maxAge: 24 * 60},
  httpOnly: false,
  store: MongoStore.create({mongoUrl: process.env.MONGODB_URI})
}))

app.get('/', (req, res) => {
  console.log("Hit /")
  res.send("pong")
});

app.get('/temploaddb', (req, res) => {
  let path1 = path.resolve('./src/lib/se.json')
  var obj = JSON.parse(fs.readFileSync(path1));
  console.log("hello", obj)
  for (let i=0; i<obj.length; i++) {
    Course.find({name: obj[i].name})
    .then((uniqueCourse) => {
      if (uniqueCourse.length !== 0) {
        console.log("Course exists")
      } else {
        let newCourse = new Course(obj[i])
        console.log(obj[i])
        console.log("d", newCourse)
        newCourse.save()
        .then((course) => {
          console.log('Success is saving course', course)
        })
        .catch((err) => {
          console.log("Error in saving course", err)
        })
      }
    })
    // if (i == 20) {
    //   break
    // }
  }
  res.send('loading db')

});

async function it_instructor(obj){
	const instructors = await Instructor.find({name: obj.name});
	if(instructors.length > 0){
		console.log("Instructor exists", instructors[0]);
		return;
	}
	var instructor = new Instructor(obj);
	instructor.save();
}

app.get("/temploadinst", (req, res) => {
	let p = path.resolve("./src/lib/inst.json")
	var obj = JSON.parse(fs.readFileSync(p));
	for (var i=0; i<obj.length; i++){
		try{
			it_instructor(obj[i]);
		}
		catch(err) {
			console.log(err, obj[i])
		}
	}
	res.send("Success")
})

async function for_it_loop(obj){
	for(var i=0; i<obj.length; i++){
                console.log("Obj", obj[i]);
                try{
                        await it_section(obj[i]);
                }
                catch (err) {
                        console.log(err, obj[i])
                }
        }
}

async function it_section(obj){
	const courses = await Course.find({name: obj.course_name});
	if(courses.length == 0){
		console.log("Failed to find course", obj);
		return;
	}

	const unique = await Section.find({courseId: courses[0]._id, number: obj.number});
	var sec;
	if(unique.length > 0){
		console.log("Section Exists", unique[0]);
		sec = unique[0];
	}
	else{

		var section = new Section();
		section.number = obj.number;
		section.courseId = courses[0]._id;
		section.quarter = obj.quarter;
		console.log("Test", section);
		sec = await section.save();
	}

	var instructors = obj.inst_name.split(", ");
	for(var name of instructors){
		if(name.split(" ").length == 3){
			var temp = name.split(" ");
			name = temp[0] + " " + temp[2];
		}
		var instructor = await Instructor.find({"name": name});
		if(instructor.length == 0){
			console.log("Failed to find instructor", name)
			continue;
		}
		var unique_join = await IS_Join.find({section: sec._id, instructor: instructor[0]._id})
		if(unique_join.length > 0){
			console.log("Join already exists", unique_join)
			continue;
		}
		var join = new IS_Join();
		join.section = sec._id;
		join.instructor = instructor[0]._id;
		console.log("Join", join);
		await join.save();
	}
}

app.get("/temploadsect", (req, res) =>{
	let p = path.resolve('./src/lib/sect.json');
	var obj = JSON.parse(fs.readFileSync(p));
	for_it_loop(obj)
	.then(() => res.send("Success"))
	.catch((err) => console.log(err))

});

app.use(courseRouter)
app.use(reviewRouter)
app.use(watchlistRouter)
app.use(sectionRouter)
app.use(surveyRouter)
app.use(instructorRouter)
app.use(isRouter)

// passport + local strategy
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(function(username, password, done){
  console.log('LOCAL STRAT', { username });
  User.findOne({ username })
	  .then((user) => {
			console.log("Find succ", user)
	    if (!user){
	      console.log('1');
	      done(null, false);
	    } else if (user.password !== password){
	      console.log('2');
	      done(null, false);
	    } else {
				console.log("Local Strategy Success")
	      done(null, user);
	    }
	  })
	  .catch((error) => {
			console.log("error in local strat")
	    done(error);
	  })
}))

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

app.use('/', authRouter(passport))

export const start = () => {
	app.listen(PORT, () => {
		console.log(`Listening on port: ${PORT}`)
	})
}

export const stop = () => {
	app.close(PORT, () => {
		console.log(`Shutting down port: ${PORT}`)
	})
}
