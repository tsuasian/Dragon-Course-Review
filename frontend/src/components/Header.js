import React, { Component } from 'react';
import NavBar from "./NavBar.js";
import Title from "./Title.js";
import styled from "styled-components";

export default class Header extends Component {
    render() {
      console.log("header props", this.props)
        return (
	         <div>
		         <Title />
		         <NavBar loggedIn = {this.props.loggedIn} logout = {this.props.logout} userFullName = {this.props.userFullName}/>
	         </div>
        )
    }
}
