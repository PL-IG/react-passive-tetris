import React from 'react';
import * as ReactDOM from 'react-dom';
import PassiveTetris from '../src/PassiveTetris';

describe('PassiveTetris', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<PassiveTetris />, div);
    ReactDOM.unmountComponentAtNode(div);
  });
});
