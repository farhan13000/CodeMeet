import React from 'react'
import { useState,useRef,useEffect} from 'react';
import Show from '../components/Show';
import Editor from '../components/Editor';
import { initSocket } from '../socket'
import '../Actions';
import { Navigate, useLocation } from 'react-router-dom';
import {useNavigate} from 'react-router-dom'
import toast from 'react-hot-toast';
import ACTIONS from '../Actions';
import { useParams } from 'react-router-dom';
import { func } from 'prop-types';

const EditorPage = () => {

  const [clients,setClients]=useState([]);
  const codeRef=useRef(null);
  const socketRef=useRef(null);
  const location=useLocation();
  const reacNavigator=useNavigate();
  const {roomId}=useParams();

  console.log(roomId);


  useEffect(() => {
    const init=async ()=>
    {


      socketRef.current=await initSocket();
      socketRef.current.on('connect_error',(err)=>handleError(err));
      socketRef.current.on('connect_failed',(err)=>handleError(err));

      function handleError(e)
      {
        console.log('socket error',e);
        toast.error('Socket connection failed,try again later.');
        reacNavigator('/');
      }

      
      socketRef.current.emit(ACTIONS.JOIN,{
        roomId,
        username:location.state?.username,
      });



      socketRef.current.on(ACTIONS.JOINED,
        ({clients,username,socketId})=>
        {
          if(username!==location.state?.username)
          {
            toast.success(`${username} joined the room`);
            console.log(`${username} joined`);
          }
          setClients(clients);
          socketRef.current.emit(ACTIONS.SYNC_CODE,
            {
              code:codeRef.current,
              socketId,
            })
        });

        socketRef.current.on(ACTIONS.DISCONNECTED,({socketId,username})=>
        {
          toast.success(`${username} left the room`);
          setClients((prev)=>
          {
            return prev.filter(client=> client.socketId!==socketId)
          })
        })

    }
    init();
    return ()=>
    {
      socketRef.current.disconnect();
      socketRef.current.off(ACTIONS.JOINED);
      socketRef.current.off(ACTIONS.DISCONNECTED);
    }

  }, [])


  async function copyRoomId()
  {
    try
    {
      await navigator.clipboard.writeText(roomId);
      toast.success('Room Id Copied');
    }
    catch(err)
    {
      toast.error("Could not copy room");
    }
  }
  function leaveRoom()
  {
    reacNavigator('/');
  }

  if(!location.state)
  {
    return <Navigate to="/" />
  }
  return (
    <div className="mainWrap">
      <div className='aside'>
        <div className='asideInner'>
          <div className='logo'>
            <img  className='logoImage' src='/farhanLogo.png' alt='logo' />
          </div>
          <h3>Connected</h3>
          <div className="clientsList">
            {
              clients.map(client=> (<Show  key={client.soketId} username={client.username} />))
            }
          </div>
        </div>
        <button className='btn copyBtn' onClick={copyRoomId}>Copy RoomId</button>
        <button className='btn leaveBtn' onClick={leaveRoom}>Leave</button>
      </div>
      <div className='editorWrap'>
        <Editor socketRef={socketRef}  roomId={roomId} onCodeChange={(code)=>{codeRef.current=code}}/>
      </div>
    </div>
  )
}

export default EditorPage
