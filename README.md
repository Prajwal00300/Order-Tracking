# Automated Order Tracking System

A full-stack web application designed to manage customer orders and fully automate their status transitions using a background scheduling system.

## 🚀 Live Demo
- **Frontend:** [https://order-tracking-81rw.vercel.app](https://order-tracking-81rw.vercel.app/)
- **Backend API:** `https://order-tracking-silk.vercel.app/api`

---

## 🛠️ System Design & Architecture

### Database Selection
- **Database:** MongoDB (Atlas)
- **Why:** Selected for its highly flexible, NoSQL document structure that pairs seamlessly with Node.js/Express. Native JSON-like documents enable rapid development and easy horizontal scaling in a serverless environment.

### Collections & Schema Design
To ensure robust system design and performance, the data is normalized across three distinct collections rather than utilizing a fixed, generic schema:
1. **`orders`**: Stores the primary customer data, product details, and the current state of the order. Enforces strict business logic via Mongoose enums (`PLACED`, `PROCESSING`, `READY_TO_SHIP`).
2. **`orderstatushistories`**: An append-only audit log. Instead of storing massive arrays inside the main order document, history is stored here and linked via `orderId` to ensure the main `orders` collection remains performant.
3. **`schedulerlogs`**: Tracks the execution history of the background cron job for diagnostic purposes.

### Preventing Duplicate Orders & Race Conditions
- **Duplicates:** Handled via UI locking (disabling submit buttons during network requests) and MongoDB's mathematical enforcement of unique `_id` values.
- **Race Conditions:** Mitigated using **Idempotent Logic**. Before the scheduler transitions an order, it explicitly queries the `timeSinceLastUpdate` and the current status. Node.js's single-threaded event loop ensures synchronous processing within a single execution block.

### Background Task Scheduling
- **Scheduler:** HTTP-Triggered architecture pinged via an external cron service (cron-job.org).
- **Why:** Traditional `node-cron` libraries fail in Serverless environments (like Vercel) because the server sleeps when inactive. Exposing a secure endpoint (`/api/scheduler/run`) authenticated by an `x-scheduler-secret` header is the industry standard for serverless task scheduling.

### Scalability
The system is built on a stateless Serverless Architecture. It relies on Vercel Edge networks for instant compute scaling and MongoDB Atlas for distributed database scaling. Serverless database connections are explicitly cached to prevent connection pool exhaustion during warm-starts.

---

## 💻 Tech Stack & Features
- **Frontend:** React, Vite, CSS (Glassmorphism UI), Lucide Icons
  - *Features:* Real-time data fetching, Interactive Status Timeline Modal, Scheduler Execution Dashboard.
- **Backend:** Node.js, Express.js, Mongoose
- **Database:** MongoDB
- **Deployment:** Vercel (Serverless Functions)

---

## ⚙️ Local Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/Prajwal00300/Order-Tracking 
cd order-tracking
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` directory:
```env
PORT=8000
MONGODB_URI=your_mongodb_atlas_connection_string
SCHEDULER_SECRET=your_scheduler_secret 
```
Start the backend server:
```bash
npm run dev
```

### 3. Frontend Setup
Open a new terminal and navigate to the frontend:
```bash
cd frontend
npm install
```
Ensure `src/config.js` points to your local backend (`http://localhost:8000/api`).
Start the frontend development server:
```bash
npm run dev
```

---

## 📡 API Endpoints

### Orders
- `GET /api/orders` - Fetch all orders (Supports pagination `?page=1&limit=10` and search `?search=name`)
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update an existing order
- `DELETE /api/orders/:id` - Delete an order
- `GET /api/orders/:id/history` - Get the status transition history (timeline) of a specific order

### Scheduler
- `POST /api/scheduler/run` - Manually trigger the status update logic (Requires Header: `x-scheduler-secret`)
- `GET /api/scheduler/logs` - Fetch the execution logs of the scheduler (Supports pagination)
