import { Strategy as LocalStrategy } from "passport-local";
import bcrypt from "bcrypt";
import { Admins } from "./models/admin.js";
import passport from "passport";

passport.use(
  new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
      try {
        const admin = await Admins.findOne({ email });

        if (!admin) {
          return done(null, false, { message: "Email does not found." });
        }

        const correctPass = await bcrypt.compare(password, admin.password);

        if (!correctPass) {
          return done(null, false, { message: "Incorrect password." });
        }

        return done(null, admin);
      } catch (error) {
        console.error(error);
        return done(error, false, {
          message: "Can't authenticate at the moment.",
        });
      }
    }
  )
);

passport.serializeUser((admin, done) => {
  done(null, admin._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const admin = await Admins.findById(id);
    return done(null, admin);
  } catch (error) {
    console.error(error);
    done(error);
  }
});

export default passport;
