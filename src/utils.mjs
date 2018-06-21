import mongoose from "mongoose";

import path from "path";
import multer from "multer";

export const multerSaveDest = path.resolve("./uploads");

console.log(multerSaveDest);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, multerSaveDest)
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});

export const upload = (req, res, next) => {
  multer({
    storage,
    fileFilter: function (req, file, callback) {
      const allowedMimes = ["image/jpg", "image/jpeg", "image/png"];
      if (allowedMimes.indexOf(file.mimetype) < 0) {
        return callback(new Error("image file type must be either jpg or png"), false);
      }

      return callback(null, true);
    }
  }).single("image")(req, res, err => {
    if (err) {
      console.error(err);
      return res
        .status(422)
        .json({
          ok: false,
          error: [err.message]
        });
    }

    next();
  });
};

export const isObjectId = {
  test(v) {
    const isValid = mongoose.Types.ObjectId.isValid(v);

    if (!isValid) {
      return this.createError({
        path: this.path,
        message: `${this.path} must be a valid ObjectId`,
      });
    }

    return isValid;
  },
};
