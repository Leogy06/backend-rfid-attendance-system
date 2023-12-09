import express from "express";
import { Admins } from "../models/admin.js";
import bcrypt from "bcrypt";
import passport from "../passport-config.js";

const routes = express.Router();
routes.use(express.json());

routes.get("/login", checkNotAuthenticated, (req, res) => {
  res.render("../src/views/login.ejs");
});

routes.post("/login", checkNotAuthenticated, (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/admin/dashboard",
    failureRedirect: "/admin/login",
    failureFlash: true,
  })(req, res, next);
});

routes.delete("/logout", (req, res) => {
  req.logout((error) => {
    if (error) {
      return res.status(500).json({ error: "Unable to logout" });
    } else {
      res.redirect("/admin/login");
    }
  });
});

function checkAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }

  res.redirect("/admin/login");
}

function checkNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect("/admin/dashboard");
  }
  next();
}

routes.get("/dashboard", checkAuthenticated, async (req, res) => {
  res.render("../src/views/home.ejs", { name: req.user.firstName });
});

// Admin registration route
routes.post("/register", async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.department
    ) {
      return res.status(400).send({
        response: "Required fields are empty",
      });
    }

    const hashedPass = await bcrypt.hash(req.body.password, 10);

    const newAdmin = {
      firstName: req.body.firstName,
      middleName: req.body.middleName || "",
      lastName: req.body.lastName,
      suffix: req.body.suffix || "",
      email: req.body.email,
      password: hashedPass,
      department: req.body.department,
    };

    const admin = await Admins.create(newAdmin);

    await admin.save();

    res.status(200).send({ response: "Registered", success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      error: error.message,
      response: "Server unreachable, cannot create account.",
    });
  }
});

routes.get("/attendance", async (req, res) => {
  res.render("../src/views/admin/attendance.ejs");
});

routes.get("/manageStudent", async (req, res) => {
  res.render("../src/views/admin/ManageStudent.ejs");
});

routes.get("/event", async (req, res) => {
  res.render("../src/views/admin/event.ejs");
});

export { routes as adminRoutes };
