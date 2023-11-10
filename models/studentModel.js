import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
    {
        firstName:{
            type: String,
            required: true
        },
        middleName:{
            type: String,
            required: true
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
            type: Number,
            required: true,
            unique: true
        },
    },
    {
        timestamps: true
    }
)

export const Students = mongoose.model('student-data', studentSchema);