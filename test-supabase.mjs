
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('Testing connection to:', supabaseUrl);
console.log('Using Key starting with:', supabaseKey?.substring(0, 15));

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
    try {
        const { data, error } = await supabase.from('programs').select('count', { count: 'exact', head: true });
        if (error) {
            console.error('Supabase error:', error);
        } else {
            console.log('Connection successful! Program count:', data);
        }
    } catch (err) {
        console.error('Catch error:', err);
    }
}

test();
