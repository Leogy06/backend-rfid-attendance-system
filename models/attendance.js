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
        timeOut:{
            type: Date,
            required:true,
        }
    },
    {
        timestamps: true
    }
)

export const Attendance = mongoose.model('Attendance', attendanceSchema);