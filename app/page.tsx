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

interface ProductItemDef {
  name: string;
  basePrice: number;
  image: string;
}

// --- CONSTANTS & CONFIGURATIONS ---
const MAIN_CATEGORIES = [
  { id: 'all', name: '🔥 ทั้งหมด', subs: [] },
  { 
    id: 'it', 
    name: '📱 อุปกรณ์ไอที', 
    subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] 
  },
  { 
    id: 'beauty', 
    name: '💄 สกินแคร์ & บิวตี้', 
    subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'] 
  },
  { 
    id: 'fashion', 
    name: '👕 แฟชั่น & เครื่องแต่งกาย', 
    subs: ['ทั้งหมด', 'เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'] 
  },
  { 
    id: 'home', 
    name: '🏠 ของแต่งบ้าน & ไลฟ์สไตล์', 
    subs: ['ทั้งหมด', 'โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'] 
  },
  { 
    id: 'gaming', 
    name: '🎮 เกมมิ่งเกียร์', 
    subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] 
  },
  { 
    id: 'sports', 
    name: '⚽ สปอร์ต & เอาต์ดอร์', 
    subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] 
  }
];

const LOCATIONS = ['กรุงเทพมหานคร', 'สมุทรปราการ', 'นนทบุรี', 'เชียงใหม่', 'ชลบุรี', 'ปทุมธานี', 'ภูเก็ต'];
const BADGES = ['367 VIP', 'MALL', 'BEST SELLER', 'HOT DEAL', 'ส่งฟรี', 'ลด 50%', 'ถูกชัวร์'];

// --- REALISTIC PRODUCTS DATA MAPPING (BOUND IMAGE + ACCURATE REAL-WORLD PRICE) ---
const PRODUCT_TEMPLATES: Record<string, Record<string, ProductItemDef[]>> = {
  it: {
    'โทรศัพท์มือถือ': [
      { name: 'Xiaomi 14 Ultra 5G Leica Lens', basePrice: 40990, image: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97' },
      { name: 'iPhone 15 Pro Max 256GB', basePrice: 48900, image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569' },
      { name: 'Samsung Galaxy S24 Ultra', basePrice: 43900, image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf' },
      { name: 'Google Pixel 8 Pro', basePrice: 32900, image: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd' }
    ],
    'คอมพิวเตอร์': [
      { name: 'PC เกมมิ่ง Intel Core i7 RTX 4070', basePrice: 42500, image: 'https://images.unsplash.com/photo-1587831990711-23ca6441447b' },
      { name: 'คอมประกอบ Ryzen 7 RTX 4060Ti', basePrice: 32900, image: 'https://images.unsplash.com/photo-1593640408182-31c70c8268f5' },
      { name: 'Mini PC Workstation Ultra', basePrice: 18500, image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f' }
    ],
    'โน๊ตบุ๊ค': [
      { name: 'MacBook Pro M3 Max 16 นิ้ว', basePrice: 89900, image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8' },
      { name: 'MacBook Air M3 13 นิ้ว', basePrice: 39900, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853' },
      { name: 'ASUS ROG Zephyrus G16 Gaming', basePrice: 65900, image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302' }
    ],
    'แท็บเล็ต & ไอแพด': [
      { name: 'iPad Pro 11 นิ้ว ชิป M4 Ultra', basePrice: 39900, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0' },
      { name: 'iPad Air 6 ชิป M2 128GB', basePrice: 21900, image: 'https://images.unsplash.com/photo-1561154464-82e9adf32764' },
      { name: 'Samsung Galaxy Tab S9 Ultra', basePrice: 38900, image: 'https://images.unsplash.com/photo-1585790050230-5dd28404ccb9' }
    ],
    'แก็ดเจ็ต & อุปกรณ์เสริม': [
      { name: 'แท่นวางไอแพดปรับระดับได้ Aluminum Holder', basePrice: 390, image: 'https://images.unsplash.com/photo-1586105251261-72a756497a11' },
      { name: 'USB-C HUB 7-in-1 Aluminum Adapter', basePrice: 690, image: 'https://images.unsplash.com/photo-1622445268465-84288046d581' },
      { name: 'สายชาร์จ Fast Charge 100W Braided Cable', basePrice: 290, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90' },
      { name: 'พาวเวอร์แบงค์ 30000mAh MagSafe Wireless', basePrice: 1290, image: 'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf' }
    ]
  },
  gaming: {
    'เมาส์ & คีย์บอร์ด': [
      { name: 'Mechanical Gaming Keyboard Tri-Mode RGB', basePrice: 2490, image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3' },
      { name: 'Ultra-Lightweight Gaming Mouse 8K Hz', basePrice: 1890, image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7' },
      { name: 'Custom Keycaps PBT Double Shot Set', basePrice: 890, image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46' }
    ],
    'หูฟัง & ไมโครโฟน': [
      { name: 'USB Condenser Streaming Microphone Pro', basePrice: 1590, image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df' },
      { name: 'หูฟังเกมมิ่ง 7.1 Surround Wireless Headset', basePrice: 2490, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e' },
      { name: 'หูฟังไร้สาย Gaming Earbuds Low Latency 40ms', basePrice: 990, image: 'https://images.unsplash.com/photo-1590658006821-04f4008d5717' },
      { name: 'ไมโครโฟน Dynamic Podcast XLR/USB', basePrice: 3290, image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6' },
      { name: 'Studio Monitor Headphone Professional', basePrice: 2890, image: 'https://images.unsplash.com/photo-1583394838336-acd977736f90' }
    ],
    'จอมอนิเตอร์ & โต๊ะเก้าอี้': [
      { name: 'Gaming Monitor 27" 240Hz IPS 1ms', basePrice: 7900, image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf' },
      { name: 'Ergonomic Gaming Chair PU Leather', basePrice: 4500, image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d83d0' }
    ]
  },
  beauty: {
    'เซรั่ม & มอยส์เจอไรเซอร์': [
      { name: 'Aura Hyaluron Intense Serum 50ml', basePrice: 490, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be' },
      { name: 'Vitamin C Booster Glow Drop 30ml', basePrice: 390, image: 'https://images.unsplash.com/photo-1608248597261-833244722510' }
    ],
    'กันแดด & คลีนซิ่ง': [
      { name: 'Sunscreen Light Watery Essence SPF50+', basePrice: 350, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03' },
      { name: 'Cleansing Oil Deep Cleanse 200ml', basePrice: 420, image: 'https://images.unsplash.com/photo-1617897903246-719242758050' }
    ],
    'เครื่องสำอาง & ลิปสติก': [
      { name: 'Velvet Matte Longlasting Lipstick', basePrice: 290, image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa' },
      { name: 'Cushion Glowing Skin SPF50 PA++++', basePrice: 590, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e' }
    ],
    'บำรุงผิวกาย & น้ำหอม': [
      { name: 'Eau De Parfum Luxury Unisex 50ml', basePrice: 1290, image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539' },
      { name: 'Perfume Body Lotion Rose Scent 250ml', basePrice: 380, image: 'https://images.unsplash.com/photo-1547887537-6158d64c35b3' }
    ]
  },
  fashion: {
    'เสื้อยืด & เสื้อครอป': [
      { name: 'Oversized Streetwear Premium Cotton Tee', basePrice: 350, image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518' },
      { name: 'Minimalist Crop Top Ribbed Soft Touch', basePrice: 250, image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c' }
    ],
    'กางเกง & ยีนส์': [
      { name: 'Straight Leg Vintage Denim Jeans', basePrice: 890, image: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246' },
      { name: 'Cargo Tactical Pants Multi-Pocket', basePrice: 650, image: 'https://images.unsplash.com/photo-1582552938357-32b906df40cb' }
    ],
    'แจ็กเก็ต & ฮู้ดดี้': [
      { name: 'Zip-Up Fleece Hoodie Heavyweight', basePrice: 790, image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5' },
      { name: 'Denim Jacket Vintage Classic Blue', basePrice: 1190, image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea' }
    ],
    'กระเป๋า & รองเท้า': [
      { name: 'White Leather Sneaker Classic Style', basePrice: 1890, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff' },
      { name: 'Leather Crossbody Minimal Bag', basePrice: 990, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa' }
    ]
  },
  home: {
    'โคมไฟ & ไฟแต่งห้อง': [
      { name: 'Minimalist Desk Lamp Touch Dimmer', basePrice: 450, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c' },
      { name: 'RGB Sunset Projection Lamp', basePrice: 290, image: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38' }
    ],
    'เครื่องหอม & อโรม่า': [
      { name: 'Aroma Soy Wax Candle Lavender 200g', basePrice: 320, image: 'https://images.unsplash.com/photo-1603006905003-be475563bc59' }
    ],
    'เฟอร์นิเจอร์ & ชั้นวาง': [
      { name: 'Ergonomic Monitor Stand Solid Wood', basePrice: 690, image: 'https://images.unsplash.com/photo-1538688525198-9b88f6f53126' }
    ],
    'เครื่องครัว & แก้วน้ำ': [
      { name: 'Stainless Tumbler Vacuum Keep Cold 900ml', basePrice: 390, image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd' }
    ]
  },
  sports: {
    'อุปกรณ์ออกกำลังกาย': [
      { name: 'Adjustable Dumbbell 24kg Quick Select', basePrice: 3200, image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2' },
      { name: 'Yoga Mat NBR 10mm Anti-Slip Eco', basePrice: 450, image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd' }
    ],
    'แคมปิ้ง & เต็นท์': [
      { name: 'Automatic Tent 4-Person Waterproof', basePrice: 1890, image: 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4' }
    ],
    'รองเท้า & เสื้อผ้ากีฬา': [
      { name: 'Marathon Carbon Plate Running Shoes', basePrice: 2900, image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06' }
    ]
  }
};

// --- REALISTIC 360 PRODUCTS GENERATOR ---
const generate350Products = (): Product[] => {
  const products: Product[] = [];
  let idCounter = 1;
  const subCategoryCounters: Record<string, number> = {};
  const mainCatKeys = Object.keys(PRODUCT_TEMPLATES);

  for (let i = 0; i < 360; i++) {
    const mainCat = mainCatKeys[i % mainCatKeys.length];
    const subCatMap = PRODUCT_TEMPLATES[mainCat];
    const subCatKeys = Object.keys(subCatMap);
    const subCat = subCatKeys[i % subCatKeys.length];

    if (subCategoryCounters[subCat] === undefined) {
      subCategoryCounters[subCat] = 0;
    } else {
      subCategoryCounters[subCat] += 1;
    }

    const itemIndexInSub = subCategoryCounters[subCat];
    const itemList = subCatMap[subCat];
    const templateItem = itemList[itemIndexInSub % itemList.length];

    const modelVariant = `(รุ่นปี 2026 / Edition ${itemIndexInSub + 1})`;
    const fullTitle = `${templateItem.name} ${modelVariant}`;

    // คำนวณราคาแบบสมจริง อ้างอิงจาก basePrice ของสินค้าแต่ละชิ้นโดยเฉพาะ
    const priceVariation = ((i % 5) * 50) - 100;
    const finalPrice = Math.max(150, templateItem.basePrice + priceVariation);
    const originalPrice = Math.round(finalPrice * 1.25);

    const rating = Number((4.7 + ((i % 4) * 0.1)).toFixed(1));
    const reviewCount = (i * 43 + 95) % 1800 + 20;
    const soldCount = (i * 47 + 150) % 9800 + 200;

    const imgUrl = `${templateItem.image}?w=600&auto=format&fit=crop&q=80`;

    products.push({
      id: idCounter,
      name: fullTitle,
      mainCategory: mainCat,
      subCategory: subCat,
      price: finalPrice,
      originalPrice: originalPrice,
      rating: rating,
      reviewCount: reviewCount,
      soldCount: soldCount,
      badge: BADGES[i % BADGES.length],
      location: LOCATIONS[i % LOCATIONS.length],
      image: imgUrl
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

  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

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

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setGeneratedOrderId(`367-TH-${Math.floor(100000 + Math.random() * 900000)}`);
    setOrderSuccess(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-32 selection:bg-indigo-500 selection:text-white">
      
      {/* Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-slate-200 text-sm py-2.5 px-4 font-medium border-b border-indigo-800/40 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider shadow-sm shadow-indigo-500/50">
              367 OFFICIAL
            </span>
            <span className="text-xs sm:text-sm font-medium">⚡ สินค้าภาพตรงปก | ใช้โค้ดส่วนลด <strong className="text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs sm:text-sm text-indigo-300/80 font-mono">การันตีของแท้ 100% | จัดส่งฟรีทั่วประเทศ</span>
        </div>
      </div>

      {/* Header Navbar */}
      <header className="sticky top-0 z-40 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl shadow-indigo-950/30">
        <div className="max-w-7xl mx-auto px-4 h-22 flex items-center justify-between gap-4 py-3">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleMainCatChange('all')}
          >
            <div className="w-12 h-12 bg-gradient-to-tr from-violet-600 via-indigo-600 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-indigo-500/40 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black tracking-tight text-white block leading-none">
                367 <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">STORE</span>
              </span>
              <span className="text-xs bg-indigo-950/80 text-indigo-300 border border-indigo-700/60 font-bold px-2 py-0.5 rounded mt-1 inline-block tracking-widest uppercase">
                PREMIUM E-COMMERCE
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าจาก 360+ รายการ..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-24 py-3 text-sm sm:text-base bg-slate-900 border border-slate-700/80 rounded-2xl focus:bg-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-slate-100"
              />
              <svg className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button className="absolute right-1.5 top-1.5 bottom-1.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 rounded-xl transition text-xs sm:text-sm shadow-md shadow-indigo-600/30">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Cart Trigger */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-indigo-300 font-bold px-4 py-3 rounded-2xl transition shadow-lg shadow-black/40 text-sm sm:text-base"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline font-bold">ตะกร้า</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-full border-2 border-slate-950 shadow-lg">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Main & Sub Categories Navigation */}
      <nav className="bg-slate-900/95 border-b border-slate-800 py-3.5 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2.5 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleMainCatChange(cat.id)}
                className={`px-4 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-600 text-white shadow-lg shadow-indigo-600/40 scale-105'
                    : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-3 pt-2.5 border-t border-slate-800/60">
              <span className="text-xs font-black text-indigo-400 uppercase tracking-wider whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => handleSubCatChange(sub)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-500 font-bold shadow-md shadow-indigo-950/80'
                      : 'bg-slate-950/60 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-indigo-950 via-slate-900 to-violet-950 border border-indigo-800/50 shadow-2xl p-6 sm:p-10 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="relative z-10 space-y-3 max-w-2xl text-center md:text-left">
            <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-black px-3.5 py-1 rounded-full uppercase tracking-widest">
              <span>🔥 367 MEGA GRAND SALE 2026</span>
            </div>
            <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white leading-tight">
              ช้อปสินค้าตรงปก <span className="bg-gradient-to-r from-indigo-400 via-emerald-400 to-violet-400 bg-clip-text text-transparent">ลดสูงสุด 70%</span>
            </h2>
            <p className="text-slate-300 text-sm sm:text-base font-medium">
              สินค้าตรงรุ่นรูปภาพสมจริง การันตีราคามาตรฐานจากโรงงาน
            </p>
          </div>

          <div className="relative z-10 bg-slate-950/80 border border-slate-800 p-5 rounded-2xl text-center w-full md:w-auto min-w-[240px] shadow-xl">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1">สิทธิพิเศษวันนี้</p>
            <p className="text-2xl font-black text-emerald-400 font-mono">แจกส่วนลด ฿200</p>
            <button 
              onClick={() => {
                setCouponCode('367VIP');
                setIsCartOpen(true);
              }}
              className="mt-4 w-full py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition"
            >
              รับโค้ดส่วนลด 367VIP &gt;
            </button>
          </div>
        </div>
      </section>

      {/* Product Grid Section */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white flex items-center gap-2">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              {selectedSubCat !== 'ทั้งหมด' && <span className="text-indigo-400 font-medium text-xl"> &gt; {selectedSubCat}</span>}
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 font-medium mt-1">
              พบสินค้าตรงปก <span className="font-bold text-emerald-400 font-mono text-base">{filteredAndSortedProducts.length}</span> รายการ
            </p>
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
            <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">จัดเรียง:</span>
            {[
              { id: 'popular', label: 'ยอดนิยม' },
              { id: 'sales', label: 'ขายดีสุด' },
              { id: 'price-asc', label: 'ราคาต่ำ-สูง' },
              { id: 'price-desc', label: 'ราคาสูง-ต่ำ' }
            ].map(btn => (
              <button
                key={btn.id}
                onClick={() => setSortBy(btn.id)}
                className={`px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  sortBy === btn.id
                    ? 'bg-indigo-500 text-slate-950 font-black'
                    : 'bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60'
                }`}
              >
                {btn.label}
              </button>
            ))}
          </div>
        </div>

        {/* Product Cards Grid */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-2xl border border-slate-800/90 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-950/60 hover:border-indigo-500/60 hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-2.5 left-2.5">
                      {product.badge && (
                        <span className="bg-emerald-500 text-slate-950 text-xs font-black px-2.5 py-0.5 rounded-md shadow-md uppercase">
                          {product.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="p-3.5 sm:p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-950 border border-indigo-800/60 px-2.5 py-0.5 rounded-full">
                        {product.subCategory}
                      </span>
                      <span className="text-xs text-slate-500 font-mono">
                        #367-{product.id}
                      </span>
                    </div>

                    <h3 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-2 h-11 leading-snug group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">ขายแล้ว {product.soldCount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 sm:p-4 pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl sm:text-3xl font-black text-emerald-400 font-mono">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 line-through">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-800/60">
                    <span className="text-xs text-slate-400 truncate max-w-[100px]">
                      📍 {product.location}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-2 px-3.5 rounded-xl transition shadow-md flex items-center gap-1 text-xs sm:text-sm"
                    >
                      <span>ใส่ตะกร้า</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 my-8">
            <p className="text-xl font-bold text-slate-300">ไม่พบสินค้าที่คุณค้นหา</p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 sm:gap-3">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 disabled:opacity-30"
            >
              &lt; ย้อนกลับ
            </button>
            <span className="text-sm font-bold text-slate-400 px-3">
              หน้า {currentPage} / {totalPages}
            </span>
            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 disabled:opacity-30"
            >
              ถัดไป &gt;
            </button>
          </div>
        )}

      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <span className="text-lg font-black text-white">ตะกร้าสินค้า ({totalCartItems})</span>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white font-bold text-xl">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950/80 rounded-xl border border-slate-800 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-bold text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-base font-black text-emerald-400 font-mono">฿{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="w-6 h-6 bg-slate-800 rounded text-xs font-bold">-</button>
                      <span className="text-xs font-bold text-slate-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="w-6 h-6 bg-slate-800 rounded text-xs font-bold">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-xs font-bold text-slate-300 block mb-1">โค้ดส่วนลด (ลองใช้: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white uppercase font-mono font-bold"
                    />
                    <button onClick={handleApplyCoupon} className="px-3.5 py-2 bg-indigo-600 text-white font-bold text-xs rounded-lg">ใช้โค้ด</button>
                  </div>
                  {couponMessage && <p className={`text-xs font-bold mt-1 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>{couponMessage.text}</p>}
                </div>

                <div className="flex justify-between items-center text-lg font-black text-white pt-2 border-t border-slate-800">
                  <span>ยอดชำระสุทธิ:</span>
                  <span className="text-2xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                </div>

                <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl">
                  ชำระเงินทันที &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 relative border border-slate-800 text-slate-100">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 text-xl font-bold">✕</button>

            {orderSuccess ? (
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center text-3xl mx-auto mb-3">✓</div>
                <h3 className="text-2xl font-black text-white">สั่งซื้อสินค้าสำเร็จ!</h3>
                <p className="text-slate-400 text-sm mt-1">หมายเลขสั่งซื้อ: <span className="font-mono text-emerald-400 font-bold">{generatedOrderId}</span></p>
                <button
                  onClick={() => {
                    setCart([]);
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="mt-6 w-full py-3 bg-slate-800 text-white font-bold rounded-xl"
                >
                  กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-slate-800 pb-3">สั่งซื้อสินค้า</h3>
                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <span className="text-2xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl">
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
