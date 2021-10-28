import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../css/global.css';
import Landing from "./landing.js";
import login from "./login.js";
import register from "./register.js";
import Home from "./home.js"
import LogReg from "./log_reg.js"
import Course_view from "./course_view.js";
import Faq from "./faq.js";
import Watchlist from "./watchlist.js";
import Result from "./result.js";
import "bootstrap/dist/css/bootstrap.min.css";
import axios from 'axios'
import SurveyTable from "./survey_table.js";
import SurveyCreate from "./survey_create.js";

class App extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			loggedIn: false,
			landing: true,
			userFullName: "",
			userEmail: "",
		}
	this.loginUser = this.loginUser.bind(this)
	this.logout = this.logout.bind(this)
	}

	loginUser(username, password) {
		axios.post('http://localhost:3000/login', {
			username: username,
			password: password
		})
		.then((resp) => {
			console.log("Login Success", resp);
			this.setState(prevState => ({
				loggedIn: !prevState.loggedIn
			}));
			this.setState({
				userFullName: `${resp.data.user.firstName} ${resp.data.user.lastName}`,
				userID: resp.data.user._id,
				userEmail: resp.data.user.email
			})
			console.log("Logged in?", this.state.loggedIn);
		})
		.catch((err) => {
			console.log("Error in Login", err);
		})
	}

	logout = () => {
		console.log("LOGOUT");
		axios.get('http://localhost:3000/logout')
		.then(
			this.setState({
				loggedIn: false,
				userFullName: undefined,
				userID: undefined,
				userEmail: undefined
			})
		)
	}

	render() {
		return (
			<Router>
				<div className="routerDiv">
					<Route path="/" exact component={() => <Landing loggedIn = {this.state.loggedIn}/>}/>
					<Route path="/login" component={() => <LogReg logged={true} loginUser={this.loginUser} loggedIn={this.state.loggedIn}/>} />
					<Route path="/register" component={() => <LogReg logged={false} loginUser={this.loginUser} loggedIn={this.state.loggedIn}/>}/>
					<Route path="/survey_table" component={(props) => <SurveyTable {...props} loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName} userEmail={this.state.userEmail} logout={this.logout} />}/>
					<Route path="/survey_create" component={(props) => <SurveyCreate {...props} loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName} userEmail={this.state.userEmail} logout={this.logout} />}/>
					<Route path="/home" component={() => <Home loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName} logout={this.logout} /> }/>
					<Route path="/course" render={props => <Course_view {...props} userID = {this.state.userID} loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName}  logout={this.logout} />}/>
					<Route path="/faq" component={(props) => <Faq {...props} loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName}  logout={this.logout} />}/>
					<Route path="/watchlist" component={(props) => <Watchlist {...props} loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName} id = {this.state.userID}  logout={this.logout} />}/>
					<Route path="/results" component={(props) => <Result {...props} loggedIn = {this.state.loggedIn} userFullName = {this.state.userFullName}  logout={this.logout} />}/>
				</div>
			</Router>
		)
	}
}

export default App;
