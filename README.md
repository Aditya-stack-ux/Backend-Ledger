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
