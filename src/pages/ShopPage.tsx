import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Search, SlidersHorizontal, X, ArrowUpDown, Star } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/product/ProductCard';

export const ShopPage: React.FC = () => {
  const { products, categories, pageParams, setCurrentPage, addToCart, settings, isLoadingData } = useStore();

  const [searchQuery, setSearchQuery] = useState<string>(pageParams?.search || '');
  const [selectedCategory, setSelectedCategory] = useState<string>(pageParams?.category || 'All');
  const [selectedSort, setSelectedSort] = useState<string>('featured');
  const [maxPrice, setMaxPrice] = useState<number>(5000);
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  // Filter and sort logic
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Search term match
      const queryMatch =
        !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.notes?.top?.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.notes?.middle?.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase())) ||
        p.notes?.base?.some((n) => n.toLowerCase().includes(searchQuery.toLowerCase()));

      // Category match
      const categoryMatch =
        selectedCategory === 'All' ||
        p.category.toLowerCase() === selectedCategory.toLowerCase() ||
        (selectedCategory === 'New Arrivals' && p.newArrival) ||
        (selectedCategory === 'Best Sellers' && p.bestSeller);

      // Price match
      const actualPrice = p.salePrice || p.price;
      const priceMatch = actualPrice <= maxPrice;

      // Availability match
      const stockMatch = !inStockOnly || p.status === 'available';

      return queryMatch && categoryMatch && priceMatch && stockMatch;
    }).sort((a, b) => {
      const priceA = a.salePrice || a.price;
      const priceB = b.salePrice || b.price;

      if (selectedSort === 'price-low') return priceA - priceB;
      if (selectedSort === 'price-high') return priceB - priceA;
      if (selectedSort === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      if (selectedSort === 'bestselling') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [products, searchQuery, selectedCategory, selectedSort, maxPrice, inStockOnly]);

  return (
    <div className="bg-[#F7F4EB] text-neutral-900 min-h-screen py-8 sm:py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* Page Header */}
      <div className="border-b border-neutral-200 pb-6 mb-8 space-y-2">
        <span className="text-[10px] sm:text-xs text-amber-800 uppercase tracking-[0.25em] font-semibold block">
          {settings.brandName || "NICE Perfumes"} CATALOGUE
        </span>
        <h1 className="font-serif text-2xl sm:text-4xl text-neutral-950 font-bold uppercase tracking-tight">
          All Perfumes &amp; Attars
        </h1>
        <p className="text-xs sm:text-sm text-neutral-600 max-w-xl">
          Hand-compounded Eau de Parfums, pure non-alcoholic itrs, and luxury gift sets crafted for fragrance lovers.
        </p>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 bg-white p-4 rounded-2xl border border-neutral-200 shadow-xs">
        
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search perfumes by name, notes, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral-50 border border-neutral-200 focus:border-neutral-500 text-neutral-900 placeholder-neutral-400 rounded-xl pl-9 pr-8 py-2.5 text-xs focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter & Sort Controls */}
        <div className="flex items-center justify-between md:justify-end gap-3 text-xs">
          
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
            className="md:hidden flex items-center gap-2 px-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-800 font-medium cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-neutral-900" />
            <span>Filters ({filteredProducts.length})</span>
          </button>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:inline" />
            <span className="text-neutral-500 uppercase tracking-wider text-[10px] hidden sm:inline">Sort:</span>
            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-neutral-50 border border-neutral-200 text-neutral-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-neutral-400 uppercase tracking-wider cursor-pointer font-medium"
            >
              <option value="featured">Featured First</option>
              <option value="bestselling">Best Selling</option>
              <option value="newest">Newest Arrivals</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid & Desktop Sidebar Layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        
        {/* Desktop Sidebar Filters */}
        <div className="hidden md:block space-y-6 bg-white p-6 rounded-2xl border border-neutral-200 shadow-xs h-fit sticky top-28">
          
          {/* Categories Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-100 pb-2">
              Categories
            </h3>
            <div className="space-y-1">
              <button
                onClick={() => setSelectedCategory('All')}
                className={`w-full text-left px-3 py-2 rounded-xl text-xs tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                  selectedCategory === 'All'
                    ? 'bg-neutral-900 text-white font-semibold'
                    : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                }`}
              >
                <span>All Fragrances</span>
                <span className={`text-[10px] ${selectedCategory === 'All' ? 'text-neutral-300' : 'text-neutral-400'}`}>({products.length})</span>
              </button>
              {categories.map((cat) => {
                const count = products.filter(
                  (p) => p.category.toLowerCase() === cat.name.toLowerCase()
                ).length;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.name)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs tracking-wider transition-colors flex items-center justify-between cursor-pointer ${
                      selectedCategory.toLowerCase() === cat.name.toLowerCase()
                        ? 'bg-neutral-900 text-white font-semibold'
                        : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className={`text-[10px] ${selectedCategory.toLowerCase() === cat.name.toLowerCase() ? 'text-neutral-300' : 'text-neutral-400'}`}>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Brands Filter */}
          <div className="space-y-3">
            <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900 border-b border-neutral-100 pb-2">
              Featured Brands
            </h3>
            <div className="grid grid-cols-1 gap-1 max-h-48 overflow-y-auto pr-1">
              {['Adil Qadri', 'Al Nuaim', 'Meena Fragrance', 'Turkish Fragrance', 'Parag Fragrance', 'R.K Professional', 'Naseem', 'Arochem'].map((brand) => (
                <button
                  key={brand}
                  onClick={() => setSearchQuery(searchQuery === brand ? '' : brand)}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs tracking-wide transition-colors flex items-center justify-between cursor-pointer ${
                    searchQuery === brand
                      ? 'bg-amber-100 text-amber-900 font-bold border border-amber-300'
                      : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-50'
                  }`}
                >
                  <span>{brand}</span>
                  {searchQuery === brand && <span className="text-[10px] text-amber-800">✓</span>}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-neutral-900">
                Max Price
              </h3>
              <span className="text-xs font-mono font-bold text-neutral-900">₹{maxPrice.toLocaleString('en-IN')}</span>
            </div>
            <input
              type="range"
              min="500"
              max="6000"
              step="100"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-neutral-900 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-neutral-500 font-mono">
              <span>₹500</span>
              <span>₹6,000</span>
            </div>
          </div>

          {/* In Stock Toggle */}
          <div className="pt-2 border-t border-neutral-100 flex items-center justify-between">
            <label htmlFor="in-stock-toggle" className="text-xs text-neutral-700 tracking-wider uppercase cursor-pointer font-medium">
              In Stock Only
            </label>
            <input
              id="in-stock-toggle"
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="w-4 h-4 accent-neutral-900 rounded cursor-pointer"
            />
          </div>

          {/* Reset Filters */}
          {(selectedCategory !== 'All' || searchQuery || maxPrice < 5000 || inStockOnly) && (
            <button
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
                setMaxPrice(5000);
                setInStockOnly(false);
              }}
              className="w-full py-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs tracking-wider uppercase rounded-xl transition-colors font-medium cursor-pointer"
            >
              Reset Filters
            </button>
          )}

        </div>

        {/* Mobile Filters Drawer Modal */}
        {isMobileFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-6 flex flex-col justify-between animate-in fade-in duration-200">
            <div className="bg-white p-6 rounded-3xl space-y-6 overflow-y-auto max-h-[90vh]">
              <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
                <h3 className="font-serif text-xl text-neutral-900 uppercase tracking-wider font-semibold">
                  Filter Fragrances
                </h3>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 text-neutral-400 hover:text-neutral-900"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Categories */}
              <div className="space-y-2">
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block">Category</span>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSelectedCategory('All')}
                    className={`p-2.5 text-xs rounded-xl border text-center ${
                      selectedCategory === 'All'
                        ? 'bg-neutral-900 text-white font-semibold border-neutral-900'
                        : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.name)}
                      className={`p-2.5 text-xs rounded-xl border text-center ${
                        selectedCategory.toLowerCase() === cat.name.toLowerCase()
                          ? 'bg-neutral-900 text-white font-semibold border-neutral-900'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <div className="flex justify-between text-xs">
                  <span className="text-neutral-500 uppercase">Max Price:</span>
                  <span className="text-neutral-900 font-mono font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="6000"
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-neutral-900"
                />
              </div>

              {/* Brands Filter */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-xs text-neutral-500 uppercase tracking-wider font-semibold block">Featured Brands</span>
                <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
                  {['Adil Qadri', 'Al Nuaim', 'Meena Fragrance', 'Turkish Fragrance', 'Parag Fragrance', 'R.K Professional', 'Naseem', 'Arochem'].map((brand) => (
                    <button
                      key={brand}
                      onClick={() => setSearchQuery(searchQuery === brand ? '' : brand)}
                      className={`p-2 text-center text-xs rounded-xl border transition-all cursor-pointer ${
                        searchQuery === brand
                          ? 'bg-amber-100 text-amber-900 font-bold border-amber-300'
                          : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                      }`}
                    >
                      {brand}
                    </button>
                  ))}
                </div>
              </div>

              {/* In stock */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-100 text-xs">
                <span className="text-neutral-700 font-medium">In Stock Only</span>
                <input
                  type="checkbox"
                  checked={inStockOnly}
                  onChange={(e) => setInStockOnly(e.target.checked)}
                  className="w-5 h-5 accent-neutral-900"
                />
              </div>

              <div className="pt-4 border-t border-neutral-100 flex gap-3">
                <button
                  onClick={() => {
                    setSelectedCategory('All');
                    setSearchQuery('');
                    setMaxPrice(5000);
                    setInStockOnly(false);
                  }}
                  className="flex-1 py-3 bg-neutral-100 text-neutral-700 rounded-xl text-xs uppercase font-medium"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="flex-1 py-3 bg-neutral-900 text-white font-semibold rounded-xl text-xs uppercase tracking-wider"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Product Cards Grid */}
        <div className="md:col-span-3">
          {isLoadingData && products.length === 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="bg-white rounded-2xl p-5 border border-neutral-200 shadow-xs animate-pulse space-y-4">
                  <div className="w-full h-64 bg-neutral-100 rounded-xl" />
                  <div className="h-4 bg-neutral-100 rounded w-3/4" />
                  <div className="h-3 bg-neutral-100 rounded w-1/2" />
                  <div className="h-10 bg-neutral-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center bg-white rounded-2xl border border-neutral-200 p-8 space-y-4 shadow-xs">
              <div className="text-neutral-900 text-2xl font-serif font-bold uppercase tracking-wider">{settings.brandName || "NICE Perfumes"}</div>
              <p className="text-neutral-500 text-sm max-w-md mx-auto">
                No perfumes match your current filter selection. Try adjusting your search query or price limit.
              </p>
              <button
                onClick={() => {
                  setSelectedCategory('All');
                  setSearchQuery('');
                  setMaxPrice(5000);
                  setInStockOnly(false);
                }}
                className="px-6 py-2.5 bg-neutral-900 text-white font-semibold text-xs rounded-xl uppercase tracking-wider hover:bg-black cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.id} product={product} index={index} />
              ))}
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
