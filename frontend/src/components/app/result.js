import { withStyles } from '@material-ui/core/styles';
import React from "react";
import {
	  BrowserRouter as Router,
	  Link,
	  useLocation,
} from "react-router-dom";
import {TablePagination,Box,Input,InputAdornment,TextField,Grid,TableContainer,Table,TableCell,TableRow,TableHead,TableBody,CssBaseline,Paper,Typography,MuiThemeProvider} from '@material-ui/core';
import Header from '../Header.js';
import theme from '../../theme/theme.js'
import SearchIcon from '@material-ui/icons/Search';
import querystring from 'querystring';

class ResultView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			user: {},
			courses: [],
			page: 0,
			rowsPerPage: 10,
			search: querystring.parse(this.props.location.search.substring(1)).name,
		}
		this.handleKeyDown = this.handleKeyDown.bind(this);
	}

	componentDidMount() {
		let query = querystring.parse(this.props.location.search.substring(1));
		fetch('http://localhost:3000/search/course?name=' + query.name)
                .then((res) => res.json())
                .then((res) => {
			console.log(res);
                        this.setState({
				courses: res
                        });
                });
	}

	handleChangePage = (e, npage) =>{
                this.setState({page: npage});
        };

        handleChangeRowsPerPage = (e) =>{
                this.setState({page: 0, rowsPerPage: e.target.value});
        };

	handleKeyDown = (e) => {
		if (e.key === 'Enter') {
			this.setState({search: e.target.value});
			fetch('http://localhost:3000/search/course?name=' + e.target.value)
                	.then((res) => res.json())
                	.then((res) => {
                        	console.log(res);
                        	this.setState({
                                	courses: res
                        	});
                	});
		}
	}
	render() {
		return (
		<div className='main'>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Header loggedIn = {this.props.loggedIn} logout={this.props.logout} userFullName = {this.props.userFullName}/>
			<div className='watchlistBody'>`
			<Paper className="watchlistPaper">
			<Typography variant="h4">{"Results for: " + this.state.search}</Typography>
			<hr />
			<TextField onKeyDown={this.handleKeyDown} id="search-result" placeholder="Search" variant="outlined"
                        InputProps={{startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),                        }}
                        />
			  <TableContainer component={Paper}>
			   <Table className="watchlistTable">
			    <TableHead>
			     <TableRow>
			      <TableCell>Course Name</TableCell>
			      <TableCell>Department</TableCell>
			      <TableCell>Survey Rating</TableCell>
			      <TableCell>Course Rating</TableCell>
			     </TableRow>
			    </TableHead>
			    <TableBody>
			     {this.state.courses.slice(this.state.page*this.state.rowsPerPage, (this.state.page+1)*this.state.rowsPerPage).map((course) => (
			      <TableRow key={course._id}>
				     <TableCell component="th" scope="row">
				     <Link to={"/course?name="+course.name}>{course.name + " - " + course.title}</Link>
				     </TableCell>
				     <TableCell>{course.title.match("^[a-zA-Z]+")[0]}</TableCell>
				     <TableCell>{Number.parseFloat(course.surveyRating).toPrecision(2)}</TableCell>
				     <TableCell>{Number.parseFloat(course.reviewRating).toPrecision(2)}</TableCell>
		              </TableRow>
			     ))
			     }
			    </TableBody>
			   </Table>
			  </TableContainer>
			<TablePagination
                        rowsPerPageOptions={[5, 10, 25]}
                        component="div"
                        count={this.state.courses.length}
                        rowsPerPage={this.state.rowsPerPage}
                        page={this.state.page}
                        onChangePage={this.handleChangePage}
                        onChangeRowsPerPage={this.handleChangeRowsPerPage}
                        />
			  
			</Paper>
			</div>
			</MuiThemeProvider>
		
			</div>
		)
	}
}

export default ResultView;
