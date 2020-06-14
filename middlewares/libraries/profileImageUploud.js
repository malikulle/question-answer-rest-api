const multer = require("multer");
const path = require("path");
const CustomError = require("../../helpers/error/CustomError");

//Storage, FileFilter

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const rootDirectory = path.dirname(require.main.filename);
    cb(null, path.join(rootDirectory + "/public/uplouds"));
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];

    req.savedProfileImage = "image_" + req.user.id + "." + extension;
    cb(null, req.savedProfileImage);
  },
});

const fileFilter = (req, file, cb) => {
  let allowedMimeType = ["image/jpg", "image/gif", "image/jpeg", "image/png"];

  if (!allowedMimeType.includes(file.mimetype)) {
    return cb(new CustomError("Please Provide a valid image file", 400), false);
  }

  return cb(null, true);
};

const profileImageUploud = multer({ storage, fileFilter });

module.exports = profileImageUploud;
