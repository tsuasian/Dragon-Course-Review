import React, { Component } from 'react';
import HomeBox from '../HomeBox';
import Header from '../Header';
export default class home extends Component {
	render() {
		console.log("home props", this.props)
		return (
			<div className='container-fluid mx-0'>
				<Header loggedIn = {this.props.loggedIn} logout={this.props.logout} userFullName = {this.props.userFullName}/>
				<HomeBox />
			</div>
    )
	}
}
