import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

const envContent = fs.readFileSync('.env.local', 'utf8');
const env = {};
envContent.split('\n').forEach(line => {
  const parts = line.split('=');
  if (parts.length >= 2) {
    const key = parts[0].trim();
    const value = parts.slice(1).join('=').trim().replace(/^"(.*)"$/, '').replace(/^'(.*)'$/, '');
    env[key] = value;
  }
});

const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

async function dump() {
  const { data, error } = await supabase.from('cohorts').select('*');
  if (error) {
    fs.writeFileSync('dump_result.json', JSON.stringify({ error }, null, 2));
  } else {
    fs.writeFileSync('dump_result.json', JSON.stringify({ data }, null, 2));
  }
}

dump();
