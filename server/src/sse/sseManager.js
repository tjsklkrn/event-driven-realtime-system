const clients = [];

const addClient = (res) => {

  clients.push(res);

  console.log(
    'SSE client connected'
  );
};

const removeClient = (res) => {

  const index = clients.indexOf(res);

  if (index !== -1) {

    clients.splice(index, 1);
  }

  console.log(
    'SSE client disconnected'
  );
};

const broadcastEvent = (payload) => {

  clients.forEach((client) => {

    client.write(
      `data: ${payload}\n\n`
    );
  });
};

module.exports = {
  addClient,
  removeClient,
  broadcastEvent,
};