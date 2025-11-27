
import React, { useState } from 'react';
import { Card, Button, Input, Drawer, showToast, ImageUploader } from '../../components/ui/Components';
import { useAdmin } from '../../hooks/useAdmin';
import { Category } from '../../types';
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';

const Categories: React.FC = () => {
  const { categories, saveCategory, deleteCategory } = useAdmin();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Partial<Category>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenDrawer = (category?: Category) => {
      setEditingCategory(category ? { ...category } : { name: '', imageUrl: '', active: true });
      setIsDrawerOpen(true);
  };

  const handleSave = async () => {
      if (!editingCategory.name) return showToast('Nome é obrigatório', 'error');
      setIsSaving(true);
      const { error } = await saveCategory(editingCategory);
      setIsSaving(false);
      if (!error) {
          showToast('Categoria salva!');
          setIsDrawerOpen(false);
      } else {
          showToast('Erro ao salvar', 'error');
      }
  };

  const handleDelete = async (id: string) => {
      if (confirm('Excluir esta categoria?')) {
          await deleteCategory(id);
          showToast('Categoria removida');
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Categorias</h1>
                <p className="text-gray-500 text-sm">Organize seus produtos em seções.</p>
            </div>
            <Button onClick={() => handleOpenDrawer()}>
                <Plus size={18} className="mr-2" /> Nova Categoria
            </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map(cat => (
                <Card key={cat.id} className="p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-lg bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0">
                            {cat.imageUrl && <img src={cat.imageUrl} className="w-full h-full object-cover" />}
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">{cat.name}</h3>
                            <p className="text-xs text-gray-500">{cat.slug}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                         <button onClick={() => handleOpenDrawer(cat)} className="p-2 hover:bg-gray-100 rounded-lg text-gray-500">
                             <Edit2 size={16} />
                         </button>
                         <button onClick={() => handleDelete(cat.id)} className="p-2 hover:bg-red-50 rounded-lg text-red-500">
                             <Trash2 size={16} />
                         </button>
                    </div>
                </Card>
            ))}
            {categories.length === 0 && <p className="text-gray-500 text-sm col-span-3 text-center py-10">Nenhuma categoria cadastrada.</p>}
        </div>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={editingCategory.id ? 'Editar Categoria' : 'Nova Categoria'}>
            <div className="space-y-5">
                <ImageUploader 
                    label="Imagem da Categoria (Opcional)"
                    value={editingCategory.imageUrl || ''}
                    onChange={url => setEditingCategory({...editingCategory, imageUrl: url})}
                />
                <Input 
                    label="Nome" 
                    value={editingCategory.name || ''}
                    onChange={e => setEditingCategory({...editingCategory, name: e.target.value})}
                />
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        checked={editingCategory.active ?? true}
                        onChange={e => setEditingCategory({...editingCategory, active: e.target.checked})}
                    />
                    <span className="text-sm">Ativo</span>
                </div>
                <Button size="full" onClick={handleSave} isLoading={isSaving}>Salvar</Button>
            </div>
        </Drawer>
    </div>
  );
};

export default Categories;
