const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getModules(req, res) {
  const { courseId } = req.params;
  const { data, error } = await supabase
    .from('modules')
    .select('*')
    .eq('course_id', courseId)
    .order('order_index', { ascending: true });

  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

module.exports = { getModules };
