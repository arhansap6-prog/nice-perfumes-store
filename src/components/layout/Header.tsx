import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ShoppingBag, User, Search, ShieldCheck, Menu, X, Sparkles } from 'lucide-react';
import { AmBrandEmblem } from '../brand/AmBrandEmblem';

export const Header: React.FC = () => {
  const {
    currentPage,
    setCurrentPage,
    cart,
    currentUser,
    isAdminLoggedIn,
    settings
  } = useStore();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage('shop', { search: searchQuery });
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <div className={currentPage === 'home' ? 'absolute top-0 left-0 right-0 z-40' : 'sticky top-0 z-40'}>
      {/* Main Luxury Header */}
      <header className={`transition-all duration-300 w-full overflow-hidden ${
        currentPage === 'home'
          ? 'bg-gradient-to-b from-black/85 via-black/45 to-transparent text-white'
          : 'bg-white/95 backdrop-blur-md border-b border-neutral-200/80 shadow-[0_2px_15px_rgba(0,0,0,0.03)]'
      }`}>
        <div className="max-w-7xl mx-auto px-2.5 sm:px-6 lg:px-8 h-16 sm:h-20 flex items-center justify-between gap-1.5 sm:gap-4 overflow-hidden">
          
          {/* Mobile Menu Toggle */}
          <button
            id="mobile-menu-toggle-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-1.5 sm:p-2 transition-colors shrink-0 ${
              currentPage === 'home' ? 'text-white hover:text-amber-300' : 'text-neutral-700 hover:text-black'
            }`}
            aria-label="Toggle Navigation Menu"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6 sm:w-7 sm:h-7" /> : <Menu className="w-6 h-6 sm:w-7 sm:h-7" />}
          </button>

          {/* Brand Logo & Name */}
          <div
            onClick={() => setCurrentPage('home')}
            className="cursor-pointer group flex items-center gap-2.5 sm:gap-4 select-none min-w-0 flex-1 overflow-hidden"
          >
            <div className="shrink-0 flex items-center justify-center">
              <AmBrandEmblem size="xs" showSubtitle={false} interactive={false} />
            </div>
            <div className="flex flex-col items-start min-w-0 overflow-hidden">
              <div className="flex items-center gap-1.5 sm:gap-2.5 min-w-0 max-w-full">
                <span className={`font-serif text-lg xs:text-xl sm:text-2xl md:text-3xl font-black tracking-wider transition-colors uppercase truncate ${
                  currentPage === 'home' 
                    ? 'text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)] group-hover:text-amber-300' 
                    : 'text-neutral-950 group-hover:text-amber-900'
                }`}>
                  {settings.brandName || "NICE Perfumes"}
                </span>
                <span className={`text-[9px] sm:text-[10px] tracking-wider uppercase px-2 py-0.5 border rounded-xs font-sans font-bold hidden md:inline-block shrink-0 shadow-2xs ${
                  currentPage === 'home' ? 'text-amber-300 border-amber-400/50 bg-black/60' : 'text-amber-900 border-amber-300/80 bg-amber-50'
                }`}>
                  PALANPUR
                </span>
              </div>
              <span className={`text-[9px] xs:text-[10px] sm:text-[12px] tracking-widest font-bold uppercase -mt-0.5 transition-colors truncate max-w-[200px] xs:max-w-[280px] sm:max-w-none ${
                currentPage === 'home' ? 'text-amber-200 group-hover:text-amber-100 drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]' : 'text-amber-900 group-hover:text-neutral-900'
              }`}>
                {settings.brandTagline || "Pure Perfumes & Luxury Fragrances"}
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className={`hidden lg:flex items-center gap-8 text-xs tracking-[0.2em] font-medium uppercase shrink-0 ${
            currentPage === 'home' ? 'text-neutral-200' : 'text-neutral-600'
          }`}>
            <button
              id="nav-link-home"
              onClick={() => setCurrentPage('home')}
              className={`hover:text-amber-300 transition-colors py-1 relative ${
                currentPage === 'home' ? 'text-white font-semibold' : ''
              }`}
            >
              HOME
              {currentPage === 'home' && (
                <span className="absolute bottom-0 left-0 w-full h-[2px] bg-amber-400" />
              )}
            </button>
            <button
              id="nav-link-shop"
              onClick={() => setCurrentPage('shop')}
              className="hover:text-amber-300 transition-colors py-1 relative"
            >
              ALL PERFUMES
            </button>
            <button
              id="nav-link-collections"
              onClick={() => setCurrentPage('collections')}
              className="hover:text-amber-300 transition-colors py-1 relative"
            >
              COLLECTIONS
            </button>
            <button
              id="nav-link-about"
              onClick={() => setCurrentPage('about')}
              className="hover:text-amber-300 transition-colors py-1 relative"
            >
              ABOUT US
            </button>
            <button
              id="nav-link-contact"
              onClick={() => setCurrentPage('contact')}
              className="hover:text-amber-300 transition-colors py-1 relative"
            >
              CONTACT
            </button>
            <button
              id="nav-link-wholesale"
              onClick={() => setCurrentPage('wholesale')}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-600 text-neutral-950 font-extrabold uppercase rounded-lg transition-all tracking-wider shadow-sm hover:scale-105"
            >
              WHOLESALE 💼
            </button>
          </nav>

          {/* Right Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
            
            {/* Search Toggle */}
            <button
              id="header-search-btn"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-1.5 sm:p-2 rounded-full transition-colors ${
                currentPage === 'home' ? 'text-white hover:text-amber-300 hover:bg-white/10' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
              title="Search Fragrances"
              aria-label="Search"
            >
              <Search className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
            </button>

            {/* Store Owner Admin Shortcut (Visible ONLY to logged in admin) */}
            {isAdminLoggedIn && (
              <button
                onClick={() => setCurrentPage('admin-dashboard')}
                className="px-2.5 py-1 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-black text-[10px] tracking-wider uppercase rounded-lg shadow-sm flex items-center gap-1 transition-all cursor-pointer"
                title="Go to Admin Panel"
              >
                <span>👑</span>
                <span className="hidden sm:inline">ADMIN</span>
              </button>
            )}

            {/* Customer Account Icon (Strictly for customers) */}
            <button
              id="header-account-btn"
              onClick={() => {
                if (currentUser?.role === 'superadmin' && isAdminLoggedIn) {
                  setCurrentPage('admin-dashboard');
                } else if (currentUser) {
                  setCurrentPage('customer-dashboard');
                } else {
                  setCurrentPage('login');
                }
              }}
              className={`p-1.5 sm:p-2 rounded-full transition-colors flex items-center gap-1.5 ${
                currentPage === 'home' ? 'text-white hover:text-amber-300 hover:bg-white/10' : 'text-neutral-600 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
              title={currentUser ? currentUser.fullName : 'Login / Account'}
            >
              <User className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              {currentUser && (
                <span className={`hidden xl:inline text-[11px] font-medium tracking-wider truncate max-w-[100px] ${
                  currentPage === 'home' ? 'text-amber-200' : 'text-neutral-700'
                }`}>
                  {currentUser.fullName.split(' ')[0]}
                </span>
              )}
            </button>

            {/* Cart Button */}
            <button
              id="header-cart-btn"
              onClick={() => setCurrentPage('cart')}
              className={`p-1.5 sm:p-2 rounded-full transition-colors relative ${
                currentPage === 'home' ? 'text-white hover:text-amber-300 hover:bg-white/10' : 'text-neutral-700 hover:text-neutral-950 hover:bg-neutral-100'
              }`}
              title="Cart"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5 sm:w-[22px] sm:h-[22px]" />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-neutral-950 font-bold text-[9px] sm:text-[10px] w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-xs">
                  {cartCount}
                </span>
              )}
            </button>

          </div>
        </div>

        {/* Expandable Search Input Bar */}
        {isSearchOpen && (
          <div className="bg-white border-b border-neutral-200 py-3 px-4 shadow-sm">
            <form onSubmit={handleSearchSubmit} className="max-w-3xl mx-auto flex items-center gap-2">
              <Search className="w-5 h-5 text-neutral-400" />
              <input
                id="search-input-field"
                type="text"
                placeholder="Search by perfume name, fragrance notes (e.g. Tuscan Leather, Oud, Amber, Rose)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-3 py-2 text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-neutral-900 text-sm tracking-wide"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-neutral-900 text-white font-medium text-xs rounded-lg hover:bg-neutral-800 uppercase tracking-widest transition-colors cursor-pointer"
              >
                Search
              </button>
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="p-2 text-neutral-500 hover:text-neutral-900 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </form>
          </div>
        )}

        {/* Mobile Dropdown Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white border-b border-neutral-200 px-6 py-6 space-y-4 shadow-xl animate-in slide-in-from-top-2 duration-200">
            <div className="flex flex-col space-y-1.5 text-sm sm:text-base tracking-[0.1em] uppercase font-bold text-neutral-900">
              
              {/* Home */}
              <button
                onClick={() => { setCurrentPage('home'); setIsMobileMenuOpen(false); }}
                className="text-left py-3 px-3.5 rounded-xl bg-neutral-900 text-white font-bold flex items-center justify-between"
              >
                <span>🏠 Home</span>
              </button>

              {/* Wholesale Enquiry Option in Menu */}
              <button
                onClick={() => { setCurrentPage('wholesale'); setIsMobileMenuOpen(false); }}
                className="text-left py-3 px-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 text-neutral-950 font-black flex items-center justify-between shadow-xs border border-amber-500 hover:brightness-105 cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <span>💼 Wholesale Enquiry</span>
                </span>
                <span className="text-[10px] bg-black text-amber-300 px-2 py-0.5 rounded font-mono font-bold tracking-widest">BULK ORDERS</span>
              </button>

              {/* Latest Products */}
              <button
                onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between"
              >
                <span>Latest Products</span>
              </button>

              {/* Best Selling with Accordion */}
              <div>
                <button
                  onClick={() => setOpenCategory(openCategory === 'bestselling' ? null : 'bestselling')}
                  className="w-full text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>Best Selling</span>
                  <span>{openCategory === 'bestselling' ? '▲' : '▼'}</span>
                </button>
                {openCategory === 'bestselling' && (
                  <div className="pl-6 py-2.5 space-y-2 bg-neutral-50 rounded-xl my-1 text-xs text-neutral-800 font-medium">
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">Arabic Attars</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">Arabic Perfumes</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">French Attars</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">French Perfumes</button>
                  </div>
                )}
              </div>

              {/* Attars with Accordion */}
              <div>
                <button
                  onClick={() => setOpenCategory(openCategory === 'attars' ? null : 'attars')}
                  className="w-full text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>Attars</span>
                  <span>{openCategory === 'attars' ? '▲' : '▼'}</span>
                </button>
                {openCategory === 'attars' && (
                  <div className="pl-6 py-2.5 space-y-2 bg-neutral-50 rounded-xl my-1 text-xs text-neutral-800 font-medium">
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">French</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">Arabic</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">Indian</button>
                  </div>
                )}
              </div>

              {/* Perfumes with Accordion */}
              <div>
                <button
                  onClick={() => setOpenCategory(openCategory === 'perfumes' ? null : 'perfumes')}
                  className="w-full text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between cursor-pointer"
                >
                  <span>Perfumes</span>
                  <span>{openCategory === 'perfumes' ? '▲' : '▼'}</span>
                </button>
                {openCategory === 'perfumes' && (
                  <div className="pl-6 py-2.5 space-y-2 bg-neutral-50 rounded-xl my-1 text-xs text-neutral-800 font-medium">
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">French</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">Arabic</button>
                    <button onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }} className="block w-full text-left py-1.5 hover:text-black">Indian</button>
                  </div>
                )}
              </div>

              {/* Packs */}
              <button
                onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between"
              >
                <span>Packs</span>
              </button>

              {/* Gift Bottles */}
              <button
                onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between"
              >
                <span>Gift Bottles</span>
              </button>

              {/* Others */}
              <button
                onClick={() => { setCurrentPage('shop'); setIsMobileMenuOpen(false); }}
                className="text-left py-3 px-3.5 rounded-xl text-neutral-900 hover:bg-neutral-100 font-bold flex items-center justify-between"
              >
                <span>Others</span>
              </button>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-neutral-200 text-xs">
              <span className="text-neutral-600 uppercase tracking-wider text-[11px] font-medium truncate max-w-[150px]">
                {settings.brandName || "NICE Perfumes"}
              </span>
              
              <a
                href={`tel:${settings.contactPhone?.split(',')[0].trim() || "8140251978"}`}
                className="text-neutral-900 font-mono font-medium hover:underline"
              >
                {settings.contactPhone?.split(',')[0].trim() || "8140251978"}
              </a>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};
