import React from 'react';
import { shallow, mount } from 'enzyme';
import { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
import sinon from 'sinon';
const chai = require('chai');
const sinonChai = require("sinon-chai");
chai.use(chaiEnzyme());
chai.use(sinonChai);

import MessageDetail from './';
import MessagingApp from '../../messagingApp'

describe('message detail component', () => {
  let sandbox;
  let renderedOutput;
  let handleNameValueStub;
  let handleBodyChangeStub;
  let handleBodyValueStub;
  beforeEach(() => {
    handleNameValueStub = sinon.stub();
    handleBodyChangeStub = sinon.stub();
    handleBodyValueStub = sinon.stub();
    renderedOutput = mount (<MessageDetail handleBodyChange={handleBodyChangeStub}/>);
  });

  afterEach(() => {
    handleBodyChangeStub.reset();
  });

  it('renders message detail', () => {
    expect(renderedOutput).to.be.present();
  });

  it('has contains the messageDetail class name', () => {
    let classname = renderedOutput.find('.messageDetail');
    expect(classname).to.have.length(1);
  });

  it('has contains the messageForm class name', () => {
    let classname = renderedOutput.find('.messageForm');
    expect(classname).to.have.length(1);
  });

  it('contains a body input field', () => {
    let inputField = renderedOutput.find('#senderMsgBody');
    expect(inputField).to.have.length(1);
  });

  it('calls the handleNameChange function', () => {
    //needs fixing
  });

  it('calls the handleBodyChange function', () => {
    const input = renderedOutput.find('#senderMsgBody');
    input.simulate('change', { target: { value: 'My message' } });
    expect(handleBodyChangeStub).to.have.been.called;
  });

  it('has a name value of `Rich`', () => {
    //needs fixing
  });

  it('has a body value of `my message`', () => {
    const input = renderedOutput.find('#senderMsgBody');
    input.simulate('change', { target: { value: 'my message' } });
    expect(handleBodyChangeStub).to.have.been.calledWith(sinon.match({ target: { value: 'my message' }}));
  });

});
