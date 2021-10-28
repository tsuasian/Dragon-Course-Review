import React, { Component } from 'react'
import theme from '../theme/theme.js'
import { AppBar, Toolbar, CssBaseline, Paper, IconButton, Typography, Button, MuiThemeProvider } from '@material-ui/core';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import HelpIcon from '@material-ui/icons/Help';
import ListAltIcon from '@material-ui/icons/ListAlt';
import HomeIcon from '@material-ui/icons/Home';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

function UserNavBar(props){
	// <IconButton edge="end" color="inherit" component={Link} to="/home">
	// 	<HomeIcon />
	// </IconButton>
	if(!props.loggedIn){
		return <Toolbar>
						<div className="navButtons" style={{ flex: 1 }}>
						<Button component={Link} to='/register'>Sign Up</Button>
						<Button component={Link} to='/login'>Log In</Button>
						</div>
						<IconButton edge="end" color="inherit" component={Link} to="/faq" aria-label="help">
						 <HelpIcon />
						</IconButton>
					</Toolbar>
	}
	return <Toolbar>
        	<div style={{ flex: 1 }}>
          	<Typography variant="h6" className="navBarWelcome">
           	Welcome, {props.name}
          	</Typography>
        	</div>
					<IconButton edge="end" color="inherit" component={Link} to="/faq" aria-label="help">
					 <HelpIcon />
					</IconButton>
					<IconButton edge="end" color="inherit" component={Link} to="/watchlist">
						<ListAltIcon />
					</IconButton>
					<IconButton edge="end" color="inherit" component={Link} to="/home">
						<HomeIcon />
					</IconButton>
					<Button component={Link} to="/" onClick={props.logout}>Logout</Button>
      	</Toolbar>
}

class NavBar extends Component {
	constructor(props){
		super(props);
		this.state = {
			loggedIn: false,
			name: "",
		}
	}

	componentDidMount(){
		console.log(this.props);
		if (this.props.loggedIn) {
			this.setState({
				loggedIn: true,
				name: this.props.userFullName,
			})
		}
	}
	render() {
		console.log("navbar props", this.props, this.state)
		return (
			<div className="nav">
      	<MuiThemeProvider theme={ theme }>
    			<CssBaseline />
        	<AppBar position="static">
         		<UserNavBar logout={this.props.logout} loggedIn={this.state.loggedIn} name={this.state.name}/>
				  </AppBar>
      	</MuiThemeProvider>
    	</div>
		)
	}
}

export default NavBar
