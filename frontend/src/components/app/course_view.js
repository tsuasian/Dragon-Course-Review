import { withStyles } from '@material-ui/core/styles';
import React from "react";
import {
	  BrowserRouter as Router,
	  Link,
	  useLocation
} from "react-router-dom";
import {AppBar, Box, Button,List,ListItem,ListItemText,CssBaseline,DialogTitle,DialogContentText,DialogContent,DialogActions,Dialog,Paper,Typography,TextField,MuiThemeProvider,InputLabel,Select,MenuItem, FormLabel, Grid} from '@material-ui/core';
import Header from '../Header.js';
import theme from '../../theme/theme.js'
import Rating from '@material-ui/lab/Rating';
import Pagination from '@material-ui/lab/Pagination';
import querystring from 'querystring';
import SurveyDialog from '../survey_dialog.js';
function useQuery(){
	return new URLSearchParams(useLocation().search);
}

class CourseView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			id: "",
			name: "Software Design",
			dept: "CS",
			title: "350",
			reviewRating: 2,
			surveyRating: 0,
			description: "This course provides fundamental knowledge of software design and management. Topics include software design principles, abstraction and modularization, hierarchical structures and software families, design modeling and analysis, pattern-oriented design, and technical debts. The course strikes a balance between teaching principles of software design and analysis, and providing a basis for understanding cutting-edge techniques and concepts, using open source projects as case studies.",
			instDescription: "",
			open: false,
			reviewValue: 0,
			reviewContent: 0,
			reviewList: [{id: 0, content: "test", course_rating: 5, date:"01/01/2001"}],
			sections: [],
			surveyRatings: [],
			db_id: "",
			surveys: [],
			openSurvey: false,
			active: false,
			selectedSectionId: '',
			reviewPage: 1,
			reviewsPerPage: 10
		}
		this.handleOpen = this.handleOpen.bind(this);
		this.handleClose = this.handleClose.bind(this);
		this.setValue = this.setValue.bind(this);
		this.setContent = this.setContent.bind(this);
		this.submitReview = this.submitReview.bind(this);
		this.addWatchlist = this.addWatchlist.bind(this);
		this.sectionChange = this.sectionChange.bind(this);
		this.changePage = this.changePage.bind(this);
		this.addRating = this.addRating.bind(this);
	}

	componentDidMount() {
		console.log(this.props)
		let query = querystring.parse(this.props.location.search.substring(1));
		console.log("course search query", query)
		console.log(query.name);
		fetch('http://localhost:3000/course?name=' + query.name)
                .then((res) => res.json())
                .then((res) => {
			console.log(res);
                        this.setState({
				id: res[0].id,
				name: res[0].name,
				title: res[0].title,
				db_id: res[0]._id,
				surveyRating: res[0].surveyRating,
				description: res[0].description,
				instDescription: res[0].instDescription
                        });
			fetch('http://localhost:3000/get_reviews?course_id=' + this.state.id)
                        .then((res) => res.json())
                        .then((res) => {
				var avgReviews = 0;
				for(var i=0; i<res.length; i++){
					avgReviews += res[i].course_rating;
				}
				if(res.length != 0){
					avgReviews = avgReviews / res.length;
				}
                                this.setState({reviewList: res, reviewRating: avgReviews});
				fetch('http://localhost:3000/section?name=' + this.state.name)
				.then((res) => res.json())
				.then((res) => {
					if(Array.isArray(res)){
						this.setState({sections: res});
						console.log(this.state.sections);
					}
				});
                        }).then(() => {
				fetch('http://localhost:3000/get_surveys_by_course?course_id=' + this.state.db_id)
				.then((res) =>res.json())
				.then((res) => {
					this.setState({surveys: res, active: true})
				});
			}).then(() => {
				fetch("http://localhost:3000/survey/get_rating_by_course?course_id=" + this.state.db_id)
				.then((res) => res.json())
				.then((res) => {
					var ratings = res.ratings;
					var avgRating = 0;
					for(var rating of ratings){
						avgRating += rating;
					}
					if(ratings.length != 0){
						avgRating = avgRating / ratings.length;
					}

					this.setState({surveyRatings: ratings, surveyRating: avgRating});
				});
			});
                });
	}
	changePage(e, v){this.setState({reviewPage: v});}
	handleOpen(){this.setState({open:true});}
	handleClose(){this.setState({open:false});}
	submitReview(){
		 fetch('http://localhost:3000/review/add', {
			method: 'POST',
			body:JSON.stringify({course_rating: this.state.reviewValue, content: this.state.reviewContent, course_id: this.state.id, section_id: this.state.selectedSectionId}),
			headers: {'Content-Type': 'application/json'}
		})
		.then((res) =>{
			if(!res.ok){
				alert("Failed to submit Review");
				return null;
			}
			return res.json()
		})
		.then((res) => {
			if(res != null){
				var newReviews = this.state.reviewList.concat([res]);
				var avgReviews = 0;
                                for(var i=0; i<newReviews.length; i++){
                                        avgReviews += newReviews[i].course_rating;
                                }
                                if(newReviews.length != 0){
                                        avgReviews = avgReviews / newReviews.length;
                                }
				this.setState({reviewList: newReviews, reviewRating: avgReviews, open: false});
			}
		})
		this.setState({open:false});
	}
	addRating(rating){
		var ratings = this.state.surveyRatings.concat([rating]);
		var avg_rating = ratings.reduce((a, b) => (a+b)) / ratings.length;
		console.log("rating", avg_rating);
		console.log("ratings", ratings);
		this.setState({surveyRatings: ratings, surveyRating: avg_rating}, 
			(() => console.log("state", this.state)));
	}
	setContent(newContent){console.log(newContent);this.setState({reviewContent: newContent});}
	setValue(newValue){this.setState({reviewValue: newValue});}
	addWatchlist(){
		fetch('http://localhost:3000/watchlist/add', {
			                        method: 'POST',
			                        body:JSON.stringify({"student_id": this.props.userID, "course_id": parseFloat(this.state.id)}),
			                        headers: {'Content-Type': 'application/json'}
			                });
	}
	sectionChange(e){
		this.setState({selectedSectionId: e.target.value});
		console.log(e.target.value);
	}
	render() {
		if(!this.state.active){
			return (<div />)
		}
		return (
		<div className='main'>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Header loggedIn = {this.props.loggedIn} logout={this.props.logout} userFullName = {this.props.userFullName}/>
			<div className='courseBody'>
			 <Paper className='coursePaper' elevation={1}>
			 <Box mb={3} fontWeight="fontWeightBold" borderColor="transparent"><Typography variant='h3' align='center'>{this.state.name}
			</Typography></Box>
			 <Typography variant='h5' align='center'>{this.state.title}</Typography>
			<Paper className="descBox" variant='outlined' square>
			 <Typography align='center' paragraph variant='body1'>
			  {this.state.description}
			 </Typography>
			</Paper>
			 <Grid
			  container
			  direction="row"
			  justify="flex-start"
			  alignItems="center">

			  <Box component="fieldset" m={3} borderColor="transparent">
			        <Typography component="legend">Rating from Reviews</Typography>
			        <Rating name="read-only" value={this.state.reviewRating} readOnly disabled={this.state.reviewList.length==0} />
			 </Box>
			 <Box component="fieldset" m={3} borderColor="transparent">
                                <Typography component="legend">Rating from Surveys</Typography>
                                <Rating name="read-only" value={this.state.surveyRating} readOnly disabled={this.state.surveyRatings.length==0}/>
                         </Box>
			 </Grid>
			 <Box className="courseButtonBox" component="fieldset" mb={3} borderColor="transparent">
			 	<Button variant="outlined" disabled={this.props.userID===undefined} color="primary" onClick={this.handleOpen}>
			        Submit a Review
			      </Button>
			 	<Button variant="outlined" disabled={this.props.userID===undefined} color="primary" onClick={(e) => this.setState({openSurvey: true})}>
			                                Take Survey
			         </Button>
			 <Button variant="outlined" disabled={this.props.userID===undefined} color="primary" onClick={this.addWatchlist}>
				Add to Watchlist
			 </Button>
			</Box>
			 <Paper className="reviewSheet" variant="outlined" square>
			  <Typography variant="subtitle2">
			   Reviews
			  </Typography>
			  <List>
			  {
			  	this.state.reviewList.slice((this.state.reviewPage-1)*this.state.reviewsPerPage, (this.state.reviewPage)*this.state.reviewsPerPage).map((review) => (
				<ListItem key={review.id} alignItems="flex-start">
                                <Paper variant="outlined" className="reviewItem" square>
                                <Box mx={2}> <Rating name="read-only" value={review.course_rating} readOnly /></Box>
                                <ListItemText
                                 primary={review.time}
                                 secondary={review.content}/>
                                 </Paper>
                                </ListItem>
			  ))
			  }
			  </List>
			  <Pagination count={Math.ceil(this.state.reviewList.length/this.state.reviewsPerPage)} page={this.state.reviewPage} onChange={this.changePage} />
			  </Paper>
			 </Paper>
			</div>
			<Dialog open={this.state.open} onClose={this.handleClose} aria-labelledby="form-dialog-title">
			        <DialogTitle id="form-dialog-title">Review {this.state.name}</DialogTitle>
			        <DialogContent>
			          <DialogContentText>

			          </DialogContentText>
				  <FormLabel component="legend">What did you think of the course?</FormLabel>
				<InputLabel id="sectionInputLabel">Select Section</InputLabel>
				<Select labelId="sectionInputLabel" id="sectionSelect" value={this.state.selectedSectionId} onChange={this.sectionChange}>
				{this.state.sections.map((section) => (
					<MenuItem key={section._id} value={section._id}>
						{section.number}
					</MenuItem>
				))}
				</Select>
				<hr/>
				<InputLabel id="ratingInputLabel">Rating</InputLabel>
				<Rating name="rateCourse" value={this.reviewValue} onChange=

					{(event, newValue) => {
						this.setValue(newValue);
					}}/>
			          <TextField
			            autoFocus
			            margin="dense"
			            id="comment"
			            label="Any Comments?"
			            multiline
			            fullWidth
				    value={this.reviewContent} onChange=
                                        {(e) => {
                                                this.setContent(e.target.value);
                                        }}
			          />
			        </DialogContent>
			        <DialogActions>
			          <Button onClick={this.submitReview} color="primary">
			            Submit
			          </Button>
			          <Button onClick={this.handleClose} color="primary">
			            Cancel
			          </Button>
			        </DialogActions>
			      </Dialog>
				<SurveyDialog survey={this.state.surveys.filter((survey) => survey.visibility=="Active")} open={this.state.openSurvey} add={this.addRating} user={this.props.userID} close={(e) => this.setState({openSurvey: false})} />
			</MuiThemeProvider>

			</div>
		)
	}
}

export default CourseView;
