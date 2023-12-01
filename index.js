import express from "express";
import { PORT,mongodbURL } from "./config.js";
import mongoose from "mongoose";
import { studentRoutes } from "./router/studentRouter.js";
import  cors  from "cors";
import { fileURLToPath } from 'url';
import { dirname, join } from "path";
import { adminRoutes } from "./router/admin.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.json());
// app.use(cors());

app.use(cors({
    origin: 'http://127.0.0.1:5500',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  }));

app.use(express.static(join(__dirname, '../frontend/node_modules')));
app.use(express.static(join(__dirname, '../frontend/public2')));


app.get('/', (req, res) => {
    const loginPath = join(__dirname, '../frontend/public2/login.html');
    res.sendFile(loginPath);
});

app.use('/students', studentRoutes);
app.use('/admin', adminRoutes);

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