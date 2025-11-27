
import React, { useState } from 'react';
import { Card, Button, Input, Select, Badge, showToast, Drawer, Textarea, ImageUploader } from '../../components/ui/Components';
import { Product } from '../../types';
import { useAdmin } from '../../hooks/useAdmin';
import { useAuth } from '../../contexts/AuthContext';
import { Plus, Search, Edit2, Trash2, Image as ImageIcon, Check, X, AlertCircle, Loader, AlertTriangle } from 'lucide-react';

const Products: React.FC = () => {
  const { products, categories, brands, saveProduct, deleteProduct, loading } = useAdmin();
  const { tenant } = useAuth();
  
  // State
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  
  // Drawer State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // Plan Limits
  const PLAN_LIMIT = 20;
  const isBasicPlan = tenant?.plan === 'basic';
  const productsCount = products.length;
  const limitReached = isBasicPlan && productsCount >= PLAN_LIMIT;

  // --- ACTIONS ---

  const handleOpenDrawer = (product?: Product) => {
    if (!product && limitReached) {
        showToast('Limite de produtos atingido no plano básico.', 'error');
        return;
    }

    if (product) {
        setEditingProduct({ ...product });
    } else {
        setEditingProduct({
            name: '',
            price: 0,
            description: '',
            imageUrl: '',
            categoryId: categories[0]?.id || '',
            brandId: '',
            active: true,
            stockQuantity: 0,
            minStockLevel: 5
        });
    }
    setIsDrawerOpen(true);
  };

  const handleSave = async () => {
    if (!editingProduct?.name || !editingProduct.price) {
        showToast('Preencha os campos obrigatórios.', 'error');
        return;
    }

    setIsSaving(true);
    const { error } = await saveProduct(editingProduct);
    setIsSaving(false);

    if (error) {
        showToast('Erro ao salvar produto.', 'error');
    } else {
        showToast('Produto salvo com sucesso!');
        setIsDrawerOpen(false);
    }
  };

  const handleDelete = async (id: string) => {
      if (confirm('Tem certeza que deseja excluir este produto?')) {
          const { error } = await deleteProduct(id);
          if(error) showToast('Erro ao excluir', 'error');
          else showToast('Produto excluído.', 'info');
      }
  };

  const toggleStatus = async (product: Product) => {
      await saveProduct({ ...product, active: !product.active });
  };

  // --- FILTERING ---
  const filteredProducts = products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'all' || p.categoryId === filterCategory;
      return matchesSearch && matchesCategory;
  });

  if (loading && products.length === 0) return <div className="p-8 flex justify-center"><Loader className="animate-spin"/></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Produtos</h1>
          <p className="text-gray-500 text-sm">Gerencie seu catálogo, preços e estoque.</p>
        </div>
        <Button onClick={() => handleOpenDrawer()} disabled={limitReached} className={limitReached ? 'opacity-50' : ''}>
            <Plus size={18} className="mr-2" />
            Novo Produto
        </Button>
      </div>
      
      {/* Plan Usage Warning */}
      {isBasicPlan && (
          <div className={`p-3 rounded-lg border flex justify-between items-center ${limitReached ? 'bg-red-50 border-red-200 text-red-700' : 'bg-gray-50 border-gray-200 text-gray-600'}`}>
              <div className="flex items-center gap-2 text-sm font-medium">
                 <AlertCircle size={16} />
                 <span>Uso do Plano: {productsCount} / {PLAN_LIMIT} produtos</span>
              </div>
              {limitReached && <span className="text-xs font-bold underline cursor-pointer">Fazer Upgrade</span>}
          </div>
      )}

      {/* Filters */}
      <Card className="p-4 flex flex-col md:flex-row gap-4 bg-white border-gray-200">
          <div className="flex-1 relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input 
                type="text" 
                placeholder="Buscar por nome..." 
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 text-sm text-gray-900 bg-white"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
             />
          </div>
          <div className="w-full md:w-64">
             <select 
                className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-gray-900 text-sm bg-white text-gray-900"
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
             >
                 <option value="all">Todas as Categorias</option>
                 {categories.map(c => (
                     <option key={c.id} value={c.id}>{c.name}</option>
                 ))}
             </select>
          </div>
      </Card>

      {/* List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          {/* Desktop Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <div className="col-span-4">Produto</div>
              <div className="col-span-2">Categoria</div>
              <div className="col-span-2">Preço</div>
              <div className="col-span-2">Estoque</div>
              <div className="col-span-2 text-right">Ações</div>
          </div>

          <div className="divide-y divide-gray-100">
              {filteredProducts.length === 0 ? (
                  <div className="p-10 text-center text-gray-400 flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                          <Search size={24} />
                      </div>
                      <p>Nenhum produto encontrado.</p>
                  </div>
              ) : (
                  filteredProducts.map(product => {
                      // Low Stock Logic
                      const currentStock = product.stockQuantity || 0;
                      const minLevel = product.minStockLevel || 5;
                      const isLowStock = currentStock <= minLevel;

                      return (
                      <div key={product.id} className="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50 transition-colors group">
                          {/* Product Info */}
                          <div className="col-span-1 md:col-span-4 flex items-center gap-4">
                              <div className="w-12 h-12 md:w-14 md:h-14 rounded-lg bg-gray-100 border border-gray-200 flex-shrink-0 overflow-hidden">
                                  {product.imageUrl ? (
                                      <img src={product.imageUrl} className="w-full h-full object-cover" />
                                  ) : (
                                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                                          <ImageIcon size={20} />
                                      </div>
                                  )}
                              </div>
                              <div className="min-w-0">
                                  <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                                  <div className="flex items-center gap-2 mt-1 md:hidden">
                                     <span className="text-xs text-gray-500">R$ {product.price.toFixed(2)}</span>
                                     {isLowStock && (
                                         <span className="text-[10px] bg-red-100 text-red-700 px-1.5 py-0.5 rounded flex items-center gap-1">
                                             <AlertTriangle size={10} /> Baixo
                                         </span>
                                     )}
                                  </div>
                                  {product.brandId && (
                                      <span className="hidden md:inline-block text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full mt-1">
                                          {brands.find(b => b.id === product.brandId)?.name}
                                      </span>
                                  )}
                              </div>
                          </div>

                          {/* Category */}
                          <div className="hidden md:block col-span-2">
                               <Badge variant="neutral">
                                   {categories.find(c => c.id === product.categoryId)?.name || 'Geral'}
                               </Badge>
                          </div>

                          {/* Price */}
                          <div className="hidden md:block col-span-2 font-medium text-gray-900">
                              R$ {product.price.toFixed(2)}
                          </div>

                          {/* Stock Status */}
                          <div className="col-span-1 md:col-span-2">
                               <div className="flex items-center gap-2">
                                   <span className="text-sm font-medium text-gray-700">{currentStock} un.</span>
                                   {isLowStock && (
                                       <div title={`Estoque abaixo do mínimo (${minLevel})`} className="flex items-center justify-center w-6 h-6 bg-red-100 text-red-600 rounded-full animate-pulse">
                                           <AlertTriangle size={14} />
                                       </div>
                                   )}
                               </div>
                          </div>

                          {/* Actions */}
                          <div className="col-span-1 md:col-span-2 flex justify-between md:justify-end items-center gap-2">
                              {/* Mobile Status Toggle shown inline */}
                              <div className="md:hidden">
                                  <button 
                                    onClick={() => toggleStatus(product)}
                                    className={`px-2 py-1 rounded text-xs border ${product.active ? 'bg-green-50 border-green-200' : 'bg-gray-50'}`}
                                  >
                                      {product.active ? 'Ativo' : 'Inativo'}
                                  </button>
                              </div>

                              <div className="flex gap-2">
                                  <button 
                                    onClick={() => handleOpenDrawer(product)}
                                    className="p-2 hover:bg-white border border-transparent hover:border-gray-200 rounded-lg text-gray-500 hover:text-[var(--primary-color)] transition-colors"
                                    title="Editar"
                                  >
                                      <Edit2 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => handleDelete(product.id)}
                                    className="p-2 hover:bg-red-50 hover:border-red-100 border border-transparent rounded-lg text-gray-500 hover:text-red-600 transition-colors"
                                    title="Excluir"
                                  >
                                      <Trash2 size={16} />
                                  </button>
                              </div>
                          </div>
                      </div>
                  )})
              )}
          </div>
      </div>

      {/* EDIT DRAWER */}
      <Drawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        title={editingProduct?.id ? 'Editar Produto' : 'Novo Produto'}
      >
         <div className="space-y-6">
             <ImageUploader 
                label="Imagem do Produto"
                value={editingProduct?.imageUrl || ''}
                onChange={url => setEditingProduct(prev => ({ ...prev!, imageUrl: url }))}
             />
             
             <Input 
                label="Nome do Produto"
                value={editingProduct?.name || ''}
                onChange={e => setEditingProduct(prev => ({ ...prev!, name: e.target.value }))}
                placeholder="Ex: Camiseta Básica"
             />

             <div className="flex gap-4">
                 <div className="flex-1">
                     <Input 
                        label="Preço (R$)"
                        type="number"
                        value={editingProduct?.price || ''}
                        onChange={e => setEditingProduct(prev => ({ ...prev!, price: parseFloat(e.target.value) }))}
                        placeholder="0.00"
                     />
                 </div>
                 <div className="flex-1">
                     <Input 
                        label="Preço Promo (Opcional)"
                        type="number"
                        value={editingProduct?.promoPrice || ''}
                        onChange={e => setEditingProduct(prev => ({ ...prev!, promoPrice: parseFloat(e.target.value) }))}
                        placeholder="0.00"
                     />
                 </div>
             </div>

             <div className="p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4">
                 <div className="flex items-center gap-2 mb-2 text-gray-700 font-bold text-sm">
                     <AlertCircle size={16} />
                     Controle de Estoque
                 </div>
                 <div className="flex gap-4">
                    <div className="flex-1">
                        <Input 
                            label="Estoque Atual"
                            type="number"
                            value={editingProduct?.stockQuantity || 0}
                            onChange={e => setEditingProduct(prev => ({ ...prev!, stockQuantity: parseInt(e.target.value) }))}
                        />
                    </div>
                    <div className="flex-1">
                        <Input 
                            label="Alerta de Baixo Estoque"
                            type="number"
                            value={editingProduct?.minStockLevel || 5}
                            onChange={e => setEditingProduct(prev => ({ ...prev!, minStockLevel: parseInt(e.target.value) }))}
                        />
                    </div>
                 </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                 <Select 
                    label="Categoria"
                    options={categories.map(c => ({ label: c.name, value: c.id }))}
                    value={editingProduct?.categoryId}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, categoryId: e.target.value }))}
                 />
                 <Select 
                    label="Marca (Opcional)"
                    options={[{ label: 'Nenhuma', value: '' }, ...brands.map(b => ({ label: b.name, value: b.id }))]}
                    value={editingProduct?.brandId || ''}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, brandId: e.target.value }))}
                 />
             </div>

             <Textarea 
                label="Descrição Completa"
                rows={4}
                value={editingProduct?.description || ''}
                onChange={e => setEditingProduct(prev => ({ ...prev!, description: e.target.value }))}
                placeholder="Detalhes sobre material, tamanho, etc..."
             />

             <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-gray-100">
                 <input 
                    type="checkbox"
                    id="active-toggle"
                    checked={editingProduct?.active || false}
                    onChange={e => setEditingProduct(prev => ({ ...prev!, active: e.target.checked }))}
                    className="w-5 h-5 rounded border-gray-300 text-[var(--primary-color)] focus:ring-[var(--primary-color)]"
                 />
                 <label htmlFor="active-toggle" className="text-sm font-medium text-gray-900 cursor-pointer">
                     Produto Visível na Loja?
                 </label>
             </div>

             <div className="pt-4 flex gap-3">
                 <Button variant="secondary" className="flex-1" onClick={() => setIsDrawerOpen(false)}>
                     Cancelar
                 </Button>
                 <Button className="flex-1" onClick={handleSave} isLoading={isSaving}>
                     Salvar Produto
                 </Button>
             </div>
         </div>
      </Drawer>
    </div>
  );
};

export default Products;
