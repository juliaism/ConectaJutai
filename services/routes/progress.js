async function syncProgress(req, res) {
  const { userId, progressList } = req.body;

  const { error } = await supabase
    .from('progress')
    .insert(progressList.map(p => ({
      user_id: userId,
      video_id: p.videoId,
      watched_at: p.watchedAt
    })));

  if (error) return res.status(400).json({ error: error.message });
  res.json({ message: 'Progresso sincronizado com sucesso' });
}

const express = require('express');
const { saveProgress, syncProgress } = require('../controllers/progressController');
const authMiddleware = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, saveProgress);
router.post('/sync', authMiddleware, syncProgress);

module.exports = router;
