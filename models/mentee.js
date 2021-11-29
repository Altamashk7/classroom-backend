const mongoose = require("mongoose");
const menteeSchema = mongoose.Schema({
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
  mentors: [
    {
      class: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Class",
      },
      mentor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Mentor",
      },
    },
  ],

  profileHeading: {
    type: String,
  },
  profileDescription: {
    type: String,
  },
});

exports.Mentee = mongoose.model("Mentee", menteeSchema);
