const express = require('express');
const { getVideos } = require('../controllers/videoController');
const router = express.Router();

router.get('/:moduleId', getVideos);

module.exports = router;
