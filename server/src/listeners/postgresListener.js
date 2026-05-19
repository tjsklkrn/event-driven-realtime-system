const pool = require('../db/database');

const {
  broadcastEvent,
} = require('../sse/sseManager');

const initializePostgresListener =
  async () => {

    try {

      await pool.query(
        'LISTEN orders_channel'
      );

      console.log(
        'Listening to orders_channel'
      );

      pool.on(
        'notification',
        (msg) => {

          console.log(
            'Realtime DB Event:',
            msg.payload
          );

          broadcastEvent(
            msg.payload
          );
        }
      );

    } catch (error) {

      console.error(
        'LISTEN error:',
        error
      );
    }
  };

module.exports = {
  initializePostgresListener,
};