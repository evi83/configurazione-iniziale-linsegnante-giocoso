import { createClient } from '@supabase/supabase-js';

async function checkSupabaseConnection() {
  const supabaseUrl = process.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = process.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('Supabase URL or Anon Key is not defined in environment variables.');
    process.exit(1);
  }

  try {
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    console.log('Supabase client created successfully.');

    // Aggiungiamo un test di connessione più concreto
    const { data, error } = await supabase.from('users').select('id').limit(1); // Sostituisci 'users' con una tabella esistente nel tuo DB Supabase
    if (error) {
      console.error('Error testing Supabase connection:', error.message);
      process.exit(1);
    }
    console.log('Supabase connection test successful.');
  } catch (error) {
    console.error('Error during Supabase connection check:', error.message);
    process.exit(1);
  }
}

checkSupabaseConnection();
