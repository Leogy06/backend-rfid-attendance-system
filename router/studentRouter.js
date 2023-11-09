import express from 'express';
import { Students } from '../models/studentModel.js';

const routes = express.Router();

//create student
routes.post('/register', async (req, res) => {

    //if user didnt put value 
    try {
        if (
            !req.body.FirstName ||
            !req.body.MiddleName ||
            !req.body.LastName ||
            !req.body.email ||
            !req.body.Password ||
            !req.body.Course ||
            !req.body.Year ||
            !req.body.Department ||
            !req.body.RFID
        ) {
            return res.status(400).send({
                message: 'Be sure to fill out the necessary input fields'
            });
        }
        

        //accumulating student data from inpuute user
        const newStudent = {
            FirstName: req.body.FirstName,
            MiddleName: req.body.MiddleName,
            LastName: req.body.LastName,
            suffix: req.body.suffix,
            email: req.body.email,
            Password: req.body.Password,
            Course: req.body.Course,
            Year: req.body.Year,
            Department: req.body.Department,
            RFID: req.body.RFID
        }
        

        const student = await Students.create(newStudent);
        
        return res.status(201).send(student);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({message: error.message, response:"Database Error"})
    }
})

//route to get students
routes.get('/', async (req, res) => {
    try {
        const students = await Students.find({})

        return res.status(200).json({
            count: students.length,
            students: students
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).send({message: error.message})
    }
})

//route for getting student by id
routes.get('/:id', async (req, res) => {
    try {
        
        const { id } = req.params;

        const student = await Students.findById(id);

        if (!student) {
            return res.status(404).json({ message: 'Student not found' });
        }

        return res.status(200).json(student);

    } catch (error) {
        console.error(error.message);
        res.status(500).send({message: error.message})
    }
})

//route that update student
routes.put('/modify/:id', async (req, res) => {
    try {
    
        //extract id from url :id
        const { id } = req.params;
        const changedField = req.body;

    //if empty
      if (Object.keys(changedField).length === 0) 
        {
         return res.status(400).send({
        message: "you didn't update anytthing", error: error
        });

        }


        const result = await Students.findByIdAndUpdate(id, changedField);

        if(!result){
            return res.status(404).json({message:'Cannot find Student'});
        }

        return res.status(200).send({message: `The Student was updated successfully`})

        //if error server...
    } catch (error) {
        console.error(error.message);
        res.status(500).send({message:error, Problem:'server'});
    }
});

//delete a student
routes.delete('/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const result = await Students.findByIdAndDelete(id);

        if (!result) {
            return res.status(404).json({message: 'Cannot find student'});
        }

        return res.status(200).send({message: 'Student deleted'});
        
    } catch (error) {
        console.log(error);
        res.status(500).send({message:error});
    }
});

export {routes as studentRoutes}