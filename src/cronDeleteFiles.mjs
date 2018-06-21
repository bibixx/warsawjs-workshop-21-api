import cron from "cron";
import emptyFolder from "empty-folder";
import { multerSaveDest } from "./utils"
import Post from "./post/Post.model";
import Comment from "./comment/Comment.model";

let deletingPromise = Promise.resolve();

export const deleteFiles = async (req, res, next) => {
  deletingPromise = new Promise(async (resolve) => {
    console.log("Started deleting all posts!");

    const emptyPromise = new Promise((emptyTimeout) => {
      emptyFolder(multerSaveDest, false, emptyTimeout);
    });

    const postPromise = Post.remove({});
    const commentPromise = Comment.remove({});

    await Promise.all([
      emptyPromise,
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