// require('dotenv').config();

// const express = require('express');
// const http = require('http');
// const cors = require('cors');
// const { Server } = require('socket.io');

// const pool = require('./db/database');
// const orderRoutes = require('./routes/orderRoutes');

// const app = express();

// app.use(cors());
// app.use(express.json());
// app.use('/api/orders', orderRoutes);

// const server = http.createServer(app);

// const io = new Server(server, {
//   cors: {
//     origin: '*',
//   },
// });

// io.on('connection', (socket) => {
//   console.log('Client connected');

//   socket.on('disconnect', () => {
//     console.log('Client disconnected');
//   });
// });

// pool.query('LISTEN orders_channel')
//   .then(() => {
//     console.log('Listening to orders_channel');
//   })
//   .catch((err) => {
//     console.error('LISTEN error:', err);
//   });

// pool.on('notification', (msg) => {
//   console.log('Realtime DB Event:', msg.payload);

//   io.emit('order_update', JSON.parse(msg.payload));
// });

// app.get('/', (req, res) => {
//   res.send('Realtime Backend Running');
// });

// const PORT = process.env.PORT || 3000;

// server.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });

require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const pool = require('./db/database');

const orderRoutes = require('./routes/orderRoutes');

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/orders', orderRoutes);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

io.on('connection', (socket) => {
  console.log('Client connected');

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

pool.query('LISTEN orders_channel')
  .then(() => {
    console.log('Listening to orders_channel');
  })
  .catch((err) => {
    console.error('LISTEN error:', err);
  });

pool.on('notification', (msg) => {

  console.log('Realtime DB Event:', msg.payload);

  io.emit('order_update', JSON.parse(msg.payload));
});

app.get('/', (req, res) => {
  res.send('Realtime Backend Running');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});