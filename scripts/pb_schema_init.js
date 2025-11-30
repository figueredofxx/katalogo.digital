
import PocketBase from 'pocketbase';

// --- CONFIGURAÇÃO ---
const PB_URL = 'http://127.0.0.1:8090'; // Ajuste se estiver rodando em outro IP
const ADMIN_EMAIL = 'admin@katalogo.digital'; // Troque pelo seu email de admin
const ADMIN_PASS = '1234567890'; // Troque pela sua senha de admin

const pb = new PocketBase(PB_URL);

async function main() {
    console.log(`🔌 Conectando ao PocketBase em ${PB_URL}...`);

    try {
        await pb.admins.authWithPassword(ADMIN_EMAIL, ADMIN_PASS);
        console.log("✅ Autenticado como Admin!");
    } catch (e) {
        console.error("❌ Erro de autenticação. Verifique email/senha no script.");
        console.error(e.message);
        process.exit(1);
    }

    const collections = [
        {
            name: 'tenants',
            type: 'base',
            schema: [
                { name: 'name', type: 'text', required: true },
                { name: 'slug', type: 'text', required: true, options: { pattern: '^[a-z0-9-]+$' } }, // Unique handled by system constraint usually, or API rule
                { name: 'owner', type: 'relation', required: true, options: { collectionId: '_pb_users_auth_', cascadeDelete: true, maxSelect: 1 } },
                { name: 'plan', type: 'select', options: { values: ['basic', 'pro'] } },
                { name: 'subscription_status', type: 'select', options: { values: ['trial', 'active', 'past_due', 'suspended'] } },
                { name: 'trial_ends_at', type: 'date' },
                { name: 'primary_color', type: 'text' },
                { name: 'whatsapp_number', type: 'text' },
                { name: 'description', type: 'text' },
                { name: 'address', type: 'text' },
                { name: 'opening_hours', type: 'text' },
                { name: 'instagram', type: 'text' },
                { name: 'custom_domain', type: 'text' },
                { name: 'logo', type: 'file', options: { mimeTypes: ['image/*'], maxSelect: 1 } },
                { name: 'banner', type: 'file', options: { mimeTypes: ['image/*'], maxSelect: 1 } },
                { name: 'config_json', type: 'json' },
                { name: 'slug_history', type: 'json' }
            ],
            createRule: "", // Public create (for registration) - Lock down later if needed
            updateRule: "@request.auth.id = owner.id",
            deleteRule: "@request.auth.id = owner.id",
            viewRule: "" // Public view for storefront
        },
        {
            name: 'categories',
            type: 'base',
            schema: [
                { name: 'name', type: 'text', required: true },
                { name: 'slug', type: 'text' },
                { name: 'image', type: 'file', options: { mimeTypes: ['image/*'], maxSelect: 1 } },
                { name: 'active', type: 'bool' },
                { name: 'tenant', type: 'relation', required: true, options: { collectionId: 'tenants', cascadeDelete: true, maxSelect: 1 } }
            ],
            listRule: "", // Public
            viewRule: "",
            createRule: "@request.auth.id != ''", // Any auth user (logic checked in app)
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        },
        {
            name: 'brands',
            type: 'base',
            schema: [
                { name: 'name', type: 'text', required: true },
                { name: 'image', type: 'file', options: { mimeTypes: ['image/*'], maxSelect: 1 } },
                { name: 'active', type: 'bool' },
                { name: 'tenant', type: 'relation', required: true, options: { collectionId: 'tenants', cascadeDelete: true, maxSelect: 1 } }
            ],
            listRule: "",
            viewRule: "",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        },
        {
            name: 'products',
            type: 'base',
            schema: [
                { name: 'name', type: 'text', required: true },
                { name: 'description', type: 'text' },
                { name: 'price', type: 'number', required: true },
                { name: 'promo_price', type: 'number' },
                { name: 'stock_quantity', type: 'number' },
                { name: 'min_stock_level', type: 'number' },
                { name: 'active', type: 'bool' },
                { name: 'image', type: 'file', options: { mimeTypes: ['image/*'], maxSelect: 1 } },
                { name: 'tenant', type: 'relation', required: true, options: { collectionId: 'tenants', cascadeDelete: true, maxSelect: 1 } },
                { name: 'category', type: 'relation', options: { collectionId: 'categories', maxSelect: 1 } },
                { name: 'brand', type: 'relation', options: { collectionId: 'brands', maxSelect: 1 } }
            ],
            listRule: "",
            viewRule: "",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        },
        {
            name: 'orders',
            type: 'base',
            schema: [
                { name: 'tenant', type: 'relation', required: true, options: { collectionId: 'tenants', cascadeDelete: true, maxSelect: 1 } },
                { name: 'status', type: 'select', options: { values: ['pending', 'confirmed', 'preparing', 'ready', 'shipping', 'delivered', 'canceled'] } },
                { name: 'total', type: 'number' },
                { name: 'customer_json', type: 'json' },
                { name: 'items_json', type: 'json' },
                { name: 'address_json', type: 'json' },
                { name: 'timeline_json', type: 'json' },
                { name: 'notes', type: 'text' }
            ],
            listRule: "", // Public for tracking (filtered by ID) or restricted? Usually public read if you know ID.
            viewRule: "",
            createRule: "", // Public create
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        },
        {
            name: 'support_tickets',
            type: 'base',
            schema: [
                { name: 'tenant', type: 'relation', required: true, options: { collectionId: 'tenants', cascadeDelete: true, maxSelect: 1 } },
                { name: 'subject', type: 'text', required: true },
                { name: 'message', type: 'text' },
                { name: 'status', type: 'select', options: { values: ['open', 'pending', 'closed'] } },
                { name: 'priority', type: 'select', options: { values: ['low', 'medium', 'high'] } }
            ],
            listRule: "@request.auth.id != ''",
            viewRule: "@request.auth.id != ''",
            createRule: "@request.auth.id != ''",
            updateRule: "@request.auth.id != ''",
            deleteRule: "@request.auth.id != ''"
        }
    ];

    for (const col of collections) {
        try {
            console.log(`📦 Verificando coleção: ${col.name}...`);
            const existing = await pb.collections.getOneOrNull(col.name);
            
            if (existing) {
                console.log(`   ⚠️ Coleção ${col.name} já existe. Pulando criação.`);
                // Opcional: Atualizar schema (pb.collections.update)
            } else {
                await pb.collections.create(col);
                console.log(`   ✅ Coleção ${col.name} CRIADA com sucesso!`);
            }
        } catch (err) {
            console.error(`   ❌ Erro ao processar ${col.name}:`, err.message);
        }
    }

    console.log("\n✨ Processo finalizado!");
}

main();
