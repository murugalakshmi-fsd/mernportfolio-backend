import mongoose from "mongoose";
import validator from 'validator';

const usersSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        validate: {
          validator: validator.isEmail,
          message: 'Please provide a valid email address',
        },
      },
    
    password:{
        type:String,
        required:true
    },
    tokens: [{ token: { type: String, required: true } }]
});



const users = mongoose.model('users', usersSchema);

export { users };