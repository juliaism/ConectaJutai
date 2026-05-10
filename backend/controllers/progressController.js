const supabase = require('../src/config/supabaseClient')

async function saveProgress(req, res) {
  const { userId, videoId } = req.body;

   try {
    const { error } = await supabase
      .from('progress')
      .insert([{ user_id: userId, video_id: videoId }])

    if (error) return res.status(400).json({ error: error.message })

    await checkAndUnlockNextModule(userId, videoId)

    res.json({ message: 'Progresso salvo e verificado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
}

async function syncProgress(req, res) {
  const { userId, progressList } = req.body

  try {
    const { error } = await supabase
      .from('progress')
      .insert(progressList.map(p => ({
        user_id: userId,
        video_id: p.videoId,
        watched_at: p.watchedAt
      })))

    if (error) return res.status(400).json({ error: error.message })

    for (const p of progressList) {
      await checkAndUnlockNextModule(userId, p.videoId)
    }

    res.json({ message: 'Progresso sincronizado e verificado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno no servidor' })
  }
}


async function checkAndUnlockNextModule(userId, videoId) {
  const { data: video } = await supabase
    .from('videos')
    .select('module_id')
    .eq('id', videoId)
    .single()

  if (!video) return

  const { data: moduleVideos } = await supabase
    .from('videos')
    .select('id')
    .eq('module_id', video.module_id)

  
  const { data: userProgress } = await supabase
    .from('progress')
    .select('video_id')
    .eq('user_id', userId)
    .in('video_id', moduleVideos.map(v => v.id))

  
  if (userProgress.length === moduleVideos.length) {
    const { data: currentModule } = await supabase
      .from('modules')
      .select('course_id, order_index')
      .eq('id', video.module_id)
      .single()

    if (!currentModule) return

    const { data: nextModule } = await supabase
      .from('modules')
      .select('id')
      .eq('course_id', currentModule.course_id)
      .eq('order_index', currentModule.order_index + 1)
      .single()

    if (nextModule) {
      await supabase
        .from('modules')
        .update({ unlocked: true })
        .eq('id', nextModule.id)
    }
  }
}

module.exports = { saveProgress, syncProgress, checkAndUnlockNextModule }


