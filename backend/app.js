const express = require("express");
require("./db/mongoose");
var cors = require("cors");
const userRouter = require("./routers/user.router");
const surveyRouter = require("./routers/survey.router");
const resultsRouter = require("./routers/results.router");

const app = express();

app.use(cors());

app.use(express.json());
app.use(userRouter);
app.use(surveyRouter);
app.use(resultsRouter);

module.exports = app;
