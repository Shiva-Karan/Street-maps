/*eslint-disable*/
import React, {PropTypes, Component } from 'react';

import {greatPlaceStyle} from './my_great_place_style';

import logo from './logo.svg';


export default class MyGreatPlace extends Component {
  static propTypes = {
    text: PropTypes.string
  };

  static defaultProps = {};


  render() {
    return (
       <div style={greatPlaceStyle}>
        {this.props.text}
       </div>
    );
  }
}