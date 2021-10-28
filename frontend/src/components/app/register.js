import React, { Component } from 'react';
import axios from 'axios'
import Person from '@material-ui/icons/Person';
import Lock from '@material-ui/icons/Lock';
import Face from '@material-ui/icons/Face';
import {AppBar, Button,Toolbar,Table, TableBody,Slide,Tooltip,CircularProgress,CssBaseline,
DialogTitle,DialogContentText,DialogContent,DialogActions,ListItemText,Dialog,TableCell,
TableHead,TableRow,Paper,Typography,IconButton,TextField,MuiThemeProvider} from '@material-ui/core';
import '../css/register.css'
import theme from '../../theme/theme.js'
import SvgIcon from '@material-ui/core/SvgIcon';

class Registration extends Component {
	constructor(props){
		super(props);
		this.state = {
      username: "",
      password: "",
      confPassword: "",
      email: "",
      fName: "",
      lName: ""
    }
	}

	onChange = (field) => (e) => {
    this.setState({
      [field]: e.target.value
    })
  }

	onSwitchMode() {
		this.props.switchMode();
	}

	onRegister = (e) => {
		e.preventDefault()
		var self = this;
    const {username, password, confPassword} = this.state;
    if (password !== confPassword){
      alert("Passwords must match");
      this.setState({
        password: "",
        confPassword: "",
      });
    }
		axios.post('http://localhost:3000/signup', {
			username: this.state.username,
			firstName: this.state.fName,
			lastName: this.state.lName,
			email: this.state.email,
			password: this.state.password
		})
		.then((resp) => {
			console.log("Success Registration", resp)
		})
		.catch((err) => {
			console.log("Error in Registration", err)
		})
		this.onSwitchMode()
	}

	render() {
		return (
			<div className="main">
      <MuiThemeProvider theme={theme}>
          <CssBaseline />
        <div className="loginPageBody">
          <Paper className="loginPaper" elevation={1}>
            <img className = "logRegImg" src='../../../../static/logo.png' />
            <h1> Welcome to Dragon Course Review </h1>
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
              <Person className="iconsyay"/>
              <TextField
                onChange={this.onChange('fName')}
                value={this.state.fName}
                id="fName"
                margin="normal"
                type="text"
                placeholder="First Name"/>
            </div>

            <div className="usernameText">
              <Person className="iconsyay"/>
              <TextField
                onChange={this.onChange('lName')}
                value={this.state.lName}
                id="lName"
                margin="normal"
                type="text"
                placeholder="Last Name"/>
            </div>
	    <Tooltip title="Emails should be Drexel emails. If you're a professor, please enter your email as it appears in the Drexel Directory. This is usually the full version of the email. IE, abc.d.efg@drexel.edu.">
            <div className="usernameText">
              <Person className="iconsyay"/>
              <TextField
                onChange={this.onChange('email')}
                value={this.state.email}
                id="lName"
                margin="normal"
                type="text"
                placeholder="email"/>
            </div>
	    </Tooltip>

            <div className="usernameText">
              <Lock className="iconsyay"/>
              <TextField
                onChange={this.onChange('password')}
                type="password"
                margin="normal"
                value={this.state.password}
                placeholder="Password"/>
            </div>
            <div className="usernameText">
              <Lock className="iconsyay"/>
              <TextField
                className="lastinputLog"
                onChange={this.onChange('confPassword')}
                type="password"
                value={this.state.confPassword}
                margin="normal"
                placeholder="Retype Password"/>
            </div>
              <Button
                className="btnStyleCustom"
                onClick={this.onRegister}
                >Register
              </Button>
              <Button
                className="btnStyleCustom"
                onClick={this.props.switchMode}
                >Already have an account?
              </Button>
          </Paper>
        </div>
        </MuiThemeProvider>
      </div>
		)
	}
}

export default Registration;
