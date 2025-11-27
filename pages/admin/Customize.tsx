
import React, { useState, useEffect } from 'react';
import { Card, Input, Button, showToast, Textarea, Badge } from '../../components/ui/Components';
import { Upload, MapPin, Instagram, Phone, Clock, Type, Copy, ExternalLink, MessageCircle, Image, Globe, Check } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';

const PRESET_COLORS = [
    '#4B0082', // Indigo Profundo (Padrão)
    '#000000', // Black
    '#2563eb', // Blue 
    '#db2777', // Pink
    '#dc2626', // Red
    '#ea580c', // Orange
    '#16a34a', // Green
    '#0d9488', // Teal
];

const Customize: React.FC = () => {
  const { tenant, refreshTenant } = useAuth();
  const { updateTenantSettings } = useAdmin();
  const [loading, setLoading] = useState(false);

  // Local State initialized with Tenant Data
  const [storeName, setStoreName] = useState('');
  const [slug, setSlug] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [primaryColor, setPrimaryColor] = useState('#4B0082');
  const [description, setDescription] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [instagram, setInstagram] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('');

  // Sync state when tenant loads
  useEffect(() => {
    if (tenant) {
        setStoreName(tenant.name || '');
        setSlug(tenant.slug || '');
        setCustomDomain(tenant.customDomain || '');
        setPrimaryColor(tenant.primaryColor || '#4B0082');
        setDescription(tenant.description || '');
        setBannerUrl(tenant.bannerUrl || '');
        setWhatsapp(tenant.whatsappNumber || '');
        setInstagram(tenant.instagram || '');
        setAddress(tenant.address || '');
        setOpeningHours(tenant.openingHours || '');
    }
  }, [tenant]);

  const baseUrl = 'katalogo.digital';
  const fullUrl = `https://${slug}.${baseUrl}`;

  const handleSave = async () => {
    setLoading(true);
    try {
        const { error } = await updateTenantSettings({
            name: storeName,
            slug,
            primaryColor,
            description,
            bannerUrl,
            whatsappNumber: whatsapp,
            instagram,
            address,
            openingHours,
            customDomain
        });

        if (error) throw error;
        
        await refreshTenant();
        showToast('Loja atualizada com sucesso!', 'success');
        
        // Update CSS Variable for preview
        document.documentElement.style.setProperty('--primary-color', primaryColor);
    } catch (e) {
        showToast('Erro ao salvar alterações.', 'error');
    } finally {
        setLoading(false);
    }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(fullUrl);
      showToast('Link copiado!');
  };

  const shareOnWhatsapp = () => {
      const text = `Olá! Conheça a nossa loja virtual: ${fullUrl}`;
      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  if (!tenant) return <div>Carregando...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Personalizar Loja</h1>
            <p className="text-gray-500 text-sm">Gerencie o endereço da sua loja e aparência pública.</p>
        </div>
        <Button onClick={handleSave} isLoading={loading}>Salvar Alterações</Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
        
        {/* --- COLUNA 1 & 2: CONTEÚDO --- */}
        <div className="xl:col-span-2 space-y-8">
            
            {/* 1. ENDEREÇO DA LOJA (URL) */}
            <section>
                <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                    <Globe size={16} />
                    <h3>Endereço e Compartilhamento</h3>
                </div>
                <Card className="p-6 bg-white border-gray-200 space-y-6">
                    {/* URL Gratuita */}
                    <div className="space-y-2">
                        <label className="block text-sm font-medium text-gray-700">Link da Loja (Grátis)</label>
                        <div className="flex flex-col md:flex-row gap-3">
                            <div className="flex-1 flex items-center border border-gray-200 rounded-xl bg-gray-50 overflow-hidden focus-within:ring-1 focus-within:ring-gray-900 focus-within:border-gray-900 transition-all">
                                <span className="pl-4 pr-1 text-gray-500 text-sm font-medium bg-gray-50">https://</span>
                                <input 
                                    type="text" 
                                    value={slug}
                                    onChange={e => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                    className="flex-1 py-3 bg-transparent border-none focus:ring-0 text-gray-900 font-semibold text-sm placeholder:text-gray-400"
                                    placeholder="sua-loja"
                                />
                                <span className="pr-4 pl-1 text-gray-500 text-sm font-medium bg-gray-50">.{baseUrl}</span>
                            </div>
                            <div className="flex gap-2">
                                <Button variant="secondary" onClick={copyToClipboard} title="Copiar Link">
                                    <Copy size={18} />
                                </Button>
                                <Button variant="secondary" onClick={() => window.open(fullUrl, '_blank')} title="Abrir Loja">
                                    <ExternalLink size={18} />
                                </Button>
                                <Button className="bg-[#25D366] hover:bg-[#20bd5a] text-white border-none" onClick={shareOnWhatsapp}>
                                    <MessageCircle size={18} className="mr-2" />
                                    Enviar
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Domínio Personalizado */}
                    <div className="pt-4 border-t border-gray-100">
                        <div className="flex justify-between items-center mb-2">
                            <label className="block text-sm font-medium text-gray-700">Domínio Personalizado (www)</label>
                            {tenant.plan === 'basic' && <Badge variant="warning">Recurso PRO</Badge>}
                        </div>
                        <div className="relative">
                            <Input 
                                placeholder="www.suamarca.com.br"
                                value={customDomain}
                                onChange={e => setCustomDomain(e.target.value)}
                                disabled={tenant.plan === 'basic'}
                                icon={<Globe size={16} className="text-gray-400"/>}
                            />
                        </div>
                    </div>
                </Card>
            </section>

            {/* 2. IDENTIDADE VISUAL */}
            <section>
                <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                    <Type size={16} />
                    <h3>Identidade da Marca</h3>
                </div>
                
                <Card className="p-6 space-y-6">
                    <div className="flex flex-col md:flex-row gap-6">
                         <div className="flex items-center gap-6">
                            <div className="w-24 h-24 rounded-full border border-gray-200 p-1 flex-shrink-0 relative group">
                                <img src={tenant.logoUrl || 'https://via.placeholder.com/100'} className="w-full h-full rounded-full object-cover bg-gray-50" />
                                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                    <Upload className="text-white" size={20}/>
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 space-y-4">
                            <Input 
                                label="Nome da Loja" 
                                value={storeName} 
                                onChange={e => setStoreName(e.target.value)}
                                placeholder="Ex: Minha Loja Incrível"
                            />
                             <Input 
                                label="URL do Banner (Capa)" 
                                value={bannerUrl} 
                                onChange={e => setBannerUrl(e.target.value)}
                                placeholder="https://..."
                                icon={<Image size={16} className="text-gray-400" />}
                            />
                        </div>
                    </div>

                    <Textarea
                        label="Biografia / Descrição Curta"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        placeholder="Descreva o que sua loja vende..."
                        rows={3}
                    />

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-3">Cor Principal</label>
                        <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 space-y-4">
                            {/* Presets */}
                            <div className="flex flex-wrap gap-3">
                                {PRESET_COLORS.map(color => (
                                    <button
                                        key={color}
                                        onClick={() => setPrimaryColor(color)}
                                        className={`w-9 h-9 rounded-full shadow-sm transition-transform hover:scale-110 flex items-center justify-center ${
                                            primaryColor.toLowerCase() === color.toLowerCase() 
                                            ? 'ring-2 ring-offset-2 ring-gray-900' 
                                            : 'ring-1 ring-black/5'
                                        }`}
                                        style={{ backgroundColor: color }}
                                    >
                                        {primaryColor.toLowerCase() === color.toLowerCase() && (
                                            <Check size={14} className="text-white drop-shadow-md" strokeWidth={3} />
                                        )}
                                    </button>
                                ))}
                            </div>

                            {/* Custom Picker Divider */}
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-start">
                                    <span className="pr-2 bg-gray-50 text-xs text-gray-400">Ou escolha uma cor personalizada</span>
                                </div>
                            </div>

                            {/* Custom Input */}
                            <div className="flex items-center gap-3">
                                <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-gray-200 shadow-sm group cursor-pointer hover:border-gray-300">
                                    <input 
                                        type="color" 
                                        value={primaryColor}
                                        onChange={e => setPrimaryColor(e.target.value)}
                                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[200%] h-[200%] p-0 cursor-pointer border-none"
                                    />
                                </div>
                                <div className="flex flex-col">
                                     <input 
                                        type="text" 
                                        value={primaryColor} 
                                        onChange={e => setPrimaryColor(e.target.value)}
                                        className="text-sm font-mono font-medium text-gray-900 bg-white border border-gray-200 rounded-lg px-3 py-2 w-28 uppercase focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900/10"
                                        maxLength={7}
                                     />
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </section>

            {/* 3. DADOS DE CONTATO */}
            <section>
                <div className="flex items-center gap-2 mb-3 text-gray-900 font-semibold text-sm uppercase tracking-wider">
                    <Phone size={16} />
                    <h3>Contato e Localização</h3>
                </div>
                
                <Card className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <Input 
                            label="WhatsApp de Atendimento" 
                            value={whatsapp} 
                            onChange={e => setWhatsapp(e.target.value)}
                            placeholder="5511999999999"
                            icon={<Phone size={16} className="text-gray-400" />}
                        />

                        <Input 
                            label="Instagram" 
                            value={instagram} 
                            onChange={e => setInstagram(e.target.value)}
                            placeholder="@sualoja"
                            icon={<Instagram size={16} className="text-gray-400" />}
                        />
                    </div>

                    <Input 
                        label="Endereço Visível" 
                        value={address} 
                        onChange={e => setAddress(e.target.value)}
                        placeholder="Rua Exemplo, 123 - Cidade"
                        icon={<MapPin size={16} className="text-gray-400" />}
                    />

                    <Input 
                        label="Horário de Funcionamento" 
                        value={openingHours} 
                        onChange={e => setOpeningHours(e.target.value)}
                        placeholder="Seg - Sex: 09h às 18h"
                        icon={<Clock size={16} className="text-gray-400" />}
                    />
                </Card>
            </section>
        </div>

        {/* --- COLUNA 3: PREVIEW --- */}
        <div className="hidden xl:flex flex-col items-center sticky top-6">
             <div className="flex items-center justify-between w-full max-w-[300px] mb-4">
                 <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Pré-visualização</h3>
                 <span className="text-[10px] bg-gray-200 px-2 py-1 rounded text-gray-600">Mobile</span>
             </div>
            
            <div className="relative border-gray-900 bg-gray-900 border-[10px] rounded-[2.5rem] h-[600px] w-[300px] shadow-2xl ring-1 ring-gray-900/10">
                <div className="rounded-[2rem] overflow-hidden w-full h-full bg-white relative flex flex-col">
                    {/* Fake Header/Banner */}
                    <div className="h-28 w-full relative flex-shrink-0 bg-gray-800">
                        {bannerUrl ? (
                            <img src={bannerUrl} className="w-full h-full object-cover opacity-80" />
                        ) : (
                            <div className="w-full h-full bg-gray-900" style={{ backgroundColor: primaryColor }}></div>
                        )}
                        <div className="absolute top-0 left-0 w-full h-full bg-black/10"></div>
                        <div className="absolute -bottom-8 left-4 w-20 h-20 bg-white rounded-2xl p-1 shadow-md z-10">
                            <img src={tenant.logoUrl || 'https://via.placeholder.com/100'} className="w-full h-full rounded-xl object-cover" />
                        </div>
                    </div>

                    <div className="mt-10 px-4 flex-1 overflow-hidden">
                        <h2 className="font-bold text-gray-900 text-lg leading-tight">{storeName}</h2>
                        <p className="text-[10px] text-gray-500 mt-1 line-clamp-2 leading-relaxed">{description}</p>
                    </div>
                </div>
            </div>
            
            <p className="text-xs text-gray-400 mt-4 text-center max-w-[200px]">Simulação visual.</p>
        </div>
      </div>
    </div>
  );
};

export default Customize;
