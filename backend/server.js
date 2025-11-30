require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// --- APP SETUP ---
const app = express();
app.use(express.json({ limit: '10mb' })); // Support base64 images
app.use(cors());

// --- DATABASE CONNECTION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/katalogo';
mongoose.connect(MONGO_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => console.error('❌ MongoDB Error:', err));

// --- MODELS (SCHEMAS) ---
const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    created: { type: Date, default: Date.now }
});
const User = mongoose.model('User', UserSchema);

const TenantSchema = new mongoose.Schema({
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    plan: { type: String, default: 'basic' },
    primary_color: { type: String, default: '#4B0082' },
    whatsapp_number: String,
    description: String,
    address: String,
    instagram: String,
    opening_hours: String,
    banner: String, // Base64 or URL
    logo: String,   // Base64 or URL
    subscription_status: { type: String, default: 'trial' },
    trial_ends_at: Date,
    config_json: Object, // Payment methods, delivery, etc
    slug_history: Array,
    isSuperAdmin: { type: Boolean, default: false } // Added for Super Admin logic
}, { timestamps: true });
const Tenant = mongoose.model('Tenant', TenantSchema);

const ProductSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
    name: { type: String, required: true },
    description: String,
    price: Number,
    promo_price: Number,
    image: String, // Base64
    active: { type: Boolean, default: true },
    stock_quantity: Number,
    min_stock_level: Number
}, { timestamps: true });
const Product = mongoose.model('Product', ProductSchema);

const CategorySchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    name: String,
    slug: String,
    image: String,
    active: Boolean
});
const Category = mongoose.model('Category', CategorySchema);

const OrderSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    customer_json: Object,
    items_json: Array,
    address_json: Object,
    timeline_json: Array,
    total: Number,
    status: String,
    notes: String
}, { timestamps: true });
const Order = mongoose.model('Order', OrderSchema);

const SupportTicketSchema = new mongoose.Schema({
    tenant: { type: mongoose.Schema.Types.ObjectId, ref: 'Tenant', required: true },
    subject: { type: String, required: true },
    message: String,
    status: { type: String, default: 'open' },
    priority: { type: String, default: 'medium' }
}, { timestamps: true });
const SupportTicket = mongoose.model('SupportTicket', SupportTicketSchema);

// --- MIDDLEWARE ---
const auth = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) return res.status(401).json({ message: 'Acesso negado' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key');
        req.user = decoded; // { id: '...' }
        next();
    } catch (e) {
        res.status(400).json({ message: 'Token inválido' });
    }
};

const getTenant = async (req, res, next) => {
    // Find tenant owned by user
    const tenant = await Tenant.findOne({ owner: req.user.id });
    if (!tenant) return res.status(404).json({ message: 'Loja não encontrada' });
    req.tenant = tenant;
    next();
};

const checkSuperAdmin = async (req, res, next) => {
    const tenant = await Tenant.findOne({ owner: req.user.id });
    if (!tenant || !tenant.isSuperAdmin) {
        return res.status(403).json({ message: 'Acesso restrito a Super Admin' });
    }
    next();
};

// --- ROUTES: AUTH ---
app.post('/api/auth/register', async (req, res) => {
    try {
        const { email, password, storeName, slug, plan } = req.body;
        
        // 1. Check User
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'Email já cadastrado' });

        // 2. Create User
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await User.create({ email, password: hashedPassword, name: storeName });

        // 3. Create Tenant
        const trialEnd = new Date();
        trialEnd.setDate(trialEnd.getDate() + 7);
        
        const tenant = await Tenant.create({
            owner: user._id,
            name: storeName,
            slug: slug || storeName.toLowerCase().replace(/\s+/g, '-'),
            plan,
            trial_ends_at: trialEnd,
            config_json: {
                paymentMethods: { pix: true, creditCard: true, money: true },
                deliveryConfig: { mode: 'fixed', fixedPrice: 0 }
            },
            isSuperAdmin: false // Default
        });

        // 4. Token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key');
        res.json({ token, user: { email: user.email, id: user._id } });

    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Senha incorreta' });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || 'secret_key');
        res.json({ token, user: { email: user.email, id: user._id } });
    } catch (e) {
        res.status(500).json({ message: e.message });
    }
});

app.get('/api/auth/me', auth, async (req, res) => {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
});

// --- ROUTES: ADMIN (PROTECTED) ---
app.get('/api/tenant/me', auth, async (req, res) => {
    const tenant = await Tenant.findOne({ owner: req.user.id });
    res.json(tenant);
});

app.put('/api/tenant/settings', auth, getTenant, async (req, res) => {
    Object.assign(req.tenant, req.body);
    await req.tenant.save();
    res.json(req.tenant);
});

// PRODUCTS
app.get('/api/products', auth, getTenant, async (req, res) => {
    const products = await Product.find({ tenant: req.tenant._id }).sort({ createdAt: -1 });
    res.json(products);
});

app.post('/api/products', auth, getTenant, async (req, res) => {
    const product = await Product.create({ ...req.body, tenant: req.tenant._id });
    res.json(product);
});

app.put('/api/products/:id', auth, getTenant, async (req, res) => {
    const product = await Product.findOneAndUpdate(
        { _id: req.params.id, tenant: req.tenant._id },
        req.body,
        { new: true }
    );
    res.json(product);
});

app.delete('/api/products/:id', auth, getTenant, async (req, res) => {
    await Product.deleteOne({ _id: req.params.id, tenant: req.tenant._id });
    res.json({ success: true });
});

// CATEGORIES
app.get('/api/categories', auth, getTenant, async (req, res) => {
    const categories = await Category.find({ tenant: req.tenant._id });
    res.json(categories);
});

app.post('/api/categories', auth, getTenant, async (req, res) => {
    const cat = await Category.create({ ...req.body, tenant: req.tenant._id });
    res.json(cat);
});

app.put('/api/categories/:id', auth, getTenant, async (req, res) => {
    const cat = await Category.findOneAndUpdate(
        { _id: req.params.id, tenant: req.tenant._id },
        req.body,
        { new: true }
    );
    res.json(cat);
});

app.delete('/api/categories/:id', auth, getTenant, async (req, res) => {
    await Category.deleteOne({ _id: req.params.id, tenant: req.tenant._id });
    res.json({ success: true });
});

// ORDERS (ADMIN)
app.get('/api/orders', auth, getTenant, async (req, res) => {
    const orders = await Order.find({ tenant: req.tenant._id }).sort({ createdAt: -1 });
    res.json(orders);
});

app.patch('/api/orders/:id/status', auth, getTenant, async (req, res) => {
    const order = await Order.findOne({ _id: req.params.id, tenant: req.tenant._id });
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
    
    order.status = req.body.status;
    order.timeline_json.push({ status: req.body.status, timestamp: new Date() });
    await order.save();
    res.json(order);
});

// TICKETS (TENANT)
app.post('/api/tickets', auth, getTenant, async (req, res) => {
    const ticket = await SupportTicket.create({ ...req.body, tenant: req.tenant._id });
    res.json(ticket);
});

// --- ROUTES: SUPER ADMIN ---
app.get('/api/super-admin/tenants', auth, checkSuperAdmin, async (req, res) => {
    const tenants = await Tenant.find().sort({ createdAt: -1 }).populate('owner', 'email');
    res.json(tenants);
});

app.patch('/api/super-admin/tenants/:id/status', auth, checkSuperAdmin, async (req, res) => {
    const tenant = await Tenant.findById(req.params.id);
    if (!tenant) return res.status(404).json({ message: 'Tenant not found' });
    tenant.subscription_status = req.body.status;
    await tenant.save();
    res.json(tenant);
});

app.get('/api/super-admin/tickets', auth, checkSuperAdmin, async (req, res) => {
    const tickets = await SupportTicket.find().sort({ createdAt: -1 }).populate('tenant', 'name');
    res.json(tickets);
});

app.patch('/api/super-admin/tickets/:id', auth, checkSuperAdmin, async (req, res) => {
    const ticket = await SupportTicket.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(ticket);
});

// --- ROUTES: PUBLIC STOREFRONT ---
app.get('/api/public/store/:slug', async (req, res) => {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: 'Loja não encontrada' });

    const [products, categories] = await Promise.all([
        Product.find({ tenant: tenant._id, active: true }).sort({ createdAt: -1 }),
        Category.find({ tenant: tenant._id })
    ]);

    res.json({ tenant, products, categories });
});

app.post('/api/public/store/:slug/orders', async (req, res) => {
    const tenant = await Tenant.findOne({ slug: req.params.slug });
    if (!tenant) return res.status(404).json({ message: 'Loja não encontrada' });

    const orderData = {
        tenant: tenant._id,
        customer_json: {
            name: req.body.customerName,
            phone: req.body.customerPhone,
            deliveryMethod: req.body.deliveryMethod,
            paymentMethod: req.body.paymentMethod
        },
        address_json: req.body.address,
        items_json: req.body.items,
        total: req.body.total,
        notes: req.body.notes,
        status: 'pending',
        timeline_json: [{ status: 'pending', timestamp: new Date() }]
    };

    const order = await Order.create(orderData);
    res.json(order);
});

app.get('/api/public/orders/:id', async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Pedido não encontrado' });
    
    // Security: Only return if ID matches (UUID/ObjectId is hard to guess, but valid point)
    res.json(order);
});

app.get('/api/public/customer/orders', async (req, res) => {
    const { phone, tenant } = req.query;
    if (!phone || !tenant) return res.json([]);
    
    const orders = await Order.find({ 
        tenant: tenant, 
        'customer_json.phone': phone 
    }).sort({ createdAt: -1 });
    
    res.json(orders);
});

// --- START SERVER ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));