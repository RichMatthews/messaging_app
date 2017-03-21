import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import chaiEnzyme from 'chai-enzyme';
const chai = require('chai');
chai.use(chaiEnzyme());
import Main from './index';

describe('react router', () => {
  let renderedOutput;

  beforeEach(() => {
      renderedOutput = mount (<Main />);
  });

  // it('calls componentDidMount', () => {
  //   expect(renderedOutput.componentDidMount.calledOnce).to.equal(false);
  // });
  // it('renders the correct text when the general link is clicked', () => {
  //   expect()
  // });
});
