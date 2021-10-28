import React, { Component } from 'react';
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';
import Face from '@material-ui/icons/Face';
import '../css/login.css'
import theme from '../../theme/theme.js'
import axios from 'axios'
import home from "./home.js"
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import {AppBar, Button,Toolbar,Table,TableBody,Slide,Tooltip,CircularProgress,CssBaseline,
DialogTitle,DialogContentText,DialogContent,DialogActions,ListItemText,Dialog,TableCell,
TableHead,TableRow,Paper,Typography,IconButton,TextField,MuiThemeProvider} from '@material-ui/core';

class Login extends Component {
	constructor(props){
		super(props);
		this.state = {
			username: '',
			password: ''
		}
	}

	onChange = (field) => (e) => this.setState({
    [field]: e.target.value
  })

	onSwitchMode() {
		this.props.switchMode();
	}

	onLogin = (e) => {
		e.preventDefault()
		console.log("Login Clicked")
		const {username, password} = this.state;
		console.log(username, password)
		this.props.loginUser(username, password)
	}

	render() {
		return (
			<div className="main">
      <MuiThemeProvider theme={theme}>
          <CssBaseline />
        <div className="loginPageBody">
          <Paper className="loginPaper" elevation={1}>
            <img className = "logRegImg" src='../../../../static/logo.png' />
            <h1> Dragon Course Review </h1>
            <div className="usernameText">
              <Person className="iconsyay"/>
              <TextField
                onChange={this.onChange('username')}
                value={this.state.username}
                id="username"
                margin="normal"
                type="text"
                placeholder="Username"/>
            </div>

            <div className="usernameText">
              <Lock className="iconsyay"/>
              <TextField
                onChange={this.onChange('password')}
                type="password"
                margin="normal"
                value={this.state.password}
                placeholder="Password"/>
            </div>
							<Button
								// to="/home"
								// component={Link}
                className="btnStyleCustom"
                onClick={this.onLogin}
                >Login
              </Button>
						<div className="button-container">
              <Button
                className="btnStyleCustom"
                onClick={this.props.switchMode}
                >Register
              </Button>
							<Button
                className="btnStyleCustom"
                onClick={() => {alert("In progress")}}
                >Forgot Password
              </Button>
						</div>
          </Paper>
        </div>
        </MuiThemeProvider>
      </div>
		)
	}
}

export default Login;
