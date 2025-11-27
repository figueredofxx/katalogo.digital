
import { createClient } from '@supabase/supabase-js';

// As chaves devem estar no arquivo .env
// Para evitar que a aplicação quebre (White Screen of Death) caso as chaves não estejam configuradas,
// usamos valores de placeholder. Isso permite que a UI carregue e mostre erros de conexão amigáveis
// em vez de travar o script.

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://placeholder-project.supabase.co';
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'placeholder-key';

if (!process.env.REACT_APP_SUPABASE_URL || !process.env.REACT_APP_SUPABASE_ANON_KEY) {
    console.warn('⚠️ ATENÇÃO: Variáveis de ambiente do Supabase não encontradas. O sistema está rodando em modo desconectado/fallback.');
}

// Cliente Supabase Real
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
