import { createClient } from '@supabase/supabase-js';

// Assicurati che le variabili d'ambiente siano definite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase URL or Anon Key is not defined in environment variables.');
  // In un'applicazione reale, potresti voler mostrare un errore all'utente o gestire la situazione in modo più robusto.
  throw new Error('Supabase credentials are missing. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
