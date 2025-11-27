
import React, { useState } from 'react';
import { Card, Button, Input, Drawer, showToast, ImageUploader } from '../../components/ui/Components';
import { useAdmin } from '../../hooks/useAdmin';
import { Brand } from '../../types';
import { Plus, Edit2, Trash2 } from 'lucide-react';

const Brands: React.FC = () => {
  const { brands, saveBrand, deleteBrand } = useAdmin();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Partial<Brand>>({});
  const [isSaving, setIsSaving] = useState(false);

  const handleOpenDrawer = (brand?: Brand) => {
      setEditingBrand(brand ? { ...brand } : { name: '', imageUrl: '', active: true });
      setIsDrawerOpen(true);
  };

  const handleSave = async () => {
      if (!editingBrand.name) return showToast('Nome é obrigatório', 'error');
      setIsSaving(true);
      const { error } = await saveBrand(editingBrand);
      setIsSaving(false);
      if (!error) {
          showToast('Marca salva!');
          setIsDrawerOpen(false);
      } else {
          showToast('Erro ao salvar', 'error');
      }
  };

  const handleDelete = async (id: string) => {
      if (confirm('Excluir esta marca?')) {
          await deleteBrand(id);
          showToast('Marca removida');
      }
  };

  return (
    <div className="space-y-6 animate-fade-in">
        <div className="flex justify-between items-center">
            <div>
                <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Marcas</h1>
                <p className="text-gray-500 text-sm">Gerencie as marcas dos produtos.</p>
            </div>
            <Button onClick={() => handleOpenDrawer()}>
                <Plus size={18} className="mr-2" /> Nova Marca
            </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {brands.map(brand => (
                <Card key={brand.id} className="p-4 flex flex-col items-center gap-3 hover:shadow-md transition-shadow relative group text-center">
                    <div className="w-16 h-16 rounded-full bg-gray-50 border border-gray-200 overflow-hidden flex-shrink-0 flex items-center justify-center">
                        {brand.imageUrl ? (
                            <img src={brand.imageUrl} className="w-full h-full object-contain p-1" />
                        ) : (
                            <span className="text-xl font-bold text-gray-300">{brand.name.charAt(0)}</span>
                        )}
                    </div>
                    <h3 className="font-bold text-gray-900 text-sm">{brand.name}</h3>
                    
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                         <button onClick={() => handleOpenDrawer(brand)} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-500">
                             <Edit2 size={14} />
                         </button>
                         <button onClick={() => handleDelete(brand.id)} className="p-1.5 hover:bg-red-50 rounded-lg text-red-500">
                             <Trash2 size={14} />
                         </button>
                    </div>
                </Card>
            ))}
            {brands.length === 0 && <p className="text-gray-500 text-sm col-span-full text-center py-10">Nenhuma marca cadastrada.</p>}
        </div>

        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} title={editingBrand.id ? 'Editar Marca' : 'Nova Marca'}>
            <div className="space-y-5">
                <ImageUploader 
                    label="Logotipo da Marca"
                    value={editingBrand.imageUrl || ''}
                    onChange={url => setEditingBrand({...editingBrand, imageUrl: url})}
                />
                <Input 
                    label="Nome da Marca" 
                    value={editingBrand.name || ''}
                    onChange={e => setEditingBrand({...editingBrand, name: e.target.value})}
                />
                <div className="flex items-center gap-2">
                    <input 
                        type="checkbox" 
                        checked={editingBrand.active ?? true}
                        onChange={e => setEditingBrand({...editingBrand, active: e.target.checked})}
                    />
                    <span className="text-sm">Ativa</span>
                </div>
                <Button size="full" onClick={handleSave} isLoading={isSaving}>Salvar</Button>
            </div>
        </Drawer>
    </div>
  );
};

export default Brands;
