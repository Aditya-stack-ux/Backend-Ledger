const mongoose = require("mongoose")

const transactionSchema = new mongoose.Schema({
    fromAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"transaction must be associated with a from account"],
        index: true
    },
    toAccount:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"transaction must be associated with a to account"],
        index: true
    },
    status:{
        type:String,
        enum:{
            values:["PENDING" , "COMPLETE", "FAILED", "REVERSED"],
            message:"Status can be either PENDING, COMPLETED, FAILED or REVERSED"
        },
        default:"PENDING"
    },
    amount:{
        type:Number,
        required:[true, "Amount is required to create transaction"],
        min:[1, "transaction amount must be greater than zero"]
    },
    idempotencyKey:{
        type:String,
        required:[true,"Idempotency key is required for creating transaction"],
        index:true,
        unique:true
    }

},{
    timestamps:true
})

const transactionModel = mongoose.model("Transaction", transactionSchema);

module.exports = transactionModel