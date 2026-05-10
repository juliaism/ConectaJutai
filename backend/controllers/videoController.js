const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getVideos(req, res) {
  const { moduleId } = req.params;
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('module_id', moduleId)
    .order('order_index', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

module.exports = { getVideos };
