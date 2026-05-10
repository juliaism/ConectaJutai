const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function getCourses(req, res) {
  const { data, error } = await supabase.from('courses').select('*');
  if (error) return res.status(400).json({ error: error.message });
  res.json(data);
}

module.exports = { getCourses };
