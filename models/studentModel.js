import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true
        },
        middleName:{
            type: String,
            required: false
        },
        lastName:{
            type: String,
            required: true
        },
        suffix:{
            type: String,
            required: false
        },
        email:{
            type: String,
            required: true
        },
        password:{
            type: String,
            required: true
        },
        course:{
            type: String,
            required: true
        },
        year:{
            type: Number,
            required: true
        },
        department:{
            type: String,
            required: true
        },
        rfid:{
            type: String,
            required: true,
            unique: true,
        },
    },
    {
        timestamps: true
    }
)

export const Students = mongoose.model('students', studentSchema);