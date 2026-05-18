Tejas Kulkarni APT Assignment — Realtime Database Updates System

A production-style realtime backend system built using Node.js, PostgreSQL, Socket.IO, and PostgreSQL LISTEN/NOTIFY.

This project demonstrates how database changes can be propagated instantly to connected clients without relying on inefficient polling mechanisms. Whenever an order is created, updated, or deleted in the PostgreSQL database, connected frontend clients receive live updates automatically through WebSockets.

The system is designed using an event-driven architecture similar to those used in trading systems, realtime dashboards, and notification platforms.

⸻

Tech Stack

Technology	Purpose
Node.js	Backend runtime
Express.js	REST API server
PostgreSQL	Relational database
Socket.IO	Realtime WebSocket communication
LISTEN / NOTIFY	PostgreSQL pub/sub mechanism
HTML/CSS/JavaScript	Frontend client
Postman	API testing

⸻

Project Overview

The system contains an orders table in PostgreSQL. Any database operation such as:

* INSERT
* UPDATE
* DELETE

triggers a PostgreSQL notification event.

The backend continuously listens to these events using PostgreSQL LISTEN/NOTIFY and broadcasts updates to all connected clients through Socket.IO in realtime.

This eliminates the need for clients to repeatedly poll the backend for updates.

⸻

System Architecture

Postman / Frontend
        ↓
REST API Requests
        ↓
Node.js + Express Backend
        ↓
PostgreSQL Database
        ↓
Database Trigger
        ↓
LISTEN / NOTIFY
        ↓
Socket.IO WebSocket Server
        ↓
Realtime Frontend Updates

⸻

Folder Structure

tejas-apt-assignment/
│
├── architecture.png
├── README.md
├── assets/
│
├── client/
│   ├── index.html
│   ├── script.js
│   └── style.css
│
├── server/
│   ├── package.json
│   ├── .env
│   │
│   └── src/
│       ├── app.js
│       │
│       ├── controllers/
│       │   └── orderController.js
│       │
│       ├── routes/
│       │   └── orderRoutes.js
│       │
│       ├── db/
│       │   └── database.js
│       │
│       ├── listeners/
│       ├── services/
│       ├── sockets/
│       └── utils/

⸻

Features

* Realtime database update propagation
* PostgreSQL trigger-based events
* WebSocket communication using Socket.IO
* RESTful CRUD APIs
* INSERT / UPDATE / DELETE realtime synchronization
* Event-driven architecture
* Live frontend updates without page refresh
* Scalable push-based communication
* Professional modular backend structure

⸻

Setup Instructions

1. Clone Repository

git clone <repository-url>
cd tejas-apt-assignment

⸻

2. Install Backend Dependencies

cd server
npm install

⸻

3. Configure Environment Variables

Create .env inside server/

PORT=3000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=apt_realtime
DB_PASSWORD=
DB_PORT=5432

⸻

4. Start PostgreSQL

brew services start postgresql@16

⸻

5. Create Database

CREATE DATABASE apt_realtime;

⸻

6. Create Orders Table

CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    product_name VARCHAR(255),
    status VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

⸻

7. Create Trigger Function

CREATE OR REPLACE FUNCTION notify_order_change()
RETURNS trigger AS $$
DECLARE
  payload JSON;
BEGIN
  IF TG_OP = 'DELETE' THEN
    payload = json_build_object(
      'operation', TG_OP,
      'data', row_to_json(OLD)
    );
  ELSE
    payload = json_build_object(
      'operation', TG_OP,
      'data', row_to_json(NEW)
    );
  END IF;
  PERFORM pg_notify(
    'orders_channel',
    payload::text
  );
  IF TG_OP = 'DELETE' THEN
    RETURN OLD;
  ELSE
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

⸻

8. Create Trigger

CREATE TRIGGER orders_trigger
AFTER INSERT OR UPDATE OR DELETE
ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_change();

⸻

9. Start Backend Server

npm run dev

⸻

10. Run Frontend

Open client/index.html using Live Server.

⸻

API Endpoints

Get All Orders

GET /api/orders

⸻

Create Order

POST /api/orders

Request Body

{
  "customer_name": "Rahul",
  "product_name": "MacBook Pro",
  "status": "pending"
}

⸻

Update Order

PUT /api/orders/:id

Request Body

{
  "status": "delivered"
}

⸻

Delete Order

DELETE /api/orders/:id

⸻

Realtime Flow Explanation

Step 1 — API Request

A user creates or updates an order through REST APIs.

⸻

Step 2 — Database Change

PostgreSQL updates the orders table.

⸻

Step 3 — Trigger Fires

The database trigger automatically executes and sends a realtime notification using:

pg_notify()

⸻

Step 4 — Backend Listener

Node.js continuously listens to:

LISTEN orders_channel;

⸻

Step 5 — WebSocket Broadcast

The backend broadcasts the event using Socket.IO:

io.emit('order_update', payload);

⸻

Step 6 — Frontend Updates Instantly

Connected clients receive updates immediately without refreshing the page.

⸻

Why Polling Is Inefficient

Traditional polling requires clients to repeatedly send API requests at fixed intervals.

Example:

Client → API → Database (every 2 seconds)

Problems with polling:

* High database load
* Wasted API requests
* Increased latency
* Poor scalability
* Unnecessary network traffic

This project uses a push-based architecture instead:

Database Change → Event → WebSocket Push → Client

Benefits:

* Lower latency
* Efficient resource usage
* Instant updates
* Better scalability
* Reduced server load

⸻

Scalability Discussion

The current implementation uses PostgreSQL LISTEN/NOTIFY which works well for moderate-scale realtime systems.

For very large-scale production systems, the architecture can be extended using:

* Redis Pub/Sub
* Kafka
* Debezium CDC
* WebSocket Gateways
* Horizontal backend scaling
* Load balancers

Example enterprise architecture:

PostgreSQL
    ↓
Kafka / Redis
    ↓
Realtime Event Service
    ↓
Socket.IO Gateway Cluster
    ↓
Clients

⸻

Future Improvements

* Authentication & Authorization
* Docker support
* Kubernetes deployment
* Redis caching
* Persistent WebSocket sessions
* Order filtering & search
* Frontend framework integration (React/Next.js)
* API rate limiting
* Monitoring & logging
* Message queues for high throughput
* CI/CD pipelines
* SSL/TLS support
* Unit & integration testing

⸻

Key Learning Outcomes

This project demonstrates:

* Realtime backend architecture
* Event-driven systems
* PostgreSQL triggers
* LISTEN / NOTIFY
* WebSocket communication
* REST API development
* Full-stack synchronization
* Scalable backend design patterns

⸻

Author

Tejas Kulkarni