import React from 'react';
import {
	          BrowserRouter as Router,
	          Link,
	          useLocation
} from "react-router-dom";
import {FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,List,ListItemSecondaryAction,ListItem,ListItemText,ListItemIcon,ListSubheader,IconButton,Box,Dialog,DialogTitle,DialogContent,DialogActions,Input,InputLabel,Select,MenuItem,Button,TextField,Grid,CssBaseline,Paper,Typography,MuiThemeProvider} from '@material-ui/core';
import RootRef from "@material-ui/core/RootRef";
import OpenWithIcon from '@material-ui/icons/OpenWith';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import querystring from 'querystring';
import Rating from '@material-ui/lab/Rating';

var template = {answer_text: "", rating: 0};

class SurveyDialog extends React.Component {
	constructor(props){
		super(props);
		console.log(this.props.survey);
		var answers = [];
		var length = this.props.survey.length!=0 ? this.props.survey[0].questions.length : 0;
		for(var i=0; i<length; i++){
			answers.push(JSON.parse(JSON.stringify(template))) }

		this.state = {
			answers: answers,
			select: 0,
			rating: 0,
		}

		this.updateValue = this.updateValue.bind(this);
		this.updateAnswer = this.updateAnswer.bind(this);
		this.saveDialog = this.saveDialog.bind(this);
	}

	updateValue(value, valueName){
		if(valueName == "select"){
			console.log("survey", this.props.survey)
			var answers = [];
                	var length = this.props.survey[value].questions ? this.props.survey[value].questions.length : 0;
			for(var i=0; i<length; i++){
                        	answers.push(JSON.parse(JSON.stringify(template)))
                	}
			console.log(answers);
			this.setState({"select": value, answers: answers}, () => console.log(this.state));
		}
		else{
			this.setState({[valueName]: value}, () => console.log(this.state))
		}
	}

	updateAnswer(value, index, valueName){
		var answers = this.state.answers;
		var answer = this.state.answers[index];
		answer[valueName] = value;
		answers[index] = answer;
		this.setState({answers: answers});
	}

	saveDialog = (e) => {
		for(var i=0; i< this.state.answers.length; i++){
			var answer = this.state.answers[i];
			fetch("http://localhost:3000/answer/add", {
				method: 'POST',
				body: JSON.stringify({
					"question": this.props.survey[this.state.select].questions[i]._id,
					"survey": this.props.survey[this.state.select]._id,
					"answer_text": answer.answer_text,
					"rating": answer.rating,
					"student_id": this.props.user_id
				}),
				headers: {"Content-Type": "application/json"}
			}).then((response) => {
				if(!response.ok){
					console.log("Failure", i);
				}
			});
		}
		fetch("http://localhost:3000/answer/add", {
			method: 'POST',
			body: JSON.stringify({
				"question": null,
				"survey": this.props.survey[this.state.select]._id,
				"answer_text": "Rating Answer",
				"rating": this.state.rating,
				"student_id": this.props.user_id
			}),
			headers: {"Content-Type": "application/json"}
		}).then((response) => {
			if(!response.ok){
				console.log("Failure saving rating.")
			}
			else{
				console.log(this.props.add);
				console.log(this.state.rating);
				this.props.add(parseInt(this.state.rating, 10));
			}
		})
		this.props.close();
	}


	render() {
		if (this.props.survey.length == 0){
			return (
			<Dialog
                         PaperProps={{style: {alignItems: "center", padding: "5vh"}}}
                         open={this.props.open}
                         onClose={this.props.close}>
				<Typography>No surveys available for this course.</Typography>
			</Dialog>	
			)
		}
	return (
			<Dialog 
			 PaperProps={{style: {minHeight: "50%", minWidth:"50%", alignItems: "flex-end"}}} 
			 open={this.props.open} 
			 onClose={this.props.close}>
				<Grid container direction="column" alignItems="center" justify="center">
				<DialogTitle>Survey {this.props.survey[this.state.select].name} Question</DialogTitle>
				<Select value={this.state.select} onChange={(e) => this.updateValue(e.target.value, "select")}>
					{this.props.survey.map((survey, index)=>(
						<MenuItem value={index} key={survey._id}>
						{survey.name}
						</MenuItem>
					))}
				</Select>
				{this.props.survey[this.state.select].questions.map((question, index) => (
					<Box width="100%" className='questionBox'>
						<hr/>
						<Typography>{(index+1)+"."}<br/>{question.question_text}</Typography>
						<Box className="textBox" display={question.type=== "Short Answer" ? "" : "none"}>
							<TextField value={this.state.answers[index].answer_text} onChange={(e) => this.updateAnswer(e.target.value, index, "answer_text")}/>
						</Box>
						<Box className="ratingBox" display={question.type==="Rating" ? "" : "none"}>
							<Rating name={"ratingQuestion" + index} value={this.state.answers[index].rating} max={question.maxRating} onChange={(e) => this.updateAnswer(e.target.value, index, "rating")}/>
						</Box>
						<Box className="tfBox" display={ question.type=== "True/False" ? "" : "none"}>
                                                <FormControl component="fieldset">
                                                   <FormLabel component="legend">Select</FormLabel>
                                                   <RadioGroup name={"question" + index} value={this.state.answers[index].answer_text} onChange={(e) => this.updateAnswer(e.target.value, index, "answer_text")}>
                                                        {["True", "False"].map((choice) => (
                                                                <FormControlLabel
                                                                value={choice}
                                                                control={<Radio />}
                                                                label={choice} />
                                                        ))}
                                                   </RadioGroup>
                                                </FormControl>
                                                </Box>
						<Box className="choiceBox" display={question.type==="Multiple Choice" ? "" : "none"}>
						<FormControl component="fieldset">
						   <FormLabel component="legend">Select</FormLabel>
						   <RadioGroup name={"question" + index} value={this.state.answers[index].answer_text} onChange={(e) => this.updateAnswer(e.target.value, index, "answer_text")}>
							{question.choices.filter((choice => choice != "")).map((choice) => (
								<FormControlLabel 
								value={choice} 
								control={<Radio />} 
								label={choice} />
							))}
						   </RadioGroup>
						</FormControl>
						</Box>
					</Box>
				))}
				<Box width="100%" className="surveyRatingBox">
					<hr />
					<Typography>{this.props.survey[this.state.select].questions.length + 1}.<br/>Overall, what did you think of the course?</Typography>
					<Box className="ratingBox">
                                        	<Rating name="surveyRating" value={this.state.rating} onChange={(e) => this.updateValue(e.target.value, "rating")}/>
                                        </Box>
				</Box>
				</Grid>
				<Button style={{width: "fit-content"}} onClick={this.saveDialog} endIcon={<ArrowForwardIcon />}>Finish</Button>	
			</Dialog>
	)
	}
}
export default SurveyDialog
