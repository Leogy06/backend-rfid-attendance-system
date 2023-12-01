import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
    {
        firstName:{
            type: String,
            required : true,
        },
        middleName:{
            type: String,
            required : true,
        },
        lastname:{
            type: String,
            required : true,
        },

        suffix:{
            type: String,
            required : false,
        },
        email:{
            type: String,
            required : true,
        },

        password:{
            type: String,
            required : true,
        },

        deparment:{
            type: String,
            required : true,
        },
    }
)
export const Admin = mongoose.model('admin', adminSchema);