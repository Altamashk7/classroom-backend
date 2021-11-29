const { Mentor } = require("../models/mentor");
const { Invite } = require("../models/invite");
const { Class } = require("../models/class");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");
router.get(`/`, async (req, res) => {
  const mentorList = await Mentor.find().select("-password");
  if (!mentorList) {
    res.json({ success: false });
  }
  res.send(mentorList);
});

router.get("/:id", async (req, res) => {
  const mentor = await Mentor.findById(req.params.id).select("-password");
  if (!mentor) {
    res.json({ message: "The Mentor with the given ID was not found." });
  }
  res.send(mentor);
});

router.get("/invite/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentee: req.params.id };
  }
  const inviteList = await Invite.find(filter).sort({ date: -1 });
  if (!inviteList) {
    res.json({ success: false });
  }
  res.send(inviteList);
});

router.get("/class/:id", async (req, res) => {
  let filter = {};
  if (req.params.id) {
    filter = { mentee: req.params.id };
  }
  const classList = await Class.find(filter).sort({ date: -1 });
  if (!classList) {
    res.json({ success: false });
  }
  res.send(classList);
});

router.post("/invite/:id", async (req, res) => {
  const menteeid = mongoose.Types.ObjectId(req.body.mentee);
  const mentorid = mongoose.Types.ObjectId(req.params.id);
  const classid = mongoose.Types.ObjectId(req.body.class);
  const today = Date.now();
  let invite = new Invite({
    message: req.body.message,
    mentee: menteeid,
    mentor: mentorid,
    date: today,
    class: classid,
  });
  invite = await invite.save();
  if (!invite) return res.send("the Invite cannot be created!");
  res.send(invite);
});

router.post("/class/:id", async (req, res) => {
  const mentorid = mongoose.Types.ObjectId(req.params.id);
  const today = Date.now();

  let classA = new Class({
    className: req.body.className,
    mentor: mentorid,
    date: today,
  });
  classA = await classA.save();
  if (!classA) return res.send("the Invite cannot be created!");

  res.send(classA);
});

router.post("/register", async (req, res) => {
  console.log(req.body);

  const secret = process.env.secret;
  let mentor = new Mentor({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
  });
  mentor = await mentor.save();
  if (!mentor) return res.send("the mentor cannot be created!");
  const token = jwt.sign(
    {
      email: req.body.email,
    },
    secret,
    { expiresIn: "1d" }
  );
  res.status(200).send({ mentor: mentor, token: token });
});
router.post("/login", async (req, res) => {
  const mentor = await Mentor.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!mentor) {
    return res.status(400).send("The mentor not found");
  }

  if (mentor && bcrypt.compareSync(req.body.password, mentor.password)) {
    const token = jwt.sign(
      {
        mentorid: mentor._id,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ mentor: mentor, token: token });
  } else {
    res.status(400).send("password incorrect");
  }
});

router.put("/:id", async (req, res) => {
  let params = {
    email: req.body.email,
    name: req.body.name,
    qualifications: req.body.qualifications,
    profileHeading: req.body.profileHeading,
    profileDescription: req.body.profileDescription,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];

  const mentor = await Mentor.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!mentor) return res.send("the mentor cannot be updated!");
  res.send(mentor);
});

module.exports = router;
