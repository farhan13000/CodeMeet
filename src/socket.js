import {io} from 'socket.io-client';

export const initSocket=async ()=>
{
    const options = {
        'forxe new connection':true,
        reconnectionAttempt:'Infinity',
        timeout: 1000,
        transports:['websocket'],
    };
    return io(process.env.REACT_APP_BACKEND_URL,options);
}