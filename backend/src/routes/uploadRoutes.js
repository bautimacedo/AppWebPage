const express = require('express');
const router = express.Router();
const { uploader } = require('../middlewares/cloudinary');
const User = require('../models/userModel');

router.post('/upload-profile/:id', uploader.single('image'), async (req, res) => {
  try {
    const userId = req.params.id;
    const imageUrl = req.file.path;

    await User.update({ imageUrl }, { where: { id: userId } });

    res.json({ success: true, imageUrl });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error al subir imagen' });
  }
});

module.exports = router;
