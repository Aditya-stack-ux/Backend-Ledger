const mongoose = require("mongoose")

const ledgerSchema = new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"ledger must be associated with a Account"],
        index:true,
        immutable:true
    },
    amount:{
        type:Number,
        immutable:true,
        required:[true, "Amount is required for creating a ledger entry"]
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Transaction",
        required:[true,"ledger must be associated with a Transaction"],
        index:true,
        immutable:true
    },
    type:{
        type:String,
        enum:{
            values:["DEBIT", "CREDIT"],
            message:"type can be either DEBIT or CREDIT"
        },
        required:[true, "Ledger type is required"],
        immutable:true
    }
})

function preventLedgerModification(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted")
}

ledgerSchema.pre("findOneAndUpdate",preventLedgerModification)
ledgerSchema.pre("findOneAndDelete",preventLedgerModification)
ledgerSchema.pre("deleteMany",preventLedgerModification)
ledgerSchema.pre("deleteOne",preventLedgerModification)
ledgerSchema.pre("updateOne",preventLedgerModification)
ledgerSchema.pre("findOneAndReplace",preventLedgerModification)
ledgerSchema.pre("updateMany",preventLedgerModification)


const ledgerModel = mongoose.model("Ledger", ledgerSchema)

module.exports = ledgerModel


