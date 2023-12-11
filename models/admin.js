import mongoose from "mongoose";

const adminSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    middleName: {
      type: String,
      required: false,
    },
    lastName: {
      type: String,
      required: true,
    },

    suffix: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },

    department: {
      type: String,
      required: true,
    },
  },
  {
    timestamp: true,
  }
);
export const Admins = mongoose.model("admin", adminSchema);
