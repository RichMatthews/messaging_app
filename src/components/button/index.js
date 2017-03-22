import React from 'react';
import './index.scss';


export default class Button extends React.Component {

  buttonOnClick = () => {
    this.props.channelClick(this.props.text)
  }

  render() {
    return (
      <div>
        <button className="buttonComponent" onClick={this.buttonOnClick}>{this.props.text}</button>
      </div>
    );
  }
}
