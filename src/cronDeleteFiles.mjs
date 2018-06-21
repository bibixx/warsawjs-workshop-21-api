import cron from "cron";
import fs from "fs";
import path from "path";
import { multerSaveDest } from "./utils"
import Post from "./post/Post.model";
import Comment from "./comment/Comment.model";

let deletingPromise = Promise.resolve();

export const deleteFiles = async (req, res, next) => {
  deletingPromise = new Promise(async (resolve) => {
    console.log("Started deleting all posts!");

    console.log(multerSaveDest);

    const protectedPost = await Post.findOne({ "title": "My first UI project!" });

    await new Promise((resolveDir) => {
      fs.readdir(multerSaveDest, async (err, files) => {
        const excludedFiles = [".gitkeep", "instgr.png"];

        const filteredFiles = files.filter(f => !excludedFiles.includes(f));

        filteredFiles.map(f => new Promise((resolveRemove) => {
          fs.unlink(path.join(multerSaveDest, f), (err) => {
            resolveRemove();
          });
        }));

        await Promise.all(filteredFiles);
        resolveDir();
      })
    });
    
    const postPromise = Post.remove({ _id: { $ne: protectedPost._id } });
    const commentPromise = Comment.remove({ _id: { $nin: protectedPost.comments } });

    await Promise.all([
      postPromise,
      commentPromise,
    ]);

    console.log("Removed all posts!");

    resolve();
  });
}

export const isDeleting = async (req, res, next) => {
  await deletingPromise;
  next();
}

export const cronDeleteFiles = () => {
  const CronJob = cron.CronJob;
  const cronPattern = process.env.CRON_PATTERN || "0 */10 * * * *";

  deleteFiles();

  const job = new CronJob({
    cronTime: cronPattern,
    onTick: function() {
      deleteFiles();
    },
    start: true,
    timeZone: "Europe/Warsaw"
  });

  job.start();
}