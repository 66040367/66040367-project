'use client';

import React, { useState, useMemo, useEffect } from 'react';

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

// --- BANNERS DATA (ROYALTY-FREE HD IMAGES) ---
const HERO_BANNERS = [
  {
    id: 1,
    title: '367 MEGA SALE 8.8',
    subtitle: 'ขนกองทัพไอทีและเกมมิ่ง ลดสูงสุด 70%',
    tag: 'PROMOTION OF THE MONTH',
    cta: 'ช้อปเลยตอนนี้',
    bgGradient: 'from-violet-950 via-indigo-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80'
  },
  {
    id: 2,
    title: 'BEAUTY & SKINCARE WEEK',
    subtitle: 'สกินแคร์สูตรอ่อนโยน การันตีของแท้ 100%',
    tag: 'EXCLUSIVE OFFER',
    cta: 'ดูสินค้าบิวตี้',
    bgGradient: 'from-rose-950 via-pink-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1200&q=80'
  },
  {
    id: 3,
    title: 'NEW STREET FASHION',
    subtitle: 'เสื้อผ้าและสตรีทแวร์คอลเลกชันใหม่ล่าสุด',
    tag: 'NEW ARRIVALS',
    cta: 'เลือกชมสไตล์ใหม่',
    bgGradient: 'from-emerald-950 via-teal-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&q=80'
  }
];

// --- MAIN CATEGORIES CONFIGURATION ---
const MAIN_CATEGORIES = [
  { id: 'all', name: '🔥 สินค้าทั้งหมด', subs: [] },
  { id: 'it', name: '📱 อุปกรณ์ไอที', subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'] },
  { id: 'gaming', name: '🎮 เกมมิ่งเกียร์', subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'] },
  { id: 'beauty', name: '💄 สกินแคร์ & บิวตี้', subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง', 'เครื่องสำอาง & ลิปสติก', 'บำรุงผิวกาย & น้ำหอม'] },
  { id: 'fashion', name: '👕 แฟชั่น & เครื่องแต่งกาย', subs: ['ทั้งหมด', 'เสื้อยืด & เสื้อครอป', 'กางเกง & ยีนส์', 'แจ็กเก็ต & ฮู้ดดี้', 'กระเป๋า & รองเท้า'] },
  { id: 'home', name: '🏠 ของแต่งบ้าน & ไลฟ์สไตล์', subs: ['ทั้งหมด', 'โคมไฟ & ไฟแต่งห้อง', 'เครื่องหอม & อโรม่า', 'เฟอร์นิเจอร์ & ชั้นวาง', 'เครื่องครัว & แก้วน้ำ'] },
  { id: 'sports', name: '⚽ สปอร์ต & เอาต์ดอร์', subs: ['ทั้งหมด', 'อุปกรณ์ออกกำลังกาย', 'แคมปิ้ง & เต็นท์', 'รองเท้า & เสื้อผ้ากีฬา'] }
];

// --- AUTOMATIC CATALOG GENERATOR (MASSIVE DATA) ---
const generateMassiveCatalog = (): Product[] => {
  const catalog: Product[] = [];
  let idCounter = 1;

  const locations = ['กรุงเทพมหานคร', 'นนทบุรี', 'สมุทรปราการ', 'เชียงใหม่', 'ชลบุรี', 'ภูเก็ต', 'ปทุมธานี'];
  const badges = ['367 VIP', 'HOT DEAL', 'MALL', 'ส่งฟรี', 'BEST SELLER', 'ลด 50%'];

  const categoryTemplates = [
    {
      mainId: 'it',
      subs: ['โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แก็ดเจ็ต & อุปกรณ์เสริม'],
      items: ['สมาร์ทโฟน flagship', 'แท็บเล็ตจอ Pro', 'โน๊ตบุ๊คบางเบา', 'พาวเวอร์แบงค์ชาร์จไว', 'หูฟังไร้สาย ANC', 'สายชาร์จ Type-C'],
      features: ['ชิปเซ็ตประมวลผลเร็วพิเศษ', 'แบตเตอรี่อึดใช้งานได้ทั้งวัน', 'รองรับ Fast Charge 65W', 'ดีไซน์พรีเมียม ประกันศูนย์ 1 ปี'],
      priceRange: [390, 38900],
      images: [
        'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
        'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600&q=80',
        'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
        'https://images.unsplash.com/photo-1609081219090-a6d81d3085bf?w=600&q=80',
        'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600&q=80'
      ]
    },
    {
      mainId: 'gaming',
      subs: ['เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน', 'จอมอนิเตอร์ & โต๊ะเก้าอี้'],
      items: ['คีย์บอร์ด Mechanical RGB', 'เมาส์เกมมิ่ง Wireless', 'หูฟัง 7.1 Surround', 'ไมโครโฟนสตรีมเมอร์', 'จอมอนิเตอร์ 240Hz'],
      features: ['สวิตช์สัมผัสนุ่มตอบสนองไว', 'ไฟ RGB ปรับได้ 16.8 ล้านสี', 'ระบบตัดเสียงรบกวน Noise Cancelling', 'ออกแบบตามสรีรศาสตร์'],
      priceRange: [690, 14900],
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
      items: ['เซรั่มเข้มข้น', 'คลีนซิ่งวอเตอร์', 'ครีมกันแดด SPF50+', 'ลิปสติกเนื้อแมตต์', 'โลชั่นบำรุงผิวกาย', 'น้ำหอม EDP'],
      features: ['สูตรอ่อนโยนสำหรับผิวแพ้ง่าย', 'ซึมซาบไวไม่เหนอะหนะ', 'สารสกัดจากธรรมชาติ 100%', 'ติดทนนานตลอดวัน'],
      priceRange: [190, 2800],
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
      items: ['เสื้อยืด Oversize', 'กางเกงคาร์โก้สตรีท', 'เสื้อแจ็กเก็ตกันลม', 'รองเท้าสนีกเกอร์', 'กระเป๋าสะพายกันน้ำ'],
      features: ['เนื้อผ้า Premium Cotton 100%', 'ผ้านุ่มระบายอากาศดีเยี่ยม', 'ตัดเย็บประณีต ทรงสวย', 'สวมใส่สบายแมตช์ได้ทุกชุด'],
      priceRange: [290, 3500],
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
      items: ['โคมไฟสไตล์มินิมอล', 'เทียนหอมอโรม่า', 'ชั้นวางของพับได้', 'แก้วน้ำเก็บความเย็น', 'หม้อไฟฟ้ามัลติฟังก์ชัน'],
      features: ['สร้างบรรยากาศอบอุ่นในบ้าน', 'วัสดุทนทาน ปลอดภัย ไร้สารพิษ', 'ดีไซน์ทันสมัย ประหยัดพื้นที่'],
      priceRange: [150, 2200],
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
      items: ['ดัมเบลปรับน้ำหนัก', 'เสื่อโยคะกันสไลด์', 'เต็นท์สนามสนามกางไว', 'รองเท้าวิ่งน้ำหนักเบา', 'กระติกน้ำกีฬา'],
      features: ['ยืดหยุ่นสูง รับน้ำหนักได้ดี', 'พกพาสะดวก เหมาะสำหรับกิจกรรมเอาต์ดอร์', 'การันตีความทนทาน'],
      priceRange: [220, 4500],
      images: [
        'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&q=80',
        'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&q=80',
        'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80',
        'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80'
      ]
    }
  ];

  categoryTemplates.forEach(template => {
    for (let i = 1; i <= 100; i++) {
      const itemBase = template.items[i % template.items.length];
      const subCat = template.subs[i % template.subs.length];
      const feature = template.features[i % template.features.length];
      const img = template.images[i % template.images.length];

      const minPrice = template.priceRange[0];
      const maxPrice = template.priceRange[1];
      const price = Math.floor((Math.random() * (maxPrice - minPrice) + minPrice) / 10) * 10;
      const originalPrice = Math.floor(price * (1.25 + Math.random() * 0.35));

      catalog.push({
        id: idCounter,
        name: `${itemBase} รุ่นพิเศษ 367 Ultra #${i}`,
        description: `${feature} สินค้าคุณภาพมาตรฐานสากล พร้อมจัดส่งทันที`,
        mainCategory: template.mainId,
        subCategory: subCat,
        price: price,
        originalPrice: originalPrice,
        rating: Number((4.3 + Math.random() * 0.7).toFixed(1)),
        soldCount: Math.floor(120 + Math.random() * 8500),
        badge: badges[i % badges.length],
        location: locations[i % locations.length],
        image: img
      });
      idCounter++;
    }
  });

  return catalog;
};

const PRODUCT_CATALOG: Product[] = generateMassiveCatalog();

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular'); 
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 24;

  // Banner Carousel State
  const [activeBanner, setActiveBanner] = useState<number>(0);

  // Cart & Modal States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [orderSuccess, setOrderSuccess] = useState<boolean>(false);
  const [generatedOrderId, setGeneratedOrderId] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    payment: 'promptpay'
  });

  // Auto Switch Hero Banner Every 5s
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % HERO_BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

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
    } else {
      setAppliedDiscount(0);
      setCouponMessage({ text: 'โค้ดส่วนลดไม่ถูกต้อง', isError: true });
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
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-28 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Announcement Bar */}
      <div className="bg-gradient-to-r from-violet-950 via-indigo-900 to-slate-950 text-slate-200 text-xs sm:text-sm py-2 px-4 border-b border-indigo-800/40 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-indigo-500 text-slate-950 font-black px-2 py-0.5 rounded-full text-[10px] tracking-wider uppercase">
              OFFICIAL
            </span>
            <span>⚡ ใช้โค้ด <strong className="text-emerald-400 font-mono bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">367VIP</strong> ลดทันที ฿200</span>
          </div>
          <span className="hidden md:inline text-xs text-indigo-300 font-mono">คลังสินค้ากว่า {PRODUCT_CATALOG.length} รายการ ลิขสิทธิ์แท้พร้อมส่ง</span>
        </div>
      </div>

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div 
            className="flex items-center gap-3 cursor-pointer select-none group"
            onClick={() => handleMainCatChange('all')}
          >
            <div className="w-11 h-11 bg-gradient-to-tr from-violet-600 via-indigo-500 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
              367
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                367 <span className="bg-gradient-to-r from-indigo-400 via-violet-400 to-emerald-400 bg-clip-text text-transparent">STORE</span>
              </span>
              <span className="text-[10px] bg-indigo-950 text-indigo-300 border border-indigo-700/60 font-bold px-1.5 py-0.2 rounded mt-1 inline-block tracking-widest uppercase">
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
                className="w-full pl-10 pr-20 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none transition-all placeholder:text-slate-500 font-medium text-slate-100"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
              <button className="absolute right-1 top-1 bottom-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-3.5 rounded-lg transition text-xs shadow-md">
                ค้นหา
              </button>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-indigo-300 font-bold px-4 py-2.5 rounded-xl transition shadow-lg text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline font-bold">ตะกร้า</span>
            {totalCartItems > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-emerald-500 text-slate-950 text-[11px] font-black px-2 py-0.2 rounded-full border-2 border-slate-950 shadow-md">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Hero Banner Carousel (NEW!) */}
      <section className="max-w-7xl mx-auto px-4 mt-6">
        <div className="relative rounded-3xl overflow-hidden border border-slate-800 bg-slate-900 shadow-2xl min-h-[220px] sm:min-h-[320px] flex items-center">
          
          {/* Banner Images & Content */}
          {HERO_BANNERS.map((banner, index) => (
            <div
              key={banner.id}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out flex items-center ${
                index === activeBanner ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background Image with Dark Gradient Overlay */}
              <div className="absolute inset-0 bg-slate-950">
                <img src={banner.image} alt={banner.title} className="w-full h-full object-cover opacity-35" />
                <div className={`absolute inset-0 bg-gradient-to-r ${banner.bgGradient} opacity-90`} />
              </div>

              {/* Banner Text Content */}
              <div className="relative z-20 p-6 sm:p-12 max-w-2xl space-y-3">
                <span className="inline-block text-[11px] sm:text-xs font-black tracking-widest text-emerald-400 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full uppercase shadow-md">
                  {banner.tag}
                </span>
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                  {banner.title}
                </h2>
                <p className="text-xs sm:text-base text-slate-300 font-medium line-clamp-2">
                  {banner.subtitle}
                </p>
                <div className="pt-2">
                  <button className="bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-black px-5 py-2.5 rounded-xl text-xs sm:text-sm shadow-xl transition transform active:scale-95">
                    {banner.cta} &rarr;
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Banner Carousel Indicator Dots */}
          <div className="absolute bottom-4 right-6 z-30 flex gap-2">
            {HERO_BANNERS.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveBanner(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeBanner ? 'w-8 bg-emerald-400' : 'w-2 bg-slate-600 hover:bg-slate-400'
                }`}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Main & Sub Categories Bar */}
      <nav className="bg-slate-900/80 border-y border-slate-800/80 py-3 mt-6 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleMainCatChange(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 border border-slate-700/50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {currentSubCategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto mt-2.5 pt-2 border-t border-slate-800/50">
              <span className="text-[11px] font-bold text-indigo-400 uppercase whitespace-nowrap mr-1">หมวดย่อย:</span>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => { setSelectedSubCat(sub); setCurrentPage(1); }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedSubCat === sub
                      ? 'bg-indigo-950 text-indigo-300 border border-indigo-500 font-bold'
                      : 'bg-slate-950 text-slate-400 border border-slate-800 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>
          )}
        </div>
      </nav>

      {/* Products Section Header */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
              {MAIN_CATEGORIES.find(c => c.id === selectedMainCat)?.name}
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                {filteredAndSortedProducts.length} รายการ
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
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
                className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div
                key={product.id}
                className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-950/50 hover:border-indigo-500/50 hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Image Container */}
                  <div className="relative aspect-square bg-slate-950 overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {product.badge && (
                      <span className="absolute top-2.5 left-2.5 bg-emerald-500 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded shadow-md uppercase tracking-wider">
                        {product.badge}
                      </span>
                    )}
                  </div>

                  {/* Product Info (Refined Typography) */}
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-1.5">
                      <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950/80 border border-indigo-800/50 px-2 py-0.5 rounded-md">
                        {product.subCategory}
                      </span>
                      <span className="text-[10px] text-slate-500 font-mono">#367-{product.id}</span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-100 line-clamp-1 leading-snug group-hover:text-indigo-300 transition-colors">
                      {product.name}
                    </h3>

                    <p className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed min-h-[36px]">
                      {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 text-xs text-slate-300">
                      <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/30 px-2 py-0.5 rounded border border-amber-500/20">
                        <span>★</span>
                        <span>{product.rating}</span>
                      </div>
                      <span className="text-slate-400 text-[11px]">ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
                    </div>
                  </div>
                </div>

                {/* Price & Action Button */}
                <div className="p-4 pt-0">
                  <div className="flex items-baseline gap-2">
                    <span className="text-2xl font-black text-emerald-400 font-mono">
                      ฿{product.price.toLocaleString()}
                    </span>
                    <span className="text-xs text-slate-500 line-through font-mono">
                      ฿{product.originalPrice.toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800/80">
                    <span className="text-[11px] text-slate-400 truncate max-w-[100px]">
                      📍 {product.location}
                    </span>

                    <button
                      onClick={() => addToCart(product)}
                      className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3 rounded-lg transition shadow-md text-xs"
                    >
                      ใส่ตะกร้า
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-slate-900 rounded-2xl p-12 text-center border border-slate-800 my-8">
            <p className="text-lg font-bold text-slate-300">ไม่พบสินค้าที่คุณค้นหา</p>
          </div>
        )}

        {/* Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-10 flex justify-center items-center gap-2">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 disabled:opacity-30 hover:bg-slate-800"
            >
              &lt; ย้อนกลับ
            </button>
            
            <span className="text-xs font-bold text-slate-400 px-3 py-2 bg-slate-900 rounded-xl border border-slate-800">
              หน้า <strong className="text-indigo-400 font-mono">{currentPage}</strong> / {totalPages}
            </span>

            <button
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3.5 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs font-bold text-slate-300 disabled:opacity-30 hover:bg-slate-800"
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
              <span className="text-base font-black text-white">ตะกร้าสินค้า ({totalCartItems})</span>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-14 h-14 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-sm font-black text-emerald-400 font-mono">฿{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button onClick={() => updateQuantity(item.product.id, -1)} className="w-5 h-5 bg-slate-800 rounded text-xs font-bold">-</button>
                      <span className="text-xs font-bold text-slate-100">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, 1)} className="w-5 h-5 bg-slate-800 rounded text-xs font-bold">+</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {cart.length > 0 && (
              <div className="p-4 border-t border-slate-800 bg-slate-950 space-y-3">
                <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">โค้ดส่วนลด (ลองใช้: 367VIP)</span>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponCode}
                      onChange={e => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-mono uppercase font-bold"
                    />
                    <button onClick={handleApplyCoupon} className="px-3 py-1.5 bg-indigo-600 text-white font-bold text-xs rounded-lg">ใช้โค้ด</button>
                  </div>
                  {couponMessage && <p className={`text-[11px] font-bold mt-1 ${couponMessage.isError ? 'text-red-400' : 'text-emerald-400'}`}>{couponMessage.text}</p>}
                </div>

                <div className="flex justify-between items-center text-base font-black text-white pt-2 border-t border-slate-800">
                  <span>ยอดชำระสุทธิ:</span>
                  <span className="text-xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                </div>

                <button onClick={() => setIsCheckoutOpen(true)} className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg">
                  ชำระเงินทันที &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 relative border border-slate-800 text-slate-100 my-8 shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 text-lg font-bold hover:text-white">✕</button>

            {orderSuccess ? (
              <div className="py-2 text-slate-100 space-y-4 text-center">
                <div className="text-5xl mb-2">🚚</div>
                <h3 className="text-xl font-black text-emerald-400">สั่งซื้อสำเร็จ!</h3>
                <p className="text-xs font-medium text-slate-300">
                  ระบบได้รับการชำระเงินเรียบร้อยแล้ว สินค้ากำลังเตรียมจัดส่ง
                </p>
                <div className="inline-block bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-xs text-indigo-300 font-mono">
                  หมายเลขคำสั่งซื้อ: <strong className="text-white">{generatedOrderId}</strong>
                </div>

                <button
                  onClick={() => {
                    setCart([]);
                    setOrderSuccess(false);
                    setIsCheckoutOpen(false);
                    setIsCartOpen(false);
                  }}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg mt-4"
                >
                  ตกลง / กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                  🛍️ ชำระเงิน & จัดส่ง
                </h3>

                <div className="space-y-3 text-xs">
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
                      placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด"
                      value={formData.address}
                      onChange={e => setFormData({ ...formData, address: e.target.value })}
                      className="w-full p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:border-indigo-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-800 flex justify-between items-center">
                  <div>
                    <span className="text-[11px] text-slate-400 block">ยอดชำระสุทธิ</span>
                    <span className="text-xl font-black text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                  </div>
                  <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg">
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
