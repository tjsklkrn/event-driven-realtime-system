require('dotenv').config();

const express = require('express');
const cors = require('cors');

const orderRoutes =
  require('./routes/orderRoutes');

const {
  addClient,
  removeClient,
} = require('./sse/sseManager');

const {
  initializePostgresListener,
} = require(
  './listeners/postgresListener'
);

const app = express();

app.use(cors());

app.use(express.json());

app.use('/api/orders', orderRoutes);

app.get('/events', (req, res) => {

  res.setHeader(
    'Content-Type',
    'text/event-stream'
  );

  res.setHeader(
    'Cache-Control',
    'no-cache'
  );

  res.setHeader(
    'Connection',
    'keep-alive'
  );

  res.flushHeaders();

  addClient(res);

  req.on('close', () => {

    removeClient(res);
  });
});

app.get('/', (req, res) => {

  res.send(
    'Realtime SSE Backend Running'
  );
});

initializePostgresListener();

const PORT =
  process.env.PORT || 3000;

app.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );
});