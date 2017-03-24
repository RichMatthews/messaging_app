import React from 'react';
import { rootRef, firebase_init, storage } from '../../../firebase/firebase_config.js';

import './index.scss';

export default class MessageDetail extends React.Component {

  post = () => {
    this.props.postMessageToDb(this.props.channelValue);
  }

  onEnter = (e) => {
    if (e.key === 'Enter') {
      this.post();
    }
  }

  render() {
    return (
      <div className="messageDetail">
        <div className="messageForm" >
            <input id="senderMsgBody" value={this.props.bodyValue} onChange={this.props.handleBodyChange} placeholder="Body" onKeyPress={this.onEnter}></input>
        </div>
      </div>
    );
  }
}
