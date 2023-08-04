import React, { useEffect,useRef } from 'react'
import Codemirror, { countColumn } from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/dracula.css';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import { Socket } from 'socket.io-client';
import ACTIONS from '../Actions';
const Editor = ({socketRef,roomId,onCodeChange}) => {

  const editorRef=useRef();

  useEffect(()=>
  {
    async function init()
    {
      editorRef.current=Codemirror.fromTextArea(document.getElementById('realTimeEditor'),{
        mode:{name:'javascript',json:true},
        theme:'dracula',
        autoClosetags:true,
        autoCloseBrackets:true,
        lineNumbers:true,
      });

      editorRef.current.on('change',(instance,changes)=>
      {
        
        const {origin}=changes;
        const code=instance.getValue();
        onCodeChange(code);
        if(origin!=='setValue')
        {
          console.log("Working");
          socketRef.current.emit(ACTIONS.CODE_CHANGE,{roomId,code}) 
        }
        // console.log(code);
      })

     
    }
    init();
  },[]);

  useEffect
  (()=>
  {
    if(socketRef.current)
    {
      socketRef.current.on(ACTIONS.CODE_CHANGE,({code})=>
      {
        console.log("Receiving",code);
        if(code!==null)
        {
          editorRef.current.setValue(code);
        }
      })
    }

    return ()=>
    {
      socketRef.current.off(ACTIONS.CODE_CHANGE);
    }
  },[socketRef.current]);

  
  return (
    <textarea id="realTimeEditor"></textarea>
  )
}

export default Editor;
