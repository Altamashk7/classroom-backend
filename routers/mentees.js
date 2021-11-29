const { Mentee } = require("../models/mentee");
const { Invite } = require("../models/invite");
const { Class } = require("../models/class");

const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
const mongoose = require("mongoose");

router.get(`/`, async (req, res) => {
  const menteeList = await Mentee.find().select("-password");
  if (!menteeList) {
    res.json({ success: false });
  }
  res.send(menteeList);
});

router.get("/:id", async (req, res) => {
  Mentee.findOne({ _id: req.params.id })
    .populate({
      path: "mentors",
      populate: [
        {
          path: "mentor",
        },

        {
          path: "class",
        },
      ],
    })
    .then((user) => {
      res.json(user);
    });
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

router.put("/invite/accept/:id", async (req, res) => {
  let inviteid = mongoose.Types.ObjectId(req.body.invite);
  let invite = await Invite.findById(inviteid);
  const classid = mongoose.Types.ObjectId(invite.class);
  const classobj = await Class.findById(classid);
  const menteeArray = classobj.mentee;
  console.log(classobj.mentee);
  menteeArray.push(mongoose.Types.ObjectId(req.params.id));
  let params = {
    mentee: menteeArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const classa = await Class.findByIdAndUpdate(classid, params, {
    new: true,
  });

  const menteeid = mongoose.Types.ObjectId(req.params.id);
  const menteeobj = await Mentee.findById(menteeid);
  const MentorArray = menteeobj.mentors;
  const Mentorobj = {
    class: classid,
    mentor: mongoose.Types.ObjectId(classobj.mentor),
  };

  MentorArray.push(Mentorobj);

  params = {
    mentors: MentorArray,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];
  const mentee = await Mentee.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  invite = await Invite.findByIdAndDelete(inviteid);
  if (!invite) {
    return res.status(404).send();
  }
  res.send("invite accepted");
});

router.post("/register", async (req, res) => {
  console.log(req.body);
  const secret = process.env.secret;
  let mentee = new Mentee({
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
    name: req.body.name,
  });
  mentee = await mentee.save();
  if (!mentee) return res.send("the mentee cannot be created!");
  const token = jwt.sign(
    {
      email: req.body.email,
    },
    secret,
    { expiresIn: "1d" }
  );
  res.status(200).send({ mentee: mentee, token: token });
});

router.post("/login", async (req, res) => {
  const mentee = await Mentee.findOne({ email: req.body.email });
  const secret = process.env.secret;
  if (!mentee) {
    return res.send("email incorrect");
  }

  if (mentee && bcrypt.compareSync(req.body.password, mentee.password)) {
    const token = jwt.sign(
      {
        menteeid: mentee._id,
      },
      secret,
      { expiresIn: "1d" }
    );

    res.status(200).send({ mentee: mentee, token: token });
  } else {
    res.send("password incorrect");
  }
});

//for profile
router.put("/:id", async (req, res) => {
  let params = {
    email: req.body.email,
    name: req.body.name,
    qualifications: req.body.a,
    profileHeading: req.body.a,
    profileDescription: req.body.profileDescription,
  };
  for (let prop in params) if (!params[prop]) delete params[prop];

  const mentee = await Mentee.findByIdAndUpdate(req.params.id, params, {
    new: true,
  });

  if (!mentee) return res.send("the mentee cannot be updated!");
  res.send(mentee);
});

module.exports = router;
