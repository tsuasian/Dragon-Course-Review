import { withStyles } from '@material-ui/core/styles';
import React from "react";
import {
	  BrowserRouter as Router,
	  Link,
	  useLocation
} from "react-router-dom";
import {Box,TextField,InputAdornment,List,ListItem,Accordion,AccordionDetails,AccordionSummary,CssBaseline,Paper,Typography,MuiThemeProvider} from '@material-ui/core';
import Header from '../Header.js';
import theme from '../../theme/theme.js'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import SearchIcon from '@material-ui/icons/Search';

class FAQView extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
		  text: "",
		  questionAnswers: [{
		    id: 0,
		    question: "What is Dragon Course Review?",
		    answer: `Dragon Course Review is a platform built for Drexel students by Drexel students to help discover, view, and compare courses. We saw the need for a course review platform as Drexel currently had none. We wanted a platform for Drexel students to voice their opinions about courses they took and the professors who taught them.`
		  }, {
		    id: 1,
		    question: "What is a Watchlist?",
		    answer: `A watchlist is your own personalized "wishlist" of classes which can be saved to the watchlist. `
		  }, {
		    id: 2,
		    question: "How do I create an account? Can I use my Drexel Credentials to login?",
		    answer: `You can register with any email through our registration form. We are currently working with Drexel so students may be able to use there Drexel credentials to login but this is currently not available.`
		  }, {
		    id: 3,
		    question: "How are course metrics genereated?",
		    answer: `Course metrics are generated through survey ratings/data from previous students who took the coruse.`
		  }, {
		    id: 4,
		    question: "How can I help develop Dragon Course Review?",
		    answer: `Apply to join the DCR team here today! We would love you to join us!`
		  }],
		  show: [{
		    id: 0,
		    question: "What is Dragon Course Review?",
		    answer: `Dragon Course Review is a platform built for Drexel students by Drexel students to help discover, view, and compare courses. We saw the need for a course review platform as Drexel currently had none. We wanted a platform for Drexel students to voice their opinions about courses they took and the professors who taught them.`
		  }, {
		    id: 1,
		    question: "What is a Watchlist?",
		    answer: `A watchlist is your own personalized "wishlist" of classes which can be saved to the watchlist. `
		  }, {
		    id: 2,
		    question: "How do I create an account? Can I use my Drexel Credentials to login?",
		    answer: `You can register with any email through our registration form. We are currently working with Drexel so students may be able to use there Drexel credentials to login but this is currently not available.`
		  }, {
		    id: 3,
		    question: "How are course metrics genereated?",
		    answer: `Course metrics are generated through survey ratings/data from previous students who took the coruse.`
		  }, {
		    id: 4,
		    question: "How can I help develop Dragon Course Review?",
		    answer: `Apply to join the DCR team here today! We would love you to join us!`
		  }]
		}
		this.onTextChange = this.onTextChange.bind(this);
	}

	componentDidMount() {
		/*fetch('http://localhost:3000/course?name=' + query.name)
                .then((res) => res.json())
                .then((res) => {
			console.log(res);
                        this.setState({
				id: res[0].id,
				name: res[0].name,
				number: res[0].number,
				reviewRating: res[0].reviewRating,
				surveyRating: res[0].surveyRating,
				description: res[0].description,
				instDescription: res[0].instDescription
                        });
			fetch('http://localhost:3000/get_reviews?course_id=' + this.state.id)
                        .then((res) => res.json())
                        .then((res) => {
                                this.setState({reviewList: res})
                        });
                });*/
	}

	onTextChange(e){
		const value = e.target.value;
		const qa = this.state.questionAnswers;
		let arr = qa;
		if(value.length > 0) {
			arr = qa.filter(v => v.question.toLowerCase().includes(value.toLowerCase()) ||
							   v.answer.toLowerCase().includes(value.toLowerCase()));
		}
		this.setState({show: arr, text: value});
	}

	render() {
		console.log("faq props", this.props)
		return (
			<div className='main'>
				<MuiThemeProvider theme={theme}>
					<CssBaseline />
					<Header loggedIn = {this.props.loggedIn} userFullName = {this.props.userFullName}/>
					<div className='faqBody'>
						<Paper className="faqBodyPaper">

							<Paper variant="outlined" className="faqHeader">
								<Typography variant="h4">Frequently Asked Questions</Typography>
							</Paper>

							<Typography component="div">
								<Box fontSize={32} color="blue" textAlign="center">How can we help you?<br />
									<TextField id="search-faq" onChange={this.onTextChange} variant="outlined"
										InputProps={{startAdornment: (
										<InputAdornment position="start">
											<SearchIcon />
										</InputAdornment>),
										}}/>
								</Box>
							</Typography>
		  			<List> { this.state.show.map((qa) => (
							<ListItem key={qa.id} alignItems="flex-start">
			          <Accordion className="faqAccordion">
									<AccordionSummary
										expandIcon={<ExpandMoreIcon />}
										id={qa.id}
										aria-controls={qa.id}>
										<Typography variant="h5">{qa.question}</Typography>
									</AccordionSummary>
									<AccordionDetails>
										<Typography>{qa.answer}</Typography>
									</AccordionDetails>
			          </Accordion>
		          </ListItem>))}
		  			</List>
					</Paper>
			</div>
			</MuiThemeProvider>
			</div>
		)
	}
}

export default FAQView;
