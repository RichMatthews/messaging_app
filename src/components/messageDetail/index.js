import React from 'react';
import { rootRef, firebase_init, storage } from '../../../firebase/firebase_config.js';

import './index.scss';

export default class MessageDetail extends React.Component {

  wait = () => {
    this.props.postMessageToDb(this.props.channelValue);
  }

  render() {
    return (
      <div className="messageDetail">
        <div className="messageForm" >
            <input id="senderMsgBody" value={this.props.bodyValue} onChange={this.props.handleBodyChange} placeholder="Body"/>
            <button id="postButton" disabled={!this.props.user} className="postButton" onClick={this.wait} >Post</button>
        </div>
      </div>
    );
  }
}
