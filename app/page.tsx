'use client';

import React, { useState, useMemo } from 'react';

// ==========================================
// 1. DATA TYPES (Production-Grade Schema)
// ==========================================
export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  mainCategory: 'it' | 'gaming' | 'beauty' | 'fashion';
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  stock: number;
  isFeatured?: boolean;
  badge?: string;
  description: string;
  specifications: Record<string, string>;
  images: string[];
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface FilterState {
  search: string;
  mainCategory: string;
  subCategory: string;
  selectedBrands: string[];
  minPrice: number;
  maxPrice: number;
  minRating: number;
  sortBy: 'popular' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
}

// ==========================================
// 2. MOCK DATABASE (Realistic & Verified Assets)
// ==========================================
const PRODUCTS_DATABASE: Product[] = [
  // --- IT & ELECTRONICS ---
  {
    id: 'prod-001',
    sku: 'AAPL-IP15PM-256-NT',
    name: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    slug: 'iphone-15-pro-max-256gb-natural-titanium',
    brand: 'Apple',
    mainCategory: 'it',
    subCategory: 'สมาร์ทโฟน',
    price: 48900,
    originalPrice: 52900,
    rating: 4.9,
    reviewsCount: 1420,
    stock: 12,
    badge: 'Flagship',
    description: 'iPhone 15 Pro Max บอดี้ไทเทเนียมเกรดอุตสาหกรรมอวกาศ ชิป A17 Pro ทรงพลัง ปุ่ม Action ปรับแต่งได้ และระบบกล้อง Pro 48MP ซูม Optical 5x',
    specifications: {
      'หน้าจอ': '6.7" Super Retina XDR OLED 120Hz ProMotion',
      'ชิปประมวลผล': 'Apple A17 Pro (3nm)',
      'กล้องหลัง': '48MP Main + 12MP Ultra Wide + 12MP Telephoto 5x',
      'แบตเตอรี่': 'ใช้งานวิดีโอสูงสุด 29 ชั่วโมง',
      'พอร์ต': 'USB-C (รองรับ USB 3 สูงสุด 10Gbps)'
    },
    images: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80',
      'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&q=80'
    ]
  },
  {
    id: 'prod-002',
    sku: 'SMSG-S24U-512-GR',
    name: 'Samsung Galaxy S24 Ultra 5G (12GB/512GB) - Titanium Gray',
    slug: 'samsung-galaxy-s24-ultra-5g-512gb',
    brand: 'Samsung',
    mainCategory: 'it',
    subCategory: 'สมาร์ทโฟน',
    price: 46900,
    originalPrice: 52900,
    rating: 4.8,
    reviewsCount: 980,
    stock: 8,
    badge: 'Galaxy AI',
    description: 'ก้าวสูี่ยุคใหม่ด้วย Galaxy AI ช่วยแปลภาษาแบบ Real-time ตกแต่งภาพอัจฉริยะ พร้อมกล้อง 200MP และปากกา S Pen ในตัว',
    specifications: {
      'หน้าจอ': '6.8" Dynamic AMOLED 2X 120Hz (2600 nits)',
      'ชิปประมวลผล': 'Snapdragon 8 Gen 3 for Galaxy',
      'กล้องหลัง': '200MP + 50MP + 12MP + 10MP',
      'หน่วยความจำ': 'RAM 12GB / ROM 512GB'
    },
    images: [
      'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800&q=80',
      'https://images.unsplash.com/photo-1580910051074-3eb694886505?w=800&q=80'
    ]
  },
  {
    id: 'prod-003',
    sku: 'AAPL-MBA15-M3-256',
    name: 'Apple MacBook Air 15" ชิป M3 (RAM 8GB / SSD 256GB)',
    slug: 'macbook-air-15-m3-256gb',
    brand: 'Apple',
    mainCategory: 'it',
    subCategory: 'แล็ปท็อป',
    price: 47900,
    originalPrice: 50900,
    rating: 4.9,
    reviewsCount: 530,
    stock: 15,
    badge: 'M3 Chip',
    description: 'ดีไซน์บางเบาพรีเมียม ประสิทธิภาพทรงพลังด้วยชิป M3 หน้าจอ Liquid Retina 15.3 นิ้ว แบตเตอรี่ใช้งานยาวนาน 18 ชั่วโมง',
    specifications: {
      'หน้าจอ': '15.3" Liquid Retina (500 nits)',
      'ชิปประมวลผล': 'Apple M3 (8-core CPU / 10-core GPU)',
      'การเชื่อมต่อ': 'Thunderbolt / USB 4 x 2, MagSafe 3',
      'น้ำหนัก': '1.51 กก.'
    },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800&q=80'
    ]
  },
  {
    id: 'prod-004',
    sku: 'SONY-PS5-SLIM-DISC',
    name: 'Sony PlayStation 5 Slim Disc Edition (1TB SSD)',
    slug: 'playstation-5-slim-disc-edition',
    brand: 'Sony',
    mainCategory: 'it',
    subCategory: 'คอนโซล & แก็ดเจ็ต',
    price: 18690,
    originalPrice: 19900,
    rating: 4.9,
    reviewsCount: 2100,
    stock: 20,
    badge: 'Best Seller',
    description: 'ประสบการณ์เล่นเกมระดับ 4K 120Hz ด้วยพลัง SSD ความเร็วสูงพิเศษ คอนโทรลเลอร์ DualSense พร้อมระบบ Haptic Feedback',
    specifications: {
      'ความจุ': '1TB NVMe High-Speed SSD',
      'การแสดงผล': 'รองรับ Output 4K 120Hz / HDR / Ray Tracing',
      'ไดรฟ์': 'Ultra HD Blu-ray Disc Drive'
    },
    images: [
      'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&q=80'
    ]
  },

  // --- GAMING GEAR ---
  {
    id: 'prod-005',
    sku: 'LOGI-GPROX-SL2-WHT',
    name: 'Logitech G Pro X Superlight 2 Wireless Gaming Mouse',
    slug: 'logitech-g-pro-x-superlight-2-white',
    brand: 'Logitech',
    mainCategory: 'gaming',
    subCategory: 'เมาส์เกมมิ่ง',
    price: 5290,
    originalPrice: 5990,
    rating: 5.0,
    reviewsCount: 1890,
    stock: 25,
    badge: 'Pro Choice',
    description: 'เมาส์เกมมิ่งไร้สายระดับแข่งขัน เบาพิเศษเพียง 60 กรัม เซนเซอร์ HERO 2 แม่นยำระดับพิกเซล สวิตช์ LIGHTFORCE Hybrid',
    specifications: {
      'น้ำหนัก': '60 กรัม',
      'เซนเซอร์': 'HERO 2 (32,000 DPI / 500 IPS)',
      'แบตเตอรี่': 'สูงสุด 95 ชั่วโมง (USB-C)'
    },
    images: [
      'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80',
      'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=800&q=80'
    ]
  },
  {
    id: 'prod-006',
    sku: 'KEYC-K2V2-RGB-HOT',
    name: 'Keychron K2 Wireless Mechanical Keyboard (RGB Hot-swappable)',
    slug: 'keychron-k2-wireless-mechanical-keyboard',
    brand: 'Keychron',
    mainCategory: 'gaming',
    subCategory: 'คีย์บอร์ดเกมมิ่ง',
    price: 3890,
    originalPrice: 4590,
    rating: 4.8,
    reviewsCount: 1120,
    stock: 14,
    description: 'คีย์บอร์ด Mechanical ไร้สายขนาด 75% เชื่อมต่อได้ 3 อุปกรณ์พร้อมกัน ถอดเปลี่ยนสวิตช์ได้โดยไม่ต้องบัดกรี รองรับ Mac & Windows',
    specifications: {
      'ขนาด Layout': '75% (84 Keys)',
      'สวิตช์': 'Gateron G Pro Mechanical',
      'แบตเตอรี่': '4,000 mAh'
    },
    images: [
      'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80',
      'https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=800&q=80'
    ]
  },
  {
    id: 'prod-007',
    sku: 'HYPX-CLOUD2-WL',
    name: 'HyperX Cloud II Wireless Gaming Headset - Red/Black',
    slug: 'hyperx-cloud-ii-wireless-headset',
    brand: 'HyperX',
    mainCategory: 'gaming',
    subCategory: 'หูฟังเกมมิ่ง',
    price: 4190,
    originalPrice: 4990,
    rating: 4.9,
    reviewsCount: 3100,
    stock: 18,
    badge: 'Legendary',
    description: 'ตำนานหูฟังเกมมิ่งไร้สาย ความสบายขั้นสุดด้วยเมมโมรี่โฟม ลำโพงขนาด 53มม. พร้อมระบบเสียงรอบทิศทาง Virtual 7.1',
    specifications: {
      'การเชื่อมต่อ': 'Wireless 2.4GHz (ระยะ 20 เมตร)',
      'ไดรเวอร์': '53mm Dynamic Neodymium',
      'แบตเตอรี่': 'สูงสุด 30 ชั่วโมง'
    },
    images: [
      'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80',
      'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80'
    ]
  },

  // --- BEAUTY & SKINCARE ---
  {
    id: 'prod-008',
    sku: 'CRV-MOIST-LOTION-473',
    name: 'CeraVe Daily Moisturizing Lotion 473ml (สำหรับผิวแห้ง-ผิวมัน)',
    slug: 'cerave-daily-moisturizing-lotion-473ml',
    brand: 'CeraVe',
    mainCategory: 'beauty',
    subCategory: 'มอยส์เจอไรเซอร์',
    price: 690,
    originalPrice: 850,
    rating: 4.9,
    reviewsCount: 8900,
    stock: 45,
    badge: 'Dermatologist Choice',
    description: 'โลชั่นบำรุงผิวกายและผิวหน้า เติมความชุ่มชื้นยาวนาน 24 ชั่วโมง ด้วยเทคโนโลยี MVE พร้อมเซราไมด์ที่จำเป็นต่อผิว 3 ชนิด',
    specifications: {
      'ปริมาณ': '473 มล.',
      'คุณสมบัติ': 'ไม่มีน้ำหอม ไม่ไม่อุดตันรูขุมขน (Non-Comedogenic)',
      'ประเทศผู้ผลิต': 'ฝรั่งเศส'
    },
    images: [
      'https://images.unsplash.com/photo-1608248597379-22212a999440?w=800&q=80',
      'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80'
    ]
  },
  {
    id: 'prod-009',
    sku: 'LRP-DUO-PLUS-M-40',
    name: 'La Roche-Posay Effaclar Duo+M 40ml (มอยส์เจอไรเซอร์ลดปัญหาสิว)',
    slug: 'la-roche-posay-effaclar-duo-plus-m',
    brand: 'La Roche-Posay',
    mainCategory: 'beauty',
    subCategory: 'เซรั่ม & ทรีทเม้นท์',
    price: 990,
    originalPrice: 1150,
    rating: 4.8,
    reviewsCount: 5400,
    stock: 30,
    description: 'สูตรใหม่! จัดการปัญหาสิวอุดตัน สิวเสี้ยน และรอยดำรอยแดงจากสิว รักษาสมดุลไมโครไบโอมบนผิว เห็นผลใน 8 ชั่วโมง',
    specifications: {
      'ปริมาณ': '40 มล.',
      'เหมาะสำหรับ': 'ผิวมัน มีปัญหาสิว แพ้ง่าย',
      'ส่วนผสมสำคัญ': 'Phylobioma + Niacinamide + LHA'
    },
    images: [
      'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80',
      'https://images.unsplash.com/photo-1608248597379-22212a999440?w=800&q=80'
    ]
  },

  // --- FASHION & STREETWEAR ---
  {
    id: 'prod-010',
    sku: 'NIKE-AF1-07-WHT',
    name: "Nike Air Force 1 '07 - Triple White Classic",
    slug: 'nike-air-force-1-07-triple-white',
    brand: 'Nike',
    mainCategory: 'fashion',
    subCategory: 'รองเท้าสนีกเกอร์',
    price: 3700,
    originalPrice: 4300,
    rating: 4.9,
    reviewsCount: 6200,
    stock: 22,
    badge: 'Iconic',
    description: 'รองเท้าบาสเกตบอลระดับตำนานยุค 80s ปรับโฉมสตรีทไอคอน หนังแท้สีขาวคลีน พร้อมระบบระบบรับแรงกระแทก Nike Air',
    specifications: {
      'วัสดุ': 'หนังแท้พรีเมียม (Real Leather)',
      'การดูแลรักษา': 'ทำความสะอาดด้วยแปรงนุ่มและน้ำยาเช็ดรองเท้า',
      'ทรง': 'Low-cut ข้อต่ำ'
    },
    images: [
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80',
      'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=800&q=80'
    ]
  },
  {
    id: 'prod-011',
    sku: 'CNV-CHUCK70-HI-BLK',
    name: 'Converse Chuck 70 Vintage Canvas High - Black/Egret',
    slug: 'converse-chuck-70-vintage-canvas-high-black',
    brand: 'Converse',
    mainCategory: 'fashion',
    subCategory: 'รองเท้าสนีกเกอร์',
    price: 3150,
    originalPrice: 3500,
    rating: 4.9,
    reviewsCount: 4100,
    stock: 16,
    badge: 'Vintage 1970',
    description: 'ดีไซน์ย้อนยุคปี 1970 ผ้าแคนวาสหนา 12oz พื้นรองเท้า OrthoLite นุ่มสบาย ขอบยางสีครีมวินเทจพร้อมป้ายส้นดำสามดาว',
    specifications: {
      'วัสดุอัปเปอร์': 'Premium Canvas 12oz',
      'แผ่นรองเท้า': 'OrthoLite Cushioning System',
      'ทรง': 'High-top หุ้มข้อ'
    },
    images: [
      'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=800&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
    ]
  }
];

// ==========================================
// 3. MAIN COMPONENT & STATE MANAGEMENT
// ==========================================
export default function SeniorProjectECommerce() {
  // Filtering States
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    mainCategory: 'all',
    subCategory: 'all',
    selectedBrands: [],
    minPrice: 0,
    maxPrice: 100000,
    minRating: 0,
    sortBy: 'popular'
  });

  // UI & Cart States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [activeImgIndex, setActiveImgIndex] = useState<number>(0);
  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Available Brands calculated dynamically from Data
  const availableBrands = useMemo(() => {
    const brands = new Set<string>();
    PRODUCTS_DATABASE.forEach(p => brands.add(p.brand));
    return Array.from(brands);
  }, []);

  // Filter & Sort Pipeline Logic
  const filteredProducts = useMemo(() => {
    return PRODUCTS_DATABASE.filter((product) => {
      // 1. Search Filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchBrand = product.brand.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        if (!matchName && !matchBrand && !matchDesc) return false;
      }

      // 2. Main Category Filter
      if (filters.mainCategory !== 'all' && product.mainCategory !== filters.mainCategory) {
        return false;
      }

      // 3. Sub Category Filter
      if (filters.subCategory !== 'all' && product.subCategory !== filters.subCategory) {
        return false;
      }

      // 4. Brands Filter
      if (filters.selectedBrands.length > 0 && !filters.selectedBrands.includes(product.brand)) {
        return false;
      }

      // 5. Price Range Filter
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // 6. Rating Filter
      if (product.rating < filters.minRating) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (filters.sortBy === 'price-asc') return a.price - b.price;
      if (filters.sortBy === 'price-desc') return b.price - a.price;
      if (filters.sortBy === 'rating') return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount; // default popular
    });
  }, [filters]);

  // Cart Operations
  const handleAddToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart(prev => {
      const exists = prev.find(item => item.product.id === product.id);
      if (exists) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartDrawerOpen(true);
  };

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const toggleBrandFilter = (brand: string) => {
    setFilters(prev => {
      const exists = prev.selectedBrands.includes(brand);
      return {
        ...prev,
        selectedBrands: exists
          ? prev.selectedBrands.filter(b => b !== brand)
          : [...prev.selectedBrands, brand]
      };
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased selection:bg-indigo-500 selection:text-white">
      
      {/* HEADER NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/80">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-6">
          
          <div 
            onClick={() => setFilters({ ...filters, mainCategory: 'all', subCategory: 'all', search: '' })}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-400 flex items-center justify-center font-black text-slate-950 text-lg shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="font-extrabold text-lg text-white tracking-tight block leading-tight">
                STUDENT<span className="text-indigo-400">STORE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-mono tracking-widest uppercase">
                Senior Project v4.0
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้า, แบรนด์, สเปก (เช่น iPhone, Logitech, CeraVe)..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-medium focus:outline-none focus:border-indigo-500 transition-colors text-slate-200 placeholder:text-slate-500"
              />
              <svg className="w-4 h-4 text-slate-500 absolute left-3.5 top-2.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartDrawerOpen(true)}
            className="relative flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-bold transition shadow-md active:scale-95"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
            <span>ตะกร้า</span>
            {cart.length > 0 && (
              <span className="bg-emerald-400 text-slate-950 px-1.5 py-0.2 rounded-full font-mono text-[10px] font-black">
                {cart.reduce((s, i) => s + i.quantity, 0)}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* MAIN CONTAINER (SIDEBAR + GRID) */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        
        {/* SIDEBAR FILTERS (A must-have for 4th year projects) */}
        <aside className="w-full md:w-64 space-y-6 flex-shrink-0">
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 space-y-6 sticky top-24">
            
            <div className="flex justify-between items-center border-b border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                ⚙️ ตัวกรองสินค้า
              </h3>
              <button
                onClick={() => setFilters({
                  search: '',
                  mainCategory: 'all',
                  subCategory: 'all',
                  selectedBrands: [],
                  minPrice: 0,
                  maxPrice: 100000,
                  minRating: 0,
                  sortBy: 'popular'
                })}
                className="text-[11px] text-indigo-400 hover:underline font-medium"
              >
                ล้างทั้งหมด
              </button>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">หมวดหมู่หลัก</label>
              {[
                { id: 'all', label: 'สินค้าทั้งหมด' },
                { id: 'it', label: '📱 อุปกรณ์ไอที & IT' },
                { id: 'gaming', label: '🎮 เกมมิ่งเกียร์' },
                { id: 'beauty', label: '💄 สกินแคร์ & บิวตี้' },
                { id: 'fashion', label: '👕 แฟชั่น & สตรีทแวร์' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setFilters({ ...filters, mainCategory: cat.id, subCategory: 'all' })}
                  className={`w-full text-left px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    filters.mainCategory === cat.id
                      ? 'bg-indigo-600 text-white font-bold shadow-sm'
                      : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Brand Filter Checkboxes */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">แบรนด์สินค้า</label>
              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 text-xs">
                {availableBrands.map(brand => (
                  <label key={brand} className="flex items-center gap-2.5 text-slate-300 cursor-pointer hover:text-white">
                    <input
                      type="checkbox"
                      checked={filters.selectedBrands.includes(brand)}
                      onChange={() => toggleBrandFilter(brand)}
                      className="rounded border-slate-700 bg-slate-950 text-indigo-600 focus:ring-0"
                    />
                    <span>{brand}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-800/80">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider block">ราคาสูงสุด (฿)</label>
              <input
                type="range"
                min="1000"
                max="60000"
                step="1000"
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })}
                className="w-full accent-indigo-500 bg-slate-800"
              />
              <div className="flex justify-between text-[11px] font-mono text-slate-400">
                <span>฿0</span>
                <span className="text-indigo-400 font-bold">฿{filters.maxPrice.toLocaleString()}</span>
              </div>
            </div>

          </div>
        </aside>

        {/* MAIN PRODUCT CATALOG GRID */}
        <main className="flex-1 space-y-6">
          
          {/* Top Control Bar */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-base font-extrabold text-white">
                รายการสินค้าในระบบ ({filteredProducts.length})
              </h1>
              <p className="text-xs text-slate-400 mt-0.5">
                ผลการค้นหาถูกต้องตาม Schema และ Database Query
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-medium text-slate-400">เรียงตาม:</span>
              <select
                value={filters.sortBy}
                onChange={(e) => setFilters({ ...filters, sortBy: e.target.value as any })}
                className="bg-slate-950 border border-slate-800 rounded-xl text-xs font-bold text-slate-200 px-3 py-1.5 focus:outline-none focus:border-indigo-500"
              >
                <option value="popular">🔥 ขายดี / ยอดนิยม</option>
                <option value="price-asc">📈 ราคา: ต่ำไปสูง</option>
                <option value="price-desc">📉 ราคา: สูงไปต่ำ</option>
                <option value="rating">⭐ คะแนนรีวิวสูงสุด</option>
              </select>
            </div>
          </div>

          {/* Grid Layout */}
          {filteredProducts.length === 0 ? (
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-12 text-center space-y-3">
              <span className="text-3xl">🔍</span>
              <h3 className="text-sm font-bold text-slate-300">ไม่พบข้อมูลสินค้าตรงตามเงื่อนไขที่กำหนด</h3>
              <p className="text-xs text-slate-500">ลองล้างค่าค้นหาหรือปรับเปลี่ยนตัวกรองราคกอีกครั้ง</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => { setSelectedProduct(product); setActiveImgIndex(0); }}
                  className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-indigo-500/60 transition-all duration-300 flex flex-col justify-between group cursor-pointer hover:-translate-y-1 shadow-lg"
                >
                  <div>
                    {/* Image Box */}
                    <div className="relative aspect-square bg-slate-950 overflow-hidden">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.badge && (
                        <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider shadow">
                          {product.badge}
                        </span>
                      )}
                      <span className="absolute bottom-2 right-2 bg-slate-950/80 text-slate-300 text-[10px] px-2 py-0.5 rounded border border-slate-800 font-mono">
                        {product.brand}
                      </span>
                    </div>

                    {/* Meta Info */}
                    <div className="p-4 space-y-2">
                      <div className="flex justify-between items-center text-[10px]">
                        <span className="text-indigo-400 font-bold bg-indigo-950/80 px-2 py-0.5 rounded border border-indigo-800/40">
                          {product.subCategory}
                        </span>
                        <span className="text-slate-500 font-mono">SKU: {product.sku}</span>
                      </div>

                      <h3 className="text-xs font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors">
                        {product.name}
                      </h3>

                      <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
                        {product.description}
                      </p>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="p-4 pt-0">
                    <div className="flex items-baseline gap-2 mb-3">
                      <span className="text-xl font-black text-emerald-400 font-mono">
                        ฿{product.price.toLocaleString()}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-xs text-slate-500 line-through font-mono">
                          ฿{product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>

                    <div className="flex justify-between items-center pt-2.5 border-t border-slate-800/80 text-xs">
                      <span className="text-amber-400 font-bold flex items-center gap-1 text-[11px]">
                        ★ {product.rating} <span className="text-slate-500 font-normal">({product.reviewsCount})</span>
                      </span>

                      <button
                        onClick={(e) => handleAddToCart(product, e)}
                        className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-xl transition text-xs shadow"
                      >
                        + ใส่ตะกร้า
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      </div>

      {/* PRODUCT DETAIL MODAL (Senior Project Spec View) */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl relative flex flex-col md:flex-row max-h-[90vh]">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-3 right-3 z-10 bg-slate-950/80 text-slate-400 hover:text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm border border-slate-800"
            >
              ✕
            </button>

            {/* Left: Gallery */}
            <div className="md:w-1/2 p-6 bg-slate-950 flex flex-col justify-between border-b md:border-b-0 md:border-r border-slate-800">
              <div className="aspect-square rounded-xl bg-slate-900 border border-slate-800 overflow-hidden mb-4">
                <img
                  src={selectedProduct.images[activeImgIndex]}
                  alt={selectedProduct.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="flex gap-2">
                {selectedProduct.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImgIndex(i)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition ${
                      activeImgIndex === i ? 'border-indigo-500 scale-95' : 'border-slate-800 opacity-50'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right: Technical Specifications */}
            <div className="md:w-1/2 p-6 overflow-y-auto space-y-4">
              <div>
                <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800">
                  {selectedProduct.brand} • {selectedProduct.subCategory}
                </span>
                <h2 className="text-base font-extrabold text-white mt-1 leading-snug">
                  {selectedProduct.name}
                </h2>
                <p className="text-xs text-slate-500 font-mono mt-0.5">SKU: {selectedProduct.sku}</p>
              </div>

              <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 flex items-baseline gap-2">
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  ฿{selectedProduct.price.toLocaleString()}
                </span>
                {selectedProduct.originalPrice > selectedProduct.price && (
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ฿{selectedProduct.originalPrice.toLocaleString()}
                  </span>
                )}
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">คำอธิบายสินค้า</h4>
                <p className="text-xs text-slate-400 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  {selectedProduct.description}
                </p>
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">ข้อมูลทางเทคนิค (Specs)</h4>
                <div className="border border-slate-800 rounded-xl overflow-hidden text-xs">
                  {Object.entries(selectedProduct.specifications).map(([k, v], idx) => (
                    <div key={k} className={`flex p-2 ${idx % 2 === 0 ? 'bg-slate-950' : 'bg-slate-900/50'}`}>
                      <span className="w-1/3 font-bold text-slate-400">{k}</span>
                      <span className="w-2/3 text-slate-200">{v}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  handleAddToCart(selectedProduct);
                  setSelectedProduct(null);
                }}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl shadow-lg transition"
              >
                🛒 เพิ่มลงในตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CART DRAWER */}
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full border-l border-slate-800 flex flex-col justify-between p-6">
            <div className="flex justify-between items-center border-b border-slate-800 pb-4">
              <h3 className="font-bold text-sm text-white">ตะกร้าสินค้า ({cart.length})</h3>
              <button onClick={() => setIsCartDrawerOpen(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto my-4 space-y-3">
              {cart.map(item => (
                <div key={item.product.id} className="flex gap-3 bg-slate-950 p-3 rounded-xl border border-slate-800 items-center">
                  <img src={item.product.images[0]} alt="" className="w-12 h-12 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-xs font-black text-emerald-400 font-mono">฿{item.product.price.toLocaleString()}</p>
                  </div>
                  <span className="text-xs font-bold text-slate-400 font-mono">x{item.quantity}</span>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-800 pt-4 space-y-3">
              <div className="flex justify-between text-sm font-bold text-white">
                <span>ราคารวมทั้งหมด:</span>
                <span className="text-emerald-400 font-mono">฿{cartTotal.toLocaleString()}</span>
              </div>
              <button
                onClick={() => { setIsCartDrawerOpen(false); setIsCheckoutOpen(true); }}
                disabled={cart.length === 0}
                className="w-full py-3 bg-indigo-600 disabled:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-lg"
              >
                สั่งซื้อสินค้า (Checkout)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHECKOUT SUCCESS MODAL */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 text-center space-y-4">
            <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center mx-auto text-xl font-bold border border-emerald-800">
              ✓
            </div>
            <h3 className="text-lg font-black text-white">การสั่งซื้อจำลองเสร็จสมบูรณ์</h3>
            <p className="text-xs text-slate-400">ระบบจำลองการส่งคำสั่งซื้อเข้า Database และตัด Stock สำเร็จ</p>
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs font-mono text-slate-300">
              Total Amount Paid: ฿{cartTotal.toLocaleString()}
            </div>
            <button
              onClick={() => { setCart([]); setIsCheckoutOpen(false); }}
              className="w-full py-2.5 bg-indigo-600 text-white text-xs font-bold rounded-xl"
            >
              ตกลง
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
