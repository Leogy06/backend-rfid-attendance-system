import express from 'express';
import { Admins } from '../models/admin.js';
import bcrypt from 'bcrypt';

const routes = express.Router();
routes.use(express.json());

// Admin registration route
routes.post('/register', async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.department
    ) {
      return res.status(400).send({
        response: 'Required fields are empty',
      });
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const newAdmin = {
      firstName: req.body.firstName,
      middleName: req.body.middleName || '',
      lastName: req.body.lastName,
      suffix: req.body.suffix || '',
      email: req.body.email,
      password: hashedPass,
      department: req.body.department,
    };

    const admin = await Admins.create(newAdmin);

    await admin.save();

    res.status(200).send({ response: 'Registered', success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ error: error.message, response: 'Server unreachable, cannot create account.' });
  }
});

routes.get('/attendance', async (req, res) => {
  res.render('../src/views/admin/attendance.ejs')
})

routes.get('/manageStudent', async (req, res) => {
  res.render('../src/views/admin/ManageStudent.ejs')
})

export { routes as adminRoutes };