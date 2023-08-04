import React, { useState} from 'react'
import {v4 as uuidv4} from 'uuid';
import toast from 'react-hot-toast'; 
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate=useNavigate();
  const [roomId, setRoomId]=useState('');
  const [username,setUsername]=useState('');

  const createNewRoom=(e)=>
  {
    e.preventDefault();
    const id=uuidv4();
    setRoomId(id);
    toast.success("Created a new room");
  }

  const joinRoom=()=>
  {
    if(!roomId||!username)
    {
      toast.error("Room ID and UserName Reuired");
      return ;
    }
    navigate(`/editor/${roomId}`,{
      state:
      {
        username,
      },
    }
    );

  }

  const handleInputEnter=(e)=>
  {
    // console.log('event',e.code);
    if(e.code==='Enter')
    {
      joinRoom();
    }
  }

  return (
    <div className='homePageWrapper'>
      <div className='formWrapper'>
        <img src='/farhanLogo.png' alt='Logo'/ >
        <h4 className='mainLabel'>Paste invitation ROOM ID</h4>
        <div className='inputGroup'>
          <input 
            type='text' 
            className='inputBox'
            placeholder='ROOM ID'
            onChange={(e)=> setRoomId(e.target.value)}
            value={roomId}
            onKeyUp={handleInputEnter}
          />
          <input 
            type='text'
            className='inputBox'
            placeholder='User Name'
            onChange={(e)=> setUsername(e.target.value)}
            value={username}
            onKeyUp={handleInputEnter}
          />
          <button className='btn joinBtn' onClick={joinRoom}>Join</button>
          <span className='createInfo'>
            If You don't have invitation the create &nbsp;
            <a 
              onClick={createNewRoom}
              href='dbq' className='createNewBtn'>new room</a>
          </span>
        </div>
        <footer>
          <h4> Built with 💛 by <a href='https://github.com/farhan13000'>FARHAN</a> </h4>
        </footer>
      </div>
    </div>
  )
}

export default Home
