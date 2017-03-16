import React from 'react';
import ReactDOM from 'react-dom';
import { rootRef, firebase_init, storage, messaging } from '../../firebase/firebase_config.js';

import './index.scss';
import Header from '../components/header';
import Channel from '../components/channel'
import MessageDetail from '../components/messageDetail'
import Footer from '../components/footer';
import Button from '../components/button'

let firebase = require('firebase');
let user = firebase.auth().currentUser;
let provider = new firebase.auth.GoogleAuthProvider();

export default class MessagingApp extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      all_messages: [],
      bodyValue: '',
      activeChannel: false,
      channelValue: 'General',
      user: '',
      all_channels: []
    };

    this.getMessagesAndSetState = this.getMessagesAndSetState.bind(this);
    this.login = this.login.bind(this);
  }

  getMessagesAndSetState = () => {
    this.pullMessagesFromDb('/options' + '/messages/' + this.state.channelValue + '/').then((messages) => {
      let all_messages = Object.keys(messages.val()).map(function(key) {
       return messages.val()[key];
     });
     this.setState({all_messages: all_messages});
    });
  };

  getChannels = () => {
    this.pullMessagesFromDb('/options' + '/channels/').then((channels) => {
      let all_channels = Object.keys(channels.val()).map(function(key) {
       return channels.val()[key];
     });
     this.setState({all_channels: all_channels});
    });
  };

  pullMessagesFromDb = (query) => {
    return new Promise((resolve, reject) => {
      firebase.database().ref(query).on('value', resolve);
    });
  }

  componentDidMount = () => {
    this.requestPermission();
    this.getMessagesAndSetState();
    firebase.auth().getRedirectResult().then(function(result) {
        if (result.credential) {
          var token = result.credential.accessToken;
        }
        return result;
      }).catch(function(error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        var email = error.email;
        var credential = error.credential;
      }).then(result => {
        if (result.user != null) {
          this.setState({user: result.user});
        }
      });

  }

  requestPermission = () => {
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
    });
  }

  handleNameChange = (event) => {
    this.setState({nameValue: 'a'})
  }

  handleBodyChange = (event) => {
    this.setState({bodyValue: event.target.value})
  }

  resetForm = () => {
    this.setState({bodyValue: ''});
  }

  postMessageToDb = (channelName) => {
    let database = rootRef.child('options/' + 'messages/' + channelName);
    let chat  = { name: this.state.user.displayName, body: this.state.bodyValue };
    database.push().set(chat).then(() => {
      this.getMessagesAndSetState();
    });
    this.resetForm();
  };

  clearMessages = () =>{
    this.setState({all_messages: []},() => this.getMessagesAndSetState());
  };

  channelClick = (anything) => {
    this.setState({ channelValue: anything});
    this.setState({ activeChannel: true });
    this.clearMessages();
  };

  deleteMessage = (index) => {
    // let dltdMsg = rootRef.child('messages/' + this.state.channelValue + '/-KentOtPSifEqogyBi8Y');
    // dltdMsg.remove();
    this.getMessagesAndSetState();
  };

  createChannel = () => {
    // probably needs to be done with firebase
    let channelName = prompt("Enter channel name");
    this.setState({all_channels: this.state.all_channels.concat([channelName])})
  }



  login = () => {
    let userDisplayName;
    firebase.auth().signInWithRedirect(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(error) {
      debugger;
      console.log('3');
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });

  };


  render(){
    return (
         <div className="container">
          <nav role="links">
            <h2> Channels </h2>
            <button onClick={this.login}>Log in with Google</button>
            <button onClick={this.createChannel}>Add channel</button>
            {this.state.all_channels.map(function(chnl, index){
                return <div key={ index }><Button channelClick={this.channelClick.bind(this)} text={chnl.name} /></div>
            }, this)}
          </nav>
          <div className="headingOne">
            {this.state.activeChannel
              ?
              <Channel
               channelValue={this.state.channelValue}
              />
              :
              <h1> {this.state.channelValue} </h1>
            }
          </div>
          <div className="postedMessagesContainer">
              <div id="messages">
                {this.state.all_messages.map(function(msg, index){
                    return <div id="msgs" key={ index }><p id="msgName">{msg.name}</p><p id="msgBody">{msg.body}<span><button onClick={() => this.deleteMessage(index)}>Delete</button></span></p></div>
                }, this)}
              </div>
          </div>
          <div className="messageDetails">
            <MessageDetail
              handleNameChange={this.handleNameChange.bind(this)}
              handleBodyChange={this.handleBodyChange.bind(this)}
              postMessageToDb={this.postMessageToDb.bind(this)}
              bodyValue={this.state.bodyValue}
              channelValue={this.state.channelValue}
              onChange={this.props.onChange}
              user={this.state.user}
            />
          </div>
        </div>
      )
  };
};
