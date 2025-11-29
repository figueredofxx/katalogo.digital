
import PocketBase from 'pocketbase';

// Detecta URL automaticamente
// Em produção (mesmo domínio via Nginx): '/'
// Em desenvolvimento local: 'http://127.0.0.1:8090'
const pbUrl = window.location.hostname === 'localhost' ? 'http://127.0.0.1:8090' : '/';

export const pb = new PocketBase(pbUrl);

// Desativa cancelamento automático para evitar erros em React StrictMode com useEffect duplo
pb.autoCancellation(false);
