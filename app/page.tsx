'use client';

import React, { useState, useMemo } from 'react';

// --- TYPES ---
interface Product {
  id: number;
  name: string;
  description: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  soldCount: number;
  badge?: string;
  location: string;
  image: string;
}

interface CartItem {
  product: Product;
  quantity: number;
}

// --- MAIN CATEGORIES CONFIGURATION ---
const MAIN_CATEGORIES = [
  { id: 'all', name: '🔥 ทั้งหมด', subs: [] },
  { id: 'it', name: '📱 อุปกรณ์ไอที', subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] },
  { id: 'gaming', name: '🎮 เกมมิ่งเกียร์', subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] },
  { id: 'beauty', name: '💄 สกินแคร์ & บิวตี้', subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'] },
  { id: 'fashion', name: '👕 แฟชั่น & เครื่องแต่งกาย', subs: ['ทั้งหมด', 'เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'] },
  { id: 'home', name: '🏠 ของแต่งบ้าน & ไลฟ์สไตล์', subs: ['ทั้งหมด', 'โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'] },
  { id: 'sports', name: '⚽ สปอร์ต & เอาต์ดอร์', subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] }
];

// --- AUTOMATIC CATALOG GENERATOR (100 ITEMS PER CATEGORY = 600+ ITEMS) ---
const generateMassiveCatalog = (): Product[] => {
  const catalog: Product[] = [];
  let idCounter = 1;

  const locations = ['กรุงเทพมหานคร', 'นนทบุรี', 'สมุทรปราการ', 'เชียงใหม่', 'ชลบุรี', 'ภูเก็ต', 'ปทุมธานี'];
  const badges = ['367 VIP', 'HOT DEAL', 'MALL', 'ส่งฟรี', 'BEST SELLER', 'ลด 50%'];

  const categoryTemplates = [
    {
      mainId: 'it',
      subs: ['โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'],
      items: ['สมาร์ทโฟน', 'แท็บเล็ต', 'โน๊ตบุ๊คตัดต่อ', 'คอมพิวเตอร์ตั้งโต๊ะ', 'สายชาร์จไว', 'พาวเวอร์แบงค์', 'หูฟังบลูทูธ', 'แท่นวางไอแพด', 'เคสกันกระแทก'],
      features: ['ชิปเซ็ตประมวลผลเร็วพิเศษ', 'แบตเตอรี่อึดใช้งานได้ทั้งวัน', 'รองรับการชาร์จไว Fast Charge', 'ดีไซน์บางเบาพกพาง่าย', 'ประกันศูนย์ไทย 1 ปีเต็ม'],
      priceRange: [290, 45000],
      images: [
        'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600&q=80',
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&q=80'
      ]
    },
    {
      mainId: 'gaming',
      subs: ['เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'],
      items: ['คีย์บอร์ด Mechanical', 'เมาส์เกมมิ่งไร้สาย', 'หูฟัง 7.1 Surround', 'ไมค์คอนเดนเซอร์', 'จอมอนิเตอร์ 240Hz', 'เก้าอี้ Ergonomic Gaming'],
      features: ['ตอบสนองแม่นยำระดับ eSports', 'ไฟ RGB ปรับแต่งได้ 16.8 ล้านสี', 'น้ำหนักเบาพิเศษใช้งานยาวนาน', 'เสียงคมชัดตัดเสียงรบกวน'],
      priceRange: [590, 15900],
      images: [
        'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
        'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80',
        'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
        'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80'
      ]
    },
    {
      mainId: 'beauty',
      subs: ['เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'],
      items: ['เซรั่มไฮยาลูรอน', 'ครีมกันแดดเนื้อเอสเซนส์', 'ลิปสติกเนื้อแมตต์', 'น้ำหอม EDP', 'คลีนซิ่งเช็ดเครื่องสำอาง', 'มอยส์เจอไรเซอร์สูตรเข้มข้น'],
      features: ['สูตรอ่อนโยนสำหรับผิวแพ้ง่าย', 'ซึมซาบไวไม่เหนียวเหนอะหนะ', 'บำรุงผิวกระจ่างใสอย่างเป็นธรรมชาติ', 'ติดทนนานตลอดวัน'],
      priceRange: [190, 2500],
      images: [
        'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=600&q=80',
        'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
        'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
        'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80'
      ]
    },
    {
      mainId: 'fashion',
      subs: ['เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'],
      items: ['เสื้อยืด Oversized', 'กางเกงยีนส์วินเทจ', 'เสื้อฮู้ดดี้ผ้านุ่ม', 'รองเท้าสนีกเกอร์', 'กระเป๋าสะพายข้าง', 'หมวกแก๊ปสตรีท'],
      features: ['ผ้า Cotton เกรดพรีเมียม นุ่มใส่สบาย', 'แมตช์เข้าชุดได้ง่ายทุกสไตล์', 'งานตัดเย็บปราณีต ทนทาน', 'ทรงสวยทันสมัย'],
      priceRange: [250, 3900],
      images: [
        'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80',
        'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&q=80',
        'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
        'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80'
      ]
    },
    {
      mainId: 'home',
      subs: ['โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'],
      items: ['โคมไฟมินิมอล', 'เทียนหอมอโรม่า', 'ชั้นวางของออแกไนเซอร์', 'แก้วน้ำเก็บความเย็น', 'หม้อสุกี้ไฟฟ้า', 'เครื่องพ่นไอน้ำ'],
      features: ['ช่วยเพิ่มบรรยากาศอบอุ่นให้บ้าน', 'วัสดุคุณภาพสูง ปลอดภัย', 'ใช้งานง่าย ดีไซน์สวยงาม', 'ช่วยประหยัดพื้นที่จัดเก็บ'],
      priceRange: [150, 1800],
      images: [
        'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
        'https://images.unsplash.com/photo-1603006905003-be475563bc59?w=600&q=80',
        'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?w=600&q=80',
        'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=600&q=80'
      ]
    },
    {
      mainId: 'sports',
      subs: ['อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'],
      items: ['ดัมเบลปรับน้ำหนัก', 'เสื่อโยคะกันสไลด์', 'เต็นท์สนามกางอัตโนมัติ', 'รองเท้าวิ่งพื้นคาร์บอน', 'เชือกกระโดดฟิตเนส'],
      features: ['รองรับแรงกระแทกได้ดีเยี่ยม', 'พกพาสะดวก เหมาะสำหรับสายเอาต์ดอร์', 'ทนทานต่อการใช้งานหนัก', 'ออกแบบตามหลักสรีรศาสตร์'],
      priceRange: [190, 4900],
      images: [
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
        'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80'
      ]
    }
  ];

  // สุ่มสร้างหมวดละ 100 ชิ้น
  categoryTemplates.forEach(template => {
    for (let i = 1; i <= 100; i++) {
      const itemBase = template.items[i % template.items.length];
      const subCat = template.subs[i % template.subs.length];
      const feature = template.features[i % template.features.length];
      const img = template.images[i % template.images.length];

      const minPrice = template.priceRange[0];
      const maxPrice = template.priceRange[1];
      const price = Math.floor((Math.random() * (maxPrice - minPrice) + minPrice) / 10) * 10;
      const originalPrice = Math.floor(price * (1.2 + Math.random() * 0.3));

      catalog.push({
        id: idCounter,
        name: `${itemBase} รุ่นพิเศษ 367 Pro #${i}`,
        description: `${feature} การันตีคุณภาพมาตรฐานสากล พร้อมส่งทันที`,
        mainCategory: template.mainId,
        subCategory: subCat,
        price: price,
        originalPrice: originalPrice,
        rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
        soldCount: Math.floor(100 + Math.random() * 9800),
        badge: badges[i % badges.length],
        location: locations[i % locations.length],
        image: img
      });
      idCounter++;
    }
  });

  return catalog;
};

// CATALOG CONSTANT (600+ ITEMS)
const PRODUCT_CATALOG: Product[] = generateMassiveCatalog();

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular'); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24; // แสดงหน้าละ 24 ชิ้น

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
    let result = PRODUCT_CATALOG.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
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
      
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-violet-900 via-indigo-900 to-slate-900 text-slate-200 text-sm py-2.5 px-4 font-medium border-b border-indigo-800/40 shadow-inner">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-slate-950 font-black px-2.5 py-0.5 rounded-full text-xs uppercase tracking-wider shadow-sm shadow-indigo-500/50">
              367 OFFICIAL
            </span>
            <span className="text-xs sm:text-sm font-medium">⚡ ใช้โค้ด <strong className="text-emerald-400 font-mono bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-500/40">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs sm:text-sm text-indigo-300/80 font-mono">คลังสินค้ากว่า {PRODUCT_CATALOG.length} รายการพร้อมส่ง</span>
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
                MEGA E-COMMERCE
              </span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้ากว่า 600 รายการ..."
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

          {/* Cart Button */}
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

      {/* Product Section Header */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-slate-900/70 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 backdrop-blur-md">
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                พบ {filteredAndSortedProducts.length} รายการ
              </span>
            </h1>
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

        {/* Product Cards Grid (24 items per page) */}
        {paginatedProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
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

                    <h3 className="text-sm sm:text-base font-bold text-slate-100 line-clamp-1 leading-snug group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 min-h-[32px] font-normal leading-relaxed">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs sm:text-sm text-slate-300 font-medium">
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/30">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-xs text-slate-400">ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
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

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 sm:gap-3 flex-wrap">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              &lt; ย้อนกลับ
            </button>
            
            <span className="text-sm font-bold text-slate-400 px-3 bg-slate-900 py-2 rounded-xl border border-slate-800">
              หน้า <strong className="text-indigo-400">{currentPage}</strong> / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-4 py-2.5 bg-slate-900 border border-slate-800 rounded-xl text-xs sm:text-sm font-bold text-slate-300 disabled:opacity-30 hover:bg-slate-800"
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

                <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg">
                  ชำระเงินทันที &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal & Order Success Screen */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 relative border border-slate-800 text-slate-100 my-8 shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 text-xl font-bold hover:text-white">✕</button>

            {orderSuccess ? (
              <div className="py-2 text-slate-100 space-y-5">
                <div className="text-center space-y-2">
                  <div className="text-6xl mb-2 animate-bounce">🚚</div>
                  <h3 className="text-2xl font-black text-emerald-400">สั่งซื้อสำเร็จ!</h3>
                  <p className="text-sm font-bold text-slate-200">
                    พนักงานกำลังจัดส่งพัสดุของคุณ
                  </p>
                  <div className="inline-block bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 text-xs text-indigo-300 font-mono mt-2">
                    หมายเลขสั่งซื้อ: <strong className="text-white font-bold">{generatedOrderId}</strong>
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
                  <p className="text-xs font-bold text-slate-400 border-b border-slate-800 pb-2 uppercase tracking-wider">
                    📦 รายละเอียดสินค้าที่สั่งซื้อ ({totalCartItems} ชิ้น)
                  </p>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2.5 pr-1">
                    {cart.map((item) => (
                      <div key={item.product.id} className="flex justify-between items-center gap-3 text-xs bg-slate-900/60 p-2 rounded-lg border border-slate-800/60">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <img 
                            src={item.product.image} 
                            alt={item.product.name} 
                            className="w-10 h-10 object-cover rounded-md border border-slate-800 shrink-0" 
                          />
                          <div className="truncate">
                            <p className="font-bold text-slate-200 truncate">{item.product.name}</p>
                            <p className="text-slate-400 font-medium">จำนวน: {item.quantity} ชิ้น</p>
                          </div>
                        </div>
                        <span className="font-mono font-bold text-emerald-400 whitespace-nowrap">
                          ฿{(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="flex justify-between">
                    <span className="text-slate-400">ผู้รับสินค้า:</span>
                    <span className="text-slate-200 font-bold">{formData.name} ({formData.phone})</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">ที่อยู่จัดส่ง:</span>
                    <span className="text-slate-200 font-medium truncate max-w-[200px]">{formData.address}</span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-slate-800 text-sm font-bold">
                    <span className="text-slate-300">ยอดชำระเงินสุทธิ:</span>
                    <span className="text-emerald-400 font-mono font-black text-base">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setCart([]);
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl transition shadow-lg shadow-indigo-600/30"
                >
                  ตกลง / กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-xl font-black text-white border-b border-slate-800 pb-3 flex items-center gap-2">
                  <span>🛍️</span> ชำระเงิน & จัดส่ง
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล *</label>
                    <input
                      type="text"
                      required
                      placeholder="เช่น สมชาย ใจดี"
                      value={formData.name}
                      onChange={e => setFormData({ ...formData, name: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ *</label>
                    <input
                      type="tel"
                      required
                      placeholder="เช่น 0812345678"
                      value={formData.phone}
                      onChange={e => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่ง *</label>
                    <textarea
                      required
                      rows={2}
                      placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-xs text-slate-400 block">ยอดชำระสุทธิ</span>
                    <span className="text-2xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                  <button type="submit" className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg transition">
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
