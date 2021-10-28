import { withStyles } from '@material-ui/core/styles';
import React from "react";
import {
	  BrowserRouter as Router,
	  Link,
	  useLocation
} from "react-router-dom";
import {Box,TextField,Grid,TableContainer,Table,TableCell,TableRow,TableHead,TableBody,CssBaseline,Paper,Typography,MuiThemeProvider} from '@material-ui/core';
import Header from '../Header.js';
import theme from '../../theme/theme.js'

class WatchlistView extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			courses: [],
			active: false
		}
	}

	componentDidMount() {
		fetch('http://localhost:3000/get_is_watchlist?user_id=' + this.props.id)
    	.then((res) => res.json())
    	.then((res) => {
			console.log(res);
      this.setState({ courses: res, active: true });
		});
	}

	render() {
		if(!this.state.active){
			return (<div/>)
		}
		return (
		<div className='main'>
		<MuiThemeProvider theme={theme}>
			<CssBaseline />
			<Header logout={this.props.logout} loggedIn = {this.props.loggedIn} userFullName = {this.props.userFullName}/>
			<div className='watchlistBody'>
			<Paper className="watchlistPaper">
			<Typography variant="h4">Watchlist</Typography>
			<hr />
			  <TableContainer component={Paper}>
			   <Table className="watchlistTable">
			    <TableHead>
			     <TableRow>
			      <TableCell>Course Name</TableCell>
			      <TableCell>Department</TableCell>
			      <TableCell>Instructor(s)</TableCell>
			     </TableRow>
			    </TableHead>
			    <TableBody>
			     {this.state.courses.map((course) => (
			      <TableRow key={course.course._id}>
				     <TableCell component="th" scope="row">
				     <Link to={"/course?name="+course.course.name}>{course.course.name}</Link>
				     </TableCell>
				     <TableCell>{course.course.title.match("^[a-zA-Z]+")[0]}</TableCell>
				     <TableCell>{course.instructors.join(", ")}</TableCell>
		              </TableRow>
			     ))
			     }
			    </TableBody>
			   </Table>
			  </TableContainer>

			</Paper>
			</div>
			</MuiThemeProvider>

			</div>
		)
	}
}

export default WatchlistView;
