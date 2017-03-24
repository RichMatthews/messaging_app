import React from 'react';
import ReactDOM from 'react-dom';
import Modal from 'react-modal';
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
      activeChannel: false,
      all_channels: [],
      all_messages: [],
      bodyValue: '',
      channelValue: 'General',
      channelNameValue: '',
      isChannelModalOpen: false,
      isDirectMsgModalOpen: false,
      user: ''
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
    this.forceUpdate();
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
    this.scrollToBottom();
    this.getChannels();
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
    let chat  = { name: this.state.user.displayName, body: this.state.bodyValue, image: this.state.user.photoURL };
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

  openChannelModal = () => {
    this.setState({isChannelModalOpen: true})
  };

  openDirectMsgModal = () => {
    this.setState({isDirectMsgModalOpen: true})
  };

  closeChannelModal = () => {
    this.setState({isChannelModalOpen: false})
  };

  closeDirectMsgModal = () => {
    this.setState({isDirectMsgModalOpen: false})
  };

  handleChannelNameChange = (event) => {
    this.setState({channelNameValue: event.target.value})
  }

  createChannel = () => {
    let channelName = this.state.channelNameValue;
    var postData = {
      name: channelName,
      members: '100',
      purpose: 'purpose'
    };
    var newPostKey = firebase.database().ref().child('options').push().key;
    var updates = {};
    updates['/options/' + 'channels/' + channelName + newPostKey] = postData;
    firebase.database().ref().update(updates);
    this.getChannels();
    this.setState({isChannelModalOpen: false})
  }

  login = () => {
    let userDisplayName;
    firebase.auth().signInWithRedirect(provider).then(function(result) {
      var token = result.credential.accessToken;
      var user = result.user;
    }).catch(function(error) {
      var errorCode = error.code;
      var errorMessage = error.message;
      var email = error.email;
      var credential = error.credential;
    });

  };

  scrollToBottom = () => {
    const node = ReactDOM.findDOMNode(this.messagesEnd);
    node.scrollIntoView({behavior: "smooth"});
  }

  componentDidUpdate() {
    this.scrollToBottom();
    //setInterval(this.getMessagesAndSetState, 3000);
  }

  componentWillUpdate() {
    //this.getMessagesAndSetState();
  }


  render(){
    return (
         <div className="container">
           <div className="modals">
             <div className="channelModal" >
                 <Modal className="modal" isOpen={this.state.isChannelModalOpen} onClose={() => this.closeChannelModal()}>
                   <h1>Create a Channel</h1>
                   <input id="channelNameValue" value={this.channelNameValue} onChange={this.handleChannelNameChange} placeholder="channel name"/>
                   <p><button onClick={() => this.createChannel()}>Create Channel</button></p>
                   <p><button onClick={() => this.closeChannelModal()}>Cancel</button></p>
                 </Modal>
             </div>
             <div className="directMsgModal" >
                 <Modal className="modal" isOpen={this.state.isChannelModalOpen} onClose={() => this.closeChannelModal()}>
                   <h1>Send a Message</h1>
                   <input id="channelNameValue" value={this.channelNameValue} onChange={this.handleChannelNameChange} placeholder="channel name"/>
                   <p><button onClick={() => this.createChannel()}>Create Channel</button></p>
                   <p><button onClick={() => this.closeChannelModal()}>Cancel</button></p>
                 </Modal>
             </div>
           </div>
           <div className="navbar">
              <nav role="links">
                <button onClick={this.login}>Log in with Google</button>
                <h2> Channels <button className="createChannelBtn" onClick={this.openChannelModal}>+</button></h2>
                {this.state.all_channels.map(function(chnl, index){
                    return <div id="channelBtn" key={ index }><Button channelClick={this.channelClick.bind(this)} text={chnl.name} /></div>
                }, this)}
              </nav>
              <h2> Direct Messages <button className="directMsgBtn" onClick={this.openDirectMsgModal}>+</button></h2>
            </div>
            <div className="other">
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
                        return <div id="msgs" key={ index }><p id="msgPhoto"><img src={msg.image} height="42" width="42"/><span id="msgName">{msg.name}</span></p><p id="msgBody">{msg.body}<span><button onClick={() => this.deleteMessage(index)}>Delete</button></span></p></div>
                    }, this)}
                    <div id="bottom" ref={(el) => { this.messagesEnd = el; }}>
                    </div>
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
        </div>
      )
  };
};
