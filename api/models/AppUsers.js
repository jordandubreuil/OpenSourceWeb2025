//const { default: mongoose } = require("mongoose");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const AppUserSchema = new mongoose.Schema({
    username:{type:String, required:true, unique:true},
    email:{type:String, required:true, unique:true},
    password:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
});

//Hash Password before saving user data
AppUserSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
})

module.exports = mongoose.model("AppUser", AppUserSchema);