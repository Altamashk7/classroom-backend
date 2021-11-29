const express = require("express");
const mongoose = require("mongoose");
require("dotenv/config");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(express.urlencoded({ extended: true }));
const authJwt = require("./helpers/jwt");
const errorHandler = require("./helpers/error-handler");
mongoose
  .connect(process.env.CONNECTION_STRING, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: "classroomDB",
  })
  .then(() => console.log("Database connected!"))
  .catch((err) => console.log(err));

const mentorsRouter = require("./routers/mentors");
const menteesRouter = require("./routers/mentees");

//routes
// app.use(authJwt());
// app.use(errorHandler);
app.use("/mentor", mentorsRouter);
app.use("/mentee", menteesRouter);

app.get("/", (req, res) => {
  res.send("API working fine !");
});

app.listen(process.env.PORT, () =>
  console.log(`Server is running on ${process.env.PORT}`)
);
