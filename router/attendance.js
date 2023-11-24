import { Attendance } from "../models/attendance";
import { Students } from "../models/studentModel";
import express from "express";

const routes = express.Router();
routes.use(express.json());

routes.post('/record-attendance', async (req, res) => {
    const {rfid} = req.body;

    try {
        const student = await Students.findOne({rfid});
        function studFullname() {
            return `${student.lastName} ${student.firstName}${student.middleName}${student.suffix || ""}`.trim('');
        }
        function date() {
            const now = new Date();
            const year = now.getFullYear();
            const month = now.getMonth() + 1;
            const day = now.getDate();
            const hours = now.getHours();
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();

            return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`
        }

        if(student){
            const attendanceRecord = new Attendance({
                studFullname:studFullname(),
                course: student.course,
                year: student.year,
                department: student.department,
                timeIn: date(),
            });

            await attendanceRecord.save();

            res.json({success: true, message: "Recorded Successfully!"})
        }else{
            res.status(404).json({success: false, message: "Student not found nor Registered"});
        }


        
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: "Internal Erro Server"})
    }
});

export {routes as attendance}