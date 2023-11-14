import express from 'express';
import { Students } from '../models/studentModel.js';

const routes = express.Router();
routes.use(express.json());

//create student
routes.post('/register', async (req, res) => {

    //if user didnt put value 
    try {
        if (
            !req.body.firstName ||
            !req.body.middleName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.course ||
            !req.body.year ||
            !req.body.department ||
            !req.body.rfid
        ) {
            return res.status(400).send({
                message: 'Necessary Fields are Empty'
            });
        }
        

        //accumulating student data from inpute user
        const newStudent = {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName,
            suffix: req.body.suffix,
            email: req.body.email,
            password: req.body.password,
            course: req.body.course,
            year: req.body.year,
            department: req.body.department,
            rfid: req.body.rfid
        }
        

        const student = await Students.create(newStudent);
        
        return res.status(201).send({student: student, success: true});

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
        message: "No fields updated", error: error
        });

        }

        const updateObject = {};
        for (const key in changedField) {
            updateObject[key] = changedField[key]
        }

        const result = await Students.findByIdAndUpdate(id, { $set: updateObject});

        if(!result){
            return res.status(404).json({message:'Cannot find Student'});
        }

        return res.status(200).send({message: `The Student was updated successfully`})

        //if error server...
    } catch (error) {
        console.error(error.message);
        res.status(500).send({message:error.message, Problem:'server'});
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