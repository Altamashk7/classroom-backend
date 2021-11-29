const mongoose = require("mongoose");

const classSchema = mongoose.Schema({
  mentor: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  mentee: [
    {
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
  className: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
  },
});

exports.Class = mongoose.model("Class", classSchema);
