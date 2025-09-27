import React, { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { supabase, ClothingItem } from '../lib/supabase';
import ClothingCard from '../components/ClothingCard';
import ItemModal from '../components/ItemModal';

const HomePage: React.FC = () => {
  const [items, setItems] = useState<ClothingItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<ClothingItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    category: '',
    size: '',
    color: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
  });
  const [sortBy, setSortBy] = useState<'newest' | 'price_asc' | 'price_desc'>('newest');
  const [selectedItem, setSelectedItem] = useState<ClothingItem | null>(null);

  const categories = ['Tops', 'Bottoms', 'Dresses', 'Outerwear', 'Shoes', 'Accessories'];
  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const colors = ['Black', 'White', 'Gray', 'Navy', 'Brown', 'Red', 'Blue', 'Green', 'Pink', 'Beige'];
  const conditions = ['New with tags', 'Like new', 'Good', 'Fair'];

  // Initial load happens via filtered fetch below

  // Debounce search to limit requests
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm.trim()), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  // Fetch items with server-side filters and sorting (with timeout)
  useEffect(() => {
    let timedOut = false;
    const timeoutId = setTimeout(() => {
      timedOut = true;
      setError('Request timed out. Please try again.');
      setLoading(false);
    }, 8000);

    const fetchFiltered = async () => {
      setLoading(true);
      setError(null);
      try {
        let query = supabase
          .from('clothing_items')
          .select('*')
          .limit(48);

        // Search across title, description, category
        if (debouncedSearch) {
          const s = debouncedSearch.replace(/'/g, "\\'");
          query = query.or(`title.ilike.%${s}%,description.ilike.%${s}%,category.ilike.%${s}%`);
        }

        if (filters.category) query = query.eq('category', filters.category);
        if (filters.size) query = query.eq('size', filters.size);
        if (filters.condition) query = query.eq('condition', filters.condition);
        if (filters.color) query = query.ilike('color', `%${filters.color}%`);
        if (filters.minPrice) query = query.gte('price', parseFloat(filters.minPrice));
        if (filters.maxPrice) query = query.lte('price', parseFloat(filters.maxPrice));

        if (sortBy === 'newest') query = query.order('created_at', { ascending: false });
        if (sortBy === 'price_asc') query = query.order('price', { ascending: true });
        if (sortBy === 'price_desc') query = query.order('price', { ascending: false });

        const { data, error } = await query;
        if (error) throw error;
        setItems(data || []);
        setFilteredItems(data || []);
      } catch (err) {
        if (!timedOut) {
          console.error('Error filtering items:', err);
          setError('Failed to load items.');
        }
      } finally {
        if (!timedOut) {
          clearTimeout(timeoutId);
          setLoading(false);
        }
      }
    };

    fetchFiltered();
    return () => clearTimeout(timeoutId);
  }, [debouncedSearch, filters, sortBy]);



  const clearFilters = () => {
    setFilters({
      category: '',
      size: '',
      color: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
    });
    setSearchTerm('');
  };

  const hasActiveFilters = Object.values(filters).some(value => value !== '') || searchTerm !== '';

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-fadeIn">
          <div className="h-8 shimmer rounded w-1/4 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className={`shimmer rounded-xl h-80 stagger-${(i % 8) + 1}`}></div>
            ))}
          </div>
          {error && (
            <p className="text-red-600 mt-4">{error}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold gradient-text mb-6 animate-fadeInUp">Browse Items</h1>
        
        {/* Search and Filter Bar */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Input */}
            <div className="relative flex-1 flex items-center">
              <Search className="absolute left-3 text-gray-400 h-4 w-4 pointer-events-none" />
              <input
                type="text"
                placeholder="Search for items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm h-10"
              />
            </div>
            
            {/* Sort and Filter Controls */}
            <div className="flex flex-col sm:flex-row gap-4 lg:gap-3">
              {/* Sort Dropdown */}
              <div className="min-w-[180px]">
                <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'newest' | 'price_asc' | 'price_desc')}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm h-10"
                >
                  <option value="newest">Newest</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                </select>
              </div>
              
              {/* Filter Toggle Button */}
              <div className="flex items-end">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className={`flex items-center px-6 py-2 rounded-lg font-medium transition-all duration-200 whitespace-nowrap h-10 ${
                    showFilters || hasActiveFilters
                      ? 'btn-primary'
                      : 'btn-secondary'
                  }`}
                >
                  <Filter className="h-5 w-5 mr-2" />
                  Filters
                  {hasActiveFilters && (
                    <span className="ml-2 bg-white text-blue-600 rounded-full px-2 py-0.5 text-xs font-bold">
                      {Object.values(filters).filter(v => v !== '').length + (searchTerm ? 1 : 0)}
                    </span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(hasActiveFilters) && (
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium text-gray-700">Active Filters</h4>
              <button
                onClick={clearFilters}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear All
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {filters.category && (
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 hover:bg-blue-200 transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, category: '' }))}
                >
                  Category: {filters.category}
                  <X className="h-3 w-3 ml-1" />
                </button>
              )}
              {filters.size && (
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-emerald-100 text-emerald-800 hover:bg-emerald-200 transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, size: '' }))}
                >
                  Size: {filters.size}
                  <X className="h-3 w-3 ml-1" />
                </button>
              )}
              {filters.condition && (
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800 hover:bg-amber-200 transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, condition: '' }))}
                >
                  Condition: {filters.condition}
                  <X className="h-3 w-3 ml-1" />
                </button>
              )}
              {filters.color && (
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 hover:bg-gray-200 transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, color: '' }))}
                >
                  Color: {filters.color}
                  <X className="h-3 w-3 ml-1" />
                </button>
              )}
              {(filters.minPrice || filters.maxPrice) && (
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 hover:bg-purple-200 transition-colors"
                  onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '' }))}
                >
                  Price: ${filters.minPrice || 0} - ${filters.maxPrice || '∞'}
                  <X className="h-3 w-3 ml-1" />
                </button>
              )}
              {searchTerm && (
                <button 
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800 hover:bg-indigo-200 transition-colors"
                  onClick={() => setSearchTerm('')}
                >
                  Search: "{searchTerm}"
                  <X className="h-3 w-3 ml-1" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Filter Panel */}
        {showFilters && (
          <div className="bg-white rounded-xl shadow-sm p-6 mb-6 animate-slideInRight">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">Filter Options</h3>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="flex items-center text-sm text-blue-600 hover:text-blue-800 font-medium px-3 py-1 rounded-md hover:bg-blue-50 transition-colors"
                >
                  <X className="h-4 w-4 mr-1" />
                  Clear All
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={filters.category}
                  onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              {/* Size Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                <select
                  value={filters.size}
                  onChange={(e) => setFilters(prev => ({ ...prev, size: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">All Sizes</option>
                  {sizes.map(size => (
                    <option key={size} value={size}>{size}</option>
                  ))}
                </select>
              </div>
              
              {/* Color Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                <select
                  value={filters.color}
                  onChange={(e) => setFilters(prev => ({ ...prev, color: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">All Colors</option>
                  {colors.map(color => (
                    <option key={color} value={color}>{color}</option>
                  ))}
                </select>
              </div>
              
              {/* Condition Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition</label>
                <select
                  value={filters.condition}
                  onChange={(e) => setFilters(prev => ({ ...prev, condition: e.target.value }))}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-sm"
                >
                  <option value="">All Conditions</option>
                  {conditions.map(condition => (
                    <option key={condition} value={condition}>{condition}</option>
                  ))}
                </select>
              </div>
              
              {/* Min Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="0"
                    value={filters.minPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, minPrice: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                  />
                </div>
              </div>
              
              {/* Max Price Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 text-sm">$</span>
                  <input
                    type="number"
                    placeholder="1000"
                    value={filters.maxPrice}
                    onChange={(e) => setFilters(prev => ({ ...prev, maxPrice: e.target.value }))}
                    className="w-full border border-gray-300 rounded-md pl-8 pr-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    min="0"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Count */}
        <div className="text-gray-600 mb-6">
          Showing {filteredItems.length} of {items.length} items
        </div>
      </div>

      {/* Items Grid */}
      {filteredItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredItems.map((item, index) => (
            <div key={item.id} className={`animate-fadeInUp stagger-${(index % 8) + 1}`}>
              <ClothingCard
                item={item}
                onClick={() => setSelectedItem(item)}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <Search className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No items found</h3>
          <p className="text-gray-600">
            {hasActiveFilters 
              ? "Try adjusting your filters or search terms"
              : "No items have been posted yet"
            }
          </p>
        </div>
      )}
    </div>
    <ItemModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </>
  );
};

export default HomePage;