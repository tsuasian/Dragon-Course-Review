import React, { Component } from 'react'
import logo from "../../static/logo.png"

class Title extends Component {
  render() {
    return (
      <div className="dcr-title" id="title">
        <img className="dcr-title-img" src={logo} alt="Dragon Course Review" />
        <span style={{color: 'rgb(74, 74, 74)'}}>
          <span style={{color: 'rgb(74, 74, 74)'}}>Dragon </span>
          <span> Course Review </span>
        </span>
      </div>
    )
  }
}

export default Title
