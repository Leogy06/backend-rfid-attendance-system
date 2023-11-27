import mongoose from "mongoose";

const formatToManilaTime = (date) => {
    const options = {
      timeZone: 'Asia/Manila',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    };
  
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };

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
            get: (value) => formatToManilaTime(value),
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