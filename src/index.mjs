import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bodyParser from "body-parser";

import { get as postGet, post as postPost, getById as postGetById } from "./post";
import { post as commentPost, get as commentGet } from "./comment";
import { upload, multerSaveDest } from "./utils"
import { isDeleting, cronDeleteFiles, deleteFiles } from "./cronDeleteFiles";
import path from "path";

const PORT = process.env.PORT || 3000;
const MONGO_URL = process.env.MONGO_URL || "mongodb://localhost/warsawjs-workshop-21-api";

mongoose.connect(MONGO_URL);

const app = express();

app.use(cors());
app.use(bodyParser.json())

app.use("/static", express.static(multerSaveDest));
app.use("/demo", express.static(path.resolve("./demo")));

app.get("/", (req, res) => {
  res.sendFile( path.resolve('./index.html') );
});

app.get("/ping", (req, res) => {
  res.json({
    ok: true,
    pong: true,
  })
})

app.post("/auth", (req, res) => {
  if ( !req.body.username ) {
    return res.status(401).json({
      ok: false,
      errors: ["username is a required field"]
    });
  }

  if ( !req.body.password ) {
    return res.status(401).json({
      ok: false,
      errors: ["password is a required field"]
    });
  }

  return res.json({
    ok: true,
    username: req.body.username
  })
});

app.use(isDeleting);

app.get('/posts/', postGet);
app.get('/posts/:id', postGetById);

app.post('/posts/', upload, postPost);

app.post('/posts/:postId/comments/', bodyParser.json(), commentPost);
app.get('/posts/:postId/comments/', bodyParser.json(), commentGet);


if (process.env.NODE_ENV === "development") {
  app.get('/delete', async (req, res) => {
    await deleteFiles();
    res.json({});
  });
}

cronDeleteFiles();

app.listen(PORT, () => console.log(`App listening on port ${PORT}!`))