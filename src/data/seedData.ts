import { Product, Category, Banner, Coupon, StoreSettings } from '../types';

export const INITIAL_SETTINGS: StoreSettings = {
  brandName: 'NICE Perfumes',
  brandTagline: 'Pure Perfumes & Luxury Fragrances',
  ownerName: 'Saidbhai',
  contactPhone: '8140251978',
  contactPhone2: '8140251978',
  whatsappNumber: '+918140251978',
  supportEmail: 'contact@niceperfumes.com',
  contactAddress: '6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001',
  googleMapsUrl: 'https://maps.app.goo.gl/Palanpur',
  instagramUrl: 'https://www.instagram.com/nice_perfumes',
  aboutText: 'NICE Perfumes by Saidbhai brings expert craftsmanship in luxury perfumes, pure alcohol-free attars, and royal fragrances.\n\n📍 Visit our showroom at 6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001 or order online with Pan-India express delivery.\n\nNICE Perfumes — Pure Perfumes & Luxury Fragrances.',
  deliveryDetails: 'Pan-India Express Delivery Available 🇮🇳. All orders are packed securely and dispatched directly from our Palanpur showroom (6, Diamond Square, Gathaman Road, Near SOS School, Opp. Kingston Valley, Palanpur - 385001). Fast delivery within 3-5 days across India.',
  announcementBarText: '✨ Welcome to NICE Perfumes • 🌿 Pure Fragrances & Luxury Attars • 📍 Palanpur • 📞 Call / WhatsApp: 81402 51978',
  isAnnouncementEnabled: true,
  heroVideoUrl: '/hamza_video.mp4?v=1.2',
  heroVideoPoster: '/hamza_video_poster.jpg?v=1.2',
  comboOfferTitle: 'ANY 5 PERFUMES AT JUST ₹1499',
  comboOfferPrice: 1499,
  comboOfferOriginalPrice: 2499,
  comboBottleCount: 5,
  comboOfferEnabled: true,
  comboProductIds: [
    'prod-am-alpha', 'prod-am-blue', 'prod-am-dessert', 'prod-secret-blue',
    'prod-ice-gold', 'prod-black-vanilla', 'prod-muaab-oud', 'prod-burberry-her',
    'prod-gucci-flora', 'prod-gentleman-pack'
  ],
  comboOfferDescription: 'Choose any 5 bottles from our entire catalog. Includes luxury gift box and Pan-India delivery!',
  adminEmail: 'Niceperfumes@gmail.com',
  adminPassword: 'Nice0404',
  razorpayKeyId: 'rzp_live_NicePerfumes8140251978',
  razorpayKeySecret: 'NicePerfumesSecret2026',
  razorpayUpiId: '8140251978@upi',
  razorpayPaymentLink: '',
  razorpayQrImageUrl: '',
  razorpayEnabled: true,
};

export const INITIAL_CATEGORIES: Category[] = [
  { id: 'cat-all', name: 'All Masterpieces', slug: 'all', description: 'Complete collection of NICE Perfumes Palanpur', active: true },
  { id: 'cat-attars', name: 'Attar (Pure Non-Alcoholic)', slug: 'attar', description: '100% pure, alcohol-free concentrated perfume oils & Ittars', active: true },
  { id: 'cat-perfumes', name: 'Luxury Perfumes (EDP)', slug: 'perfumes', description: 'Long-lasting Eau de Parfum crafted for all-day projection', active: true },
  { id: 'cat-agarbatti', name: 'Handcrafted Agarbatti', slug: 'agarbatti', description: 'Pure aromatic incense sticks with soothing natural oils', active: true },
  { id: 'cat-bakhoor', name: 'Royal Bakhoor & Dhoop', slug: 'bakhoor', description: 'Exquisite Arabian incense chips, oudh bakhoor & burners', active: true },
  { id: 'cat-bridal', name: 'Islamic Accessories & Burners', slug: 'bridal-accessories', description: 'Kashmiri Rumal, Premium Topi, Ehram, Electric Burners & Stands', active: true },
  { id: 'cat-gifts', name: 'Custom Gifts & Combos', slug: 'gifts-combos', description: 'Special gift sets, personalized fragrance boxes & combo packs', active: true },
  { id: 'cat-fresh', name: 'Aquatic & Fresh', slug: 'fresh', description: 'Invigorating sea breeze, iced citrus, and blue notes', active: true },
  { id: 'cat-oud', name: 'Oud & Woody', slug: 'oud', description: 'Royal Agarwood, smoky woods, and amber authority', active: true },
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod_1790524402319',
    name: 'AL OUD',
    price: 1200,
    salePrice: 999,
    category: 'Luxury Perfumes (EDP)',
    volume: '50ml Eau de Parfum',
    sku: 'NP-OUD-01',
    stock: 50,
    featured: true,
    bestSeller: true,
    newArrival: true,
    status: 'available',
    description: 'The defining signature royal oud masterpiece of NICE Perfumes (Saidbhai Palanpur). Rich smoky woody notes lingering for 12+ hours with unforgettable presence.',
    notes: {
      top: ['Kashmiri Saffron', 'Calabrian Bergamot'],
      middle: ['Royal Cambodian Oud', 'Rose Petals'],
      base: ['Golden Amber', 'White Musk'],
    },
    images: [
      '/al_ansar_royal_attar_showcase_1789386348873.jpg',
      '/am_user_perfume_hero.png',
    ],
    createdAt: new Date().toISOString(),
  },
  {
    id: 'prod_1790528862652',
    name: 'Rb marj',
    price: 599,
    salePrice: 499,
    category: 'Luxury Perfumes (EDP)',
    volume: '25 / 50 / 100ml',
    sku: 'NP-MRJ-02',
    stock: 35,
    featured: true,
    bestSeller: true,
    newArrival: false,
    status: 'available',
    description: 'Rich Arabian warmth blending exotic spices, sweet floral nuances, and deep balsamic woods. Formulated for high projection.',
    notes: {
      top: ['Spice sweet', 'Cardamom'],
      middle: ['Warm Amber', 'Orchid'],
      base: ['Woody Accord', 'Pure Musk'],
    },
    images: [
      '/al_ansar_royal_attar_showcase_1789386348873.jpg',
    ],
    createdAt: new Date().toISOString(),
  },
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-1',
    imageUrl: 'https://images.unsplash.com/photo-1615397349754-cfa2066a298e?auto=format&fit=crop&w=1600&q=80',
    title: 'ATTAR • PERFUMES • AGARBATTI • BAKHOOR',
    subtitle: '6, Diamond Square, Gathaman Road, Palanpur - 385001',
    buttonText: 'EXPLORE MASTERPIECES',
    linkUrl: '/shop',
    isActive: true,
  },
  {
    id: 'ban-2',
    imageUrl: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1600&q=80',
    title: 'CREATING MASTERPIECE IN SCENTS ✨',
    subtitle: 'By NICE Perfumes — WhatsApp Order: 8140251978',
    buttonText: 'DISCOVER BESTSELLERS',
    linkUrl: '/shop',
    isActive: true,
  },
];

export const INITIAL_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'AL10',
    discountPercent: 10,
    minOrderAmount: 999,
    isActive: true,
  },
  {
    id: 'coup-2',
    code: 'VAD15',
    discountPercent: 15,
    minOrderAmount: 1999,
    isActive: true,
  },
];
