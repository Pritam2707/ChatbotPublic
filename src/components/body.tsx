import React from 'react';
import Contacts from './contacts';
import Chatbox from './chatscreen/chatbox';
import { ForwardModal } from './modal/forward_modal';

function Body() {
  return (
    <div className="body relative h-screen flex flex-col md:flex-row">
      <Contacts />
      <ForwardModal />
      <Chatbox />
    </div>
  );
}

export default Body;
