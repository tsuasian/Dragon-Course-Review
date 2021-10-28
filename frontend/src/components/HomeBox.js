import React, { Component } from 'react'
import styled from 'styled-components'
import TypeAheadSearch from './TypeAheadSearch'
import {Paper, Grid, Button} from '@material-ui/core'

class HomeBox extends Component {
	constructor(props) {
		super(props);
	}
  render() {
		return (
			<Paper className="homePaper" square={true} style={{background: 'rgb(239, 239, 239) center center repeat'}}>
				<Grid container direction="column" justify="space-evenly">
					<TypeAheadSearch/>
				</Grid>
				<p className="subtext">
					Built for Drexel students by Drexel students |
					<a href="http://www.cci.drexel.edu/SeniorDesign/2020_2021/DragonCourseReview/index.html"> DCR TEAM </a>
				</p>
		  </Paper>
		)
	}
}

export default HomeBox

// <Button color="inherit">
// 	Find a <br/> Professor
// </Button>
//
// <Button color="inherit">
// 	Find a <br/> Course
// </Button>
//
// <Button color="inherit">
// 	Rate a <br/> Professor
// </Button>
//
// <Button color="inherit">
// 	Rate a <br/> Course
// </Button>
