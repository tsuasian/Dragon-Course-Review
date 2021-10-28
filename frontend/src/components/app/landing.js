import React, { Component } from 'react';
import NavBar from "../NavBar.js";
import Title from "../Title.js";
import TypeAheadSearch from '../TypeAheadSearch'
import Header from '../Header';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import { Button } from "@material-ui/core";
export default class landing extends Component {
  render() {
    var courses = [];
    var professors = [];
    console.log("landing props", this.props)
    return (
      <div className = 'container-fluid'>
        <NavBar loggedIn = {this.props.loggedIn}/>
        <div className='container-fluid my-5 landing-container'>
        <Title />
        </div>
          <TypeAheadSearch items={courses} profs={professors}/>
          <p className="subtext">
            Built for Drexel students by Drexel students |
            <a href="http://www.cci.drexel.edu/SeniorDesign/2020_2021/DragonCourseReview/index.html"> DCR TEAM </a>
          </p>
      </div>
    )
  }
}
