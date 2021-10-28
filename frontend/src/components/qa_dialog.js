import React from 'react';
import {
	          BrowserRouter as Router,
	          Link,
	          useLocation
} from "react-router-dom";
import {FormControl,FormLabel,RadioGroup,Radio,FormControlLabel,InputProps,List,ListItemSecondaryAction,ListItem,ListItemText,ListItemIcon,ListSubheader,IconButton,Box,Dialog,DialogTitle,DialogContent,DialogActions,Input,InputLabel,Select,MenuItem,Button,TextField,Grid,CssBaseline,Paper,Typography,MuiThemeProvider} from '@material-ui/core';
import RootRef from "@material-ui/core/RootRef";
import OpenWithIcon from '@material-ui/icons/OpenWith';
import EditIcon from '@material-ui/icons/Edit';
import DeleteIcon from '@material-ui/icons/Delete';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import querystring from 'querystring';
import Rating from '@material-ui/lab/Rating';

class QADialog extends React.Component {
	constructor(props){
		super(props);
		console.log(this.props.survey);
		this.state = {
			qa: [],
			active: false
		}
	}

	componentDidUpdate(prevProps){
		console.log("props", this.props);
		console.log("prevProps", prevProps);
		if(this.props.survey_id == prevProps.survey_id){
			if(!this.state.active && (this.props.open != prevProps.open) ){
				this.setState({active: true});
			}
		}
		else{
		fetch("http://localhost:3000/survey/get_question_answers?id=" + this.props.survey_id)
		.then((res) => res.json())
		.then((res) => this.setState({qa: res, active: true}))
		}
	}



	render() {
		if (this.state.qa.length == 0){
			return (
			<Dialog
                         PaperProps={{style: {alignItems: "center", padding: "5vh"}}}
                         open={this.state.active}
                         onClose={(e) => this.setState({active: false})}>
				<Typography>No Questions for this survey.</Typography>
			</Dialog>	
			)
		}
	return (
			<Dialog 
			 PaperProps={{style: {minWidth:"50%", alignItems: "flex-end"}}} 
			 open={this.state.active} 
			 onClose={(e) => this.setState({active: false})}>
				<Grid container direction="column" alignItems="center" justify="center">
				<DialogTitle>Survey {"\"" + this.props.name + "\""} Responses</DialogTitle>
				{this.state.qa.map((qa, index) => (
					<Box padding={3} width="100%" className='questionBox'>
						<hr/>
						<Typography>{"Question " + (index+1)+"."}<br/>{qa.question.question_text}</Typography>
					{qa.answers.map((answer, index) => (
						<Box className="answerBox">
						<Typography>{"Answer " + (index+1)+"."}</Typography>
						<Box className="textBox" display={qa.question.type=== "Short Answer" ? "" : "none"}>
							<TextField value={answer.answer_text} InputProps={{
							            readOnly: true,
							          }}>
							</TextField>
						</Box>
						<Box className="ratingBox" display={qa.question.type==="Rating" ? "" : "none"}>
							<Rating name={"ratingQuestion" + answer._id} readOnly value={answer.rating} max={qa.question.maxRating}/>
						</Box>
						<Box className="tfBox" display={ qa.question.type=== "True/False" ? "" : "none"}>
                                                <FormControl component="fieldset">
                                                   <FormLabel component="legend">Select</FormLabel>
                                                   <RadioGroup name={"question" + index} value={answer.answer_text}>
                                                        {["True", "False"].map((choice) => (
                                                                <FormControlLabel
								disabled
                                                                value={choice}
                                                                control={<Radio />}
                                                                label={choice} />
                                                        ))}
                                                   </RadioGroup>
                                                </FormControl>
                                                </Box>
						<Box className="choiceBox" display={qa.question.type==="Multiple Choice" ? "" : "none"}>
						<FormControl component="fieldset">
						   <FormLabel component="legend">Select</FormLabel>
						   <RadioGroup name={"question" + index} value={answer.answer_text}>
							{qa.question.choices.filter((choice => choice != "")).map((choice) => (
								<FormControlLabel 
								disabled
								value={choice} 
								control={<Radio />} 
								label={choice} />
							))}
						   </RadioGroup>
						</FormControl>
						</Box>
						</Box>
					))}
					</Box>
				))}	
				</Grid>
			</Dialog>
	)
	}
}
export default QADialog
