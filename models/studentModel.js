import mongoose from "mongoose";

const studentSchema = mongoose.Schema(
    {
        FirstName:{
            type: String,
            required: true
        },
        MiddleName:{
            type: String,
            required: true
        },
        LastName:{
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
        Password:{
            type: String,
            required: true
        },
        Course:{
            type: String,
            required: true
        },
        Year:{
            type: String,
            required: true
        },
        Department:{
            type: String,
            required: true
        },
        RFID:{
            type: Number,
            required: true,
            unique: true
        },
    },
    {
        timestamps: true
    }
)

export const Students = mongoose.model('students', studentSchema);