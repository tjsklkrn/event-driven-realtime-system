# Tejas Kulkarni APT Assignment - Realtime Database Update System

A production-level real-time backend system implemented with Node.js, PostgreSQL, Socket.IO, and PostgreSQL LISTEN/NOTIFY.

This system illustrates how any change in the database could be instantly reflected on connected clients without the need for ineffective polling. When an order is added, updated or deleted from the PostgreSQL database, connected frontend clients get instant updates from the server via WebSockets.

It has been designed with a reactive architecture style used in many trading systems and notification services.

---

# Tech Stack

- Node.js → Backend runtime  
- Express.js → REST API server  
- PostgreSQL → Relational database  
- Socket.IO → Realtime WebSocket communication  
- LISTEN / NOTIFY → PostgreSQL pub/sub mechanism  
- HTML/CSS/JavaScript → Frontend client  
- Postman → API testing  

---

# Project Description

The project has a table called `orders` in PostgreSQL. Every time there is a database action, including:

- Insertion,
- Update,
- Deletion,

a PostgreSQL notification event occurs.

The backend listens to these events using PostgreSQL `LISTEN/NOTIFY` and sends notifications to all connected clients via Socket.IO.

Therefore, there will be no need for clients to continually poll the server for new information.

---

# Why This Architecture

I have selected PostgreSQL LISTEN/NOTIFY along with Socket.IO as against polling due to its ability to deliver low latency and reduce unwanted calls to the APIs and database.

The architecture is highly scalable for moderate real-time workloads and fits well with architectures typically employed in real-time trading applications and monitoring dashboards.

---

# System Architecture

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

---

# Folder Structure

tejas-apt-assignment/

├── architecture.png  
├── README.md  
├── client/  
│   ├── index.html  
│   ├── script.js  
│   └── style.css  
│  
├── server/  
│   ├── package.json  
│   ├── .env.example  
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

---

# Features

- Realtime database update propagation
- PostgreSQL trigger-based events
- WebSocket communication using Socket.IO
- RESTful CRUD APIs
- INSERT / UPDATE / DELETE realtime synchronization
- Event-driven architecture
- Live frontend updates without page refresh
- Scalable push-based communication
- Professional modular backend structure

---

# Setup Instructions

## 1. Clone Repository

```
git clone <repository-url>
cd tejas-apt-assignment
```

---

## 2. Install Backend Dependencies

```
cd server
npm install
```

---

## 3. Configure Environment Variables

Create `.env` inside `server/`

```
PORT=3000

DB_USER=postgres
DB_HOST=localhost
DB_NAME=apt_realtime
DB_PASSWORD=
DB_PORT=5432
```

---

## 4. Start PostgreSQL

```
brew services start postgresql@16
```

---

## 5. Create Database

```
CREATE DATABASE apt_realtime;
```

---

## 6. Create Orders Table

```
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_name VARCHAR(255),
    product_name VARCHAR(255),
    status VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 7. Create Trigger Function

```
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
```

---

## 8. Create Trigger

```
CREATE TRIGGER orders_trigger
AFTER INSERT OR UPDATE OR DELETE
ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_change();
```

---

## 9. Start Backend Server

```
npm run dev
```

---

## 10. Run Frontend

You can run the frontend using any local static server.

### Option 1 — VS Code / Cursor Live Server Extension

- Install the “Live Server” extension
- Open `client/index.html`
- Right click → “Open with Live Server”

---

### Option 2 — Python Simple HTTP Server

If Python is installed:

```
cd client
python3 -m http.server 5500
```

Then open:

```
http://localhost:5500
```

in the browser.

---

# API Testing Using Postman

This project uses Postman to test REST APIs and validate realtime updates.

## Download Postman

https://www.postman.com/downloads/

---

## Example API Requests

### Get All Orders

```
GET /api/orders
```

---

### Create Order

```
POST /api/orders
```

#### Request Body

```
{
  "customer_name": "Tejas",
  "product_name": "MacBook Pro",
  "status": "pending"
}
```

---

### Update Order

```
PUT /api/orders/:id
```

#### Request Body

```
{
  "status": "delivered"
}
```

---

### Delete Order

```
DELETE /api/orders/:id
```

---

# Realtime Flow Explanation

## Step 1 — API Request

A user creates or updates an order through REST APIs.

---

## Step 2 — Database Change

PostgreSQL updates the `orders` table.

---

## Step 3 — Trigger Fires

The database trigger automatically executes and sends a realtime notification using:

```
pg_notify()
```

---

## Step 4 — Backend Listener

Node.js continuously listens to:

```
LISTEN orders_channel;
```

---

## Step 5 — WebSocket Broadcast

The backend broadcasts the event using Socket.IO:

```
io.emit('order_update', payload);
```

---

## Step 6 — Frontend Updates Instantly

Connected clients receive updates immediately without refreshing the page.

---

# Why Polling is Inefficient

In traditional polling, clients have to continuously send API calls at regular intervals.

Example:

Client → API → Database (every 2 seconds)

Challenges with polling include:

- Heavy database load
- Inefficient use of API calls
- Higher latency
- Poor scalability
- Excess network traffic

In this project, we implement a push system as follows:

Database change → Event → WebSocket push → Client

Advantages:

- Low latency
- Efficient resource utilization
- Real-time data updates
- Scalability
- Low server load

---

# Scalability Section

Scalability can be achieved through the following mechanisms for a large-scale production environment:

- Redis Pub/Sub
- Kafka
- Debezium CDC
- WebSocket Gateways
- Horizontal Scaling of Backend Servers
- Load Balancers

Enterprise architecture example:

PostgreSQL
↓
Kafka / Redis
↓
Real-time Event Service
↓
Socket.IO Gateway Cluster
↓
Clients

---

# Future Enhancements

- Authentication and Authorization
- Support for Docker
- Kubernetes Deployment
- Redis caching
- Persistent WebSocket connections
- Filtering of Orders
- Integration with React/Next.js frontend frameworks
- Rate limiting of APIs
- Monitoring and logging
- Queuing messages for high throughput
- CI/CD Pipelines
- SSL/TLS support
- Unit and integration tests

---

# Important Learnings

This project showcases the following:

- Realtime backend implementation
- Event-driven approach
- PostgresSQL triggers
- LISTEN / NOTIFY
- WebSocket connection
- REST API design
- Fullstack synchronization
- Patterns for scalable backends

---

# Author

Tejas Kulkarni