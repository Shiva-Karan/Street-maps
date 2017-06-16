/*eslint-disable*/
import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import "antd/dist/antd.css";
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import * as firebase from 'firebase';


const config = {
    apiKey: "AIzaSyBuDnDoFr__voyw_jqrZof9W3lay7sSWI4",
    authDomain: "street-41cb0.firebaseapp.com",
    databaseURL: "https://street-41cb0.firebaseio.com",
    projectId: "street-41cb0",
    storageBucket: "street-41cb0.appspot.com",
    messagingSenderId: "888555847354"
  };
  firebase.initializeApp(config);


ReactDOM.render(
    <div style={{width: '100%', height: '400px'}}>
        <App />
    </div>, 
    document.getElementById('root')
);

