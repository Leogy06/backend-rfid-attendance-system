import express from 'express';
import {Admins} from '../models/admin.js';
import bcrypt from 'bcrypt';

const routes = express.Router();

routes.use(express.json());

//login authentication
routes.post('/login', async (req, res) => {
    try {
        const adminEmail = req.body.email;
        const adminPassword = req.body.password;

        const regAdmin = await Admins.findOne({ email: adminEmail});

        if (!regAdmin) {
            res.status(404).send('User admin not found');
        }

        const passMatch = await bcrypt.compare(adminPassword, regAdmin.password)
    
        if (passMatch){
            res.send({response: 'Login success!', success:true})
        } else{
            res.status(401).send({response: 'Password do not match.', success:false})
        }

    } catch (error) {
        res.status(500).send({response: 'Server cannot reach, unable to login', error: error.message});
    }
});

//admin registration
routes.post('/register', async (req, res) => {

    try {
       if ( 
            !req.body.firstName ||
            !req.body.lastName ||
            !req.body.email ||
            !req.body.password ||
            !req.body.department
        ){
            return res.status(400).send({
                response: 'Required fields are empty'
            });
        }

        const hashedPass = await bcrypt.hash(req.body.password, 10);

        const insertAdmin = {
            firstName: req.body.firstName,
            middleName: req.body.middleName || "",
            lastName: req.body.lastName,
            suffix: req.body.suffix || "",
            email: req.body.email,
            password: hashedPass,
            department: req.body.department,
        }

        const admin = await Admins.create(insertAdmin);

        await admin.save();

        res.status(200).send({response:"Registered", success: true})
    
    } catch (error) {
        console.error(error.message);
        res.status(500).send({message: error.message, response: "Server unreachable, cannot create account."})
    }

});

export {routes as adminRoutes}