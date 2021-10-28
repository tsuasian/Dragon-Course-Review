import React from 'react';
import Login from './login'
import { withStyles } from '@material-ui/core/styles';
import Registration from './register'
import { BrowserRouter as Router, Route, Link, Redirect } from "react-router-dom";

class LogReg extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			mode: 'register',
		};
	}

	switchMode() {
    this.state.mode=='register'
    ? this.setState({mode: 'login'})
    : this.setState({mode: 'register'})
  }

  registered() {
    this.setState({ mode: 'login' })
  }

	componentDidMount() {
		const pressLogIn = this.props.logged
		console.log(pressLogIn)
		if (pressLogIn) { this.setState({ mode: 'login'})}
		console.log(this.state.mode)
	}

	render() {
		return (
			this.props.loggedIn
			? <Redirect to="/home" />
			: (this.state.mode=='register')
	      ? <Registration
	          switchMode={this.switchMode.bind(this)}
	          done={() => this.registered()}
	        />
	      : <Login
	          switchMode={this.switchMode.bind(this)}
	          status={this.props.status}
						loginUser={this.props.loginUser}
	          // user={this.props.user}
	        />
		)
	}
}

export default LogReg;
