import mongoose from "mongoose";

const eventSchema = mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: false,
    },
    schoolYear: {
      type: Date,
      required: true,
    },

    description: {
      type: String,
      required: false,
    },
    timeBegin: {
      type: String,
      required: true,
    },

    timeEnd: {
      type: String,
      required: true,
    },
  },
  {
    timeStamp: true,
  }
);

export const Event = mongoose.model("event", eventSchema);
