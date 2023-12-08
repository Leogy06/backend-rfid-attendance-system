import express from "express";
import { PORT, mongodbURL } from "./config.js";
import mongoose from "mongoose";
import { studentRoutes } from "./router/studentRouter.js";
import { adminRoutes } from "./router/admin.js";
import passport from "passport";
import session from "express-session";
import flash from "express-flash";
import { mySecretKey } from "./config.js";

const app = express();

app.use(express.json());

mongoose
  .connect(mongodbURL)

  .then(() => {
    app.listen(PORT, () => {
      console.log(`Listening on port ${PORT}`);
    });
    console.log("Server is connected to database");
  })
  .catch((error) => {
    console.log(error);
  });

app.set("view-engine", "ejs");

app.use(express.static("public"));

app.use(express.urlencoded({ extended: false }));
app.use(passport.initialize());
app.use(
  session({
    secret: mySecretKey(),
    resave: false,
    saveUninitialized: false,
  })
);
app.use(flash());
app.use(passport.session());

app.use("/students", studentRoutes);
app.use("/admin", adminRoutes);
