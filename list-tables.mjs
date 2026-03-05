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

async function list() {
  // Querying information_schema requires more privileges, but we can try to list common tables
  const tables = ['cohorts', 'departments', 'enrollments', 'users', 'profiles', 'events', 'waitlist'];
  const results = {};
  for (const t of tables) {
    const { count, error } = await supabase.from(t).select('*', { count: 'exact', head: true });
    results[t] = { count: count ?? 0, error: error?.message ?? null };
  }
  fs.writeFileSync('tables_count.json', JSON.stringify(results, null, 2));
}

list();
