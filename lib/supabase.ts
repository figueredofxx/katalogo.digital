
// ESTE ARQUIVO ESTÁ DEPRECIADO. O SISTEMA AGORA USA POCKETBASE.
// Por favor, use 'lib/pocketbase.ts'.

export const supabase = {
    from: () => { throw new Error("Supabase foi removido. Use PocketBase."); },
    auth: {
        signIn: () => { throw new Error("Supabase foi removido."); }
    }
};
