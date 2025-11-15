const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'task-management-app',
    allowed_formats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
    resource_type: 'auto',
  },
});

const upload = multer({ storage: storage });

module.exports = { cloudinary, upload };
