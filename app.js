const express = require("express");
const mongoose = require("mongoose");
const mainRouter = require("./routes/index");

const app = express();
const { PORT = 3001 } = process.env;


app.use((req, res, next) => {
  req.user = {
    _id: "63359607631bc44a6dfb0da9",
  };
  next();
});

mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("Connected to DB");
  })
  .catch(console.error);

app.use(express.json());
app.use("/", mainRouter);

 app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
