
require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

async function verify() {
    const { data, error } = await supabase
        .from('scholarship_applications')
        .select('*')
        .eq('email', 'webstackict@gmail.com')
        .limit(1);

    if (error) {
        console.error('Error fetching scholarship applications:', error);
        process.exit(1);
    }

    console.log('Scholarship Application Found:', JSON.stringify(data, null, 2));

    const { data: enrollments, error: enrollError } = await supabase
        .from('enrollments')
        .select('*')
        .eq('email', 'webstackict@gmail.com')
        .order('created_at', { ascending: false })
        .limit(1);

    if (enrollError) {
        console.error('Error fetching enrollments:', enrollError);
        process.exit(1);
    }

    console.log('Enrollment Found:', JSON.stringify(enrollments, null, 2));
}

verify();
