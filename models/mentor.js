const mongoose = require("mongoose");

const mentorSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  qualifications: {
    type: String,
    default: "",
  },
  profileHeading: {
    type: String,
  },
  profileDescription: {
    type: String,
  },
});

exports.Mentor = mongoose.model("Mentor", mentorSchema);
