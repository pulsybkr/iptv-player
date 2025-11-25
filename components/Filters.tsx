import React from 'react';
import { ICategory, ICountry, ILanguage, Filters as FilterState } from '../types';
import { Filter, X } from 'lucide-react';

interface FiltersProps {
  categories: ICategory[];
  countries: ICountry[];
  languages: ILanguage[];
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  isOpen: boolean;
  onClose: () => void;
}

const FilterSidebar: React.FC<FiltersProps> = ({ 
    categories, 
    countries, 
    languages, 
    filters, 
    setFilters,
    isOpen,
    onClose
}) => {
    
    const updateFilter = (key: keyof FilterState, value: string | null) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    return (
        <div className={`
            fixed inset-y-0 left-0 z-40 w-72 bg-dark-900 border-r border-dark-700 transform transition-transform duration-300 ease-in-out flex flex-col
            ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            lg:relative lg:translate-x-0
        `}>
            <div className="p-5 border-b border-dark-700 flex justify-between items-center">
                <div className="flex items-center space-x-2 text-brand-500">
                    <Filter className="w-5 h-5" />
                    <h2 className="font-bold text-lg text-white">Filtres</h2>
                </div>
                <button onClick={onClose} className="lg:hidden text-slate-400 hover:text-white">
                    <X className="w-6 h-6" />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-6">
                {/* Search */}
                <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                        Recherche
                    </label>
                    <input 
                        type="text" 
                        placeholder="Nom de la chaîne..."
                        className="w-full bg-dark-800 border border-dark-700 rounded-md px-3 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={filters.search}
                        onChange={(e) => updateFilter('search', e.target.value)}
                    />
                </div>

                {/* Categories */}
                <div>
                    <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Catégorie
                        </label>
                        {filters.category && (
                            <button onClick={() => updateFilter('category', null)} className="text-xs text-brand-500 hover:text-brand-400">
                                Effacer
                            </button>
                        )}
                    </div>
                    <select 
                        className="w-full bg-dark-800 border border-dark-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={filters.category || ''}
                        onChange={(e) => updateFilter('category', e.target.value || null)}
                    >
                        <option value="">Toutes les catégories</option>
                        {categories.map(cat => (
                            <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                    </select>
                </div>

                {/* Countries */}
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Pays
                        </label>
                        {filters.country && (
                            <button onClick={() => updateFilter('country', null)} className="text-xs text-brand-500 hover:text-brand-400">
                                Effacer
                            </button>
                        )}
                    </div>
                    <select 
                        className="w-full bg-dark-800 border border-dark-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={filters.country || ''}
                        onChange={(e) => updateFilter('country', e.target.value || null)}
                    >
                        <option value="">Tous les pays</option>
                        {countries.sort((a,b) => a.name.localeCompare(b.name)).map(c => (
                            <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                    </select>
                </div>

                {/* Languages */}
                <div>
                     <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                            Langue
                        </label>
                        {filters.language && (
                            <button onClick={() => updateFilter('language', null)} className="text-xs text-brand-500 hover:text-brand-400">
                                Effacer
                            </button>
                        )}
                    </div>
                    <select 
                        className="w-full bg-dark-800 border border-dark-700 rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                        value={filters.language || ''}
                        onChange={(e) => updateFilter('language', e.target.value || null)}
                    >
                        <option value="">Toutes les langues</option>
                        {languages.sort((a,b) => a.name.localeCompare(b.name)).map(l => (
                            <option key={l.code} value={l.code}>{l.name}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="p-4 border-t border-dark-700 text-xs text-slate-500 text-center">
                Données fournies par <a href="https://github.com/iptv-org/iptv" className="text-brand-500 hover:underline" target="_blank" rel="noopener noreferrer">iptv-org</a>
            </div>
        </div>
    );
};

export default FilterSidebar;