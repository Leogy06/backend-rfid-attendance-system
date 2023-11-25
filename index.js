import express from "express";
import { PORT,mongodbURL } from "./config.js";
import mongoose from "mongoose";
import { studentRoutes } from "./router/studentRouter.js";
import  cors  from "cors";
import date from "./date.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));
  

app.get('/', (req, res) => {
    console.log(req);
    return res.status(234).send('Hello!')
})

app.use('/students', studentRoutes);


mongoose
    .connect(mongodbURL)

    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        });
        console.log('Server is connected to database');
    })
    .catch((error) => {
        console.log(error);
    })

    console.log(date);