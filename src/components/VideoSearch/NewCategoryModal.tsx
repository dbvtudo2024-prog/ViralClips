import React, { useState } from 'react';
import { X, Plus, Hash, Tag, Sparkles } from 'lucide-react';
import { CustomCategory } from '../../types';

interface NewCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (category: CustomCategory) => void;
}

const COLOR_OPTIONS = [
  '#ef4444', // Red
  '#f97316', // Orange
  '#f59e0b', // Amber
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
];

export const NewCategoryModal: React.FC<NewCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const [name, setName] = useState('');
  const [color, setColor] = useState(COLOR_OPTIONS[4]);
  const [keywordsInput, setKeywordsInput] = useState('');
  const [minViewsPerHour, setMinViewsPerHour] = useState(5000);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const keywords = keywordsInput
      .split(',')
      .map((k) => k.trim())
      .filter((k) => k.length > 0);

    const newCat: CustomCategory = {
      id: `cat_${Date.now()}`,
      name: name.trim(),
      color,
      icon: 'Tag',
      videoCount: 0,
      keywords: keywords.length > 0 ? keywords : [name.toLowerCase()],
      minViewsPerHour,
    };

    onAddCategory(newCat);
    setName('');
    setKeywordsInput('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 mb-1">
          <div
            className="w-4 h-4 rounded-full"
            style={{ backgroundColor: color }}
          />
          <h2 className="text-lg font-bold text-white">Criar Nova Categoria</h2>
        </div>
        <p className="text-xs text-zinc-400 mb-5">
          Organize seus vídeos virais e filtre conteúdo por nicho específico.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Nome da Categoria
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: True Crime & Mistérios, Futebol, Saúde..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Cor de Destaque
            </label>
            <div className="flex items-center gap-2.5 flex-wrap">
              {COLOR_OPTIONS.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setColor(c)}
                  className={`w-7 h-7 rounded-full transition-transform ${
                    color === c ? 'scale-125 ring-2 ring-white ring-offset-2 ring-offset-zinc-900' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-zinc-300 mb-1.5">
              Palavras-chave ou Canais (separados por vírgula)
            </label>
            <div className="relative">
              <input
                type="text"
                value={keywordsInput}
                onChange={(e) => setKeywordsInput(e.target.value)}
                placeholder="Ex: caso, polícia, investigação, mistério"
                className="w-full px-3.5 py-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white text-sm focus:outline-none focus:border-rose-500 placeholder:text-zinc-600"
              />
            </div>
            <p className="text-[11px] text-zinc-500 mt-1">
              A IA utilizará esses termos para rastrear vídeos com alta velocidade de visualizações.
            </p>
          </div>

          <div>
            <div className="flex justify-between text-xs font-semibold text-zinc-300 mb-1">
              <span>Gatilho de Velocidade Viral Mínima</span>
              <span className="text-rose-400">{minViewsPerHour.toLocaleString()} views/hora</span>
            </div>
            <input
              type="range"
              min="1000"
              max="50000"
              step="1000"
              value={minViewsPerHour}
              onChange={(e) => setMinViewsPerHour(Number(e.target.value))}
              className="w-full accent-rose-500 cursor-pointer"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-lg shadow-rose-900/30"
            >
              <Plus className="w-4 h-4" />
              Salvar Categoria
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
