import express from "express"
import { PORT,mongodbURL } from "./config.js"
import mongoose from "mongoose"
import { studentRoutes } from "./router/studentRouter.js"
import { adminRoutes } from "./router/admin.js"

const app = express()

app.use(express.json())

app.set('view-engine', 'ejs')

app.use(express.static('public'))

app.use(express.urlencoded({ extended:false}))

app.get('/', (req, res) => {
    res.render('../src/views/home.ejs', {name: 'Leogy'})
})

app.use('/students', studentRoutes)
app.use('/admin', adminRoutes)

mongoose
    .connect(mongodbURL)

    .then(() => {
        app.listen(PORT, () => {
            console.log(`Listening on port ${PORT}`)
        })
        console.log('Server is connected to database')
    })
    .catch((error) => {
        console.log(error)
    })