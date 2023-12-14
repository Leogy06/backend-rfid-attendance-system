import express from "express";
import { Admins } from "../models/admin.js";
import bcrypt from "bcrypt";
import passport from "../passport-config.js";
import { Events } from "../models/event.js";
import { Students } from "../models/studentModel.js";

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
routes.post("/register", checkAuthenticated, async (req, res) => {
  try {
    if (
      !req.body.firstName ||
      !req.body.lastName ||
      !req.body.email ||
      !req.body.password ||
      !req.body.department
    ) {
      return res.status(400).send({
        message: "Required fields are empty",
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

    res.status(200).send({ message: "Registered", success: true });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({
      error: error.message,
      message: "Server unreachable, cannot create account.",
    });
  }
});

routes.get("/attendance", checkAuthenticated, async (req, res) => {
  res.render("../src/views/admin/attendance.ejs");
});

routes.get("/manageStudent", checkAuthenticated, async (req, res) => {
  res.render("../src/views/admin/ManageStudent.ejs");
});

//create event
routes.get("/event", checkAuthenticated, async (req, res) => {
  res.render("../src/views/admin/event.ejs");
});

routes.get("/sendEvent", checkAuthenticated, async (req, res) => {
  try {
    const events = await Events.find({});

    return res.status(200).json({
      count: events.length,
      events: events,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Unable to reach server" });
  }
});

routes.post("/event", checkAuthenticated, async (req, res) => {
  try {
    const readableResponse = (readableResponse) => {
      return readableResponse
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase());
    };
    // Check for required fields
    const requiredFields = [
      "title",
      "location",
      "startingSchoolYear",
      "endingSchoolYear",
      "timeBegin",
      "timeEnd",
    ];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      const readableMessage = missingFields.map(readableResponse);
      const emphasizedFields = readableMessage.map(
        (field) => `<b>${field}</b>`
      );

      return res.status(400).send({
        message: `This fields must not empty: ${emphasizedFields.join(", ")}`,
      });
    }

    // Create a new event
    const newEvent = {
      title: req.body.title,
      location: req.body.location,
      startingSchoolYear: req.body.startingSchoolYear,
      endingSchoolYear: req.body.endingSchoolYear,
      description: req.body.description || "",
      timeBegin: req.body.timeBegin,
      timeEnd: req.body.timeEnd,
      attendees: [],
    };

    const event = await Events.create(newEvent);

    return res.status(200).send({
      message: "Event successfully created.",
      success: true,
      title: newEvent.title,
      location: newEvent.location,
      startingSchoolYear: newEvent.startingSchoolYear,
      endingSchoolYear: newEvent.endingSchoolYear,
      description: newEvent.description,
      timeBegin: newEvent.timeBegin,
      timeEnd: newEvent.timeEnd,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).send({ message: "Unable to create event" });
  }
});

routes.put(
  "/event/attendees/timeIn/:id",
  checkAuthenticated,
  async (req, res) => {
    try {
      const rfid = req.body.rfid;
      const attendedEvent = req.params.id;
      const student = await Students.findOne({ rfid });

      if (!student) {
        return res.status(404).send({ message: "Student not found with rfid" });
      }
      const sFullName = () => {
        return `${student.lastName} ${student.firstName} ${
          student.middleName[0] || ""
        }. ${student.suffix || ""}`.trim();
      };

      const newAttendees = {
        studentName: sFullName(),
        year: student.year,
        course: student.course,
        department: student.department,
        timeIn: new Date(),
        status: "PRESENT",
      };
      const updateResult = await Events.updateOne(
        { _id: attendedEvent },
        { $push: { attendees: { $each: [newAttendees] } } }
      );

      console.log(updateResult);

      res.status(200).send({ message: `Welcome ${student.firstName}` });
    } catch (error) {
      console.error(error);
      res.send({ message: "Server problem upon creating attendees" });
    }
  }
);

//delete an event
routes.delete("/event/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await Events.findByIdAndDelete(id);

    if (!result) {
      return res
        .status(404)
        .json({ message: "Can't delete, event do not exist." });
    } else {
      return res.status(200).json({ message: "Student deleted" });
    }
  } catch (error) {
    console.error(error);
    console.log(error);
    res
      .status(500)
      .json({ error: error, message: "Can't delete due to server error" });
  }
});

export { routes as adminRoutes };
