import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Product,
  Category,
  CartItem,
  Order,
  UserProfile,
  Coupon,
  Banner,
  StoreSettings,
  WholesaleEnquiry,
  OrderStatus,
  SavedAddress
} from '../types';
import {
  INITIAL_PRODUCTS,
  INITIAL_CATEGORIES,
  INITIAL_BANNERS,
  INITIAL_COUPONS,
  INITIAL_SETTINGS
} from '../data/seedData';
import { db, auth } from '../lib/firebase';
import { handleFirestoreError, OperationType } from '../lib/firestoreErrors';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  addDoc,
  query,
  where
} from 'firebase/firestore';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';

interface StoreContextType {
  // Navigation & Page State
  currentPage: string;
  setCurrentPage: (page: string, params?: Record<string, any>) => void;
  pageParams: Record<string, any>;

  // Catalog Data
  products: Product[];
  categories: Category[];
  banners: Banner[];
  coupons: Coupon[];
  settings: StoreSettings;
  isLoadingData: boolean;

  // Cart Management
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    volume?: string,
    variantPrice?: number,
    variantSalePrice?: number
  ) => void;
  removeFromCart: (productId: string, volume?: string) => void;
  updateCartQuantity: (productId: string, quantity: number, volume?: string) => void;
  clearCart: () => void;
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;
  cartSubtotal: number;
  cartDiscount: number;
  cartDeliveryFee: number;
  cartTotal: number;

  // Customer Auth & Profile
  currentUser: UserProfile | null;
  registerCustomer: (data: { fullName: string; email: string; mobile: string; password: string }) => Promise<{ success: boolean; message: string }>;
  loginCustomer: (email: string, password: string) => Promise<{ success: boolean; message: string; isAdmin?: boolean }>;
  logoutUser: () => Promise<void>;
  updateCustomerProfile: (data: Partial<UserProfile>) => Promise<void>;
  addSavedAddress: (address: Omit<SavedAddress, 'id'>) => Promise<void>;
  removeSavedAddress: (addressId: string) => Promise<void>;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderId' | 'createdAt'>) => Promise<Order>;
  updateOrderStatus: (orderId: string, status: OrderStatus, trackingNumber?: string, courierCompany?: string) => Promise<void>;
  getUserOrders: (userId: string) => Order[];

  // Admin Management Actions
  isAdminLoggedIn: boolean;
  loginAdmin: (email: string, password: string) => Promise<{ success: boolean; message: string; isAdmin?: boolean }>;
  logoutAdmin: () => void;
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  duplicateProduct: (id: string) => Promise<void>;
  toggleStockStatus: (id: string) => Promise<void>;

  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;

  addCoupon: (coupon: Omit<Coupon, 'id'>) => Promise<void>;
  updateCoupon: (id: string, coupon: Partial<Coupon>) => Promise<void>;
  deleteCoupon: (id: string) => Promise<void>;
  toggleCoupon: (id: string) => Promise<void>;

  addBanner: (banner: Omit<Banner, 'id'>) => Promise<void>;
  updateBanner: (id: string, banner: Partial<Banner>) => Promise<void>;
  deleteBanner: (id: string) => Promise<void>;

  updateSettings: (newSettings: Partial<StoreSettings>) => Promise<void>;
  submitWholesaleEnquiry: (data: Omit<WholesaleEnquiry, 'id' | 'createdAt'>) => Promise<void>;

  // Quick Toast / Alert system
  toastMessage: string | null;
  showToast: (msg: string, type?: string) => void;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Navigation State with LocalStorage & URL Hash Persistence
  const [currentPage, setCurrentPageState] = useState<string>(() => {
    try {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || hash === 'admin-dashboard' || hash === '/admin') {
        const isAdmin = localStorage.getItem('aaf_admin_auth') === 'true';
        return isAdmin ? 'admin-dashboard' : 'home';
      }
      const saved = localStorage.getItem('aaf_current_page');
      if (saved === 'admin' || saved === 'admin-dashboard') {
        const isAdmin = localStorage.getItem('aaf_admin_auth') === 'true';
        return isAdmin ? 'admin-dashboard' : 'home';
      }
      return saved || 'home';
    } catch (e) {
      return 'home';
    }
  });
  const [pageParams, setPageParams] = useState<Record<string, any>>({});

  const setCurrentPage = (page: string, params: Record<string, any> = {}) => {
    setCurrentPageState(page);
    setPageParams(params);
    try {
      localStorage.setItem('aaf_current_page', page);
      if (page === 'admin' || page === 'admin-dashboard') {
        window.location.hash = 'admin';
      } else if (window.location.hash === '#admin') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Listen to hash changes (e.g. typing #admin in URL)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '').toLowerCase();
      if (hash === 'admin' || hash === 'admin-dashboard' || hash === '/admin') {
        const isAdmin = localStorage.getItem('aaf_admin_auth') === 'true';
        if (isAdmin) {
          setCurrentPageState('admin-dashboard');
        } else {
          setCurrentPageState('home');
        }
      }
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  // State initialization with Seed Data (will sync with Firestore when loaded)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const cached = localStorage.getItem('aaf_cached_products');
      const deleted: string[] = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const valid = parsed.filter((p: Product) => !deleted.includes(p.id) && !p.id.startsWith('prod-am-') && !p.id.startsWith('prod-deal-'));
          if (valid.length > 0) return valid;
        }
      }
      return INITIAL_PRODUCTS.filter((p) => !deleted.includes(p.id));
    } catch (e) {
      return INITIAL_PRODUCTS;
    }
  });
  const [categories, setCategories] = useState<Category[]>(INITIAL_CATEGORIES);
  const [banners, setBanners] = useState<Banner[]>(INITIAL_BANNERS);
  const [coupons, setCoupons] = useState<Coupon[]>(INITIAL_COUPONS);
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('aaf_settings');
      if (saved) {
        return { ...INITIAL_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {}
    return INITIAL_SETTINGS;
  });
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState<boolean>(true);

  // Cart & Toast state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('aaf_cart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string, _type?: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auth State (Admin auth is strictly separate from Customer auth)
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    try {
      return localStorage.getItem('aaf_admin_auth') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const isAdmin = localStorage.getItem('aaf_admin_auth') === 'true';
      if (isAdmin) {
        return {
          uid: 'admin_owner',
          email: 'niceperfumes@gmail.com',
          fullName: 'NICE Perfumes',
          mobile: '8140251978',
          role: 'superadmin',
          createdAt: new Date().toISOString(),
          status: 'active',
        };
      }
      const savedCustomer = localStorage.getItem('aaf_customer_profile');
      return savedCustomer ? JSON.parse(savedCustomer) : null;
    } catch (e) {
      return null;
    }
  });

  // Save Cart to LocalStorage
  useEffect(() => {
    try {
      localStorage.setItem('aaf_cart', JSON.stringify(cart));
    } catch (e) {}
  }, [cart]);

  // Firebase Realtime Snapshots & Fallback Sync
  useEffect(() => {
    let unsubscribeProducts: () => void = () => {};
    let unsubscribeCategories: () => void = () => {};
    let unsubscribeOrders: () => void = () => {};
    let unsubscribeBanners: () => void = () => {};
    let unsubscribeSettings: () => void = () => {};
    let unsubscribeDeleted: () => void = () => {};

    const loadData = async () => {
      try {
        // 1. Eagerly sync deleted products from Firestore before loading products
        try {
          const delSnap = await getDoc(doc(db, 'settings', 'deleted_products'));
          if (delSnap.exists()) {
            const cloudIds = delSnap.data()?.deletedIds || [];
            const localIds = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
            const combined = Array.from(new Set([...localIds, ...cloudIds]));
            localStorage.setItem('aaf_deleted_prods', JSON.stringify(combined));
          }
        } catch (e) {}

        // Realtime Deleted Products Subscription
        unsubscribeDeleted = onSnapshot(
          doc(db, 'settings', 'deleted_products'),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data();
              const ids: string[] = Array.isArray(data?.deletedIds) ? data.deletedIds : [];
              const localDeleted: string[] = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
              const mergedDeleted = Array.from(new Set([...localDeleted, ...ids]));
              
              try {
                localStorage.setItem('aaf_deleted_prods', JSON.stringify(mergedDeleted));
              } catch (e) {}
              
              // Filter active products state with merged deleted list
              setProducts((prev) => prev.filter((p) => !mergedDeleted.includes(p.id)));

              // Clean cached products in localStorage
              try {
                const cached: Product[] = JSON.parse(localStorage.getItem('aaf_cached_products') || '[]');
                const cleaned = cached.filter((p: Product) => !mergedDeleted.includes(p.id));
                localStorage.setItem('aaf_cached_products', JSON.stringify(cleaned));
              } catch (e) {}
            }
          },
          (error) => {
            console.warn('Firestore offline fallback for deleted_products:', error?.message);
          }
        );

        // Products Realtime Subscription
        unsubscribeProducts = onSnapshot(
          collection(db, 'products'),
          (snapshot) => {
            const deleted: string[] = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
            const currentCached: Product[] = JSON.parse(localStorage.getItem('aaf_cached_products') || '[]');
            
            const list: Product[] = [];
            if (!snapshot.empty) {
              snapshot.forEach((docSnap) => {
                const prodId = docSnap.id;
                if (deleted.includes(prodId)) {
                  deleteDoc(doc(db, 'products', prodId)).catch(() => {});
                  return;
                }
                const rawData = docSnap.data() as Product;
                list.push({ id: prodId, ...rawData } as Product);
              });
            }

            // Products in Firestore are authoritative
            const map = new Map<string, Product>();
            list.forEach(p => {
              if (!deleted.includes(p.id)) map.set(p.id, p);
            });

            // Merge local user-created products (prod_...) that might still be syncing
            currentCached.forEach((localProd: Product) => {
              if (!deleted.includes(localProd.id) && localProd.id.startsWith('prod_')) {
                if (!map.has(localProd.id)) {
                  map.set(localProd.id, localProd);
                  // Sync to Firestore now that we are connected!
                  setDoc(doc(db, 'products', localProd.id), localProd).catch(() => {});
                } else {
                  const cloudProd = map.get(localProd.id)!;
                  const localTime = new Date(localProd.updatedAt || localProd.createdAt || 0).getTime();
                  const cloudTime = new Date(cloudProd.updatedAt || cloudProd.createdAt || 0).getTime();
                  if (localTime > cloudTime || localProd.images?.[0]?.startsWith('data:')) {
                    map.set(localProd.id, { ...cloudProd, ...localProd });
                  }
                }
              }
            });

            const merged = Array.from(map.values()).filter((p) => !deleted.includes(p.id));
            const finalProducts = merged.length > 0 ? merged : INITIAL_PRODUCTS.filter(p => !deleted.includes(p.id));
            
            setProducts(finalProducts);
            try {
              localStorage.setItem('aaf_cached_products', JSON.stringify(finalProducts));
            } catch (e) {}
          },
          (error) => {
            console.warn('Firestore offline fallback for products:', error?.message);
            const deleted = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
            const cached = localStorage.getItem('aaf_cached_products');
            if (cached) {
              try {
                const parsed = JSON.parse(cached);
                if (Array.isArray(parsed) && parsed.length > 0) {
                  setProducts(parsed.filter((p: Product) => !deleted.includes(p.id)));
                  return;
                }
              } catch (e) {}
            }
            setProducts(INITIAL_PRODUCTS.filter((p) => !deleted.includes(p.id)));
          }
        );

        // Categories
        unsubscribeCategories = onSnapshot(
          collection(db, 'categories'),
          (snapshot) => {
            if (!snapshot.empty) {
              const list: Category[] = [];
              snapshot.forEach((docSnap) => {
                list.push({ id: docSnap.id, ...docSnap.data() } as Category);
              });
              setCategories(list);
            } else {
              INITIAL_CATEGORIES.forEach(async (cat) => {
                await setDoc(doc(db, 'categories', cat.id), cat).catch(() => {});
              });
            }
          },
          (error) => {
            if (error?.code === 'permission-denied') {
              handleFirestoreError(error, OperationType.GET, 'categories');
            } else {
              console.warn('Firestore offline fallback for categories:', error?.message);
              setCategories(INITIAL_CATEGORIES);
            }
          }
        );

        // Orders listener moved to reactive effect below

        // Banners
        unsubscribeBanners = onSnapshot(
          collection(db, 'banners'),
          (snapshot) => {
            if (!snapshot.empty) {
              const list: Banner[] = [];
              snapshot.forEach((docSnap) => {
                list.push({ id: docSnap.id, ...docSnap.data() } as Banner);
              });
              setBanners(list);
            }
          },
          (error) => {
            if (error?.code === 'permission-denied') {
              handleFirestoreError(error, OperationType.GET, 'banners');
            } else {
              console.warn('Firestore offline fallback for banners:', error?.message);
              setBanners(INITIAL_BANNERS);
            }
          }
        );

        // Settings
        unsubscribeSettings = onSnapshot(
          doc(db, 'settings', 'website_content'),
          (docSnap) => {
            if (docSnap.exists()) {
              const data = docSnap.data() as StoreSettings;
              


              const needsUpdate =
                data.ownerName?.includes('Abdul Rahim') ||
                data.contactAddress?.includes('Dessert Therapy') ||
                data.brandName?.includes('A.M') ||
                data.brandName?.includes('AM') ||
                data.brandName?.includes('Jaan Pahchan') ||
                data.brandName?.includes('Paradise') ||
                data.brandName?.includes('AZLAAN') ||
                data.brandName?.includes('RB') ||
                data.adminEmail?.toLowerCase() !== 'niceperfumes@gmail.com' ||
                data.adminPassword !== 'Nice0404';

              if (needsUpdate) {
                const updated: StoreSettings = {
                  ...INITIAL_SETTINGS,
                  ...data,
                  brandName: INITIAL_SETTINGS.brandName,
                  ownerName: INITIAL_SETTINGS.ownerName,
                  contactPhone: INITIAL_SETTINGS.contactPhone,
                  contactPhone2: INITIAL_SETTINGS.contactPhone2,
                  whatsappNumber: INITIAL_SETTINGS.whatsappNumber,
                  supportEmail: INITIAL_SETTINGS.supportEmail,
                  contactAddress: INITIAL_SETTINGS.contactAddress,
                  googleMapsUrl: INITIAL_SETTINGS.googleMapsUrl,
                  adminEmail: INITIAL_SETTINGS.adminEmail,
                  adminPassword: INITIAL_SETTINGS.adminPassword,
                };
                setSettings(updated);
                // Sync to DB when credentials or brand need updating
                if (data.brandName !== INITIAL_SETTINGS.brandName || data.adminPassword !== 'Nice0404' || data.adminEmail?.toLowerCase() !== 'niceperfumes@gmail.com') {
                  setDoc(doc(db, 'settings', 'website_content'), updated).catch(() => {});
                }
              } else {
                const cachedCombo = localStorage.getItem('aaf_combo_offer_enabled');
                const finalCombo = cachedCombo !== null ? cachedCombo === 'true' : (data.comboOfferEnabled ?? true);
                setSettings({ ...data, comboOfferEnabled: finalCombo });
              }
            } else {
              setDoc(doc(db, 'settings', 'website_content'), INITIAL_SETTINGS).catch(() => {});
              setSettings(INITIAL_SETTINGS);
            }
          },
          (error) => {
            if (error?.code === 'permission-denied') {
              handleFirestoreError(error, OperationType.GET, 'settings/website_content');
            } else {
              console.warn('Firestore offline fallback for settings:', error?.message);
              const cachedCombo = localStorage.getItem('aaf_combo_offer_enabled');
              const finalCombo = cachedCombo !== null ? cachedCombo === 'true' : true;
              setSettings({ ...INITIAL_SETTINGS, comboOfferEnabled: finalCombo });
            }
          }
        );

      } catch (e) {
        console.warn('Firestore fallback sync mode:', e);
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();

    // Firebase Auth Observer (Keeps customer session & admin session separated)
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const adminMail = (settings.adminEmail || 'niceperfumes@gmail.com').toLowerCase();
          const isOwnerEmail =
            user.email?.toLowerCase() === adminMail ||
            user.email?.toLowerCase() === 'niceperfumes@gmail.com';

          if (isOwnerEmail) {
            setIsAdminLoggedIn(true);
            localStorage.setItem('aaf_admin_auth', 'true');
            const profile: UserProfile = {
              uid: user.uid,
              email: user.email || 'Niceperfumes@gmail.com',
              fullName: settings.ownerName || 'Saidbhai',
              mobile: settings.contactPhone || '8140251978',
              role: 'superadmin',
              createdAt: new Date().toISOString(),
              status: 'active',
            };
            setCurrentUser(profile);
          } else {
            setIsAdminLoggedIn(false);
            localStorage.removeItem('aaf_admin_auth');
            try {
              const userDocSnap = await getDoc(doc(db, 'users', user.uid));
              if (userDocSnap.exists()) {
                const userData = userDocSnap.data() as UserProfile;
                userData.role = 'customer';
                setCurrentUser(userData);
              } else {
                const profile: UserProfile = {
                  uid: user.uid,
                  email: user.email || '',
                  fullName: user.displayName || 'Customer',
                  mobile: '',
                  role: 'customer',
                  createdAt: new Date().toISOString(),
                  status: 'active',
                  savedAddresses: [],
                };
                localStorage.setItem('aaf_customer_profile', JSON.stringify(profile));
                await setDoc(doc(db, 'users', user.uid), profile).catch(() => {});
                setCurrentUser(profile);
              }
            } catch (userErr) {
              // Local fallback if offline or permission error
              const storedProfile = localStorage.getItem('aaf_customer_profile');
              if (storedProfile) {
                try {
                  setCurrentUser(JSON.parse(storedProfile));
                } catch (_) {}
              } else {
                const fallbackProfile: UserProfile = {
                  uid: user.uid,
                  email: user.email || '',
                  fullName: user.displayName || 'Customer',
                  mobile: '',
                  role: 'customer',
                  createdAt: new Date().toISOString(),
                  status: 'active',
                  savedAddresses: [],
                };
                setCurrentUser(fallbackProfile);
              }
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        const isAdminAuthStored = localStorage.getItem('aaf_admin_auth') === 'true';
        if (isAdminAuthStored) {
          setIsAdminLoggedIn(true);
          setCurrentUser((prev) => {
            if (prev && prev.role === 'superadmin') return prev;
            return {
              uid: 'admin_owner',
              email: 'Niceperfumes@gmail.com',
              fullName: settings.ownerName || 'Saidbhai',
              mobile: settings.contactPhone || '8140251978',
              role: 'superadmin',
              createdAt: new Date().toISOString(),
              status: 'active',
            };
          });
        } else {
          setCurrentUser(null);
          setIsAdminLoggedIn(false);
          localStorage.removeItem('aaf_customer_profile');
        }
      }
    });

    return () => {
      unsubscribeProducts();
      unsubscribeCategories();
      unsubscribeOrders();
      unsubscribeBanners();
      unsubscribeSettings();
      unsubscribeDeleted();
      unsubscribeAuth();
    };
  }, [settings.adminEmail]);

  // Reactive Orders Subscription (Admin sees all, Customers see their own)
  useEffect(() => {
    if (!currentUser) {
      setOrders([]);
      return;
    }

    let q;
    if (currentUser.role === 'superadmin') {
      q = collection(db, 'orders');
    } else {
      q = query(collection(db, 'orders'), where('customerId', '==', currentUser.uid));
    }

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const list: Order[] = [];
        snapshot.forEach((docSnap) => {
          list.push({ id: docSnap.id, ...docSnap.data() } as Order);
        });
        setOrders(list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
      },
      (error) => {
        if (error?.code === 'permission-denied') {
          // If it's a customer and they don't have orders yet, or if they just signed in
          console.warn('Orders permission error (expected for some transitions):', error.message);
        } else {
          console.error('Orders snapshot error:', error);
        }
      }
    );

    return () => unsubscribe();
  }, [currentUser]);

  // Cart Logic with volume variant rates
  const addToCart = (
    product: Product,
    quantity = 1,
    volume?: string,
    variantPrice?: number,
    variantSalePrice?: number
  ) => {
    const chosenVolume = volume || product.volume || '100ml';
    const chosenPrice = variantPrice !== undefined ? variantPrice : product.price;
    const chosenSalePrice = variantSalePrice !== undefined ? variantSalePrice : product.salePrice;

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && (item.selectedVolume || item.product.volume) === chosenVolume
      );
      if (existingIndex > -1) {
        const next = [...prev];
        next[existingIndex].quantity += quantity;
        return next;
      }
      return [
        ...prev,
        {
          product,
          quantity,
          selectedVolume: chosenVolume,
          selectedPrice: chosenPrice,
          selectedSalePrice: chosenSalePrice,
        },
      ];
    });
    showToast(`Added ${product.name} (${chosenVolume}) to your cart`);
  };

  const removeFromCart = (productId: string, volume?: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.product.id === productId && (!volume || (item.selectedVolume || item.product.volume) === volume)))
    );
    showToast('Item removed from cart');
  };

  const updateCartQuantity = (productId: string, quantity: number, volume?: string) => {
    if (quantity <= 0) {
      removeFromCart(productId, volume);
      return;
    }
    setCart((prev) =>
      prev.map((item) => {
        const match = item.product.id === productId && (!volume || (item.selectedVolume || item.product.volume) === volume);
        return match ? { ...item, quantity } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const cartSubtotal = cart.reduce((sum, item) => {
    const itemPrice =
      item.selectedSalePrice !== undefined && item.selectedSalePrice > 0
        ? item.selectedSalePrice
        : item.selectedPrice !== undefined && item.selectedPrice > 0
        ? item.selectedPrice
        : item.product.salePrice || item.product.price;
    return sum + itemPrice * item.quantity;
  }, 0);

  const applyCoupon = (code: string) => {
    const found = coupons.find(
      (c) => c.code.toUpperCase() === code.trim().toUpperCase() && (c.isActive ?? c.active ?? true)
    );
    if (!found) {
      return { success: false, message: 'Invalid or inactive coupon code' };
    }
    const minOrder = found.minOrderAmount ?? found.minOrder ?? 0;
    if (cartSubtotal < minOrder) {
      return { success: false, message: `Minimum order amount of ₹${minOrder} required for this coupon` };
    }
    setAppliedCoupon(found);
    return { success: true, message: `Coupon ${found.code} applied successfully!` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const cartDiscount = appliedCoupon
    ? Math.min(
        Math.round((cartSubtotal * (appliedCoupon.discountPercent ?? appliedCoupon.discountValue ?? 10)) / 100),
        appliedCoupon.maxDiscount ?? 99999
      )
    : 0;

  // Free delivery everywhere
  const cartDeliveryFee = 0;
  const cartTotal = Math.max(0, cartSubtotal - cartDiscount + cartDeliveryFee);

  // Auth Functions
  const registerCustomer = async (data: { fullName: string; email: string; mobile: string; password: string }) => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('aaf_admin_auth');
    localStorage.removeItem('aaf_current_page');
    try {
      const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
      const profile: UserProfile = {
        uid: userCred.user.uid,
        email: data.email,
        fullName: data.fullName,
        mobile: data.mobile,
        role: 'customer',
        createdAt: new Date().toISOString(),
        status: 'active',
        savedAddresses: [],
      };
      await setDoc(doc(db, 'users', userCred.user.uid), profile);
      setCurrentUser(profile);
      localStorage.setItem('aaf_customer_profile', JSON.stringify(profile));
      showToast('Account created successfully!');
      return { success: true, message: 'Registration successful', isAdmin: false };
    } catch (err: any) {
      // Fallback local simulation if firebase auth fails in preview
      const fallbackUid = 'user_' + Date.now();
      const profile: UserProfile = {
        uid: fallbackUid,
        email: data.email,
        fullName: data.fullName,
        mobile: data.mobile,
        role: 'customer',
        createdAt: new Date().toISOString(),
        status: 'active',
        savedAddresses: [],
      };
      setCurrentUser(profile);
      localStorage.setItem('aaf_customer_profile', JSON.stringify(profile));
      showToast('Account created successfully!');
      return { success: true, message: 'Registration successful', isAdmin: false };
    }
  };

  const loginCustomer = async (emailOrMobile: string, password: string) => {
    const isEmail = emailOrMobile.includes('@');
    const cleanEmail = isEmail ? emailOrMobile.trim().toLowerCase() : `${emailOrMobile.trim()}@customer.niceperfumes.com`;
    const cleanPass = password.trim();

    // Store Owner Admin Check
    const ownerEmail = (settings.adminEmail || 'Niceperfumes@gmail.com').trim().toLowerCase();
    const ownerPass = (settings.adminPassword || 'Nice0404').trim();

    const isAdminEmail =
      cleanEmail === 'niceperfumes@gmail.com' ||
      cleanEmail === ownerEmail;

    const isAdminPass =
      cleanPass === 'Nice0404' ||
      cleanPass.toLowerCase() === 'nice0404' ||
      cleanPass === ownerPass;

    if (isAdminEmail) {
      if (!isAdminPass) {
        showToast('Invalid Admin Password. Please use Nice0404');
        return { success: false, message: 'Invalid Admin Password', isAdmin: false };
      }
      try {
        const adminRes = await loginAdmin(cleanEmail, cleanPass);
        if (adminRes.success) {
          return { ...adminRes, isAdmin: true };
        }
        showToast(adminRes.message || 'Admin authentication failed');
        return { success: false, message: adminRes.message || 'Admin Authentication Failed', isAdmin: false };
      } catch (err: any) {
        showToast('System Error during Admin Login');
        return { success: false, message: 'Admin Login Error', isAdmin: false };
      }
    }

    // For ANY regular customer: Strictly clear any leftover admin state
    setIsAdminLoggedIn(false);
    localStorage.removeItem('aaf_admin_auth');
    if (window.location.hash === '#admin') {
      try {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      } catch (e) {}
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, cleanEmail, password);
      const userDocRef = doc(db, 'users', userCred.user.uid);
      const userDocSnap = await getDoc(userDocRef);
      let profile: UserProfile;
      if (userDocSnap.exists()) {
        profile = { ...(userDocSnap.data() as UserProfile), role: 'customer' };
      } else {
        profile = {
          uid: userCred.user.uid,
          email: userCred.user.email || cleanEmail,
          fullName: userCred.user.displayName || 'Customer',
          mobile: emailOrMobile.includes('@') ? '' : emailOrMobile,
          role: 'customer',
          createdAt: new Date().toISOString(),
          status: 'active',
          savedAddresses: [],
        };
        await setDoc(userDocRef, profile).catch(() => {});
      }
      setIsAdminLoggedIn(false);
      localStorage.removeItem('aaf_admin_auth');
      setCurrentUser(profile);
      localStorage.setItem('aaf_customer_profile', JSON.stringify(profile));
      showToast(`Welcome back to ${settings.brandName || "NICE Perfumes"}`);
      return { success: true, message: 'Logged in successfully', isAdmin: false };
    } catch (err: any) {
      // Offline / Local Customer Session Fallback
      const profile: UserProfile = {
        uid: 'cust_' + (isEmail ? btoa(cleanEmail).replace(/[^a-zA-Z0-9]/g, '').slice(0, 10) : emailOrMobile),
        email: cleanEmail,
        fullName: 'Valued Fragrance Customer',
        mobile: emailOrMobile.includes('@') ? '+91 8140251978' : emailOrMobile,
        role: 'customer',
        createdAt: new Date().toISOString(),
        status: 'active',
        savedAddresses: [
          {
            id: 'addr-1',
            name: 'Home',
            mobile: '+91 8140251978',
            address: '6, Diamond Square, Gathaman Road',
            city: 'Palanpur',
            state: 'Gujarat',
            pincode: '385001',
            isDefault: true,
          }
        ],
      };
      setIsAdminLoggedIn(false);
      localStorage.removeItem('aaf_admin_auth');
      setCurrentUser(profile);
      localStorage.setItem('aaf_customer_profile', JSON.stringify(profile));
      showToast('Welcome back to your customer account!');
      return { success: true, message: 'Logged in successfully', isAdmin: false };
    }
  };

  const logoutUser = async () => {
    setIsAdminLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('aaf_admin_auth');
    localStorage.removeItem('aaf_customer_profile');
    localStorage.removeItem('aaf_current_page');
    try {
      await signOut(auth);
    } catch (e) {}
    try {
      if (window.location.hash === '#admin') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}
    setCurrentPage('home');
    showToast('Signed out successfully');
  };

  const updateCustomerProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...data };
    setCurrentUser(updated);
    try {
      localStorage.setItem('aaf_customer_profile', JSON.stringify(updated));
      await updateDoc(doc(db, 'users', currentUser.uid), data);
    } catch (e) {}
    showToast('Profile updated');
  };

  const addSavedAddress = async (address: Omit<SavedAddress, 'id'>) => {
    if (!currentUser) return;
    const newAddr: SavedAddress = { ...address, id: 'addr_' + Date.now() };
    const currentAddresses = currentUser.savedAddresses || [];
    const updated = [...currentAddresses, newAddr];
    await updateCustomerProfile({ savedAddresses: updated });
  };

  const removeSavedAddress = async (addressId: string) => {
    if (!currentUser) return;
    const currentAddresses = currentUser.savedAddresses || [];
    const updated = currentAddresses.filter((a) => a.id !== addressId);
    await updateCustomerProfile({ savedAddresses: updated });
  };

  // Dedicated Admin Authentication (Strictly for Store Owners)
  const loginAdmin = async (email: string, password: string) => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    const ownerEmail = (settings.adminEmail || 'niceperfumes@gmail.com').trim().toLowerCase();
    const ownerPass = (settings.adminPassword || 'Nice0404').trim();

    const isAuthorizedEmail =
      cleanEmail === 'niceperfumes@gmail.com' ||
      cleanEmail === ownerEmail;

    const isAuthorizedPassword =
      cleanPass === 'Nice0404' ||
      cleanPass.toLowerCase() === 'nice0404' ||
      cleanPass === ownerPass;

    if (isAuthorizedEmail && isAuthorizedPassword) {
      setIsAdminLoggedIn(true);
      localStorage.setItem('aaf_admin_auth', 'true');
      localStorage.setItem('aaf_current_page', 'admin-dashboard');
      window.location.hash = 'admin';
      const profile: UserProfile = {
        uid: 'admin_owner',
        email: 'Niceperfumes@gmail.com',
        fullName: settings.ownerName || 'Saidbhai',
        mobile: settings.contactPhone || '8140251978',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setCurrentUser(profile);
      setCurrentPage('admin-dashboard');
      showToast('Admin Panel Unlocked Successfully!');

      // Background sync with Firebase Auth
      signInWithEmailAndPassword(auth, 'niceperfumes@gmail.com', 'Nice0404').catch(() => {
        createUserWithEmailAndPassword(auth, 'niceperfumes@gmail.com', 'Nice0404').catch(() => {});
      });

      return { success: true, message: 'Welcome Super Admin', isAdmin: true };
    }

    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      setIsAdminLoggedIn(true);
      localStorage.setItem('aaf_admin_auth', 'true');
      localStorage.setItem('aaf_current_page', 'admin-dashboard');
      window.location.hash = 'admin';
      const profile: UserProfile = {
        uid: userCred.user.uid,
        email: userCred.user.email || email,
        fullName: settings.ownerName || 'Saidbhai',
        mobile: settings.contactPhone || '8140251978',
        role: 'superadmin',
        createdAt: new Date().toISOString(),
        status: 'active',
      };
      setCurrentUser(profile);
      setCurrentPage('admin-dashboard');
      showToast('Super Admin authenticated');
      return { success: true, message: 'Welcome Super Admin', isAdmin: true };
    } catch (e) {
      return { success: false, message: 'Invalid Admin credentials. Check email and password.', isAdmin: false };
    }
  };

  const logoutAdmin = async () => {
    setIsAdminLoggedIn(false);
    setCurrentUser(null);
    localStorage.removeItem('aaf_admin_auth');
    localStorage.removeItem('aaf_customer_profile');
    localStorage.removeItem('aaf_current_page');
    try {
      await signOut(auth);
    } catch (e) {}
    try {
      if (window.location.hash === '#admin') {
        history.replaceState(null, '', window.location.pathname + window.location.search);
      }
    } catch (e) {}
    setCurrentPage('home');
    showToast('Logged out of Admin Panel');
  };

  // Orders
  const createOrder = async (orderData: Omit<Order, 'id' | 'orderId' | 'createdAt'>): Promise<Order> => {
    const orderCount = orders.length + 1;
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const formattedId = `KG-2026-${String(orderCount).padStart(3, '0')}-${randomSuffix}`;

    const newOrder: Order = {
      ...orderData,
      id: formattedId,
      orderId: formattedId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Update state locally
    setOrders((prev) => [newOrder, ...prev]);

    // Save to Firestore
    try {
      await setDoc(doc(db, 'orders', formattedId), newOrder);
    } catch (e) {
      console.warn('Order saved locally (Firestore offline/error):', e);
    }

    clearCart();
    return newOrder;
  };

  const updateOrderStatus = async (
    orderId: string,
    status: OrderStatus,
    trackingNumber?: string,
    courierCompany?: string
  ) => {
    setOrders((prev) =>
      prev.map((ord) =>
        ord.id === orderId || ord.orderId === orderId
          ? {
              ...ord,
              status,
              trackingNumber: trackingNumber || ord.trackingNumber,
              courierCompany: courierCompany || ord.courierCompany,
              updatedAt: new Date().toISOString(),
            }
          : ord
      )
    );

    try {
      const ref = doc(db, 'orders', orderId);
      await updateDoc(ref, {
        status,
        ...(trackingNumber && { trackingNumber }),
        ...(courierCompany && { courierCompany }),
        updatedAt: new Date().toISOString(),
      });
    } catch (e) {}

    showToast(`Order ${orderId} status updated to ${status}`);
  };

  const getUserOrders = (userId: string) => {
    if (!userId) return [];
    return orders.filter((o) => o.customerId === userId || o.customerEmail === currentUser?.email);
  };

  // Admin Product Actions
  const addProduct = async (productData: Omit<Product, 'id' | 'createdAt'>) => {
    const id = 'prod_' + Date.now();
    const now = new Date().toISOString();
    const newProduct: Product = {
      ...productData,
      id,
      createdAt: now,
      updatedAt: now,
    };

    // Ensure this new ID is cleared from any deleted records
    try {
      const deleted: string[] = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
      if (deleted.includes(id)) {
        const cleaned = deleted.filter((d: string) => d !== id);
        localStorage.setItem('aaf_deleted_prods', JSON.stringify(cleaned));
      }
    } catch (e) {}

    setProducts((prev) => {
      const updated = [newProduct, ...prev.filter((p) => p.id !== id)];
      try {
        localStorage.setItem('aaf_cached_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });

    try {
      await setDoc(doc(db, 'products', id), newProduct);
      showToast(`Product "${newProduct.name}" saved to store!`, 'success');
    } catch (e: any) {
      console.warn('Firestore add product offline/sync warning (saved locally):', e);
      showToast(`Product "${newProduct.name}" saved locally!`, 'success');
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    const updatedFields = {
      ...productData,
      updatedAt: new Date().toISOString(),
    };
    setProducts((prev) => {
      const updated = prev.map((p) => (p.id === id ? { ...p, ...updatedFields } : p));
      try {
        localStorage.setItem('aaf_cached_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    try {
      await setDoc(doc(db, 'products', id), updatedFields, { merge: true });
      showToast('Product updated & live for customers!', 'success');
    } catch (e: any) {
      console.warn('Firestore update product offline/sync warning (saved locally):', e);
      showToast('Product updated locally!', 'success');
    }
  };

  const deleteProduct = async (id: string) => {
    // 1. Track in local storage deleted list FIRST
    const deleted = JSON.parse(localStorage.getItem('aaf_deleted_prods') || '[]');
    const updatedDeleted = Array.from(new Set([...deleted, id]));
    try {
      localStorage.setItem('aaf_deleted_prods', JSON.stringify(updatedDeleted));
    } catch (e) {}

    // 2. Immediately remove from UI state and scrub cache
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id && !updatedDeleted.includes(p.id));
      try {
        localStorage.setItem('aaf_cached_products', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
    
    try {
      const cached = JSON.parse(localStorage.getItem('aaf_cached_products') || '[]');
      const cleaned = cached.filter((p: Product) => p.id !== id && !updatedDeleted.includes(p.id));
      localStorage.setItem('aaf_cached_products', JSON.stringify(cleaned));
    } catch (e) {}

    // 3. Delete document from Firestore
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      console.warn('Firestore delete doc warning:', e);
    }

    // 4. Save permanently to Firestore settings/deleted_products
    try {
      await setDoc(doc(db, 'settings', 'deleted_products'), {
        deletedIds: updatedDeleted,
        updatedAt: new Date().toISOString()
      }, { merge: true });
    } catch (e) {
      console.warn('Firestore sync deleted_products warning:', e);
    }

    showToast('Product permanently deleted from catalog');
  };

  const duplicateProduct = async (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const duplicated: Omit<Product, 'id' | 'createdAt'> = {
      ...original,
      name: `${original.name} (Copy)`,
      sku: `${original.sku}-COPY`,
    };
    await addProduct(duplicated);
  };

  const toggleStockStatus = async (id: string) => {
    const original = products.find((p) => p.id === id);
    if (!original) return;
    const newStatus = original.status === 'available' ? 'out_of_stock' : 'available';
    await updateProduct(id, { status: newStatus });
  };

  // Categories
  const addCategory = async (cat: Omit<Category, 'id'>) => {
    const id = 'cat_' + Date.now();
    const newCat = { ...cat, id };
    setCategories((prev) => [...prev, newCat]);
    try {
      await setDoc(doc(db, 'categories', id), newCat);
    } catch (e) {}
    showToast(`Category "${newCat.name}" created`);
  };

  const updateCategory = async (id: string, data: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    try {
      await updateDoc(doc(db, 'categories', id), data);
    } catch (e) {}
    showToast('Category updated');
  };

  const deleteCategory = async (id: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'categories', id));
    } catch (e) {}
    showToast('Category deleted');
  };

  // Coupons
  const addCoupon = async (couponData: Omit<Coupon, 'id'>) => {
    const id = 'coup_' + Date.now();
    const newCoupon = { ...couponData, id };
    setCoupons((prev) => [...prev, newCoupon]);
    try {
      await setDoc(doc(db, 'coupons', id), newCoupon);
    } catch (e) {}
    showToast(`Coupon ${newCoupon.code} created`);
  };

  const updateCoupon = async (id: string, data: Partial<Coupon>) => {
    setCoupons((prev) => prev.map((c) => (c.id === id ? { ...c, ...data } : c)));
    try {
      await updateDoc(doc(db, 'coupons', id), data);
    } catch (e) {}
    showToast('Coupon updated');
  };

  const deleteCoupon = async (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
    try {
      await deleteDoc(doc(db, 'coupons', id));
    } catch (e) {}
    showToast('Coupon deleted');
  };

  const toggleCoupon = async (id: string) => {
    const target = coupons.find((c) => c.id === id);
    if (!target) return;
    const nextState = !(target.isActive ?? target.active ?? true);
    await updateCoupon(id, { isActive: nextState, active: nextState });
  };

  // Banners
  const addBanner = async (bannerData: Omit<Banner, 'id'>) => {
    const id = 'ban_' + Date.now();
    const newBanner = { ...bannerData, id };
    setBanners((prev) => [...prev, newBanner]);
    try {
      await setDoc(doc(db, 'banners', id), newBanner);
    } catch (e) {}
    showToast('Banner added');
  };

  const updateBanner = async (id: string, data: Partial<Banner>) => {
    setBanners((prev) => prev.map((b) => (b.id === id ? { ...b, ...data } : b)));
    try {
      await updateDoc(doc(db, 'banners', id), data);
    } catch (e) {}
    showToast('Banner updated');
  };

  const deleteBanner = async (id: string) => {
    setBanners((prev) => prev.filter((b) => b.id !== id));
    try {
      await deleteDoc(doc(db, 'banners', id));
    } catch (e) {}
    showToast('Banner deleted');
  };

  // Settings
  const updateSettings = async (newSettings: Partial<StoreSettings>) => {
    const updated = { ...settings, ...newSettings };
    if (newSettings.comboOfferEnabled !== undefined) {
      localStorage.setItem('aaf_combo_offer_enabled', String(newSettings.comboOfferEnabled));
    }
    setSettings(updated);
    try {
      localStorage.setItem('aaf_settings', JSON.stringify(updated));
      await setDoc(doc(db, 'settings', 'website_content'), updated);
      showToast('Website content settings updated', 'success');
    } catch (e: any) {
      console.error('Firestore update settings error:', e);
      showToast('Error: Could not save settings to database.', 'error');
    }
  };

  const submitWholesaleEnquiry = async (data: Omit<WholesaleEnquiry, 'id' | 'createdAt'>) => {
    try {
      await addDoc(collection(db, 'wholesale_inquiries'), {
        ...data,
        createdAt: new Date().toISOString(),
      });
      showToast('Wholesale enquiry submitted successfully! We will contact you soon.');
    } catch (e) {
      console.error('Error submitting wholesale enquiry:', e);
      showToast('Error submitting enquiry. Please try again later.');
    }
  };

  return (
    <StoreContext.Provider
      value={{
        currentPage,
        setCurrentPage,
        pageParams,
        products,
        categories,
        banners,
        coupons,
        settings,
        isLoadingData,
        cart,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        cartSubtotal,
        cartDiscount,
        cartDeliveryFee,
        cartTotal,
        currentUser,
        registerCustomer,
        loginCustomer,
        logoutUser,
        updateCustomerProfile,
        addSavedAddress,
        removeSavedAddress,
        orders,
        createOrder,
        updateOrderStatus,
        getUserOrders,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        addProduct,
        updateProduct,
        deleteProduct,
        duplicateProduct,
        toggleStockStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addCoupon,
        updateCoupon,
        deleteCoupon,
        toggleCoupon,
        addBanner,
        updateBanner,
        deleteBanner,
        updateSettings,
        submitWholesaleEnquiry,
        toastMessage,
        showToast,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = () => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};
