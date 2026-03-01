const express = require("express")
const router = express.Router()
const authMiddleware = require("../middleware/auth.middleware")
const accountController = require("../controllers/account.controller")

/**
 * -POST api/accounts/
 * - create a new account
 * - Protected route
 */
router.post("/",authMiddleware.authMiddleware, accountController.createAccountController)

/**
 * get all accounts
 */
router.get("/",authMiddleware.authMiddleware, accountController.getAllAccountsController)

/**
 * GET api/accounts/balance/:accountId
 */
router.get("/balance/:accountId", authMiddleware.authMiddleware,accountController.getAccountBalance)

module.exports = router;