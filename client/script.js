const socket = io('http://localhost:3000');

const ordersDiv =
  document.getElementById('orders');

const emptyState =
  document.getElementById('empty-state');

const ordersMap = new Map();

function renderOrders() {

  ordersDiv.innerHTML = '';

  if (ordersMap.size === 0) {

    emptyState.style.display = 'flex';

    return;
  }

  emptyState.style.display = 'none';

  const orders = Array.from(
    ordersMap.values()
  ).sort((a, b) => a.id - b.id);

  orders.forEach((order) => {

    const card =
      document.createElement('div');

    card.className = 'order-card';

    card.innerHTML = `

      <h2>Order #${order.id}</h2>

      <div>

        <p>
          <strong>Customer:</strong>
          ${order.customer_name}
        </p>

        <p>
          <strong>Product:</strong>
          ${order.product_name}
        </p>

        <p class="status ${order.status}">
          ${order.status}
        </p>

        <p>
          <strong>Updated:</strong>
          ${new Date(
            order.updated_at
          ).toLocaleString()}
        </p>

      </div>

    `;

    ordersDiv.appendChild(card);
  });
}

socket.on(
  'order_update',
  (payload) => {

    const order = payload.data;

    if (
      payload.operation === 'DELETE'
    ) {

      ordersMap.delete(order.id);

    } else {

      ordersMap.set(order.id, order);
    }

    renderOrders();
  }
);

async function loadOrders() {

  try {

    const response = await fetch(
      'http://localhost:3000/api/orders'
    );

    const orders = await response.json();

    orders.forEach((order) => {

      ordersMap.set(order.id, order);
    });

    renderOrders();

  } catch (error) {

    console.error(
      'Failed to load orders:',
      error
    );
  }
}

loadOrders();