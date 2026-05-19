# Tejas Kulkarni APT Assignment - Realtime Database Update System

An actual level backend system built using Node.js, PostgreSQL, Server-Sent Event (SSE) and PostgreSQL LISTEN/NOTIFY.

It shows how the change in database is reflected instantaneously on the clients without resorting to polling which is an inefficient mechanism. If an order gets inserted or modified or deleted in PostgreSQL, clients immediately get the updates in real time using SSE.

The design uses an event driven approach which is a typical pattern in trading systems, monitor screens, and notifications services.

---

# Tech Stack

- Node.js → Backend runtime  
- Express.js → REST API server  
- PostgreSQL → Relational database  
- Server-Sent Events (SSE) → Realtime server-to-client communication  
- LISTEN / NOTIFY → PostgreSQL pub/sub mechanism  
- HTML/CSS/JavaScript → Frontend client  
- Postman → API testing  

---

# Why This Architecture

PostgreSQL LISTEN/NOTIFY with SSE was chosen over polling because it allows for low latency updates to be made while drastically cutting down on extraneous calls to the API and unnecessary database usage.

Because this project only requires messages to be sent from server to client, SSE provides a lighter and more scalable alternative to WebSockets since SSE uses regular HTTP connections and does not complicate infrastructure.

This model suits well within an event-driven architecture that is commonly found in realtime dashboards and trade platforms.

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
SSE Event Stream  
↓  
Realtime Frontend Updates  

---

# Folder Structure

tejas-apt-assignment/

├── client/  
│   ├── index.html  
│   ├── script.js  
│   └── style.css  
│  
├── server/  
│   ├── node_modules/  
│   ├── .env  
│   ├── package.json  
│   ├── package-lock.json  
│   │  
│   └── src/  
│       ├── app.js  
│       │  
│       ├── controllers/  
│       │   └── orderController.js  
│       │  
│       ├── db/  
│       │   └── database.js  
│       │  
│       ├── listeners/  
│       │   └── postgresListener.js  
│       │  
│       ├── routes/  
│       │   └── orderRoutes.js  
│       │  
│       ├── sse/  
│       │   └── sseManager.js  
│  
├── architecture.png  
├── assignment_output.png  
├── .gitignore  
└── README.md  

---

# Features

- Realtime database update propagation
- PostgreSQL trigger-based events
- Server-Sent Events (SSE) communication
- RESTful CRUD APIs
- INSERT / UPDATE / DELETE realtime synchronization
- Event-driven architecture
- Live frontend updates without page refresh
- Scalable push-based communication
- Modular backend structure

---

# Setup Instructions

## 1. Clone Repository

```
git clone https://github.com/tjsklkrn/event-driven-realtime-system.git
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

## 5. Open PostgreSQL

```
psql postgres
```

---

## 6. Create Database

```
CREATE DATABASE apt_realtime;
```

Connect to database:

```
\c apt_realtime
```

---

## 7. Create Orders Table

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

## 8. Create Trigger Function

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

## 9. Create Trigger

```
CREATE TRIGGER orders_trigger
AFTER INSERT OR UPDATE OR DELETE
ON orders
FOR EACH ROW
EXECUTE FUNCTION notify_order_change();
```

---

## 10. Start Backend Server

```
npm run dev
```

---

## 11. Server runs on

```
http://localhost:3000
```

---

## 12. Run Frontend

### Option 1 — Open Directly in Browser

Double click:

```
client/index.html
```

---

### Option 2 — VS Code / Cursor Live Server Extension

- Install the “Live Server” extension
- Open `client/index.html`
- Right click → “Open with Live Server”

---

# Backend Endpoints
  API testing done using Postman

## Base URL

```
http://localhost:3000/api/orders
```

---

## Get All Orders

```
GET /api/orders
```

---

## Create Order

```
POST /api/orders
```

Request Body:

```
{
  "customer_name": "Tejas",
  "product_name": "MacBook Pro",
  "status": "pending"
}
```

---

## Update Order

```
PUT /api/orders/:id
```

Request Body:

```
{
  "status": "delivered"
}
```

---

## Delete Order

```
DELETE /api/orders/:id
```

---

# Realtime Flow Explanation

## Step 1 — API Request

A client creates, updates, or deletes an order through REST APIs.

---

## Step 2 — Database Change

PostgreSQL updates the `orders` table.

---

## Step 3 — Trigger Fires

The PostgreSQL trigger automatically executes and sends a realtime notification using:

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

## Step 5 — SSE Event Broadcast

The backend pushes realtime updates to all connected clients through Server-Sent Events (SSE).

---

## Step 6 — Frontend Updates Instantly

Connected frontend clients automatically receive updated data without refreshing the page.

---

# Why Polling is Inefficient

In traditional polling systems, clients repeatedly send API requests at fixed intervals to check for new updates.

Example:

Client → API → Database (every 2 seconds)

Challenges with polling include:

- Heavy database load
- Excessive API requests
- Increased latency
- Poor scalability
- Unnecessary network traffic

This project instead follows a push-based architecture:

Database Change → Event → SSE Push → Client

Advantages:

- Low latency
- Efficient resource usage
- Instant realtime updates
- Better scalability
- Reduced server load

---

# Why SSE Over WebSockets

This project uses Server-Sent Events (SSE) instead of WebSockets because the communication requirement is strictly one-way:

Server → Client

The client only needs to receive updates whenever the database changes and does not need persistent bidirectional communication with the server.

Advantages of SSE in this use case:

- Simpler implementation
- Operates over standard HTTP
- Easier horizontal scaling
- Works efficiently behind traditional HTTP load balancers
- Lower infrastructure complexity
- Lightweight realtime communication model
- Automatic browser reconnection support

WebSockets are generally more suitable for bidirectional communication use cases such as chat applications, multiplayer systems, or collaborative editing platforms.

---

# Scalability Section

For larger production-scale systems, this architecture can be extended using:

- Redis Pub/Sub
- Kafka
- Dedicated realtime event services
- Horizontal backend scaling
- Load balancers

Example enterprise architecture:

PostgreSQL  
↓  
Kafka / Redis  
↓  
Realtime Event Service  
↓  
SSE Gateway Cluster  
↓  
Clients  

---

# Future Enhancements

- Authentication and Authorization
- Docker containerization
- Redis-based distributed event streaming
- Monitoring and centralized logging
- Unit and integration testing

---

# Important Learnings

This project demonstrates:

- Realtime backend architecture
- Event-driven system design
- PostgreSQL triggers
- LISTEN / NOTIFY
- Server-Sent Events (SSE)
- REST API development
- Fullstack synchronization
- Scalable backend design patterns

---

# Author

Tejas Kulkarni