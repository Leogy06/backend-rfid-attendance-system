import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    startingSchoolYear: {
      type: String,
      required: true,
    },
    endingSchoolYear: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: false,
    },
    timeBegin: {
      type: Date,
      required: true,
    },
    timeEnd: {
      type: Date,
      required: true,
    },
    attendees: [
      {
        studentName: {
          type: String,
          required: false,
          unique: true,
        },
        year: {
          type: String,
          required: false,
        },
        course: {
          type: String,
          required: false,
        },
        department: {
          type: String,
          required: false,
        },
        timeIn: {
          type: Date,
          required: false,
        },
        timeOut: {
          type: Date,
          required: false,
        },
        status: {
          type: String,
          required: false,
        },
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Events = mongoose.model("Event", eventSchema);
