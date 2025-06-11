const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dfmoswu5x',
  api_key: '675215553211717',
  api_secret: 'rFDLF8UqwEby5sKRvbLVuDgGdAY',
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'localhands', // nombre del folder en Cloudinary
    allowed_formats: ['jpg', 'png', 'jpeg'],
    public_id: (req, file) => `user-${req.params.id}`, // nombre personalizado
  },
});

const uploader = multer({ storage });

module.exports = { uploader, cloudinary };
