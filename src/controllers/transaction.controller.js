const transactionModel = require("../models/transaction.model")
const ledgerModel = require("../models/ledger.model")
const accountModel = require("../models/account.model")
const emailService = require("../services/email.service")
const mongoose = require("mongoose")

async function createTransaction(req,res){

    /**
     * 1. validate request
     */
    const {fromAccount, toAccount , amount, idempotencyKey} = req.body
    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"fromAccount, toAccount , amount and idempotencyKey are required"
        })
    }

    

    const fromUserAccount = await accountModel.findOne({_id:fromAccount})
    const toUserAccount = await accountModel.findOne({_id:toAccount})

    if(!fromUserAccount || !toUserAccount){
        return res.status(400).json({
            message:"Invalid fromAccount or toAccount"
        })
    }
    if (fromAccount === toAccount) {
        return res.status(400).json({
            message: "Cannot transfer to same account"
        })
    }
   if (!fromUserAccount.user.equals(req.user.id)) {
    return res.status(403).json({
        message: "You are not the owner of this account!"
    })
}

    /**
     * validate idempotencyKey
     */

    const transactionAlreadyExist = await transactionModel.findOne({
        idempotencyKey: idempotencyKey
    })

    if(transactionAlreadyExist){
        if(transactionAlreadyExist.status == "COMPLETED"){
            return res.status(200).json({
                message:"Transaction already processed"
            })
        }
        if(transactionAlreadyExist.status == "PENDING"){
            return res.status(200).json({
                message:"Transaction is still processing"
            })
        }
        if(transactionAlreadyExist.status == "FAILED"){
            return res.status(500).json({
                message:"Transaction processing failed, please retry"
            })
        }
        if(transactionAlreadyExist.status == "REVERSED"){
            return res.status(500).json({
                message:"Transaction was reserved, please retry"
            })
        }

    }

    /**
     * check account status
     */
    if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !== "ACTIVE"){
        return res.status(400).json({
            message:"Both fromAccount and toAccount must be ACTIVE to process transaction"
        })
    }
    

    /**
     * derive senders balance from ledger
     */
    const balance = await fromUserAccount.getBalance()

    if(balance < amount){
        return res.status(400).json({
            message:`insufficient balance. Currrent balance is ${balance}, Requested amount is ${amount}`
        })
    }
    
    /**
     * Create transaction (PENDING)
     */

    const transaction = await transactionModel.create({
        fromAccount,
        toAccount,
        amount,
        idempotencyKey,
    })

    const session = await mongoose.startSession()
    try{
    session.startTransaction()


    const debitLedgerEntry = await ledgerModel.create([{
        account:fromAccount,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }], {session})

    await (()=>{
        return new Promise((resolve)=> setTimeout(resolve, 15*1000))
    })()

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }], {session})

    await transactionModel.findByIdAndUpdate(
        transaction._id,
        { status: "COMPLETED" },
        { session }
    )

    await session.commitTransaction()
    }
    catch(err){
        await session.abortTransaction()
        await transactionModel.findByIdAndUpdate(
        transaction._id,
        { status: "FAILED" })

        await emailService.sendTransactionFailureEmail(req.user.email, req.user.name, amount, toAccount)
        return res.status(400).json({
            message:"Transaction Failed!"
        })
    
    }
    finally{
        session.endSession()
    }

    /**
     * send email notification
     */
    const finalTransaction = await transactionModel.findById(transaction._id)
    await emailService.sendTransactionEmail(req.user.email, req.user.name, amount, toAccount)

    return res.status(201).json({
        message:"Transaction completed Successfully",
        transaction:finalTransaction
    })
    
}

async function createInitialFundsTransaction(req,res){
    const {toAccount, amount, idempotencyKey} = req.body
    if(!toAccount || !amount || !idempotencyKey){
        return res.status(400).json({
            message:"toAccount, amount and idempotencyKey are required"
        })
    }

    const toUserAccount = await accountModel.findById(toAccount)
    if(!toUserAccount){
        return res.status(400).json({
            message:"Invalid toAccount"
        })
    }

    const fromUserAccount = await accountModel.findOne({
        user: req.user._id
    })

    if(!fromUserAccount){
        return res.status(400).json({
            message:"System user not found"
        })
    }

    const session = await mongoose.startSession()
    try {
        session.startTransaction()
    const transaction = new transactionModel({
        fromAccount:fromUserAccount._id,
        toAccount,
        amount,
        idempotencyKey,
    })


    const debitLedgerEntry = await ledgerModel.create([{
        account:fromUserAccount._id,
        amount:amount,
        transaction:transaction._id,
        type:"DEBIT"
    }],{session})

    const creditLedgerEntry = await ledgerModel.create([{
        account:toAccount,
        amount:amount,
        transaction:transaction._id,
        type:"CREDIT"
    }],{session})

    transaction.status = "COMPLETE"
    await transaction.save({ session })

    await session.commitTransaction()

    return res.status(201).json({
    message:"Initial funds transaction completed successfully!",
    transaction:transaction
    })
    } catch (error) {
        await session.abortTransaction()
        return res.status(500).json({
        message: "Transaction failed",
        error: error.message
    })

    }finally{
        session.endSession()
    }

}

module.exports = {createTransaction,
                  createInitialFundsTransaction
}