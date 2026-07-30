'use client';

import React, { useState, useMemo } from 'react';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewCount: number;
  soldCount: number;
  badge?: string;
  location: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// --- CATEGORY CONFIGURATION ---
const MAIN_CATEGORIES = [
  { id: 'all', name: 'ทั้งหมด', subs: [] },
  { 
    id: 'it', 
    name: 'อุปกรณ์ไอที', 
    subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] 
  },
  { 
    id: 'beauty', 
    name: 'สกินแคร์ & บิวตี้', 
    subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'] 
  },
  { 
    id: 'fashion', 
    name: 'แฟชั่น & เครื่องแต่งกาย', 
    subs: ['ทั้งหมด', 'เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'] 
  },
  { 
    id: 'home', 
    name: 'ของแต่งบ้าน & ไลฟ์สไตล์', 
    subs: ['ทั้งหมด', 'โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'] 
  },
  { 
    id: 'gaming', 
    name: 'เกมมิ่งเกียร์', 
    subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] 
  },
  { 
    id: 'sports', 
    name: 'สปอร์ต & เอาต์ดอร์', 
    subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] 
  }
];

const LOCATIONS = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'เชียงใหม่', 'ชลบุรี', 'ปทุมธานี', 'ภูเก็ต'];
const BADGES = ['367 VIP', 'MALL', 'BEST', 'HOT', 'ส่งฟรี', 'ลด 50%', 'ถูกชัวร์'];

// --- REAL HIGH-QUALITY PRODUCT IMAGES POOL (Unsplash) ---
const CATEGORY_IMAGE_POOLS: Record<string, string[]> = {
  'โทรศัพท์มือถือ': [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=600&auto=format&fit=crop&q=80'
  ],
  'คอมพิวเตอร์': [
    'https://images.unsplash.com/photo-1587831990711-23ca6441447b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=600&auto=format&fit=crop&q=80'
  ],
  'โน๊ตบุ๊ค': [
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&auto=format&fit=crop&q=80'
  ],
  'แท็บเล็ต & ไอแพด': [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600&auto=format&fit=crop&q=80'
  ],
  'แก็ดเจ็ต & อุปกรณ์เสริม': [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1622445268465-84288046d581?w=600&auto=format&fit=crop&q=80'
  ],
  'เซรั่ม & มอยส์เจอไรเซอร์': [
    'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597261-833244722510?w=600&auto=format&fit=crop&q=80'
  ],
  'กันแดด & คลีนซิ่ง': [
    'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&auto=format&fit=crop&q=80'
  ],
  'เครื่องสำอาง & ลิปสติก': [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80'
  ],
  'บำรุงผิวกาย & น้ำหอม': [
    'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1547887537-6158d64c35b3?w=600&auto=format&fit=crop&q=80'
  ],
  'เสื้อยืด & เสื้อครอป': [
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=600&auto=format&fit=crop&q=80'
  ],
  'กางเกง & ยีนส์': [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'
  ],
  'แจ็กเก็ต & ฮู้ดดี้': [
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80'
  ],
  'กระเป๋า & รองเท้า': [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
  ],
  'โคมไฟ & ไฟแต่งห้อง': [
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80'
  ],
  'เครื่องหอม & อโรม่า': [
    'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&auto=format&fit=crop&q=80'
  ],
  'เฟอร์นิเจอร์ & ชั้นวาง': [
    'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&auto=format&fit=crop&q=80'
  ],
  'เครื่องครัว & แก้วน้ำ': [
    'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&auto=format&fit=crop&q=80'
  ],
  'เมาส์ & คีย์บอร์ด': [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&auto=format&fit=crop&q=80'
  ],
  'หูฟัง & ไมโครโฟน': [
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600&auto=format&fit=crop&q=80'
  ],
  'จอมอนิเตอร์ & โต๊ะเก้าอี้': [
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80'
  ],
  'อุปกรณ์ออกกำลังกาย': [
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80'
  ],
  'แคมปิ้ง & เต็นท์': [
    'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&auto=format&fit=crop&q=80'
  ],
  'รองเท้า & เสื้อผ้ากีฬา': [
    'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&auto=format&fit=crop&q=80'
  ]
};

// --- REALISTIC 350+ PRODUCTS GENERATOR WITH MATCHING IMAGES ---
const generate350Products = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;

  const templates: Record<string, Record<string, string[]>> = {
    it: {
      'โทรศัพท์มือถือ': ['iPhone 15 Pro Max', 'Samsung Galaxy S24 Ultra', 'Xiaomi 14 Ultra', 'OPPO Find X7 Pro', 'Vivo X100 Pro', 'Google Pixel 8 Pro', 'OnePlus 12', 'ROG Phone 8 Pro'],
      'คอมพิวเตอร์': ['PC เกมมิ่ง Core i7 RTX 4070', 'คอมประกอบ Ryzen 7 RTX 4060Ti', 'Mini PC Workstation Pro', 'PC สำนักงาน Ultra SSD 512GB'],
      'โน๊ตบุ๊ค': ['MacBook Pro M3 Max 16 นิ้ว', 'MacBook Air M3 13 นิ้ว', 'ASUS ROG Zephyrus G16', 'Lenovo Legion Pro 5', 'Dell XPS 15 OLED', 'Acer Predator Helios'],
      'แท็บเล็ต & ไอแพด': ['iPad Pro 11 นิ้ว M4', 'iPad Air 6 M2', 'Samsung Galaxy Tab S9 Ultra', 'Xiaomi Pad 6 Max', 'iPad Mini 6 Cellular'],
      'แก็ดเจ็ต & อุปกรณ์เสริม': ['USB-C HUB 7-in-1 Aluminum', 'แท่นวางไอแพดปรับระดับได้', 'สายชาร์จ Fast Charge 100W', 'พาวเวอร์แบงค์ 30000mAh Magsafe', 'หูฟังไร้สาย ANC Bluetooth 5.4']
    },
    beauty: {
      'เซรั่ม & มอยส์เจอไรเซอร์': ['Aura Hyaluron Intense Serum 50ml', 'Vitamin C Booster Glow Drop', 'Retinol Night Repair Cream', 'Centella Soothing Barrier Gel'],
      'กันแดด & คลีนซิ่ง': ['Sunscreen Light Watery Essence SPF50+', 'Cleansing Oil Deep Cleanse 200ml', 'Micellar Water Sensitive Skin', 'Physical Sunscreen Stick Matte'],
      'เครื่องสำอาง & ลิปสติก': ['Velvet Matte Longlasting Lipstick', 'Cushion Glowing Skin SPF50 PA++++', 'Eyeliner Water-Proof Black', 'Blush On Shimmer Peach Soft'],
      'บำรุงผิวกาย & น้ำหอม': ['Perfume Body Lotion Rose Scent', 'Eau De Parfum Luxury Unisex 50ml', 'Body Scrub Organic Coffee Blend', 'Hand Cream Sheabutter Extra Moisture']
    },
    fashion: {
      'เสื้อยืด & เสื้อครอป': ['Oversized Streetwear Premium Cotton Tee', 'Minimalist Crop Top Ribbed', 'Vintage Graphic Washed T-Shirt', 'Polo Shirt Slim Fit Smart Casual'],
      'กางเกง & ยีนส์': ['Straight Leg Vintage Denim Jeans', 'Cargo Tactical Pants Multi-Pocket', 'Chino Trousers Slim Fit', 'Casual Shorts Organic Cotton'],
      'แจ็กเก็ต & ฮู้ดดี้': ['Zip-Up Fleece Hoodie Heavyweight', 'Denim Jacket Vintage Classic Blue', 'Bomber Jacket Streetwear Style', 'Windbreaker Waterproof Sport Outdoor'],
      'กระเป๋า & รองเท้า': ['Leather Crossbody Minimal Bag', 'Canvas Tote Bag Large Capacity', 'White Leather Sneaker Classic', 'Carbon Plate Running Shoes Ultra Light']
    },
    home: {
      'โคมไฟ & ไฟแต่งห้อง': ['Minimalist Desk Lamp Touch Dimmer', 'RGB Sunset Projection Atmosphere Lamp', 'Nordic Floor Lamp Warm Light', 'Smart LED Strip Light WiFi App Control'],
      'เครื่องหอม & อโรม่า': ['Aroma Soy Wax Candle Lavender 200g', 'Essential Oil Diffuser Ultrasonic', 'Reed Diffuser Luxury Hotel Scent'],
      'เฟอร์นิเจอร์ & ชั้นวาง': ['Ergonomic Monitor Stand Solid Wood', 'Foldable Storage Box Clear Front 55L', 'Nordic Round Coffee Table', 'Minimal Bookshelf 4-Tier White'],
      'เครื่องครัว & แก้วน้ำ': ['Stainless Tumbler Vacuum 900ml', 'Non-Stick Frying Pan Granite 28cm', 'Electric Glass Kettle Fast Boil', 'French Coffee Press Stainless Filter']
    },
    gaming: {
      'เมาส์ & คีย์บอร์ด': ['RGB Mechanical Keyboard Wireless Tri-Mode', 'Ultra-Lightweight Gaming Mouse 8K Hz', 'Custom Keycaps PBT Double Shot Set'],
      'หูฟัง & ไมโครโฟน': ['7.1 Surround Gaming Headset Wireless', 'USB Condenser Streaming Microphone', 'Wireless Gaming Earbuds Low Latency 40ms'],
      'จอมอนิเตอร์ & โต๊ะเก้าอี้': ['Gaming Monitor 27" 240Hz IPS 1ms', 'Ergonomic Gaming Chair PU Leather', 'Electric Height Adjustable Desk 140cm']
    },
    sports: {
      'อุปกรณ์ออกกำลังกาย': ['Resistance Bands 5-Level Set latex', 'Adjustable Dumbbell 24kg Quick Select', 'Yoga Mat NBR 10mm Anti-Slip Eco'],
      'แคมปิ้ง & เต็นท์': ['Automatic Tent 4-Person Waterproof', 'Camping Chair Foldable Ultra Compact', 'Portable Gas Stove Outdoor Brass'],
      'รองเท้า & เสื้อผ้ากีฬา': ['Marathon Carbon Shoes Pro', 'Quick-Dry Sport T-Shirt Breathable', 'Gym Training Shorts with Phone Pocket']
    }
  };

  const mainCatKeys = Object.keys(templates);

  for (let i = 0; i < 360; i++) {
    const mainCat = mainCatKeys[i % mainCatKeys.length];
    const subCatMap = templates[mainCat];
    const subCatKeys = Object.keys(subCatMap);
    const subCat = subCatKeys[i % subCatKeys.length];
    const nameList = subCatMap[subCat];
    const baseName = nameList[i % nameList.length];

    const modelVariant = `(รุ่นปี 2026 / Ver. ${(i % 4) + 1})`;
    const fullTitle = `${baseName} ${modelVariant}`;

    // Dynamic price calculation
    let basePrice = 180 + ((i * 149) % 32000);
    if (mainCat === 'it' || mainCat === 'gaming') basePrice += 2500;

    const discountRatio = 1.18 + ((i % 5) * 0.08);
    const originalPrice = Math.round(basePrice * discountRatio);

    // Get matching product image from subcategory pool
    const pool = CATEGORY_IMAGE_POOLS[subCat] || [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'
    ];
    const selectedImage = pool[i % pool.length];

    // Reviews & Star calculation
    const rating = Number((4.6 + ((i % 5) * 0.1)).toFixed(1));
    const reviewCount = (i * 37 + 82) % 1450 + 15;
    const soldCount = (i * 41 + 120) % 9200 + 150;

    products.push({
      id: idCounter,
      name: fullTitle,
      mainCategory: mainCat,
      subCategory: subCat,
      price: basePrice,
      originalPrice: originalPrice,
      rating: rating,
      reviewCount: reviewCount,
      soldCount: soldCount,
      badge: BADGES[i % BADGES.length],
      location: LOCATIONS[i % LOCATIONS.length],
      image: selectedImage
    });

    idCounter++;
  }

  return products;
};

const ALL_PRODUCTS = generate350Products();

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular'); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 20;

  // Cart & Coupon States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'promptpay'
  });

  // Get Subcategories
  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

  // Filter & Sort Products
  const filteredAndSortedProducts = useMemo(() => {
    let result = ALL_PRODUCTS.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMain && matchSub && matchSearch;
    });

    if (sortBy === 'sales') {
      result.sort((a, b) => b.soldCount - a.soldCount);
    } else if (sortBy === 'price-asc') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'price-desc') {
      result.sort((a, b) => b.price - a.price);
    } else if (sortBy === 'rating') {
      result.sort((a, b) => b.rating - a.rating);
    }

    return result;
  }, [selectedMainCat, selectedSubCat, searchQuery, sortBy]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const handleMainCatChange = (catId: string) => {
    setSelectedMainCat(catId);
    setSelectedSubCat('ทั้งหมด');
    setCurrentPage(1);
  };

  const handleSubCatChange = (subCat: string) => {
    setSelectedSubCat(subCat);
    setCurrentPage(1);
  };

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => {
      return prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  // Coupon
  const handleApplyCoupon = () => {
    if (couponCode.toUpperCase() === '367VIP') {
      setAppliedDiscount(200);
      setCouponMessage({ text: 'ใช้ส่วนลด 367VIP (-฿200) สำเร็จ!', isError: false });
    } else if (couponCode.toUpperCase() === 'FREE50') {
      setAppliedDiscount(50);
      setCouponMessage({ text: 'ใช้ส่วนลด (-฿50) สำเร็จ!', isError: false });
    } else {
      setAppliedDiscount(0);
      setCouponMessage({ text: 'โค้ดส่วนลดไม่ถูกต้องหรือหมดอายุ', isError: true });
    }
  };

  const totalCartItems = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const subtotalCartPrice = useMemo(() => cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0), [cart]);
  const finalCartPrice = Math.max(0, subtotalCartPrice - appliedDiscount);

  // Submit Order
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedOrderId(`367-TH-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-indigo-500 selection:text-white">
      
      {/* 🔮 Top Ambient Neon Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-slate-200 text-xs py-2.5 px-4 font-medium border-b border-indigo-800/40 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wider shadow-sm shadow-indigo-500/50">
              367 OFFICIAL
            </span>
            <span>⚡ สินค้าตรงปกกว่า 350+ รายการ | โค้ดส่วนลด <strong className="text-emerald-400 font-mono bg-emerald-950/60 px-1.5 py-0.5 rounded border border-emerald-500/30">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs text-indigo-300/70 font-mono">การันตีของแท้ 100% | พร้อมส่งทั่วประเทศ</span>
        </div>
      </div>

      {/* 🚀 Sleek Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-indigo-950/20">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Neon Gradient Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleMainCatChange('all')}
          >
            <div className="w-11 h-11 bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white block leading-none">
                367 <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">STORE</span>
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/50 font-bold px-2 py-0.5 rounded mt-1 inline-block tracking-widest uppercase">
                PREMIUM CATALOG
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าจาก 350+ รายการ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-10 pr-24 py-2.5 text-xs sm:text-sm bg-slate-900 border border-slate-700/70 rounded-2xl focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-slate-100"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded-xl transition text-xs shadow-md shadow-indigo-600/30">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Cart Drawer Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-indigo-300 font-bold px-4 py-2.5 rounded-2xl transition shadow-lg shadow-black/40"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline text-xs">ตะกร้า</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-black px-2 py-0.5 rounded-full border-2 border-slate-950 shadow-lg">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* 🏷️ Main & Sub Categories Navigation */}
      <nav className="bg-slate-900/90 border-b border-slate-800/80 py-3 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleMainCatChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/40'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategories */}
          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-3 pt-2.5 border-t border-slate-800/60">
              <span className="text-[11px] font-bold text-indigo-400 uppercase tracking-wider whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubCatChange(sub)}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-500 font-bold shadow-sm'
                      : 'bg-slate-950/50 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* 🛍️ Main Product Grid Section */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Sorting & Filter Header Bar */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800/80 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-xs">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-indigo-400 font-medium text-lg"> &gt; {selectedSubCat}</span>}
            </h1>
            <p className="text-xs text-slate-400 font-medium mt-1">
              พบสินค้าตรงปกทั้งสิ้น <span className="font-bold text-emerald-400 font-mono">{filteredAndSortedProducts.length}</span> รายการ
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-[11px] font-bold text-slate-500 uppercase whitespace-nowrap">จัดเรียง:</span>
            {[
              { id: 'popular', label: 'ยอดนิยม' },
              { id: 'sales', label: 'ขายดีสุด' },
              { id: 'price-asc', label: 'ราคาต่ำ-สูง' },
              { id: 'price-desc', label: 'ราคาสูง-ต่ำ' },
              { id: 'rating', label: 'คะแนนสูงสุด' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  sortBy === btn.id
                    ? 'bg-indigo-500 text-slate-950 font-black shadow-md shadow-indigo-500/20'
                    : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700/50'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-5">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-2xl border border-slate-800/80 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-950/50 hover:border-indigo-600/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Real Product Image Container */}
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    
                    {/* Badges */}
                    <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
                      {product.badge && (
                        <span className="bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded-md shadow-lg tracking-wider uppercase">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-3 sm:p-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[10px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded-full inline-block">
                        {product.subCategory}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">
                        #367-{product.id}
                      </span>
                    </div>

                    <h3 className="text-xs sm:text-sm font-bold text-slate-100 line-clamp-2 h-9 leading-snug group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>

                    {/* Rating & Review Count */}
                    <div className="flex items-center justify-between mt-3 text-[11px] text-slate-400 font-medium">
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
                        <span>★</span>
                        <span>{product.rating}</span>
                        <span className="text-slate-400 font-normal text-[10px]">
                          ({product.reviewCount.toLocaleString()} รีวิว)
                        </span>
                      </div>
                      <span className="text-[10px]">ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="p-3 sm:p-4 pt-0">
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-lg sm:text-xl font-black text-emerald-400">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-[10px] text-slate-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3">
                    <span className="text-[10px] text-slate-400 flex items-center gap-0.5 truncate max-w-[100px]">
                      📍 {product.location}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold p-2 rounded-xl shadow-lg shadow-indigo-600/30 transition-all active:scale-95 flex items-center gap-1 text-xs px-3"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4"/>
                      </svg>
                      <span className="hidden sm:inline">ใส่ตะกร้า</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 my-8">
            <p className="text-lg font-bold text-slate-300">ไม่พบสินค้าที่คุณกำลังค้นหา</p>
            <button
              onClick={() => handleMainCatChange('all')}
              className="mt-4 px-5 py-2 bg-indigo-600 text-white rounded-xl font-bold text-sm hover:bg-indigo-500 transition shadow-lg shadow-indigo-600/30"
            >
              ดูสินค้าทั้งหมดในร้าน
            </button>
          </div>
        )}

        {/* 📖 Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition"
            >
              &lt; ย้อนกลับ
            </button>

            <div className="flex gap-1 overflow-x-auto max-w-[200px] sm:max-w-none py-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`w-9 h-9 rounded-xl text-xs font-bold transition-all ${
                    currentPage === page
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/40'
                      : 'bg-slate-900 border border-slate-800 text-slate-400 hover:bg-slate-800'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 hover:bg-slate-800 disabled:opacity-30 transition"
            >
              ถัดไป &gt;
            </button>
          </div>
        )}

      </main>

      {/* 🛒 High-End Cyber Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
            
            {/* Header */}
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950 text-white">
              <div className="flex items-center gap-2">
                <span className="text-base font-black">ตะกร้าสินค้า (367 Official)</span>
                <span className="bg-emerald-500 text-slate-950 text-xs font-bold px-2 py-0.5 rounded-full">
                  {totalCartItems}
                </span>
              </div>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-slate-400 hover:text-white font-bold text-xl px-2"
              >
                ✕
              </button>
            </div>

            {/* Cart Product List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950/70 rounded-xl border border-slate-800 items-center">
                    <img
                      src={item.product.image}
                      alt={item.product.name}
                      className="w-16 h-16 object-cover rounded-lg bg-slate-900 border border-slate-800"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                      <p className="text-sm font-black text-emerald-400 mt-0.5">฿{item.product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center gap-2 mt-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, -1)}
                          className="w-6 h-6 bg-slate-800 border border-slate-700 rounded text-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-700"
                        >
                          -
                        </button>
                        <span className="font-bold text-xs px-1 text-slate-100">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, 1)}
                          className="w-6 h-6 bg-slate-800 border border-slate-700 rounded text-slate-300 font-bold text-xs flex items-center justify-center hover:bg-slate-700"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-24 text-slate-500 font-medium text-sm">
                  ไม่มีสินค้าในตะกร้า
                </div>
              )}
            </div>

            {/* Coupon & Total Price Summary */}
            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                {/* Coupon Code Input */}
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-1">โค้ดส่วนลด (ลองใช้: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="ใส่โค้ดส่วนลด..."
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg focus:outline-none focus:border-indigo-500 font-mono font-bold uppercase text-slate-100"
                    />
                    <button
                      onClick={handleApplyCoupon}
                      className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg hover:bg-indigo-500 transition shadow-sm"
                    >
                      ใช้โค้ด
                    </button>
                  </div>
                  {couponMessage && (
                    <p className={`text-[11px] font-bold mt-1.5 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>
                      {couponMessage.text}
                    </p>
                  )}
                </div>

                {/* Receipt Breakdown */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>ยอดรวมสินค้า:</span>
                    <span>฿{subtotalCartPrice.toLocaleString()}</span>
                  </div>
                  {appliedDiscount > 0 && (
                    <div className="flex justify-between text-emerald-400 font-bold">
                      <span>ส่วนลดคูปอง:</span>
                      <span>-฿{appliedDiscount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-400">
                    <span>ค่าจัดส่ง:</span>
                    <span className="text-emerald-400 font-bold">ฟรี (฿0)</span>
                  </div>
                  <div className="flex justify-between items-center text-base font-black pt-2 border-t border-slate-800 text-white">
                    <span>ยอดชำระสุทธิ:</span>
                    <span className="text-xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
                >
                  ชำระเงินทันที &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 📄 Checkout Modal & Clean Order Receipt (Without QR Code) */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden p-6 relative border border-slate-800 text-slate-100">
            <button 
              onClick={() => setIsCheckoutOpen(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white font-bold text-lg"
            >
              ✕
            </button>

            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3 shadow-inner">
                  ✓
                </div>
                <h3 className="text-2xl font-black text-white">สั่งซื้อสินค้าสำเร็จ!</h3>
                <p className="text-slate-400 text-xs mt-1">หมายเลขคำสั่งซื้อ: <span className="font-bold text-emerald-400 font-mono">{generatedOrderId}</span></p>
                
                {/* Clean Receipt Summary Block (No QR Code) */}
                <div className="mt-5 p-4 bg-slate-950 rounded-2xl border border-slate-800 text-left space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>ผู้รับ:</span>
                    <span className="font-bold text-slate-200">{formData.name}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>เบอร์โทร:</span>
                    <span className="font-bold text-slate-200">{formData.phone}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>วิธีชำระเงิน:</span>
                    <span className="font-bold text-indigo-400 uppercase">{formData.payment}</span>
                  </div>
                  <div className="flex justify-between text-slate-400 pt-2 border-t border-slate-800">
                    <span>ยอดชำระสำเร็จ:</span>
                    <span className="font-black text-emerald-400 text-sm font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-500 mt-5">ระบบกำลังเตรียมจัดส่งสินค้า ขอบคุณที่อุดหนุน 367 Store ครับ</p>
                
                <button
                  onClick={() => {
                    setCart([]);
                    setAppliedDiscount(0);
                    setCouponCode('');
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="mt-5 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold rounded-xl transition border border-slate-700"
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-slate-800 pb-3">สั่งซื้อสินค้า (367 Official Store)</h3>

                {/* Item List Summary */}
                <div className="max-h-28 overflow-y-auto space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  {cart.map((c) => (
                    <div key={c.product.id} className="flex justify-between font-medium">
                      <span className="truncate max-w-[240px] text-slate-300">{c.product.name} x {c.quantity}</span>
                      <span className="font-bold text-emerald-400 font-mono">฿{(c.product.price * c.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                {/* Form Controls */}
                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="081-234-5678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl focus:outline-none focus:border-indigo-500 font-medium text-slate-100"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">วิธีการชำระเงิน</label>
                    <select
                      value={formData.payment}
                      onChange={e => setFormData({ ...formData, payment: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl font-bold focus:outline-none focus:border-indigo-500 text-slate-100"
                    >
                      <option value="promptpay">พร้อมเพย์ / โอนเงิน (PromptPay)</option>
                      <option value="cod">เก็บเงินปลายทาง (COD)</option>
                      <option value="card">บัตรเครดิต / บัตรเดบิต</option>
                    </select>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <p className="text-[10px] text-slate-500">ยอดชำระสุทธิ</p>
                    <p className="text-xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</p>
                  </div>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition"
                  >
                    ยืนยันการสั่งซื้อ
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
