const socket = io('http://localhost:3000');

const ordersDiv = document.getElementById('orders');

const ordersMap = new Map();

socket.on('connect', () => {
  console.log('Connected to backend socket');
});

socket.on('order_update', (payload) => {

  console.log('Realtime Update:', payload);

  const operation = payload.operation;
  const order = payload.data;

  if (operation === 'DELETE') {

    const existingCard = document.getElementById(`order-${order.id}`);

    if (existingCard) {
      existingCard.remove();
    }

    ordersMap.delete(order.id);

    return;
  }

  let card = document.getElementById(`order-${order.id}`);

  if (!card) {

    card = document.createElement('div');

    card.className = 'order-card';

    card.id = `order-${order.id}`;

    ordersDiv.prepend(card);
  }

  card.innerHTML = `
    <h2>Order #${order.id}</h2>

    <p><strong>Customer:</strong> ${order.customer_name}</p>

    <p><strong>Product:</strong> ${order.product_name}</p>

    <p class="status ${order.status}">
    <strong>Status:</strong> ${order.status}
    </p>

    <p>
  <strong>Updated:</strong>
  ${new Date(order.updated_at).toLocaleString()}
</p>
  `;

  ordersMap.set(order.id, order);
});