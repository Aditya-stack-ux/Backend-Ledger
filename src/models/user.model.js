const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required: [true,"Email is required for creating user"],
        trim:true,
        lowercase: true,
        match:[/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/,"Invalid Email Address"],
        unique:[true,"Email already exist"]
    },
    name:{
        type:String,
        required:[true,"name is required for creating your account"],
    },
    password:{
        type:String,
        required:[true,"password is required for creating your account"],
        minlength:[6,"password should contain more than 6 character"],
        select:false,
        
    },
    systemUser:{
        type:Boolean,
        select:false,
        default:false,
        immutable:true
    }
},  {
    timestamps:true,
})

userSchema.pre("save", async function(){
    if(!this.isModified("password")){
        return ;
    }

    const hash = await bcrypt.hash(this.password, 10)
    this.password = hash;
     
    return ;
})

userSchema.methods.comparePassword = async function(password){

    return await bcrypt.compare(password, this.password);

}

const userModel = mongoose.model("User",userSchema);

module.exports = userModel