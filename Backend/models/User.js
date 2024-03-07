const mongoose = require ('mongoose')
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    Name :{
        type : String,
        required : true
    },
    Email :{
        type : String ,
        required :true,
        unique : true
    },
    password : {
       type : String,
       required : true ,
    },
    timestamp :{
        type : Date,
        default : Date.now
    }
})
// const User = mongoose.model('user' , UserSchema);
// User.createIndexes();    // For creating unique fields
module.exports = mongoose.model('user' , UserSchema);;