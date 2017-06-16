/*eslint-disable*/
import React, {PropTypes, Component } from 'react';
import logo from './logo.svg';
import './App.css';
import GoogleMapReact from 'google-map-react';
import { Button, Input, InputNumber, Modal, Radio, notification,
        Menu, Dropdown, Icon, Row, Col } from 'antd';
import PlacesAutocomplete, { geocodeByAddress, getLatLng } from 'react-places-autocomplete'
import MyGreatPlace from './my_great_place';
import {geolocated} from 'react-geolocated';
import * as firebase from 'firebase';
import Webcam from 'react-webcam';

const RadioGroup = Radio.Group;


const AnyReactComponent = ({ text }) => <div>{text}</div>;

class App extends Component {
    
    static propTypes = {
        center: PropTypes.array,
        zoom: PropTypes.number
     };
     
    constructor(props){
        super(props);
        this.state = {
            lat: 0,
            lng: 0,
            zoom: 11,
            address: '',
            pop: false,
            gender: "male",
            markers: [{lat: 16.7852111, lng: 80.8270381},{ lat: 17.385044, lng: 78.486671 }],
            imageSrc: null,
            cam : false,
            addedUsers : [],
            currentLocation : true
       };
        this.onChange = (address) => this.setState({ address })
        
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.getLatLng = this.getLatLng.bind(this);
        this.handleAdd = this.handleAdd.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.changeGender = this.changeGender.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.capture = this.capture.bind(this);
        this.openCam = this.openCam.bind(this);
        this.closeCam = this.closeCam.bind(this);
    }
    
    setRef = (webcam) => {
        this.webcam = webcam;
      }
      
      capture = () => {
      
          this.setState({
                imageSrc : this.webcam.getScreenshot()
              });
      };
    
     
     getLatLng(){
         console.log("getLatLng is called.");
        if(this.props.isGeolocationAvailable){
            if(this.props.isGeolocationEnabled){
                if(this.props.coords){
                    console.log(this.props.coords.latitude);
                    console.log(this.props.coords.longitude);
                    this.setState({
                        lat: this.props.coords.latitude,
                        lng: this.props.coords.longitude
                    });
                    console.log("lat&lng are changed...", this.state.lat, this.state.lng);
                }
                else{
                    console.log("props coords is not find.");
                }
            }
            else{
                console.log("geolocation is not enabled");
            }
        }
        else{
            console.log("Geo Location is not Available");
        }
    }
    
    handleFormSubmit = (event) => {
        event.preventDefault();
    
        geocodeByAddress(this.state.address)
          .then(results => getLatLng(results[0]))
          .then(latLng => {console.log('Success', latLng);
                console.log("latitude is :", latLng.lat);
                console.log("Longitude is :", latLng.lng);
                this.setState({
                    lat: latLng.lat,
                    lng: latLng.lng
                });
                console.log("lat&lng are changed...", this.state.lat, this.state.lng);
          })
          .catch(error => console.error('Error', error))
      }
      
      componentDidMount(){
          console.log("Component Mounted....");
          this.databaseRef = firebase.database().ref('add');
          this.databaseRef.on('value',(dataSnap) => {
            this.setState({
               addedUsers: dataSnap.val()
            });
          });  
    }
      
      componentWillUnmount() {
        this.databaseRef.off();
      }
      
      handleAdd(){
          this.setState({
              pop: true
          });
      }
      
      handleCancel(){
          this.setState({
              pop: false
          });
      }
    
    handleSubmit(event){
        event.preventDefault();
        
         let newKey = this.databaseRef.push().key;
         
         let imagePath = "images/"+newKey+"/"+event.target.image.files[0].name;
        
        
        let newPerson = {
            name : event.target.name.value,
            age : event.target.age.value,
            skill: event.target.skill.value,
            gender : this.state.gender,
            lat : this.state.lat,
            lng : this.state.lng,
            condition : event.target.condition.value,
            category : event.target.category.value,
            img : imagePath
        }
        
        console.log(event.target.image.files[0]);
        
        
        let storageRef = firebase.storage().ref();
        
        console.log(newPerson);
        
        let newPersonPushed = {};
        
        newPersonPushed[''+newKey] = newPerson;
        
        storageRef.child(imagePath).put(event.target.image.files[0])
        
        
        this.databaseRef.update(newPersonPushed).then(this.handleOrderSuccess).catch(this.handleOrderFail);
        
        this.setState({
            pop: false
        })
    }
    
    handleOrderSuccess(){
        console.log("Order Placed");
        notification.success({
            message: 'person Added',
            description: 'all the details added to the firebase.!'
         });
    }
    handleOrderFail(){
        console.log("failed");
        notification.error({
            message: 'Failed to Add person',
            description: 'Please try again!'
         });
    }
    
    changeGender(e){
        this.setState({
            gender : e.target.value
        });
    }
  
    openCam(){
        this.setState({
            cam: true
        });
    }
    
    closeCam(){
        this.setState({
            cam: false
        });
    }
    
  render() {
      
       const inputProps = {
        value: this.state.address,
         onChange: this.onChange,
         placeholder: 'Search Places...'
        }
        
        
        let allItemsDisplayed = [];
        
        if(this.state.addedUsers.length == 0){
          console.log("No markers are present.");
        }
        else{
           allItemsDisplayed =  Object.keys(this.state.addedUsers).map((key) => {
               
               return (
                        <MyGreatPlace
                          lat={this.state.addedUsers[key].lat}
                          lng={this.state.addedUsers[key].lng}
                            text={"H"}
                        />
                );
           });
        }

    return (
     <div style={{width: '95%', height: '400px'}}>
        
        <h1 style={{color: "BLUE"}}>STREET</h1>
     <br />
     
      <form onSubmit={this.handleFormSubmit}>
        <PlacesAutocomplete inputProps={inputProps} /><br /><br />
        <Button type="primary" htmlType="submit">Search</Button>
      </form>
     <br />
     <Button type="primary" onClick={this.getLatLng}>Current Location</Button>
     &nbsp;&nbsp;&nbsp;
     
     <Button type="primary" onClick={this.handleAdd}>Add</Button><br />
     <br />
     <GoogleMapReact

        bootstrapURLKeys={{
            key: "AIzaSyAcS52skiqBCvLlpZ5Dkm1rh25WQ4-6CIM"
          }}
        center={[this.state.lat, this.state.lng]}
        defaultZoom={this.state.zoom}
        >
        <MyGreatPlace
                  lat={this.state.lat}
                  lng={this.state.lng}
                    text={"C"}/>
            
            {allItemsDisplayed}  
      </GoogleMapReact>
      
      <Modal title="TakePhoto"
            visible={this.state.cam}
            onCancel={this.closeCam}
            footer={null} width='90%'>
          <div>
                <Webcam
                  audio={false}
                  height={350}
                  ref={this.setRef}
                  screenshotFormat="image/jpeg"
                  width={350}
                />
                <button onClick={this.capture}>Capture photo</button>
                <br /><br />
                <img src={this.state.imageSrc} alt="No Image"/>
              </div>
          </Modal>     
     <Modal title="Add"
            visible={this.state.pop}
            onCancel={this.handleCancel}
            footer={null} width='90%'>
            <div>
            <form onSubmit={this.handleSubmit}>
                <Input placeholder="Name" name="name" /><br /> <br />
                <InputNumber placeholder="Age" name="age" /><br /><br />
                <Input placeholder="Skills" name="skill" /><br /> <br />
                <RadioGroup onChange={this.changeGender} 
                    value={this.state.gender} name="gender">
                    <Radio value={"male"}>male</Radio>
                    <Radio value={"female"}>female</Radio>
                  </RadioGroup><br /><br />
                 <Input placeholder="Condition" name="condition" /><br /> <br />
                <input type="file" name="image" /><br />
                <select name="category">
                    <option value={"Willing to Work"}>Willing to Work</option>
                    <option value={"Not Willing to Work"}>Not Willing to Work</option>
                    <option value={"Working"}>Working</option>
                    <option value={"Homeless"}>HomeLess</option>
                </select><br /><br />
                <Button type="primary" htmlType="submit">Add</Button>
            </form>
            </div>
        </Modal>
    </div>
    
    );
  }
}

export default geolocated({
  positionOptions: {
    enableHighAccuracy: false,
  },
  userDecisionTimeout: 5000
})(App);
