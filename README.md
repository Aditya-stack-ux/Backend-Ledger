# 🏦 Ledger-Based Banking Transaction System (Backend)

A secure and ACID-compliant banking backend built using Node.js, Express, and MongoDB.  
This system implements a double-entry ledger architecture to ensure financial integrity, auditability, and transactional consistency.

---

## 📌 Project Overview

This project simulates core banking functionality with a production-inspired backend design.

Unlike basic CRUD banking applications that directly mutate account balances, this system:

- Implements double-entry accounting
- Uses MongoDB ACID transactions
- Prevents race conditions and double spending
- Maintains immutable ledger records
- Ensures financial data integrity

The ledger acts as the source of truth for all balances.

---

## 🚀 Tech Stack

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcrypt (Password hashing)
- MongoDB Replica Set (for transactions)


## Architecture

- MVC pattern
- Middleware-based authentication
- Aggregation pipeline for financial computation
- Index optimization for query performance

## API Endpoints

### Auth
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout

### Transactions / Accounts
POST /api/transaction      // initialize transaction
GET /api/accounts/balance  // check balance 
POST /api/accounts       // create account

## Database Design Decisions

- Balance is not stored; calculated using aggregation.
- TTL index used for automatic token cleanup.
- Email field indexed for login optimization.

## Security

- JWT verification middleware
- Ownership validation before transactions
- Token blacklist after logout
- Strict ObjectId comparison
