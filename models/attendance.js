import mongoose from "mongoose";

const attendanceSchema = mongoose.Schema(
    {
        studFullname:{
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
        timeIn:{
            type: Date,
            required:true,
        },
        present:{
            type:Boolean,
            required:true,
            default: false
        },
        rfid:{
            type:String,
            required:true,
            unique:true,
        },
    },
    {
        timestamps: true
    }
)

export const Attendance = mongoose.model('Attendance', attendanceSchema);