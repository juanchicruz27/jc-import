'use client';

import { useState, useRef } from 'react';
import { createProduct } from '@/app/actions';
import { X, Upload, Loader2 } from 'lucide-react';

interface SideDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SideDrawer({ isOpen, onClose }: SideDrawerProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formData = new FormData(e.currentTarget);
      await createProduct(formData);
      
      // Reset form
      e.currentTarget.reset();
      setImagePreview('');
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert('Error al guardar el producto');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      
      {/* Drawer */}
      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[450px] bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-800">Gestionar Catálogo: Nuevo Perfume</h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-600" />
            </button>
          </div>

          {/* Form */}
          <div className="flex-1 overflow-y-auto p-6">
            <form id="add-product-form" onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Nombre</label>
                  <input 
                    name="name"
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Ej. Yara"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Marca</label>
                  <input 
                    name="brand"
                    type="text" 
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="Ej. Lattafa"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Precio (USD)</label>
                  <input 
                    name="priceUSD"
                    type="number" 
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="0.00"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Descuento (%)</label>
                  <input 
                    name="discount"
                    type="number" 
                    className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <h3 className="text-sm font-bold text-gray-700 mb-3">Notas Olfativas</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notas de Salida</label>
                    <input 
                      name="notesTop"
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Ej. Bergamota, Mandarina"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notas de Corazón</label>
                    <input 
                      name="notesHeart"
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Ej. Jazmín, Rosa"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Notas de Fondo</label>
                    <input 
                      name="notesBase"
                      type="text" 
                      className="w-full border border-gray-200 rounded-lg p-2 text-sm focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="Ej. Vainilla, Almizcle"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Color de Fondo (Página Producto)</label>
                <div className="flex items-center gap-3">
                  <input 
                    name="bgColor"
                    type="color" 
                    defaultValue="#ffffff"
                    className="w-12 h-12 rounded cursor-pointer border-none p-0"
                  />
                </div>
              </div>

              <div className="border-t pt-4">
                <label className="block text-sm font-bold text-gray-700 mb-2">Categoría / Género</label>
                <select 
                  name="gender" 
                  className="w-full border border-gray-200 rounded-lg p-3 text-sm focus:ring-2 focus:ring-green-500 outline-none transition-all"
                  defaultValue="Unisex"
                >
                  <option value="Unisex">Unisex</option>
                  <option value="Hombre">Hombre</option>
                  <option value="Mujer">Mujer</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Imagen del Producto</label>
                <div 
                  className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-colors ${imagePreview ? 'border-green-500 bg-green-50' : 'border-gray-200 hover:border-green-400 bg-gray-50'}`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  {imagePreview ? (
                    <div className="relative w-full aspect-square max-h-[200px] rounded-lg overflow-hidden bg-white shadow-sm border">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-contain" />
                    </div>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center mb-3 shadow-sm border">
                        <Upload size={28} className="text-gray-400" />
                      </div>
                      <p className="text-sm font-semibold text-gray-700">Subir imagen</p>
                      <p className="text-xs text-gray-400 mt-1">Formatos aceptados: JPG, PNG</p>
                    </>
                  )}
                  <input 
                    name="imageFile"
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleImageSelect}
                    accept=".jpg,.jpeg,.png"
                    className="hidden"
                  />
                </div>
              </div>

            </form>
          </div>

          {/* Footer */}
          <div className="p-4 border-t bg-gray-50">
            <button
              type="submit"
              form="add-product-form"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors flex items-center justify-center gap-2 ${
                !isSubmitting 
                  ? 'bg-green-600 hover:bg-green-700 shadow-md' 
                  : 'bg-gray-300 cursor-not-allowed'
              }`}
            >
              {isSubmitting && <Loader2 className="animate-spin" size={18} />}
              {isSubmitting ? 'Guardando...' : 'Guardar Perfume'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
