const mongoose = require("mongoose");

const inviteSchema = mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
  },
  mentee: {
    type: mongoose.Schema.Types.ObjectId,
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
  },
  date: {
    type: Date,
  },
});

exports.Invite = mongoose.model("Invite", inviteSchema);
