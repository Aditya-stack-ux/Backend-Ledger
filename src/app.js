const express = require("express")
const cookieParser = require("cookie-parser")

const app = express();


app.get("/",(req,res)=>{
    res.send("LEDGER SERVICES IS UP AND RUNNING")
})

app.use(express.json())
app.use(cookieParser())

/**
 * Routes required
 */
const authRoutes = require("./routes/auth.routes")
const accountRoutes = require("./routes/account.routes")
const transactionRoutes = require("./routes/transaction.routes")

/**
 * Routes use
 */

app.use("/api/auth", authRoutes)
app.use("/api/accounts", accountRoutes)
app.use("/api/transactions", transactionRoutes)

module.exports = app