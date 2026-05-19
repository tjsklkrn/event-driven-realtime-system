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

        <p>
          <strong>Status:</strong>

          <span class="status ${order.status}">
            ${order.status}
          </span>
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

async function fetchOrders() {

  try {

    const response = await fetch(
      'http://localhost:3000/api/orders'
    );

    const orders = await response.json();

    ordersMap.clear();

    orders.forEach((order) => {

      ordersMap.set(order.id, order);
    });

    renderOrders();

  } catch (error) {

    console.error(
      'Failed to fetch orders:',
      error
    );
  }
}

const eventSource = new EventSource(
  'http://localhost:3000/events'
);

eventSource.onmessage = (event) => {

  console.log(
    'SSE Event:',
    event.data
  );

  fetchOrders();
};

fetchOrders();