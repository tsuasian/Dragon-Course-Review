import React from 'react';
import {
	          BrowserRouter as Router,
	          Link,
	          useLocation
} from "react-router-dom";
import {List,ListItemSecondaryAction,ListItem,ListItemText,ListItemIcon,ListSubheader,IconButton,Box,Dialog,DialogTitle,DialogContent,DialogActions,Input,InputLabel,Select,MenuItem,Button,TextField,Grid,CssBaseline,Paper,Typography,MuiThemeProvider} from '@material-ui/core';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import Header from '../Header.js';
import theme from '../../theme/theme.js'
import RootRef from "@material-ui/core/RootRef";
import OpenWithIcon from '@material-ui/icons/OpenWith';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import querystring from 'querystring';

const sourceList = ["Multiple Choice", "Short Answer", "True/False", "Rating"]

const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

class SurveyInput extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			value: this.props.value,
			target: this.props.target
		}
		this.updateValue = this.updateValue.bind(this);
	}

	updateValue(value){
                this.setState({value: value})
		this.props.updateValue(value, this.state.target)
        }
	render(){
	return (
	<TextField
	{...this.props}
        value={this.state.value}
        onChange={(e)=>this.updateValue(e.target.value, "name")}/>
	)}
}

class SurveyCreate extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			name: "NEW Survey",
			questions: [{_id: "0", question_text: "Question 1", type: "Rating"}, {_id: "1", question_text: "Question 233333333333333333333", type:"True/False"}, {_id:"2", question_text: "Question 3", type:"Multiple Choice"}, {_id: "3", question_text: "Question 4", type: "Short Answer"}],
			open: false,
			isNew: false,
			text: "",
			type: "Short Answer",
			maxRating: 5,
			choices: ["", "", "", ""],
			a: "",
			b: "",
			c: "",
			d: "",
			index: 0,
			survey_id: "",
			inst_id: "",
			active: false

		}

		this.onDragEnd = this.onDragEnd.bind(this);
		this.dragStart = this.dragStart.bind(this);
		this.allowDrop = this.allowDrop.bind(this);
		this.drop = this.drop.bind(this);
		this.updateValue = this.updateValue.bind(this);
		this.updateChoice = this.updateChoice.bind(this);
		this.editQuestions = this.editQuestions.bind(this);
		this.deleteQuestions = this.deleteQuestions.bind(this);
		this.saveDialog = this.saveDialog.bind(this);
	}

	componentDidMount() {
		let query = querystring.parse(this.props.location.search.substring(1));
		if(query.survey_id=="NEW"){
			this.setState({active: true, questions: [], survey_id: "NEW", inst_id: query.inst_id});
		}
		else{
			console.log("HIT")
			fetch("http://localhost:3000/survey/get_by_id?survey=" + query.survey_id)
			.then((res) => res.json())
			.then((res) => this.setState({active: true, questions: res.questions, name: res.name, inst_id: res.inst_id, survey_id: res._id}, () => console.log(this.state)))
	
		}
	}

	shouldComponentUpdate(nextProps, nextState) {
		if
		(
			  nextState.maxRating != this.state.maxRating
			  || nextState.open != this.state.open
			  || nextState.questions.length != this.state.questions.length
			  || nextState.active != this.state.active
		)
		{
		  	return true;
		}

		return false;

	}

	updateValue(value, valueName){
		console.log(value, valueName);
		this.setState({[valueName]: value}, () => console.log(this.state))
	}

	updateChoice(value, index){
		console.log(value);
		var choices = this.state.choices;
		choices[index] = value;
		this.setState({choices: choices});
	}

	onDragEnd(result) {
		if(!result.destination || !result.source) return;
		const items = reorder(this.state.questions, result.source.index, result.destination.index);
		this.setState({questions: items});
	}

	dragStart = (e) => {
		console.log(e);
		this.setState({type: e.target.innerText}, () => {
			console.log(this.state)
		});
	}

	allowDrop = (e) => {
		e.preventDefault();
	}

	drop = (e) => {
		e.preventDefault();
		console.log(e);
		this.setState({open: true, isNew: true, text: "", maxRating: 5, a:"", b:"", c:"", d:""})
	}

	editQuestions(e, index){
		console.log(index, e)
		this.setState({open: true, isNew: false, index: index, 
				type: this.state.questions[index].type, 
				text: this.state.questions[index].question_text,
				maxRating: this.state.questions[index].maxRating,
				choices: this.state.questions[index].choices})
	}

	deleteQuestions(e, index){
		console.log(index)
		var result = Array.from(this.state.questions);
		result.splice(index, 1);
		this.setState({questions: result});
	}

	save = async(e) => {
		var survey_id = this.state.survey_id;
		if(survey_id=="NEW"){
			const postSurvey = await fetch("http://localhost:3000/survey/add", {
				method: 'POST',
				body: JSON.stringify({"inst_id": this.state.inst_id, "name": this.state.name, "visibility": "Draft"}),
				headers: {"Content-Type": "application/json"}
			})
			if(!postSurvey.ok){
				alert("Failed to save survey. Aborting save.");
				return;
			}
			var res = await postSurvey.json();
			survey_id = res._id;
			console.log(res);
			this.setState({survey_id: res._id});
		}
		if(survey_id=="NEW"){
			console.log("Fail");
			return;
		}
		var questions = Array.from(this.state.questions);
		for(var i=0; i<questions.length; i++){
			var question = questions[i];
			if(question._id.includes("NEW"))
			{
				const response = await fetch("http://localhost:3000/question/add", {
					method: 'POST',
					body:JSON.stringify({"survey": survey_id, "type": question.type, "question_text": question.question_text, "choices": question.choices, "maxRating": question.maxRating}),
					headers: {"Content-Type": "application/json"}
				});
				if(!response.ok){
					alert("Failed to save question \"" + question.question_text + "\". Aborting save.");
					return;
				}
				var res = await response.json();
				console.log(res);
				question._id = res._id;
				questions[i] = question;
			}
		}
		this.setState({questions: questions});
		const surveyUpdate = await fetch("http://localhost:3000/survey/update", {
			method: 'POST',
			body: JSON.stringify({"survey": survey_id, "questions": questions, "name": this.state.name}),
			headers: {"Content-Type": "application/json"}
		});
		if(!surveyUpdate.ok){
			alert("Failed to save changes.");
			return;
		}
		alert("Saved.");
	}

	saveDialog = (e) => {
		if(this.state.isNew){
			var newQuestion = {_id: "NEW"+this.state.text, survey: this.state.survey_id, question_text: this.state.text, type: this.state.type, maxRating: this.state.maxRating, choices: [this.state.a, this.state.b, this.state.c, this.state.d]}
			var questionList = this.state.questions.concat([newQuestion]);
			this.setState({questions: questionList});
		}
		else {
			var question = this.state.questions[this.state.index]
			question.question_text = this.state.text;
			question.type = this.state.type;
			question.maxRating = this.state.maxRating;
			question.choices = [this.state.a, this.state.b, this.state.c, this.state.d];
			var questionList = Array.from(this.state.questions);
			questionList[this.state.index] = question;
			this.setState({questions: questionList});
		}
		this.setState({open: false});
	}

	render() {
		if(!this.state.active){
			return (<div />)
		}
	return (
		<div className="main" style={{flexGrow: 1}}>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Header loggedIn = {this.props.loggedIn} logout={this.props.logout} userFullName = {this.props.userFullName} />
			<Box className='watchlistBody'>
                        <Paper style={{paddingBottom: "80px"}} className="watchlistPaper">
                        <Typography align="center" variant="h4">Surveys</Typography>
                        <hr />
			<Grid container direction="row" justify="center" alignItems="stretch">
			  <Grid container direction="column" justify="center" alignItems="center" item xs={6}>
			    <Grid item>
			      <SurveyInput 
				label="Name" 
				fullWidth 	
				inputProps={{style: {textAlign: "center"}}} 
				value={this.state.name}
				target="name" 
				updateValue={this.updateValue}/>
			    </Grid>
			    <Grid style={{width:"80%", background: "rgba(245, 245, 245, 1.0)"}} item xs={10}>
			      <DragDropContext onDragEnd={this.onDragEnd}>
			      <Droppable droppableId="droppable">
			      {(provided, snapshot) => (
			      <RootRef rootRef={provided.innerRef}>
			      <List style={{height: "400px", overflow: "auto", padding: "0"}}>
				<ListSubheader mb={4} onDrop={this.drop} onDragOver={this.allowDrop} style={{background: "rgba(245, 245, 245, 1.0)", height:"75px", borderStyle: "solid"}} >
				  <Box width="97%" height="90%" style={{margin:"3px auto", borderStyle: "dashed"}}>
				  </Box>
				</ListSubheader>
				{this.state.questions.map((question, index) => (
				<Draggable key={question._id} draggableId={question._id} index={index}>
				{(provided, snapshot) => (
				
				<ListItem 
				ContainerComponent="li" 
				ContainerProps={{ ref: provided.innerRef }} 
				{...provided.draggableProps}
				{...provided.dragHandleProps}
				style={{width: "96%", background: "lightgray", margin: "16px auto"}}>

				<ListItemIcon><IconButton onClick={(e)=>this.editQuestions(e, index)}><EditIcon fontSize="large" /></IconButton></ListItemIcon>
				<ListItemText disableTypography 
					      style={{margin: "auto"}} 
					      primary={<Typography type="body2" style={{whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{question.question_text}</Typography>}>
				</ListItemText>
				<ListItemSecondaryAction><IconButton onClick={(e)=>this.deleteQuestions(e, index)}><DeleteIcon fontSize="large"/></IconButton></ListItemSecondaryAction>
				</ListItem>
				)}
				</Draggable>
				))}
				{provided.placeholder}
			      </List>
			      </RootRef>
			    )}
			    </Droppable>
			    </DragDropContext>
			    </Grid>
			  </Grid>
			  <Grid container direction="column" justify="center" alignItems="center" item xs={6}>
			    <Grid item>
			      <Typography align="center" variant="subtitle1">Question Templates</Typography>
			    </Grid>
			    <Grid container direction="column" justify="flex-start" spacing={0} alignItems="stretch" item xs={10} spacing={0}>
				<Grid container style={{height: "33%"}} direction="row" alignItems="stretch" item>
					<Grid container item justify="center" alignItems="center" style={{width: "50%", background: "rgba(245, 245, 245, 1.0)"}}>
						<Typography draggable="true" id="Multiple Choice" onDragStart={this.dragStart} style={{height: "30%", width: "80%", textAlign: "center", background: "lightgray", lineHeight: "2"}}>Multiple Choice</Typography>
                                        </Grid>
                                        <Grid container item justify="center" alignItems="center" style={{width: "50%", background: "rgba(245, 245, 245, 1.0)"}}>
						<Typography draggable="true" onDragStart={this.dragStart} style={{height: "30%", width: "80%", textAlign: "center", background: "lightgray", lineHeight: "2"}}>True/False</Typography>
                                        </Grid>
				</Grid>
				<Grid container style={{height:"33%"}} direction="row" alignItems="stretch" item>
					 <Grid container item justify="center" alignItems="center" style={{width:"50%", background: "rgba(245, 245, 245, 1.0)"}}>
		                                 <Typography draggable="true" onDragStart={this.dragStart} style={{height: "30%", width: "80%", textAlign: "center", background: "lightgray", lineHeight: "2"}}>Short Answer</Typography>
		                         </Grid>
		                         <Grid container item justify="center" alignItems="center" style={{width:"50%", background: "rgba(245, 245, 245, 1.0)"}}>
		                                 <Typography draggable="true" onDragStart={this.dragStart} style={{height: "30%", width: "80%", textAlign: "center", background: "lightgray", lineHeight: "2"}}>Rating</Typography>
		                         </Grid>
				</Grid>
				<Grid container item justify="flex-end">
					<Button onClick={this.save} endIcon={<ArrowForwardIcon />}>Save</Button>
					<Button component={Link} to={"/survey_table?inst_id=" + this.state.inst_id} endIcon={<ArrowForwardIcon />} >Exit</Button>
				</Grid>
			    </Grid>
		  	  </Grid>
			</Grid>
			</Paper>
			</Box>
			<Dialog 
			 PaperProps={{style: {minHeight: "50%", minWidth:"50%", justifyContent: "space-around", alignItems: "flex-end"}}} 
			 open={this.state.open} 
			 onClose={(e) => this.updateValue(false, "open")}>
				<Grid container direction="column" alignItems="center" justify="center">
				<DialogTitle>Design {this.state.type} Question</DialogTitle>
				<SurveyInput
				autoFocus
				margin="dense"
				id="question"
				label="Question Text"
				multiline
				value={this.state.text}
				target="text"
				updateValue={this.updateValue} />
				<Box className="ratingBox" display={(this.state.type==="Rating") ? "" : "none"}>
					<InputLabel id="ratingLabel">Select Max Rating</InputLabel>
					<Select 
					labelId="ratingLabel" 
					id="ratingSelect"
					value={this.state.maxRating}
					onChange={(e) => this.updateValue(e.target.value, "maxRating")}>
						{[5,6,7,8,9,10].map((value) => (
						 <MenuItem value={value} key={value} id={value}>{value}</MenuItem>
						))}
					</Select>
				</Box>
				<Box className="choiceBox" display={this.state.type==="Multiple Choice" ? "" : "none"}>
				{this.state.choices.map((choice, index) => (
					<Box className="singleChoiceBox" padding={2}>
					<SurveyInput 
					label={["A.", "B.", "C.", "D."][index]}
					value={this.state[["a", "b", "c", "d"][index]]}
					target={["a","b","c","d"][index]}
					rowsMax={2} 
					updateValue={this.updateValue}
					/>
					</Box>
				))
				}
				</Box>
				
				</Grid>
				<Button style={{width: "fit-content"}} onClick={this.saveDialog} endIcon={<ArrowForwardIcon />}>Save</Button>	
			</Dialog>
		</MuiThemeProvider>
		</div>
	)
	}
}
export default SurveyCreate
