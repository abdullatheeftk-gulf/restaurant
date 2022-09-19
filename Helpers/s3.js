const {
  S3Client,
  GetObjectCommand,
  DeleteObjectCommand,
} = require("@aws-sdk/client-s3");
const multer = require("multer");
require("dotenv").config();
const multerS3 = require("multer-s3");

const bucketName = process.env.S3_BUCKET;
const region = process.env.AWS_BUCKET_REGION;
const awsAccessKey = process.env.AWS_ACCESS_KEY_ID;
const awsSecretKey = process.env.AWS_SECRET_ACCESS_KEY;

const s3 = new S3Client({
  region,
  awsAccessKey,
  awsSecretKey,
});

const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: bucketName,
    metadata: function (req, file, cb) {
      try {
        cb(null, { fieldName: file.fieldname });
      } catch (error) {
        console.log(error);
      }
    },
    key: function (req, file, cb) {
      try {
        cb(null, Date.now().toString());
        //console.log(req.file);
      } catch (error) {
        console.log(error);
      }
    },
  }),
});

exports.uploadFile = upload;

const getImage = async (fileKey) => {
  try {
    const downloadParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    return s3.send(new GetObjectCommand(downloadParams));
  } catch (error) {
    return error;
  }
};

exports.getOneImage = getImage;

const deleteImage = async (fileKey) => {
  try {
    const deleteParams = {
      Key: fileKey,
      Bucket: bucketName,
    };
    await s3.send(new DeleteObjectCommand(deleteParams));
  } catch (error) {
    console.log(error.message);
    throw error;
  }
};

exports.deleteImage = deleteImage;
