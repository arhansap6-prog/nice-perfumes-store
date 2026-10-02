import React, { useState, useEffect } from 'react';
import { useStore } from '../context/StoreContext';
import { Product, ProductVolumeVariant, Order, OrderStatus, Coupon, Banner } from '../types';
import { getProductVolumeVariants } from '../utils/productUtils';
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Boxes,
  Tag,
  CreditCard,
  BarChart3,
  Settings,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  Search,
  SlidersHorizontal,
  X,
  Truck,
  Image as ImageIcon,
  Save,
  AlertTriangle,
  Sparkles,
  ArrowUpRight,
  Flame,
  Zap,
} from 'lucide-react';

export const AdminPage: React.FC = () => {
  const {
    products,
    categories,
    orders,
    coupons,
    banners,
    settings,
    currentUser,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    setCurrentPage,
    addProduct,
    updateProduct,
    deleteProduct,
    updateOrderStatus,
    addCategory,
    deleteCategory,
    addCoupon,
    toggleCoupon,
    deleteCoupon,
    addBanner,
    deleteBanner,
    updateSettings,
    showToast,
  } = useStore();

  const [activeTab, setActiveTab] = useState<
    'overview' | 'products' | 'orders' | 'inventory' | 'coupons' | 'payments' | 'razorpay' | 'analytics' | 'cms' | 'combo'
  >('overview');

  // Combo Deal Form State ("Buy Any 5 @ ₹1499")
  const [comboForm, setComboForm] = useState({
    comboOfferTitle: settings.comboOfferTitle || 'ANY 5 PERFUMES AT JUST ₹1499',
    comboOfferPrice: settings.comboOfferPrice || 1499,
    comboOfferOriginalPrice: settings.comboOfferOriginalPrice || 2499,
    comboBottleCount: settings.comboBottleCount || 5,
    comboOfferEnabled: settings.comboOfferEnabled ?? true,
    comboOfferDescription: settings.comboOfferDescription || 'Choose any 5 bottles from our entire catalog. Includes luxury gift box and Pan-India delivery!',
    comboProductIds: settings.comboProductIds || [
      'prod-am-alpha', 'prod-am-blue', 'prod-am-dessert', 'prod-secret-blue',
      'prod-ice-gold', 'prod-black-vanilla', 'prod-muaab-oud', 'prod-burberry-her',
      'prod-gucci-flora', 'prod-gentleman-pack'
    ],
  });

  useEffect(() => {
    if (settings) {
      setComboForm((prev) => ({
        ...prev,
        comboOfferTitle: settings.comboOfferTitle || 'ANY 5 PERFUMES AT JUST ₹1499',
        comboOfferPrice: settings.comboOfferPrice || 1499,
        comboOfferOriginalPrice: settings.comboOfferOriginalPrice || 2499,
        comboBottleCount: settings.comboBottleCount || 5,
        comboOfferEnabled: settings.comboOfferEnabled !== false && (settings.comboOfferEnabled as any) !== 'false',
        comboOfferDescription: settings.comboOfferDescription || 'Choose any 5 bottles from our entire catalog. Includes luxury gift box and Pan-India delivery!',
        comboProductIds: settings.comboProductIds && settings.comboProductIds.length > 0
          ? settings.comboProductIds
          : prev.comboProductIds,
      }));

      setSettingsForm({
        brandName: settings.brandName || "NICE Perfumes",
        brandTagline: settings.brandTagline || "Pure Perfumes & Luxury Fragrances",
        announcementBarText: settings.announcementBarText || "✨ Welcome to NICE Perfumes • Palanpur • Call / WhatsApp: 92650 64213 ✨",
        heroVideoUrl: settings.heroVideoUrl || '/hamza_video.mp4',
        heroVideoPoster: settings.heroVideoPoster || '/hamza_video_poster.jpg',
        heroImageUrl: settings.heroImageUrl || '/home_bg.png',
        showroomImageUrl: settings.showroomImageUrl || '/showroom_bg.png',
      });
    }
  }, [settings]);

  const handleSaveComboSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...comboForm,
      comboOfferEnabled: Boolean(comboForm.comboOfferEnabled),
    };
    await updateSettings(payload);
    showToast(payload.comboOfferEnabled ? '🔥 Combo deal updated & visible on website!' : '👁️ Combo deal hidden from website!');
  };

  const toggleComboProduct = (productId: string) => {
    setComboForm((prev) => {
      const exists = prev.comboProductIds.includes(productId);
      const updatedIds = exists
        ? prev.comboProductIds.filter((id) => id !== productId)
        : [...prev.comboProductIds, productId];
      return { ...prev, comboProductIds: updatedIds };
    });
  };

  const handleSelectAllComboProducts = () => {
    setComboForm((prev) => ({
      ...prev,
      comboProductIds: products.map((p) => p.id),
    }));
  };

  const handleClearAllComboProducts = () => {
    setComboForm((prev) => ({
      ...prev,
      comboProductIds: [],
    }));
  };

  // Inline Admin Auth State if not logged in
  const [adminAuthEmail, setAdminAuthEmail] = useState('Niceperfumes@gmail.com');
  const [adminAuthPassword, setAdminAuthPassword] = useState('Nice0404');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);

  // Razorpay Gateway Settings Form State
  const [razorpayForm, setRazorpayForm] = useState({
    razorpayKeyId: settings.razorpayKeyId || 'rzp_live_NicePerfumes8140251978',
    razorpayKeySecret: settings.razorpayKeySecret || 'NicePerfumesSecret2026',
    razorpayUpiId: settings.razorpayUpiId || '8140251978@upi',
    razorpayPaymentLink: settings.razorpayPaymentLink || 'https://wa.me/918140251978',
    razorpayQrImageUrl: settings.razorpayQrImageUrl || '',
    razorpayEnabled: settings.razorpayEnabled ?? true,
  });

  // Product Modal Form State
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const DEFAULT_PRODUCT_VARIANTS: ProductVolumeVariant[] = [
    { volume: '12ml', price: 499, salePrice: 399 },
    { volume: '50ml', price: 999, salePrice: 799 },
    { volume: '100ml', price: 1800, salePrice: 1499 },
  ];

  const [productForm, setProductForm] = useState({
    name: '',
    sku: '',
    category: 'Luxury Perfumes (EDP)',
    price: 1800,
    salePrice: 1499,
    volume: '12ml / 50ml / 100ml',
    stock: 35,
    description: '',
    status: 'available' as 'available' | 'out_of_stock' | 'draft',
    featured: false,
    bestSeller: false,
    newArrival: true,
    imagesText: '',
    topNotesText: 'Bergamot, Pepper',
    middleNotesText: 'Rose, Oud',
    baseNotesText: 'Amber, Musk',
    volumeVariants: [
      { volume: '12ml', price: 499, salePrice: 399 },
      { volume: '50ml', price: 999, salePrice: 799 },
      { volume: '100ml', price: 1800, salePrice: 1499 },
    ] as ProductVolumeVariant[],
  });

  const openCreateProduct = () => {
    setEditingProductId(null);
    setProductForm({
      name: '',
      sku: `AL-${Math.floor(100 + Math.random() * 900)}`,
      category: categories[0]?.name || 'Luxury Perfumes (EDP)',
      price: 1800,
      salePrice: 1499,
      volume: '12ml / 50ml / 100ml',
      stock: 50,
      description: '',
      status: 'available',
      featured: false,
      bestSeller: false,
      newArrival: true,
      imagesText: '',
      topNotesText: '',
      middleNotesText: '',
      baseNotesText: '',
      volumeVariants: [
        { volume: '12ml', price: 499, salePrice: 399 },
        { volume: '50ml', price: 999, salePrice: 799 },
        { volume: '100ml', price: 1800, salePrice: 1499 },
      ],
    });
    setIsProductModalOpen(true);
  };

  const handleVariantChange = (
    index: number,
    field: 'volume' | 'price' | 'salePrice',
    val: string | number
  ) => {
    const updated = [...productForm.volumeVariants];
    if (!updated[index]) return;
    if (field === 'volume') {
      updated[index] = { ...updated[index], volume: String(val) };
    } else {
      const numVal = val === '' ? 0 : Number(val);
      updated[index] = { ...updated[index], [field]: numVal };
    }
    const first = updated[0];
    setProductForm((prev) => ({
      ...prev,
      volumeVariants: updated,
      price: first ? first.price : prev.price,
      salePrice: first && first.salePrice ? first.salePrice : prev.salePrice,
      volume: updated.map((v) => v.volume).filter(Boolean).join(' / '),
    }));
  };

  const handleAddVariantRow = () => {
    const current = productForm.volumeVariants;
    const last = current[current.length - 1];
    let nextVolume = '24ml';
    if (current.length === 0) nextVolume = '12ml';
    else if (current.length === 1) nextVolume = '50ml';
    else if (current.length === 2) nextVolume = '100ml';
    else if (current.length === 3) nextVolume = '200ml';

    const basePrice = last ? last.price : 1499;
    const newPrice = Math.round(basePrice * 1.5);
    const newSale = last && last.salePrice ? Math.round(last.salePrice * 1.5) : Math.round(newPrice * 0.85);

    const updated = [
      ...current,
      { volume: nextVolume, price: newPrice, salePrice: newSale },
    ];
    setProductForm((prev) => ({
      ...prev,
      volumeVariants: updated,
      volume: updated.map((v) => v.volume).filter(Boolean).join(' / '),
    }));
  };

  const handleRemoveVariantRow = (index: number) => {
    if (productForm.volumeVariants.length <= 1) {
      showToast('कम से कम एक साइज (Volume Variant) होना जरूरी है', 'info');
      return;
    }
    const updated = productForm.volumeVariants.filter((_, i) => i !== index);
    setProductForm((prev) => ({
      ...prev,
      volumeVariants: updated,
      volume: updated.map((v) => v.volume).filter(Boolean).join(' / '),
    }));
  };

  const applyVariantPreset = (preset: 'perfume' | 'attar') => {
    if (preset === 'perfume') {
      const base = Number(productForm.price) || 1800;
      const baseSale = Number(productForm.salePrice) || 1499;
      const updated = [
        { volume: '12ml', price: Math.max(399, Math.round(base * 0.35)), salePrice: Math.max(299, Math.round(baseSale * 0.35)) },
        { volume: '50ml', price: Math.max(899, Math.round(base * 0.7)), salePrice: Math.max(699, Math.round(baseSale * 0.7)) },
        { volume: '100ml', price: base, salePrice: baseSale },
      ];
      setProductForm((prev) => ({
        ...prev,
        volumeVariants: updated,
        volume: '12ml / 50ml / 100ml',
      }));
    } else if (preset === 'attar') {
      const base = Number(productForm.price) || 899;
      const baseSale = Number(productForm.salePrice) || 699;
      const updated = [
        { volume: '6ml', price: Math.max(299, Math.round(base * 0.55)), salePrice: Math.max(249, Math.round(baseSale * 0.55)) },
        { volume: '12ml', price: base, salePrice: baseSale },
        { volume: '24ml', price: Math.round(base * 1.8), salePrice: Math.round(baseSale * 1.8) },
      ];
      setProductForm((prev) => ({
        ...prev,
        volumeVariants: updated,
        volume: '6ml / 12ml / 24ml',
      }));
    }
  };

  // Category State
  const [newCatName, setNewCatName] = useState('');

  // Order Search & Filter
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('All');

  // Coupon Form State
  const [isCouponModalOpen, setIsCouponModalOpen] = useState(false);
  const [couponForm, setCouponForm] = useState({
    code: '',
    discountPercent: 10,
    minOrderAmount: 1000,
  });

  // Banner Form State
  const [bannerForm, setBannerForm] = useState({
    title: '',
    subtitle: '',
    imageUrl: '',
    linkUrl: '/shop',
    buttonText: 'SHOP NOW',
  });

  // Settings State
  const [settingsForm, setSettingsForm] = useState({
    brandName: settings.brandName || "NICE Perfumes",
    brandTagline: settings.brandTagline || "Pure Perfumes & Luxury Fragrances",
    announcementBarText: settings.announcementBarText || "✨ Welcome to NICE Perfumes • Palanpur • Call / WhatsApp: 92650 64213 ✨",
    heroVideoUrl: settings.heroVideoUrl || '/hamza_video.mp4',
    heroVideoPoster: settings.heroVideoPoster || '/hamza_video_poster.jpg',
    heroImageUrl: settings.heroImageUrl || '/home_bg.png',
    showroomImageUrl: settings.showroomImageUrl || '/showroom_bg.png',
  });

  // Calculate KPIs
  const totalRevenue = orders
    .filter((o) => o.paymentStatus === 'Paid')
    .reduce((sum, o) => sum + o.totalAmount, 0);

  const pendingOrdersCount = orders.filter((o) => o.status === 'Pending' || o.status === 'Confirmed').length;
  const outOfStockProducts = products.filter((p) => p.stock === 0 || p.status === 'out_of_stock');

  // Handle Product Save
  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const imagesArray = productForm.imagesText.split('\n').map((s) => s.trim()).filter(Boolean);
    const topNotes = productForm.topNotesText.split(',').map((s) => s.trim()).filter(Boolean);
    const middleNotes = productForm.middleNotesText.split(',').map((s) => s.trim()).filter(Boolean);
    const baseNotes = productForm.baseNotesText.split(',').map((s) => s.trim()).filter(Boolean);

    const validVariants = (productForm.volumeVariants || [])
      .filter((v) => v.volume && v.volume.trim() !== '')
      .map((v) => ({
        volume: v.volume.trim(),
        price: Math.max(1, Number(v.price) || 0),
        salePrice: v.salePrice && Number(v.salePrice) > 0 ? Number(v.salePrice) : undefined,
      }));

    const finalVariants: ProductVolumeVariant[] = validVariants.length > 0
      ? validVariants
      : [
          {
            volume: productForm.volume || '100ml',
            price: Math.max(1, Number(productForm.price) || 1499),
            salePrice: productForm.salePrice && Number(productForm.salePrice) > 0 ? Number(productForm.salePrice) : undefined,
          },
        ];

    const primaryVariant = finalVariants[0];
    const volumeSummary = finalVariants.map((v) => v.volume).join(' / ');

    const productPayload = {
      name: productForm.name,
      sku: productForm.sku || `AL-${Math.floor(100 + Math.random() * 900)}`,
      category: productForm.category,
      price: primaryVariant.price,
      salePrice: primaryVariant.salePrice,
      volume: volumeSummary,
      volumeVariants: finalVariants,
      stock: Number(productForm.stock),
      description: productForm.description,
      status: Number(productForm.stock) === 0 ? ('out_of_stock' as const) : productForm.status,
      featured: productForm.featured,
      bestSeller: productForm.bestSeller,
      newArrival: productForm.newArrival,
      images: imagesArray.length > 0 ? imagesArray : ['https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=800&q=80'],
      notes: {
        top: topNotes,
        middle: middleNotes,
        base: baseNotes,
      },
    };

    if (editingProductId) {
      await updateProduct(editingProductId, productPayload);
      showToast('✨ Product successfully updated & saved!', 'success');
    } else {
      await addProduct(productPayload);
      showToast('✨ New product successfully added & saved!', 'success');
    }

    setIsProductModalOpen(false);
    setEditingProductId(null);
  };

  const openEditProduct = (p: Product) => {
    setEditingProductId(p.id);
    const variants = (p.volumeVariants && p.volumeVariants.length > 0)
      ? p.volumeVariants
      : getProductVolumeVariants(p);

    const safeVariants = variants.length > 0
      ? variants.map((v) => ({
          volume: v.volume,
          price: Number(v.price) || 0,
          salePrice: v.salePrice !== undefined && v.salePrice !== null ? Number(v.salePrice) : undefined,
        }))
      : [
          { volume: '12ml', price: 499, salePrice: 399 },
          { volume: '50ml', price: 999, salePrice: 799 },
          { volume: '100ml', price: p.price || 1800, salePrice: p.salePrice || 1499 },
        ];

    setProductForm({
      name: p.name,
      sku: p.sku,
      category: p.category,
      price: p.price,
      salePrice: p.salePrice || 0,
      volume: p.volume || safeVariants.map((v) => v.volume).join(' / '),
      stock: p.stock,
      description: p.description,
      status: p.status,
      featured: p.featured || false,
      bestSeller: p.bestSeller || false,
      newArrival: p.newArrival || false,
      imagesText: p.images.join('\n'),
      topNotesText: p.notes?.top?.join(', ') || '',
      middleNotesText: p.notes?.middle?.join(', ') || '',
      baseNotesText: p.notes?.base?.join(', ') || '',
      volumeVariants: safeVariants,
    });
    setIsProductModalOpen(true);
  };

  const handleAddCouponSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponForm.code) return;
    await addCoupon({
      code: couponForm.code.toUpperCase(),
      discountPercent: Number(couponForm.discountPercent),
      minOrderAmount: Number(couponForm.minOrderAmount),
      isActive: true,
    });
    setCouponForm({ code: '', discountPercent: 10, minOrderAmount: 1000 });
    setIsCouponModalOpen(false);
  };

  const handleAddBannerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bannerForm.title || !bannerForm.imageUrl) return;
    await addBanner({
      ...bannerForm,
      isActive: true,
    });
    setBannerForm({ title: '', subtitle: '', imageUrl: '', linkUrl: '/shop', buttonText: 'SHOP NOW' });
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings(settingsForm);
  };

  const handleSaveRazorpaySettings = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateSettings({
      ...settings,
      ...razorpayForm,
    });
    showToast('Razorpay Payment Gateway configuration updated and live!');
  };

  const handleProductImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    files.forEach((file: File) => {
      // Basic size validation for the raw file to prevent browser hanging
      if (file.size > 10 * 1024 * 1024) {
        showToast(`File "${file.name}" is too large (>10MB).`, 'error');
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        const rawDataUrl = event.target?.result as string;
        if (!rawDataUrl) return;

        showToast('Processing premium photo...', 'info');

        const img = new Image();
        img.src = rawDataUrl;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          // 900px at 0.80 JPEG quality provides crystal-clear clarity (~75KB) that saves smoothly to Firestore
          const maxDim = 900; 
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            // 0.80 quality ensures crisp detail while easily fitting in cloud database
            const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.80);
            
            setProductForm((prev) => {
              const currentImages = prev.imagesText.split('\n').filter(Boolean);
              if (currentImages.length >= 8) {
                showToast('Maximum 8 photos allowed.', 'error');
                return prev;
              }
              return {
                ...prev,
                imagesText: prev.imagesText ? `${prev.imagesText}\n${compressedDataUrl}` : compressedDataUrl,
              };
            });
            showToast('High-Definition Photo processed & added!', 'success');
          } else {
            setProductForm((prev) => ({
              ...prev,
              imagesText: prev.imagesText ? `${prev.imagesText}\n${rawDataUrl}` : rawDataUrl,
            }));
          }
        };
        img.onerror = () => {
          setProductForm((prev) => ({
            ...prev,
            imagesText: prev.imagesText ? `${prev.imagesText}\n${rawDataUrl}` : rawDataUrl,
          }));
        };
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAdminInlineLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminAuthLoading(true);
    const res = await loginAdmin(adminAuthEmail, adminAuthPassword);
    setAdminAuthLoading(false);
    if (!res.success) {
      showToast('Invalid Admin credentials. Check email and password.');
    }
  };

  // Filtered Orders
  const filteredOrders = orders.filter((ord) => {
    const matchSearch =
      !orderSearch ||
      ord.orderId.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(orderSearch.toLowerCase()) ||
      ord.customerMobile.includes(orderSearch);
    const matchStatus = orderStatusFilter === 'All' || ord.status === orderStatusFilter;
    return matchSearch && matchStatus;
  });

  // Strict Admin Email Protection Guard
  const ownerEmail = (settings.adminEmail || 'niceperfumes@gmail.com').trim().toLowerCase();
  const isStoreOwner =
    Boolean(isAdminLoggedIn) &&
    (
      currentUser?.role === 'superadmin' ||
      currentUser?.email?.toLowerCase() === ownerEmail ||
      currentUser?.email?.toLowerCase() === 'niceperfumes@gmail.com'
    );

  if (!isStoreOwner) {
    return (
      <div className="bg-black text-neutral-100 min-h-screen py-16 px-4 flex items-center justify-center">
        <div className="max-w-md w-full bg-neutral-950 border border-neutral-850 p-8 rounded-2xl shadow-2xl space-y-6 text-center">
          <div className="w-16 h-16 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
            <AlertTriangle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] uppercase tracking-[0.35em] text-red-400 font-bold block">
              RESTRICTED OWNER PORTAL
            </span>
            <h1 className="font-serif text-2xl text-white uppercase tracking-wider">
              Store Owner Access Only
            </h1>
            <p className="text-xs text-neutral-400 leading-relaxed">
              The Admin Panel is strictly locked to the store owner email (<span className="text-white font-mono font-bold">{ownerEmail}</span>). Please log in with the owner credentials below.
            </p>
          </div>

          <form onSubmit={handleAdminInlineLogin} className="space-y-4 text-left text-xs">
            <div className="space-y-1">
              <label className="text-neutral-400 uppercase font-medium">Admin Email</label>
              <input
                type="email"
                required
                value={adminAuthEmail}
                onChange={(e) => setAdminAuthEmail(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded font-mono"
              />
            </div>

            <div className="space-y-1">
              <label className="text-neutral-400 uppercase font-medium">Admin Password</label>
              <input
                type="password"
                required
                value={adminAuthPassword}
                onChange={(e) => setAdminAuthPassword(e.target.value)}
                className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={adminAuthLoading}
              className="w-full py-3.5 bg-white hover:bg-neutral-200 text-black font-bold uppercase tracking-widest text-xs rounded shadow-lg transition-all"
            >
              {adminAuthLoading ? 'AUTHENTICATING...' : 'LOGIN TO ADMIN PANEL'}
            </button>
          </form>

          <div className="pt-4 border-t border-neutral-900">
            <button
              onClick={() => setCurrentPage('home')}
              className="text-xs text-neutral-500 hover:text-white uppercase tracking-wider"
            >
              ← Return to Fragrance Boutique
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black text-neutral-100 min-h-screen pb-16">
      
      {/* Top Admin Header Bar */}
      <div className="bg-neutral-950 border-b border-neutral-850 px-4 sm:px-8 py-4 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-amber-400 text-black text-[10px] uppercase tracking-widest font-bold px-2.5 py-1 rounded">
              STORE OWNER ADMIN
            </span>
            <h1 className="font-serif text-lg sm:text-xl text-neutral-100 uppercase tracking-wider hidden sm:block animate-fade-in">
              {settings.brandName || "NICE Perfumes"} Management
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-neutral-400 font-mono">
            <span className="hidden sm:inline">Owner: <span className="text-white font-semibold">{ownerEmail}</span></span>
            <button
              onClick={logoutAdmin}
              className="px-3 py-1 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-red-400 text-[10px] uppercase font-bold rounded"
            >
              Logout Admin
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 space-y-6">
        
        {/* Mobile & Desktop Admin Navigation Tabs Bar */}
        <div className="flex items-center gap-2 border-b border-neutral-900 overflow-x-auto pb-3 text-xs uppercase tracking-wider font-medium scrollbar-none">
          
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'overview' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab('products')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('razorpay')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'razorpay' ? 'bg-amber-400 text-black font-bold' : 'text-amber-400 hover:text-white bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <CreditCard className="w-4 h-4 text-amber-400" />
            <span>Razorpay Gateway</span>
          </button>

          <button
            onClick={() => setActiveTab('combo')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'combo' ? 'bg-amber-400 text-black font-bold' : 'text-amber-400 hover:text-white bg-amber-500/10 border border-amber-500/30'
            }`}
          >
            <Flame className="w-4 h-4 text-amber-400" />
            <span>🔥 Combo Deals (Buy Any 5)</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'orders' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'inventory' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <Boxes className="w-4 h-4" />
            <span>Inventory</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'coupons' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('payments')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'payments' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Payments</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'analytics' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('cms')}
            className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'cms' ? 'bg-white text-black font-bold' : 'text-neutral-400 hover:text-white bg-neutral-950 border border-neutral-900'
            }`}
          >
            <Settings className="w-4 h-4" />
            <span>CMS / Banners</span>
          </button>

        </div>

        {/* TAB 1: OVERVIEW / DASHBOARD */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            
            {/* KPI Cards Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              
              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>TOTAL REVENUE (PREPAID)</span>
                  <CreditCard className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="font-serif text-3xl text-emerald-400 font-medium">
                  ₹{totalRevenue.toLocaleString('en-IN')}
                </div>
                <span className="text-[10px] text-neutral-500 block">100% Prepaid Settlement</span>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>TOTAL ORDERS</span>
                  <ShoppingBag className="w-4 h-4 text-white" />
                </div>
                <div className="font-serif text-3xl text-neutral-100 font-medium">{orders.length}</div>
                <span className="text-[10px] text-neutral-300 block">{pendingOrdersCount} Pending Dispatch</span>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>CATALOG PERFUMES</span>
                  <Package className="w-4 h-4 text-white" />
                </div>
                <div className="font-serif text-3xl text-neutral-100 font-medium">{products.length}</div>
                <span className="text-[10px] text-neutral-500 block">{categories.length} Fragrance Families</span>
              </div>

              <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 space-y-2">
                <div className="flex justify-between items-center text-xs text-neutral-400">
                  <span>LOW STOCK ALERTS</span>
                  <AlertTriangle className="w-4 h-4 text-red-400" />
                </div>
                <div className="font-serif text-3xl text-red-400 font-medium">{outOfStockProducts.length}</div>
                <span className="text-[10px] text-neutral-500 block">Items needing inventory refill</span>
              </div>

            </div>

            {/* Quick Action Bar for Store Owner */}
            <div className="bg-neutral-950 p-5 rounded-2xl border border-neutral-850 flex flex-wrap items-center justify-between gap-4">
              <div>
                <h3 className="font-serif text-lg text-neutral-100">Quick Store Operations</h3>
                <p className="text-xs text-neutral-400">Instant shortcuts for mobile management</p>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={openCreateProduct}
                  className="px-4 py-2.5 bg-white text-black font-semibold text-xs tracking-wider uppercase rounded flex items-center gap-1.5 hover:bg-neutral-200 cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Add Perfume</span>
                </button>

                <button
                  onClick={() => setActiveTab('orders')}
                  className="px-4 py-2.5 bg-neutral-900 text-white border border-neutral-800 text-xs tracking-wider uppercase rounded font-medium flex items-center gap-1.5 hover:bg-neutral-800"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Process Orders</span>
                </button>
              </div>
            </div>

            {/* Recent Orders Overview Table */}
            <div className="bg-neutral-950 rounded-2xl border border-neutral-850 overflow-hidden space-y-4 p-6">
              <h3 className="font-serif text-xl text-neutral-100 uppercase tracking-wider">
                Latest Customer Orders
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Order ID</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Items</th>
                      <th className="p-3">Amount</th>
                      <th className="p-3">Payment</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {orders.slice(0, 5).map((ord) => (
                      <tr key={ord.id} className="hover:bg-neutral-900/50">
                        <td className="p-3 font-mono text-white font-bold">{ord.orderId}</td>
                        <td className="p-3">
                          <span className="font-medium text-white block">{ord.customerName}</span>
                          <span className="text-[10px] text-neutral-500 font-mono">{ord.customerMobile}</span>
                        </td>
                        <td className="p-3">{ord.items.length} Perfumes</td>
                        <td className="p-3 font-serif font-medium text-white">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="p-3">
                          <span className="text-emerald-400 font-semibold text-[10px] uppercase">Paid (Razorpay)</span>
                        </td>
                        <td className="p-3">
                          <span className="bg-neutral-900 text-white px-2 py-0.5 rounded text-[10px] border border-neutral-800 uppercase font-medium">
                            {ord.status}
                          </span>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setActiveTab('orders')}
                            className="text-white hover:underline uppercase text-[10px]"
                          >
                            Manage Order
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: PRODUCTS MANAGEMENT */}
        {activeTab === 'products' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div>
                <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider">
                  Product Management ({products.length})
                </h2>
                <p className="text-xs text-neutral-400 font-light">
                  Add, edit price, fragrance notes, volume & images
                </p>
              </div>

              <button
                onClick={openCreateProduct}
                className="px-5 py-2.5 bg-white hover:bg-neutral-200 text-black font-bold text-xs uppercase tracking-widest rounded flex items-center gap-1.5 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Create New Product</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-neutral-950 rounded-2xl border border-neutral-850 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Perfume</th>
                      <th className="p-3">Category</th>
                      <th className="p-3">Volume</th>
                      <th className="p-3">Price</th>
                      <th className="p-3">Stock</th>
                      <th className="p-3">Badges</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {products.map((p) => (
                      <tr key={p.id} className="hover:bg-neutral-900/50">
                        <td className="p-3 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-12 object-cover rounded bg-neutral-900 flex-shrink-0" />
                          <div>
                            <span className="font-serif text-sm font-normal text-white block">{p.name}</span>
                            <span className="text-[10px] text-neutral-500 font-mono">SKU: {p.sku}</span>
                          </div>
                        </td>
                        <td className="p-3 uppercase text-[10px] text-neutral-300 font-semibold">{p.category}</td>
                        <td className="p-3 font-mono">
                          <span className="text-neutral-200 block">{p.volume}</span>
                          {p.volumeVariants && p.volumeVariants.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-1">
                              {p.volumeVariants.map((v, idx) => (
                                <span key={idx} className="bg-neutral-900 border border-neutral-800 text-[9px] px-1.5 py-0.5 rounded text-amber-300 font-mono">
                                  {v.volume}: ₹{v.salePrice || v.price}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>
                        <td className="p-3 font-serif">
                          <span className="text-white font-medium">₹{(p.salePrice || p.price).toLocaleString('en-IN')}</span>
                          {p.salePrice && <span className="text-[10px] text-neutral-500 line-through block">₹{p.price}</span>}
                        </td>
                        <td className="p-3">
                          <span className={p.stock > 0 ? 'text-emerald-400 font-mono' : 'text-red-400 font-mono font-bold'}>
                            {p.stock} units
                          </span>
                        </td>
                        <td className="p-3 space-x-1">
                          {p.featured && <span className="bg-neutral-800 text-white text-[9px] px-1.5 py-0.5 rounded border border-neutral-700">FEATURED</span>}
                          {p.bestSeller && <span className="bg-purple-500/20 text-purple-300 text-[9px] px-1.5 py-0.5 rounded">BESTSELLER</span>}
                        </td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => openEditProduct(p)}
                            className="p-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded border border-neutral-800"
                            title="Edit Product"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setProductToDelete(p)}
                            className="p-1.5 bg-neutral-900 hover:bg-red-950 text-red-400 hover:text-red-300 rounded border border-neutral-800 hover:border-red-800 transition-colors cursor-pointer"
                            title="Permanently Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* TAB 3: ORDER MANAGEMENT */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 border-b border-neutral-900 pb-4">
              <div>
                <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider">
                  Order Management ({orders.length})
                </h2>
                <p className="text-xs text-neutral-400">
                  Update status, attach courier tracking number & view customer address
                </p>
              </div>

              {/* Status Filter */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-neutral-400 uppercase">Status:</span>
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="bg-neutral-950 border border-neutral-800 text-white rounded px-3 py-2 text-xs uppercase"
                >
                  <option value="All">All Statuses</option>
                  <option value="Pending">Pending</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Out for Delivery">Out for Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
              {filteredOrders.map((ord) => (
                <div key={ord.id} className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-4">
                  
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 border-b border-neutral-900 pb-3 text-xs">
                    <div>
                      <span className="font-mono font-bold text-white text-base">{ord.orderId}</span>
                      <span className="text-neutral-500 text-[10px] block font-mono">
                        Placed: {new Date(ord.createdAt).toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="bg-emerald-500/20 text-emerald-300 text-[10px] uppercase font-bold px-2.5 py-1 rounded">
                        {ord.paymentStatus} ({ord.paymentMethod})
                      </span>
                      <span className="font-serif text-xl text-white font-semibold">
                        ₹{ord.totalAmount.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
                    
                    {/* Items */}
                    <div className="space-y-2">
                      <span className="text-neutral-400 font-semibold uppercase text-[10px]">Ordered Perfumes:</span>
                      <div className="space-y-1.5">
                        {ord.items.map((it, idx) => (
                          <div key={idx} className="flex items-center gap-2 bg-neutral-900 p-2 rounded">
                            <img src={it.image} alt={it.name} className="w-8 h-10 object-cover rounded" />
                            <div>
                              <span className="font-serif text-white block">{it.name}</span>
                              <span className="text-[10px] text-neutral-400 font-mono">{it.volume} • Qty: {it.quantity}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Customer Info */}
                    <div className="space-y-1 text-neutral-300 bg-neutral-900/40 p-3 rounded-xl border border-neutral-900">
                      <span className="text-white font-semibold uppercase text-[10px] block">Customer Details:</span>
                      <p className="font-semibold text-white">{ord.customerName}</p>
                      <p className="font-mono text-neutral-400">Phone: {ord.customerMobile}</p>
                      <p className="font-mono text-neutral-400">Email: {ord.customerEmail}</p>
                      <div className="pt-2 text-[11px] text-neutral-400">
                        <strong className="text-neutral-300 block">Shipping Address:</strong>
                        {ord.deliveryAddress.address}, {ord.deliveryAddress.city}, {ord.deliveryAddress.state} - {ord.deliveryAddress.pincode}
                      </div>
                    </div>

                    {/* Status Changer & Tracking */}
                    <div className="space-y-3 bg-neutral-900/60 p-4 rounded-xl border border-neutral-850">
                      <span className="text-neutral-400 font-semibold uppercase text-[10px] block">Update Status & Tracking:</span>
                      
                      <div className="space-y-1.5">
                        <label className="text-neutral-400 text-[10px] uppercase">Current Order Status:</label>
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as OrderStatus)}
                          className="w-full bg-neutral-950 border border-neutral-700 text-white rounded p-2 text-xs font-semibold uppercase cursor-pointer"
                        >
                          <option value="Pending">Pending</option>
                          <option value="Confirmed">Confirmed</option>
                          <option value="Processing">Processing</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Cancelled">Cancelled</option>
                        </select>
                      </div>

                      <div className="space-y-1.5 pt-1">
                        <label className="text-neutral-400 text-[10px] uppercase">Courier Tracking Ref:</label>
                        <input
                          type="text"
                          placeholder="e.g. Bluedart #9823412"
                          defaultValue={ord.trackingNumber || ''}
                          onBlur={(e) => updateOrderStatus(ord.id, ord.status, ord.courierCompany || 'Bluedart Express', e.target.value)}
                          className="w-full bg-neutral-950 border border-neutral-800 text-white rounded p-2 text-xs font-mono"
                        />
                      </div>
                    </div>

                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 4: INVENTORY MANAGEMENT */}
        {activeTab === 'inventory' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider border-b border-neutral-900 pb-3">
              Inventory Stock Control
            </h2>

            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-4">
              <div className="flex items-center gap-2 text-white text-xs font-semibold uppercase tracking-wider">
                <Boxes className="w-4 h-4" />
                <span>Live Perfume Stock Units</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((p) => (
                  <div key={p.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 flex items-center justify-between">
                    <div>
                      <h4 className="font-serif text-neutral-100 text-sm">{p.name}</h4>
                      <span className="text-[10px] text-neutral-500 font-mono">{p.volume} • SKU: {p.sku}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        value={p.stock}
                        onChange={(e) => updateProduct(p.id, { stock: Number(e.target.value), status: Number(e.target.value) === 0 ? 'out_of_stock' : 'available' })}
                        className="w-16 bg-neutral-950 border border-neutral-700 text-white font-mono rounded p-1.5 text-xs text-center font-bold"
                      />
                      <span className="text-xs text-neutral-400">pcs</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: COUPON MANAGEMENT */}
        {activeTab === 'coupons' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
              <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider">
                Promotional Coupon Codes
              </h2>
              <button
                onClick={() => setIsCouponModalOpen(!isCouponModalOpen)}
                className="px-4 py-2 bg-white text-black font-semibold text-xs uppercase tracking-wider rounded flex items-center gap-1.5 hover:bg-neutral-200"
              >
                <Plus className="w-4 h-4" />
                <span>Create Coupon</span>
              </button>
            </div>

            {isCouponModalOpen && (
              <form onSubmit={handleAddCouponSubmit} className="bg-neutral-950 p-6 rounded-xl border border-neutral-850 space-y-4 text-xs max-w-md">
                <h3 className="font-serif text-lg text-neutral-100">Add Promo Coupon</h3>
                <input
                  type="text"
                  required
                  placeholder="Coupon Code (e.g. LUXURY20)"
                  value={couponForm.code}
                  onChange={(e) => setCouponForm({ ...couponForm, code: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded uppercase font-bold"
                />
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="number"
                    required
                    placeholder="Discount %"
                    value={couponForm.discountPercent}
                    onChange={(e) => setCouponForm({ ...couponForm, discountPercent: Number(e.target.value) })}
                    className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded font-mono"
                  />
                  <input
                    type="number"
                    required
                    placeholder="Min Order ₹"
                    value={couponForm.minOrderAmount}
                    onChange={(e) => setCouponForm({ ...couponForm, minOrderAmount: Number(e.target.value) })}
                    className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded font-mono"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-3 bg-white text-black font-bold text-xs uppercase tracking-widest rounded hover:bg-neutral-200"
                >
                  Save Coupon
                </button>
              </form>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {coupons.map((c) => (
                <div key={c.id} className="bg-neutral-950 p-5 rounded-xl border border-neutral-850 space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white font-mono text-base">{c.code}</span>
                    <button onClick={() => toggleCoupon(c.id)} className="text-[10px] uppercase font-semibold text-neutral-400 hover:text-white">
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <div className="text-xs text-neutral-300">
                    Discount: <strong className="text-white">{c.discountPercent}% OFF</strong> (Min ₹{c.minOrderAmount})
                  </div>
                  <button onClick={() => deleteCoupon(c.id)} className="text-[10px] text-red-400 hover:underline uppercase">
                    Delete Code
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB: RAZORPAY GATEWAY LINKING & SETUP */}
        {activeTab === 'razorpay' && (
          <div className="space-y-8">
            <div className="border-b border-neutral-900 pb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-amber-400 font-mono uppercase tracking-widest font-bold block mb-1">
                  PREPAID PAYMENT INTEGRATION
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl text-neutral-100 uppercase tracking-wider">
                  Razorpay Merchant Link & Payment Settings
                </h2>
                <p className="text-xs text-neutral-400 mt-1">
                  Link your personal/business Razorpay Key ID, UPI ID, Payment Page link & QR code. Customers will pay directly to your account.
                </p>
              </div>
              <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 text-xs font-mono font-bold rounded border border-emerald-500/30">
                GATEWAY ACTIVE
              </span>
            </div>

            <form onSubmit={handleSaveRazorpaySettings} className="bg-neutral-950 p-6 sm:p-8 rounded-2xl border border-amber-500/30 space-y-6 text-xs">
              
              <div className="flex items-center justify-between border-b border-neutral-850 pb-4">
                <h3 className="font-serif text-xl text-neutral-100 flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-400" />
                  <span>Razorpay API Credentials & UPI Configuration</span>
                </h3>

                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={razorpayForm.razorpayEnabled}
                    onChange={(e) => setRazorpayForm({ ...razorpayForm, razorpayEnabled: e.target.checked })}
                    className="accent-amber-400 w-4 h-4"
                  />
                  <span className="font-bold uppercase text-[11px]">Enable Razorpay Checkout</span>
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Razorpay Key ID */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 uppercase font-semibold text-[11px] block">
                    Razorpay Key ID (Public Key) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="rzp_live_xxxxxxxxxxxxx or rzp_test_xxxxxxxxxxxxx"
                    value={razorpayForm.razorpayKeyId}
                    onChange={(e) => setRazorpayForm({ ...razorpayForm, razorpayKeyId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-amber-300 p-3 rounded font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-500">Find this in Razorpay Dashboard → Settings → API Keys.</p>
                </div>

                {/* Razorpay Secret Key */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 uppercase font-semibold text-[11px] block">
                    Razorpay Key Secret (Optional / Private)
                  </label>
                  <input
                    type="password"
                    placeholder="••••••••••••••••"
                    value={razorpayForm.razorpayKeySecret}
                    onChange={(e) => setRazorpayForm({ ...razorpayForm, razorpayKeySecret: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

                {/* Razorpay Merchant UPI ID */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 uppercase font-semibold text-[11px] block">
                    Merchant UPI ID (GPay / PhonePe / Paytm / BHIM) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 8286934502@okicici or hamza@upi"
                    value={razorpayForm.razorpayUpiId}
                    onChange={(e) => setRazorpayForm({ ...razorpayForm, razorpayUpiId: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-emerald-400 p-3 rounded font-mono text-xs focus:border-amber-400 focus:outline-none"
                  />
                  <p className="text-[10px] text-neutral-500">Customer payments go directly to this UPI address.</p>
                </div>

                {/* Razorpay Payment Page Link */}
                <div className="space-y-1.5">
                  <label className="text-neutral-300 uppercase font-semibold text-[11px] block">
                    Razorpay Payment Link (Razorpay.me / Custom Link)
                  </label>
                  <input
                    type="url"
                    placeholder="https://razorpay.me/@jaanpahchan"
                    value={razorpayForm.razorpayPaymentLink}
                    onChange={(e) => setRazorpayForm({ ...razorpayForm, razorpayPaymentLink: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded text-xs focus:border-amber-400 focus:outline-none"
                  />
                </div>

              </div>

              {/* QR Code Upload Section */}
              <div className="bg-neutral-900/80 p-5 rounded-xl border border-neutral-800 space-y-4">
                <h4 className="text-white font-serif text-base uppercase tracking-wider flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  Razorpay Merchant QR Code (For Scan & Pay)
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="space-y-2">
                    <label className="text-neutral-400 text-[10px] uppercase font-medium block">
                      Upload QR Code Image File:
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const dataUrl = event.target?.result as string;
                            if (dataUrl) {
                              setRazorpayForm((prev) => ({ ...prev, razorpayQrImageUrl: dataUrl }));
                              showToast('Razorpay QR Image selected!');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 p-2 text-xs rounded file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-amber-400 file:text-black hover:file:bg-amber-300"
                    />

                    <label className="text-neutral-400 text-[10px] uppercase font-medium block pt-2">
                      Or Paste QR Image URL:
                    </label>
                    <input
                      type="text"
                      placeholder="https://domain.com/razorpay-qr.jpg"
                      value={razorpayForm.razorpayQrImageUrl}
                      onChange={(e) => setRazorpayForm({ ...razorpayForm, razorpayQrImageUrl: e.target.value })}
                      className="w-full bg-neutral-950 border border-neutral-800 text-white p-2.5 rounded font-mono text-[11px]"
                    />
                  </div>

                  {/* QR Preview */}
                  <div className="flex flex-col items-center justify-center p-3 bg-neutral-950 rounded-xl border border-neutral-800 text-center">
                    {razorpayForm.razorpayQrImageUrl ? (
                      <img src={razorpayForm.razorpayQrImageUrl} alt="Razorpay QR" className="w-32 h-32 object-contain rounded bg-white p-2" />
                    ) : (
                      <div className="w-32 h-32 bg-neutral-900 border border-dashed border-neutral-700 rounded flex flex-col items-center justify-center text-[10px] text-neutral-500 p-2">
                        <span>No QR Uploaded</span>
                        <span className="text-[8px] text-neutral-600 mt-1">UPI ID will be shown</span>
                      </div>
                    )}
                    <span className="text-[10px] text-neutral-400 font-mono mt-2">Live QR Preview</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-8 py-3 bg-amber-400 hover:bg-amber-300 text-black font-bold uppercase text-xs tracking-widest rounded shadow-xl transition-all"
                >
                  SAVE RAZORPAY SETTINGS
                </button>
              </div>

            </form>
          </div>
        )}

        {/* TAB 6: PAYMENTS LOG */}
        {activeTab === 'payments' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider border-b border-neutral-900 pb-3">
              Prepaid Payment Settlement Log
            </h2>

            <div className="bg-neutral-950 rounded-2xl border border-neutral-850 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-neutral-300">
                  <thead className="bg-neutral-900 text-neutral-400 uppercase tracking-wider text-[10px] border-b border-neutral-800">
                    <tr>
                      <th className="p-3">Razorpay Ref ID</th>
                      <th className="p-3">Order Ref</th>
                      <th className="p-3">Customer</th>
                      <th className="p-3">Amount Paid</th>
                      <th className="p-3">Payment Mode</th>
                      <th className="p-3">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-900">
                    {orders.map((ord) => (
                      <tr key={ord.id}>
                        <td className="p-3 font-mono text-white">{ord.razorpayPaymentId || 'pay_rzp_mock'}</td>
                        <td className="p-3 font-mono font-bold">{ord.orderId}</td>
                        <td className="p-3">{ord.customerName}</td>
                        <td className="p-3 font-serif text-white font-medium">₹{ord.totalAmount.toLocaleString('en-IN')}</td>
                        <td className="p-3 text-[10px] uppercase font-semibold text-emerald-400">{ord.paymentMethod}</td>
                        <td className="p-3 font-mono text-[10px] text-neutral-500">{new Date(ord.createdAt).toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* TAB 7: ANALYTICS & REPORTS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider border-b border-neutral-900 pb-3">
              Sales & Olfactory Analytics
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">AVERAGE ORDER VALUE</span>
                <div className="font-serif text-3xl text-white font-medium">
                  ₹{orders.length ? Math.round(totalRevenue / orders.length).toLocaleString('en-IN') : 0}
                </div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">DELIVERY RATE</span>
                <div className="font-serif text-3xl text-emerald-400 font-medium">100% Pan-India</div>
              </div>

              <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-2">
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">MOST POPULAR FAMILY</span>
                <div className="font-serif text-2xl text-neutral-100 font-medium">Extraits & Attars</div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 8: WEBSITE CMS & SETTINGS */}
        {activeTab === 'cms' && (
          <div className="space-y-8">
            <h2 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider border-b border-neutral-900 pb-3">
              Website CMS & Branding Control
            </h2>

            {/* Store Header Announcement & Contact Info */}
            <form onSubmit={handleSaveSettings} className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-4 text-xs">
              <h3 className="font-serif text-xl text-neutral-100">Boutique Information</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase font-medium">Brand Name</label>
                  <input
                    type="text"
                    value={settingsForm.brandName}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandName: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase font-medium">Brand Tagline</label>
                  <input
                    type="text"
                    value={settingsForm.brandTagline}
                    onChange={(e) => setSettingsForm({ ...settingsForm, brandTagline: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 uppercase font-medium">Announcement Bar Text</label>
                <input
                  type="text"
                  value={settingsForm.announcementBarText}
                  onChange={(e) => setSettingsForm({ ...settingsForm, announcementBarText: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                />
              </div>

              {/* HERO BACKGROUND VIDEO UPLOADER & CONTROLLER */}
              <div className="bg-neutral-900/90 p-5 rounded-xl border border-amber-500/30 space-y-4">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                  <div>
                    <h4 className="text-white font-serif text-base uppercase tracking-wider flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-amber-400" />
                      Homepage Hero Background Video Manager
                    </h4>
                    <p className="text-[11px] text-neutral-400">
                      Upload any MP4 / WebM video from your device to instantly display on the Homepage Hero loop.
                    </p>
                  </div>
                  <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-full uppercase font-mono border border-amber-500/30">
                    LIVE SYNC
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  {/* File Upload Trigger */}
                  <div className="space-y-2">
                    <label className="text-neutral-300 text-[11px] uppercase font-semibold block">
                      Select Video File From Device (.mp4 / .webm):
                    </label>
                    <input
                      type="file"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const resultUrl = event.target?.result as string;
                            if (resultUrl) {
                              setSettingsForm((prev) => ({
                                ...prev,
                                heroVideoUrl: resultUrl,
                              }));
                              showToast('Video selected! Click "Save Settings" to apply live.', 'info');
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 p-2.5 text-xs rounded file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-amber-400 file:text-black hover:file:bg-amber-300 cursor-pointer"
                    />

                    <div className="pt-2">
                      <label className="text-neutral-400 text-[10px] uppercase font-medium block pb-1">Or Paste Video URL Direct Path:</label>
                      <input
                        type="text"
                        placeholder="e.g. /hamza_video.mp4 or https://domain.com/video.mp4"
                        value={settingsForm.heroVideoUrl}
                        onChange={(e) => setSettingsForm({ ...settingsForm, heroVideoUrl: e.target.value })}
                        className="w-full bg-neutral-950 border border-neutral-800 text-amber-300 font-mono text-[11px] p-2.5 rounded"
                      />
                    </div>
                  </div>

                  {/* Live Video Preview Box */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-neutral-400 uppercase tracking-widest block font-medium">LIVE VIDEO PREVIEW</span>
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-neutral-800 bg-black">
                      {settingsForm.heroVideoUrl ? (
                        <video
                          autoPlay
                          loop
                          muted
                          playsInline
                          key={settingsForm.heroVideoUrl}
                          className="w-full h-full object-cover"
                        >
                          <source src={settingsForm.heroVideoUrl} type="video/mp4" />
                        </video>
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-xs text-neutral-500">
                          No Video Selected
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* DYNAMIC IMAGE MANAGERS (HERO & SHOWROOM) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Hero Image Manager */}
                  <div className="bg-neutral-900/90 p-5 rounded-xl border border-amber-500/30 space-y-4">
                    <h4 className="text-white font-serif text-base uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      Hero Background Image
                    </h4>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.src = event.target?.result as string;
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              canvas.width = 1200;
                              canvas.height = Math.round((img.height * 1200) / img.width);
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                              setSettingsForm(prev => ({ ...prev, heroImageUrl: dataUrl }));
                              showToast('Hero image updated! Click Save to apply.', 'success');
                            };
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-amber-400 file:text-black cursor-pointer"
                    />
                    <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-black">
                      <img src={settingsForm.heroImageUrl} className="w-full h-full object-cover" alt="Hero Preview" />
                    </div>
                  </div>

                  {/* Showroom Image Manager */}
                  <div className="bg-neutral-900/90 p-5 rounded-xl border border-amber-500/30 space-y-4">
                    <h4 className="text-white font-serif text-base uppercase tracking-wider flex items-center gap-2 border-b border-neutral-800 pb-2">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      Showroom / Boutique Photo
                    </h4>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            const img = new Image();
                            img.src = event.target?.result as string;
                            img.onload = () => {
                              const canvas = document.createElement('canvas');
                              canvas.width = 1000;
                              canvas.height = Math.round((img.height * 1000) / img.width);
                              const ctx = canvas.getContext('2d');
                              ctx?.drawImage(img, 0, 0, canvas.width, canvas.height);
                              const dataUrl = canvas.toDataURL('image/jpeg', 0.8);
                              setSettingsForm(prev => ({ ...prev, showroomImageUrl: dataUrl }));
                              showToast('Showroom image updated! Click Save to apply.', 'success');
                            };
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                      className="w-full text-xs text-neutral-400 file:mr-3 file:py-1.5 file:px-3 file:rounded file:border-0 file:bg-amber-400 file:text-black cursor-pointer"
                    />
                    <div className="aspect-video rounded-lg overflow-hidden border border-neutral-800 bg-black">
                      <img src={settingsForm.showroomImageUrl} className="w-full h-full object-cover" alt="Showroom Preview" />
                    </div>
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="px-8 py-3 bg-white text-black font-bold text-xs tracking-wider uppercase rounded hover:bg-amber-400 transition-colors shadow-lg"
              >
                Save Settings & Apply Video Live
              </button>
            </form>

            {/* Banner Manager */}
            <div className="bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-6">
              <h3 className="font-serif text-xl text-neutral-100">Homepage Banner Management</h3>

              <form onSubmit={handleAddBannerSubmit} className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="Banner Title"
                    value={bannerForm.title}
                    onChange={(e) => setBannerForm({ ...bannerForm, title: e.target.value })}
                    className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                  />
                  <input
                    type="text"
                    placeholder="Subtitle"
                    value={bannerForm.subtitle}
                    onChange={(e) => setBannerForm({ ...bannerForm, subtitle: e.target.value })}
                    className="bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                  />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Image URL"
                  value={bannerForm.imageUrl}
                  onChange={(e) => setBannerForm({ ...bannerForm, imageUrl: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                />
                <button type="submit" className="px-5 py-2.5 bg-neutral-900 text-white border border-neutral-800 text-xs uppercase font-medium rounded hover:bg-neutral-800">
                  + Add Banner Slide
                </button>
              </form>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {banners.map((b) => (
                  <div key={b.id} className="bg-neutral-900 p-4 rounded-xl border border-neutral-800 space-y-2 relative">
                    <img src={b.imageUrl} alt={b.title} className="w-full h-28 object-cover rounded" />
                    <h4 className="font-serif text-neutral-100 font-medium">{b.title}</h4>
                    <button onClick={() => deleteBanner(b.id)} className="text-red-400 text-xs">Remove Banner</button>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* TAB 9: COMBO & BUNDLE MANAGER ("Buy Any 5 @ ₹1499") */}
        {activeTab === 'combo' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-r from-amber-950/80 via-neutral-900 to-amber-950/80 p-6 rounded-2xl border border-amber-500/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/40 text-amber-300 text-[10px] uppercase tracking-widest font-bold mb-2">
                  🔥 INSTAGRAM VIRAL DEALS
                </div>
                <h2 className="font-serif text-2xl text-white font-bold uppercase tracking-wide">
                  Buy Any 5 Combo Offer Manager
                </h2>
                <p className="text-xs text-neutral-300 mt-1">
                  Change combo offer price (e.g. ₹1499), offer headline, bottle count, and select which perfumes customers can pick in their 5-bottle bundle!
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                  comboForm.comboOfferEnabled ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                }`}>
                  {comboForm.comboOfferEnabled ? 'LIVE ON STORE' : 'OFFER DISABLED'}
                </span>
              </div>
            </div>

            <form onSubmit={handleSaveComboSettings} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Offer Pricing & Banner Config */}
              <div className="lg:col-span-1 bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-4">
                <h3 className="font-serif text-lg text-amber-400 font-bold uppercase tracking-wider flex items-center gap-2 border-b border-neutral-850 pb-3">
                  <span>🏷️ Price & Offer Config</span>
                </h3>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-medium text-neutral-300">Offer Status</label>
                  <select
                    value={comboForm.comboOfferEnabled ? 'true' : 'false'}
                    onChange={(e) => setComboForm((prev) => ({ ...prev, comboOfferEnabled: e.target.value === 'true' }))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl text-xs font-bold"
                  >
                    <option value="true">Active (Enabled on Storefront)</option>
                    <option value="false">Inactive (Hide Banner & Deal)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-medium text-neutral-300">Offer Headline / Title</label>
                  <input
                    type="text"
                    required
                    value={comboForm.comboOfferTitle}
                    onChange={(e) => setComboForm((prev) => ({ ...prev, comboOfferTitle: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl text-xs font-bold"
                    placeholder="e.g. ANY 5 PERFUMES AT JUST ₹1499"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs uppercase font-medium text-amber-400 font-bold">Offer Price (₹) *</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={comboForm.comboOfferPrice}
                      onChange={(e) => setComboForm((prev) => ({ ...prev, comboOfferPrice: Number(e.target.value) || 1499 }))}
                      className="w-full bg-amber-950/40 border border-amber-500/50 text-amber-300 p-3 rounded-xl text-sm font-black font-mono"
                      placeholder="1499"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs uppercase font-medium text-neutral-400">Original MRP (₹)</label>
                    <input
                      type="number"
                      value={comboForm.comboOfferOriginalPrice}
                      onChange={(e) => setComboForm((prev) => ({ ...prev, comboOfferOriginalPrice: Number(e.target.value) || 2499 }))}
                      className="w-full bg-neutral-900 border border-neutral-800 text-neutral-400 p-3 rounded-xl text-xs font-mono line-through"
                      placeholder="2499"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-medium text-neutral-300">Number of Bottles in Deal</label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="20"
                    value={comboForm.comboBottleCount}
                    onChange={(e) => setComboForm((prev) => ({ ...prev, comboBottleCount: Number(e.target.value) || 5 }))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl text-xs font-bold font-mono"
                    placeholder="5"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs uppercase font-medium text-neutral-300">Offer Tagline / Description</label>
                  <textarea
                    rows={3}
                    value={comboForm.comboOfferDescription}
                    onChange={(e) => setComboForm((prev) => ({ ...prev, comboOfferDescription: e.target.value }))}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded-xl text-xs leading-relaxed"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-widest text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  <Zap className="w-4 h-4" />
                  <span>SAVE COMBO PRICE & CONFIG</span>
                </button>
              </div>

              {/* Product Selection for Combo */}
              <div className="lg:col-span-2 bg-neutral-950 p-6 rounded-2xl border border-neutral-850 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-neutral-850 pb-3">
                  <div>
                    <h3 className="font-serif text-lg text-white font-bold uppercase tracking-wider">
                      Included Perfumes in Combo ({comboForm.comboProductIds.length} Selected)
                    </h3>
                    <p className="text-xs text-neutral-400">
                      Tick perfumes below to include them in the 5-bottle combo deal selection
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleSelectAllComboProducts}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-amber-300 text-[10px] uppercase font-bold rounded-lg cursor-pointer"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllComboProducts}
                      className="px-3 py-1.5 bg-neutral-900 border border-neutral-800 hover:border-neutral-700 text-neutral-400 hover:text-white text-[10px] uppercase font-bold rounded-lg cursor-pointer"
                    >
                      Clear
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        openCreateProduct();
                        setProductForm((prev) => ({ ...prev, category: 'Deals & Combos' }));
                      }}
                      className="px-3 py-1.5 bg-amber-400 text-black font-extrabold text-[10px] uppercase tracking-wider rounded-lg hover:bg-amber-300 cursor-pointer flex items-center gap-1"
                    >
                      <span>➕</span> Add New Combo Perfume
                    </button>
                  </div>
                </div>

                {/* Product Grid Checklist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[450px] overflow-y-auto pr-1">
                  {products.map((p) => {
                    const isSelected = comboForm.comboProductIds.includes(p.id);
                    return (
                      <div
                        key={p.id}
                        onClick={() => toggleComboProduct(p.id)}
                        className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center gap-3 select-none ${
                          isSelected
                            ? 'bg-amber-950/30 border-amber-500/60 text-white'
                            : 'bg-neutral-900/60 border-neutral-850 text-neutral-400 hover:border-neutral-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {}}
                          className="w-4 h-4 accent-amber-400 rounded cursor-pointer shrink-0"
                        />
                        <img
                          src={p.images[0]}
                          alt={p.name}
                          className="w-10 h-10 object-cover rounded-lg bg-neutral-800 shrink-0"
                        />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-white truncate">{p.name}</h4>
                          <span className="text-[10px] text-amber-400 font-mono">
                            {p.category} • ₹{p.salePrice || p.price}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="pt-3 border-t border-neutral-850 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-3 bg-amber-400 hover:bg-amber-300 text-black font-black uppercase tracking-wider text-xs rounded-xl shadow-lg transition-all cursor-pointer flex items-center gap-2"
                  >
                    <Zap className="w-4 h-4" />
                    <span>SAVE ALL COMBO SELECTIONS</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        )}

      </div>

      {/* CREATE / EDIT PRODUCT MODAL */}
      {isProductModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto space-y-6 animate-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
              <h3 className="font-serif text-2xl text-neutral-100 uppercase tracking-wider">
                {editingProductId ? 'Edit Perfume' : 'Create New Perfume'}
              </h3>
              <button onClick={() => setIsProductModalOpen(false)} className="text-neutral-400 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleProductSubmit} className="space-y-4 text-xs">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase font-medium">Perfume Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Royal Amber Extraits"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase font-medium">SKU Reference</label>
                  <input
                    type="text"
                    value={productForm.sku}
                    onChange={(e) => setProductForm({ ...productForm, sku: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white font-mono p-3 rounded"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase font-medium">Category *</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded cursor-pointer"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-neutral-400 uppercase font-medium">Total Stock Quantity *</label>
                  <input
                    type="number"
                    required
                    value={productForm.stock}
                    onChange={(e) => setProductForm({ ...productForm, stock: Number(e.target.value) })}
                    className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 font-mono rounded"
                  />
                </div>
              </div>

              {/* BOTTLE SIZES & INDIVIDUAL PRICING (12ml, 50ml, 100ml / Custom ML & Prices) */}
              <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-4 sm:p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-neutral-800 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold uppercase tracking-wider text-xs flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        Bottle Sizes &amp; Individual Pricing (बॉटल साइज / ML और अलग-अलग रेट)
                      </span>
                      <span className="bg-amber-400/20 text-amber-300 text-[10px] px-2 py-0.5 rounded font-bold font-mono">
                        {productForm.volumeVariants.length} Sizes
                      </span>
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      होम पेज पर कस्टमर को ये बॉटल साइज (उदा. 12ml, 50ml, 100ml) दिखेंगे। आप ML का नाम भी बदल सकते हैं (उदा. 24ml, 99ml आदि) और हर ML का अलग MRP व Sale Price सेट कर सकते हैं।
                    </p>
                  </div>

                  {/* Presets */}
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="text-[10px] text-neutral-500 uppercase font-mono hidden sm:inline">Presets:</span>
                    <button
                      type="button"
                      onClick={() => applyVariantPreset('perfume')}
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] rounded font-mono border border-neutral-700 cursor-pointer"
                      title="Set 12ml / 50ml / 100ml"
                    >
                      12ml/50ml/100ml
                    </button>
                    <button
                      type="button"
                      onClick={() => applyVariantPreset('attar')}
                      className="px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[10px] rounded font-mono border border-neutral-700 cursor-pointer"
                      title="Set 6ml / 12ml / 24ml"
                    >
                      6ml/12ml/24ml
                    </button>
                  </div>
                </div>

                {/* Variants List */}
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-[10px] uppercase font-bold tracking-wider text-neutral-400 px-1">
                    <div className="col-span-4 sm:col-span-3">Size / ML (बॉटल साइज)</div>
                    <div className="col-span-4 sm:col-span-4">Original MRP ₹</div>
                    <div className="col-span-3 sm:col-span-4">Offer / Sale Price ₹</div>
                    <div className="col-span-1 text-center">Del</div>
                  </div>

                  {productForm.volumeVariants.map((variant, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-12 gap-2 items-center bg-neutral-950 p-2 sm:p-2.5 rounded-lg border border-neutral-800 hover:border-neutral-700 transition-colors"
                    >
                      {/* ML Label Input */}
                      <div className="col-span-4 sm:col-span-3">
                        <input
                          type="text"
                          required
                          placeholder="e.g. 12ml"
                          value={variant.volume}
                          onChange={(e) => handleVariantChange(idx, 'volume', e.target.value)}
                          className="w-full bg-neutral-900 border border-neutral-700 text-white font-mono font-bold text-xs p-2 rounded focus:ring-1 focus:ring-amber-400 uppercase"
                        />
                      </div>

                      {/* Original Price (MRP) Input */}
                      <div className="col-span-4 sm:col-span-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-500 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            required
                            min="0"
                            placeholder="MRP"
                            value={variant.price || ''}
                            onChange={(e) => handleVariantChange(idx, 'price', e.target.value)}
                            className="w-full bg-neutral-900 border border-neutral-700 text-neutral-300 font-mono text-xs pl-6 pr-2 py-2 rounded focus:ring-1 focus:ring-amber-400"
                          />
                        </div>
                      </div>

                      {/* Offer / Sale Price Input */}
                      <div className="col-span-3 sm:col-span-4">
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-emerald-500 font-mono text-xs">₹</span>
                          <input
                            type="number"
                            min="0"
                            placeholder="Sale Price"
                            value={variant.salePrice || ''}
                            onChange={(e) => handleVariantChange(idx, 'salePrice', e.target.value)}
                            className="w-full bg-neutral-900 border border-emerald-900/60 text-emerald-400 font-mono font-bold text-xs pl-6 pr-2 py-2 rounded focus:ring-1 focus:ring-emerald-400"
                          />
                        </div>
                      </div>

                      {/* Delete Row */}
                      <div className="col-span-1 flex justify-center">
                        <button
                          type="button"
                          disabled={productForm.volumeVariants.length <= 1}
                          onClick={() => handleRemoveVariantRow(idx)}
                          className="p-1.5 text-neutral-500 hover:text-red-400 disabled:opacity-20 cursor-pointer disabled:cursor-not-allowed transition-colors"
                          title="Delete this size"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Add Row Button & Live Preview */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-neutral-800/80">
                  <button
                    type="button"
                    onClick={handleAddVariantRow}
                    className="px-3 py-1.5 bg-neutral-800 hover:bg-neutral-750 text-white font-medium text-xs rounded-lg border border-neutral-700 flex items-center gap-1.5 w-fit cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5 text-amber-400" />
                    <span>+ Add More Size / ML (और साइज जोड़ें)</span>
                  </button>

                  {/* Live Preview on Home Page */}
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-neutral-400 font-mono uppercase">Home Page Preview:</span>
                    <div className="flex gap-1.5 overflow-x-auto">
                      {productForm.volumeVariants.map((v, i) => (
                        <div
                          key={i}
                          className="bg-neutral-950 border border-neutral-700 rounded-lg px-2.5 py-1 text-center font-mono shrink-0"
                        >
                          <div className="text-[10px] font-bold text-white uppercase">{v.volume || '—'}</div>
                          <div className="text-[9px] text-emerald-400 font-bold">₹{v.salePrice || v.price || 0}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-neutral-400 uppercase font-medium">Description Details *</label>
                <textarea
                  rows={3}
                  required
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  className="w-full bg-neutral-900 border border-neutral-800 text-white p-3 rounded"
                />
              </div>

              {/* Fragrance Notes Inputs */}
              <div className="bg-neutral-900 p-4 rounded-xl border border-neutral-850 space-y-3">
                <span className="text-white font-semibold uppercase text-[10px] block">Fragrance Pyramid Notes:</span>
                
                <input
                  type="text"
                  placeholder="Top Notes (comma separated: Bergamot, Pink Pepper)"
                  value={productForm.topNotesText}
                  onChange={(e) => setProductForm({ ...productForm, topNotesText: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white p-2.5 rounded"
                />

                <input
                  type="text"
                  placeholder="Heart/Middle Notes (comma separated: Damask Rose, Jasmine)"
                  value={productForm.middleNotesText}
                  onChange={(e) => setProductForm({ ...productForm, middleNotesText: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white p-2.5 rounded"
                />

                <input
                  type="text"
                  placeholder="Base Notes (comma separated: Cambodian Oud, Amber, Vanilla)"
                  value={productForm.baseNotesText}
                  onChange={(e) => setProductForm({ ...productForm, baseNotesText: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 text-white p-2.5 rounded"
                />
              </div>

              {/* Image Upload File Picker & Textarea */}
              <div className="space-y-3 bg-neutral-900 p-4 rounded-xl border border-neutral-850">
                <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
                  <label className="text-white uppercase font-semibold text-[11px] flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span>Upload Product Photos (File or URL)</span>
                  </label>
                  <span className="text-[10px] text-neutral-400 font-mono">Select file from device or paste links</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-neutral-400 text-[10px] uppercase font-medium block">
                    Pick Perfume Photo File from Phone / Device:
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleProductImageFileUpload}
                    className="w-full bg-neutral-950 border border-neutral-800 text-neutral-300 p-2 text-xs rounded file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:bg-amber-400 file:text-black hover:file:bg-amber-300 cursor-pointer"
                  />
                </div>

                <div className="space-y-1 pt-1">
                  <label className="text-neutral-400 text-[10px] uppercase font-medium block">Or Paste Image Web URLs (One per line):</label>
                  <textarea
                    rows={3}
                    value={productForm.imagesText}
                    placeholder="https://example.com/photo.jpg"
                    onChange={(e) => setProductForm({ ...productForm, imagesText: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 text-amber-300 p-3 font-mono text-[11px] rounded"
                  />
                </div>

                {/* Images Preview & Clear Actions */}
                {productForm.imagesText.trim() && (
                  <div className="space-y-2 pt-2 border-t border-neutral-800/60">
                    <div className="flex items-center justify-between">
                      <span className="text-neutral-400 text-[10px] uppercase font-bold tracking-wider">Loaded Photos ({productForm.imagesText.split('\n').filter(Boolean).length}):</span>
                      <button
                        type="button"
                        onClick={() => setProductForm({ ...productForm, imagesText: '' })}
                        className="text-red-400 hover:text-red-300 text-[10px] uppercase font-bold tracking-wider flex items-center gap-1 cursor-pointer"
                      >
                        Remove All Photos
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-3 max-h-56 overflow-y-auto p-3 bg-neutral-950 rounded-xl border border-neutral-800">
                      {productForm.imagesText.split('\n').filter(Boolean).map((url, i) => (
                        <div key={i} className="relative w-20 h-24 rounded-lg border border-neutral-800 overflow-hidden bg-neutral-900 shadow-lg">
                          <img src={url} alt="preview" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const remaining = productForm.imagesText.split('\n').filter(Boolean).filter((_, idx) => idx !== i).join('\n');
                              setProductForm({ ...productForm, imagesText: remaining });
                              showToast('Photo removed', 'info');
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors cursor-pointer shadow-md z-10"
                            title="Delete Photo"
                          >
                            <X className="w-3 h-3" />
                          </button>
                          <div className="absolute bottom-0 left-0 right-0 bg-black/50 py-0.5 text-center text-[8px] text-white font-mono">
                            #{i + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap gap-4 pt-2 text-xs">
                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.featured}
                    onChange={(e) => setProductForm({ ...productForm, featured: e.target.checked })}
                    className="accent-white w-4 h-4"
                  />
                  <span>Featured Perfume</span>
                </label>

                <label className="flex items-center gap-2 text-neutral-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={productForm.bestSeller}
                    onChange={(e) => setProductForm({ ...productForm, bestSeller: e.target.checked })}
                    className="accent-white w-4 h-4"
                  />
                  <span>Best Seller Badge</span>
                </label>
              </div>

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsProductModalOpen(false)}
                  className="px-5 py-3 bg-neutral-900 text-neutral-400 uppercase text-xs rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-white hover:bg-neutral-200 text-black font-bold uppercase text-xs tracking-widest rounded shadow-lg"
                >
                  Save Perfume
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CONFIRM PERMANENT PRODUCT DELETION MODAL */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-950 border border-neutral-800 p-6 sm:p-8 rounded-2xl max-w-md w-full space-y-5 animate-in zoom-in-95 duration-150 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-500/10 border border-red-500/30 rounded-full flex items-center justify-center mx-auto text-red-400">
              <Trash2 className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h3 className="font-serif text-xl font-bold text-white uppercase tracking-wider">
                Delete Product Permanently?
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Are you sure you want to permanently remove <strong className="text-white">"{productToDelete.name}"</strong>?
              </p>
              <p className="text-[11px] text-red-400 bg-red-950/30 border border-red-900/50 p-2.5 rounded-lg mt-2 font-mono">
                ⚠️ This item will be permanently removed from your database and customer store. It will NOT come back even after refreshing the website.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="flex-1 py-3 bg-neutral-900 hover:bg-neutral-800 text-neutral-300 font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={async () => {
                  const id = productToDelete.id;
                  setProductToDelete(null);
                  await deleteProduct(id);
                }}
                className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-colors cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
