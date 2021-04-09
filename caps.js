'use strict'; 
//bring in .env dependency
require('dotenv').config();
//declare port
const port = process.env.PORT || 3000;


let orderqueue = {
  orders: {}
}

//start general socket server
const io = require('socket.io')(port);

//create namespace within socket server
const caps = io.of('/caps');


//on general socket server connectiion, log socket.id to console for proof of life
io.on('connection', (socket) => {
  console.log('connected to general socket server: ', socket.id);
})


caps.on('connection', (socket) => {
  socket.on('pickup', (payload) => {
    orderqueue.orders[payload.orderId] = payload;
    socket.broadcast.emit('pickup', payload);
    console.log('orderq @ pickup..', orderqueue);
  })

  console.log('connected to caps namespace: ', socket.id);

  socket.on('in-transit', (payload) => {
    socket.emit('in-transit', payload);
    console.log('in-transit heard');
  })

  socket.on('delivered', (payload) => {
    console.log('orderqueue on delivered', orderqueue)
    
   
    socket.broadcast.emit('delivered', payload);
    console.log('delivered heard');

  })

  socket.on('received', (payload) => {
    console.log('payload on received', payload);
    
    socket.broadcast.emit('received', (payload))

    delete orderqueue.orders[payload.orderId]

    console.log('orderqueue after delete', orderqueue);

  })
})




