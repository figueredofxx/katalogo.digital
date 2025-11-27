
import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Link as LinkIcon, AlertTriangle } from 'lucide-react';

// --- BUTTON ---
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'icon' | 'full';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', className = '', isLoading, disabled, ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center rounded-lg font-medium transition-all active:scale-95 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed shadow-sm";
  
  const variants = {
    primary: "bg-[var(--primary-color)] text-white hover:opacity-90 border border-transparent",
    secondary: "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50 hover:text-gray-900",
    outline: "bg-transparent border border-gray-200 text-gray-700 hover:bg-gray-50 hover:text-gray-900",
    ghost: "bg-transparent border-transparent text-gray-600 hover:bg-gray-100 shadow-none",
    danger: "bg-red-50 text-red-600 border border-red-100 hover:bg-red-100",
  };

  const sizes = {
    xs: "h-7 px-2 text-xs",
    sm: "h-8 px-3 text-xs",
    md: "h-9 px-4 text-sm",
    lg: "h-10 px-5 text-sm",
    icon: "h-9 w-9 p-0",
    full: "h-10 w-full text-sm",
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-3.5 w-3.5 text-current" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : null}
      {children}
    </button>
  );
};

// --- INPUT ---
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({ label, error, icon, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{label}</label>}
      <div className="relative group">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-gray-600 transition-colors">
            {icon}
          </div>
        )}
        <input
          className={`w-full ${icon ? 'pl-9 pr-3' : 'px-3'} h-9 bg-white text-gray-900 border rounded-lg text-sm transition-all shadow-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 ${
            error ? 'border-red-300 focus:border-red-500 focus:ring-red-100' : 'border-gray-200 hover:border-gray-300'
          } ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-500 ml-0.5 font-medium">{error}</p>}
    </div>
  );
};

// --- SELECT ---
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { label: string; value: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, error, options, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{label}</label>}
      <div className="relative">
        <select
          className={`w-full px-3 h-9 bg-white text-gray-900 border rounded-lg text-sm appearance-none shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 transition-all cursor-pointer ${
            error ? 'border-red-300' : 'border-gray-200 hover:border-gray-300'
          } ${className}`}
          {...props}
        >
          {options.map(opt => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none">
          <svg className="w-3.5 h-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
        </div>
      </div>
      {error && <p className="mt-1 text-xs text-red-500 ml-0.5">{error}</p>}
    </div>
  );
};

// --- TEXTAREA ---
interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, error, className = '', ...props }) => {
  return (
    <div className="w-full flex flex-col">
      {label && <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{label}</label>}
      <textarea
        className={`w-full px-3 py-2 bg-white text-gray-900 border rounded-lg text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-900 resize-none hover:border-gray-300 ${
          error ? 'border-red-300 focus:border-red-500' : 'border-gray-200'
        } ${className}`}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-500 ml-0.5">{error}</p>}
    </div>
  );
};

// --- IMAGE UPLOADER ---
interface ImageUploaderProps {
    label?: string;
    value: string;
    onChange: (url: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ label, value, onChange }) => {
    const [mode, setMode] = useState<'upload' | 'url'>('upload');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                // Simulating upload by converting to base64
                onChange(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="w-full">
            {label && <label className="block text-xs font-medium text-gray-700 mb-1.5 ml-0.5">{label}</label>}
            
            <div className="border border-gray-200 rounded-xl overflow-hidden bg-white">
                {/* Tabs */}
                <div className="flex border-b border-gray-100">
                    <button 
                        className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-2 ${mode === 'upload' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setMode('upload')}
                    >
                        <Upload size={14} /> Upload
                    </button>
                    <button 
                        className={`flex-1 py-2 text-xs font-medium flex items-center justify-center gap-2 ${mode === 'url' ? 'bg-gray-50 text-gray-900' : 'text-gray-500 hover:bg-gray-50'}`}
                        onClick={() => setMode('url')}
                    >
                        <LinkIcon size={14} /> URL
                    </button>
                </div>

                <div className="p-4">
                    {value ? (
                        <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden group border border-gray-100">
                            <img src={value} className="w-full h-full object-cover" alt="Preview" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <Button variant="danger" size="sm" onClick={() => onChange('')}>
                                    <X size={14} className="mr-1" /> Remover
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <>
                            {mode === 'upload' ? (
                                <div 
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-200 rounded-lg h-32 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 hover:border-gray-300 transition-all"
                                >
                                    <ImageIcon className="text-gray-300 mb-2" size={24} />
                                    <p className="text-xs text-gray-500">Clique para selecionar</p>
                                    <input 
                                        type="file" 
                                        ref={fileInputRef} 
                                        onChange={handleFileChange} 
                                        accept="image/*" 
                                        className="hidden" 
                                    />
                                </div>
                            ) : (
                                <div className="space-y-2">
                                    <input 
                                        type="text" 
                                        placeholder="https://exemplo.com/imagem.jpg"
                                        className="w-full px-3 h-9 bg-white text-gray-900 border border-gray-200 rounded-lg text-sm focus:outline-none focus:border-gray-900"
                                        onChange={(e) => onChange(e.target.value)}
                                    />
                                    <p className="text-[10px] text-gray-400">Cole o link direto da imagem.</p>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

// --- CARD ---
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-xl border border-gray-200 shadow-sm ${className}`} {...props}>
    {children}
  </div>
);

// --- BADGE ---
interface BadgeProps {
  children: React.ReactNode;
  variant?: 'neutral' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'neutral', className = '' }) => {
   const styles = {
       neutral: "bg-gray-100 text-gray-700 border border-gray-200",
       success: "bg-green-50 text-green-700 border border-green-200",
       warning: "bg-amber-50 text-amber-700 border border-amber-200",
       danger: "bg-red-50 text-red-700 border border-red-200",
       info: "bg-blue-50 text-blue-700 border border-blue-200"
   };
   return (
       <span className={`px-2 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${styles[variant]} ${className}`}>
           {children}
       </span>
   );
};

// --- DRAWER (Mobile Sheet) ---
interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Drawer: React.FC<DrawerProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex justify-end isolate">
      <div 
        className="absolute inset-0 bg-gray-900/20 backdrop-blur-[2px] transition-opacity"
        onClick={onClose}
      />
      <div className="relative w-full md:max-w-md h-full bg-white shadow-2xl animate-slide-in-right flex flex-col border-l border-gray-100">
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-900 transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-5">
          {children}
        </div>
      </div>
    </div>
  );
};

// --- QUANTITY SELECTOR ---
export const QuantitySelector: React.FC<{ quantity: number; onIncrease: () => void; onDecrease: () => void }> = ({ quantity, onIncrease, onDecrease }) => {
  return (
    <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-0.5 shadow-sm">
      <button onClick={onDecrease} className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-gray-50 text-gray-600 font-bold disabled:opacity-30 transition-colors" disabled={quantity <= 0}>-</button>
      <span className="text-sm font-semibold w-8 text-center tabular-nums text-gray-900">{quantity}</span>
      <button onClick={onIncrease} className="w-7 h-7 flex items-center justify-center rounded-md bg-gray-900 text-white font-bold hover:bg-gray-800 transition-colors">+</button>
    </div>
  )
}

// --- LOGO ---
export const Logo: React.FC<{ className?: string }> = ({ className }) => (
    <svg 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
    </svg>
);

// --- SUPABASE WARNING ---
export const SupabaseWarning: React.FC = () => {
    const isPlaceholder = !process.env.REACT_APP_SUPABASE_URL || process.env.REACT_APP_SUPABASE_URL.includes('placeholder');
    if (!isPlaceholder) return null;

    return (
        <div className="fixed top-0 left-0 right-0 z-[1000] bg-yellow-500 text-white text-[10px] font-bold py-1 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2">
                <AlertTriangle size={12} />
                <span>Modo Demonstração: Configure o Supabase no .env para persistir dados.</span>
            </div>
        </div>
    );
};

// --- TOAST ---
export const ToastContainer = () => <div id="toast-container" className="fixed top-6 right-6 z-[200] flex flex-col gap-2 pointer-events-none w-full max-w-xs" />;

export const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  const bgColors = {
      success: 'bg-white border-green-100 text-gray-900',
      error: 'bg-white border-red-100 text-gray-900',
      info: 'bg-white border-blue-100 text-gray-900'
  };
  
  const icons = {
    success: '<div class="text-green-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg></div>',
    error: '<div class="text-red-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></div>',
    info: '<div class="text-blue-500"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg></div>'
  }

  toast.className = `pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-lg border shadow-lg shadow-gray-100/50 text-sm font-medium transform transition-all duration-300 translate-x-8 opacity-0 ${bgColors[type]}`;
  
  toast.innerHTML = `${icons[type]}<span>${message}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => {
    toast.classList.remove('translate-x-8', 'opacity-0');
  });

  setTimeout(() => {
    toast.classList.add('opacity-0', 'translate-x-8');
    setTimeout(() => toast.remove(), 300);
  }, 3500);
};
    