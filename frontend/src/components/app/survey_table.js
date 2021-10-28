import { withStyles } from '@material-ui/core/styles';
import React from "react";
import {
	  BrowserRouter as Router,
	  Link,
	  useLocation,
} from "react-router-dom";
import {Box,Select,MenuItem,Input,InputAdornment,TableSortLabel,Button,TextField,Grid,TableContainer,Table,TableCell,TableRow,TableHead,TableBody,CssBaseline,Paper,Typography,TablePagination,MuiThemeProvider} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Header from '../Header.js';
import theme from '../../theme/theme.js'
import SearchIcon from '@material-ui/icons/Search';
import querystring from 'querystring';
import QADialog from "../qa_dialog.js";

const headers = [
	{id: "course", val: "Course"},
	{id: "name", val: "Name"},
	{id: "questions", val: "Questions"},
	{id: "visibility", val: "Status"}
];

const colors = {Inactive: "error.main", Active: "success.main", Draft: "text.secondary"}

class SurveyTable extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			survey: [{_id: 0, course: "Course A", name: "Name AAA", questions: ["","","","",""], visibility: "Inactive"}, 
				{_id: 1, course: "Course AB", name: "Name BBB", questions: ["","","","","","", "", "", "", "", "", ""], visibility: "Active"}, 
				{_id: 2, course: "Course ABB", name: "Name CCC", questions: ["","",""], visibility: "Draft"}, 
				{_id: 3, course: "Course ABBC", name: "Name DDD", questions: [""], visibility: "Draft"}, 
				{_id: 4, course: "Course BBC", name: "Name FFF", questions: [""], visibility: "Draft"}],
			order: 'asc',
			orderBy: 'course',
			search: '',
			inst_id: "",
			inst_name: "",
			inst_email: "",
			dialog_open: false,
			dailog_id: "",
			dialog_name: "",
			page: 0,
			rowsPerPage: 10,
			sections: [{_id: 555, instructor: {}, section:{number: "001", courseId: {name: "Course AAA", title: "CS111"}}}]
		}
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.setOrderBy = this.setOrderBy.bind(this);
		this.sortFunc = this.sortFunc.bind(this);
		this.copySort = this.copySort.bind(this);
		this.searchFilter = this.searchFilter.bind(this);
		this.handleChangePage = this.handleChangePage.bind(this);
		this.handleChangeRowsPerPage = this.handleChangeRowsPerPage.bind(this);
		this.update_visibility = this.update_visibility.bind(this);
		this.update_section = this.update_section.bind(this);
		this.getIndex = this.getIndex.bind(this);
	}

	componentDidMount() {
		let query = querystring.parse(this.props.location.search.substring(1));
		fetch("http://localhost:3000/get_surveys_by_instructor?inst_id=" + query.inst_id)
			.then((res) => res.json())
			.then((res) => {
				console.log(res);
				var surveys = res.map((survey) => {
					if(!survey.section){
						console.log("HIT");
						survey.course = "********";
					}
					else{
						survey.course = survey.section.courseId.name + "-" + survey.section.number;
					}
					return survey;
				})
				console.log(surveys);
				this.setState({survey: surveys, inst_id: query.inst_id});
			})
		fetch("http://localhost:3000/get_sections_by_instructor?id=" + query.inst_id)
		.then((res) => res.json())
		.then((res) => {
			this.setState({sections: res});
		})

		fetch("http://localhost:3000/instructor/get_instructor?id=" + query.inst_id)
		.then((res) => res.json())
		.then((res) => {
			this.setState({inst_name: res.name, inst_email: res.email})
		})


		
	}
	handleKeyDown = (e) => {
		this.setState({search: e.target.value});
	}

	handleChangePage = (e, npage) =>{
		this.setState({page: npage});
	};

	handleChangeRowsPerPage = (e) =>{
		this.setState({page: 0, rowsPerPage: e.target.value});
	};

	setOrderBy = (e, id) => {
		if(this.state.orderBy === id){
			this.setState({order: this.state.order === 'asc' ? 'desc' : 'asc'});
		}
		else{
			this.setState({order: 'asc', orderBy: id});
		}
	}

	getIndex(survey){
		for(var i=0; i<this.state.survey.length; i++){
			if(this.state.survey[i]._id == survey._id){
				return i;
			}
		}
		return -1;
	}

	update_section(e, survey) {
		var section = e.target.value;
		var i = this.getIndex(survey);
		if(i<0){
			console.log("Remove for prod");
			return;
		}
		console.log(section);
		console.log(this.state);
		fetch("http://localhost:3000/survey/set_section", {
			method: 'POST',
			body:JSON.stringify({
				survey: this.state.survey[i]._id, 
				section: section._id,
				course: section.courseId._id
			}),
			headers: {'Content-Type': 'application/json'}
		})
		.then((res) => {
			if(res.ok){
				var surveys = this.state.survey;
				surveys[i].section = section;
				surveys[i].course = section.courseId.name + "-" +section.number
				this.setState({survey: surveys});
			}
		})
	}

	update_visibility(e, survey) {
		var visibility = e.target.value;
		var i = this.getIndex(survey);
                if(i<0){
                        console.log("Remove for prod");
                        return;
                }
		console.log(this.state.survey[i]._id);
		fetch("http://localhost:3000/survey/set_visibility", {
			method: 'POST',
			body: JSON.stringify({
				survey: this.state.survey[i]._id,
				visibility: visibility
			}),
			headers: {'Content-Type': 'application/json'}
		})
		.then((res) => {
			if(res.ok){
				var surveys = this.state.survey;
				surveys[i].visibility = visibility;
				this.setState({survey: surveys});
			}
		})
	}

	sortFunc = (a, b) =>{
		var val1 = a[this.state.orderBy];
		var val2 = b[this.state.orderBy];
		var asc = this.state.order === 'asc' ? 1 : -1;
		if(this.state.orderBy === 'questions'){
			val1 = a[this.state.orderBy].length;
			val2 = b[this.state.orderBy].length;
		}
		if(val1 > val2){
			return asc;
		}
		if(val1 < val2){
			return -asc;
		}
		return 0;
	}

	copySort = (survey) => {
		console.log("hit", survey)
		var surveyCopy = survey.map((survey, index) => [survey, index]);
		surveyCopy.sort((a, b) =>{
			var ret = this.sortFunc(a[0], b[0]);
			if (ret != 0) return ret;
			return a[1] - b[1];
		});
		return surveyCopy.map(val => val[0]);
	}
	searchFilter = (elem) => {
		var val = this.state.search.toLowerCase()
		return this.state.search === '' || elem.name.toLowerCase().includes(val) || elem.course.toLowerCase().includes(val);
	}

	render() {
		if(this.state.inst_id == ""){
			return (<div />)
		}
		return (
		<div className='main'>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Header loggedIn = {this.props.loggedIn} logout={this.props.logout} userFullName = {this.props.userFullName} />
			<Box pb={10} className='watchlistBody'>
			<Paper className="watchlistPaper">
			<Typography align="center" variant="h4">Surveys for {this.state.inst_name}</Typography>
			<hr />
			<Grid container alignItems="center" spacing={0}>
			 <Grid item xs>
			  <Button disabled={this.state.inst_email!=this.props.userEmail} startIcon={<AddIcon />} component={Link} to={"/survey_create?survey_id=NEW&inst_id=" + this.state.inst_id} variant='outlined'>Create New Survey</Button>
			 </Grid>
			 <Grid item container justify="center" xs>
			  <TextField style={{"margin": "auto"}} onChange={this.handleKeyDown} id="search-result" placeholder="Search" variant="outlined"
                          InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),                        }}
                          />
			 </Grid>
			 <Grid item xs> </Grid>
			</Grid>
			  <TableContainer component={Paper}>
			   <Table className="watchlistTable">
			    <TableHead>
			     <TableRow>
			      {headers.map((header) => (
			      	<TableCell 
				      key={header.id}>
					      <TableSortLabel 
				      		active={this.state.orderBy === header.id}
				      		direction={this.state.orderBy === header.id ? this.state.order : 'asc'}
				      		onClick={(e) => this.setOrderBy(e, header.id)}>
						{header.val}
				      	      </TableSortLabel>
			        </TableCell>
			      ))}
				<TableCell>Set Visibility</TableCell>
				<TableCell>Set Course</TableCell>
				<TableCell>View Responses</TableCell>
			     </TableRow>
			    </TableHead>
			    <TableBody>
			     {this.copySort(this.state.survey.filter(this.searchFilter)).slice(this.state.page*this.state.rowsPerPage, (this.state.page+1)*this.state.rowsPerPage).map((survey, index) => (
			      <TableRow key={survey._id}>
				     <TableCell component="th" scope="row">
				     {survey.course}
				     </TableCell>
				     <TableCell><Link style={(this.state.inst_email!=this.props.userEmail) ? {pointerEvents: "none", color: "black"} : {}} to={"/survey_create?survey_id=" + survey._id}>{survey.name}</Link></TableCell>
				     <TableCell><Box borderRadius={16} width={50} align='center' bgcolor="text.disabled" p={2}>{survey.questions.length}</Box></TableCell>
				     <TableCell><Box borderRadius={32} width={200} align='center' bgcolor={colors[survey.visibility]} color="background.paper" p={2}>{survey.visibility}</Box></TableCell>
		              	     <TableCell>
				     	<Select disabled={this.state.inst_email!=this.props.userEmail} value={survey.visibility} onChange={(e) => this.update_visibility(e, survey)}>
				     		<MenuItem key="act" value="Active">Active</MenuItem>
				     		<MenuItem key="ina" value="Inactive">Inactive</MenuItem>
				     		<MenuItem key="draft" value="Draft">Draft</MenuItem>
				     	</Select>
				     </TableCell>
				     <TableCell>
				     	<Select disabled={this.state.inst_email!=this.props.userEmail} value='' onChange={(e) => this.update_section(e, survey)}>
					{this.state.sections.map((join) => (
						<MenuItem key={join.section._id} value={join.section}>
							{join.section.courseId.name +" - " + join.section.courseId.title + "-" + join.section.number}
						</MenuItem>
					))}
					</Select>
				     </TableCell>
				     <TableCell>
				     	<Button onClick={(e) => {this.setState({dialog_id: survey._id, dialog_name: survey.name, dialog_open: !this.state.dialog_open})}}>
				     	View Responses
				     	</Button>
				     </TableCell>
				     </TableRow>
			     ))
			     }
			    </TableBody>
			   </Table>
			  
			  </TableContainer>
			<TablePagination
			rowsPerPageOptions={[5, 10, 25]}
			component="div"
			count={this.state.survey.length}
			rowsPerPage={this.state.rowsPerPage}
			page={this.state.page}
			onChangePage={this.handleChangePage}
			onChangeRowsPerPage={this.handleChangeRowsPerPage}
			/>
			</Paper>
			</Box>
			<QADialog open={this.state.dialog_open} name={this.state.dialog_name} survey_id={this.state.dialog_id}/>
			</MuiThemeProvider>
		
			</div>
		)
	}
}

export default SurveyTable;
