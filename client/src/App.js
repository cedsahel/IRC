import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import Chat from './components/chat';
import Login from './components/Login';

import './App.css';
const socket = io('http://localhost:3333', { transports: ['websocket'] });


function App() {

  const [User, setUser] = useState(null)


  socket.on('loggedIn', (user) => {
    console.log(user)
    // setUser(user)
  })

  const test = () => {
    console.log('yep')
    socket.emit('test', User)
  }
  if (User == null) {
    return (
      <div>
        {/* <Chat /> */}
        {/* <button onClick={test}>Default</button> */}
        <Login />
      </div>
    );
  }
    return (
      <div>
        <Chat />
        {/* <button onClick={test}>Default</button> */}
        {/* <Login /> */}
      </div>
    );


}

export default App;