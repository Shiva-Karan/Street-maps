import React from 'react';
import {geolocated} from 'react-geolocated';
 
class Demo extends React.Component {
    
  render() {
    return (
         <MyGreatPlace
                  lat={this.props.passedItem.lat}
                  lng={this.props.passedItem.lng}
                    text={this.props.passedItem.pointer}/> 
    );
  }
}
 
export default Demo;