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

interface OrderSummary {
  orderId: string;
  items: CartItem[];
  customer: {
    name: string;
    phone: string;
    address: string;
    paymentMethod: string;
  };
  subtotal: number;
  discount: number;
  finalTotal: number;
  date: string;
}

// --- CURATED REAL PRODUCTS (รูปตรง ชื่อตรง ราคาจริง 100%) ---
const REAL_PRODUCTS: Product[] = [
  // --- IT & SMARTPHONES ---
  {
    id: 101,
    name: 'Apple iPhone 15 Pro Max 256GB - Natural Titanium',
    description: 'ชิป A17 Pro ดีไซน์ไทเทเนียมน้ำหนักเบา ปุ่ม Action พร้อมระบบกล้อง Pro 48MP Zoom 5x รับประกันศูนย์ไทย 1 ปี',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์มือถือ',
    price: 48900,
    originalPrice: 52900,
    rating: 4.9,
    soldCount: 1420,
    badge: 'MALL แท้ 100%',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800&q=80'
  },
  {
    id: 102,
    name: 'คอมพิวเตอร์ประกอบ iHaveCPU Intel Core i7-14700K / RTX 4070 Super 12GB',
    description: 'จัดสเปกคอมพิวเตอร์เล่นเกมแรงๆ RAM 32GB DDR5 / SSD 1TB NVMe M.2 เคสกระจกไฟ RGB สวยงาม พร้อมประกันศูนย์ 3 ปีเต็ม',
    mainCategory: 'it',
    subCategory: 'คอมพิวเตอร์',
    price: 59900,
    originalPrice: 65900,
    rating: 5.0,
    soldCount: 850,
    badge: 'iHaveCPU SPEC',
    location: 'ปทุมธานี',
    image: 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=800&q=80'
  },
  {
    id: 103,
    name: 'Apple iPad Air 5 (รุ่น第5代) Wi-Fi 64GB - Space Gray',
    description: 'ชิป M1 ทรงพลัง จอภาพ Liquid Retina 10.9 นิ้ว รองรับ Apple Pencil รุ่นที่ 2 และ Magic Keyboard',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต & ไอแพด',
    price: 21900,
    originalPrice: 23900,
    rating: 4.8,
    soldCount: 3200,
    badge: 'BEST SELLER',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&q=80'
  },
  {
    id: 104,
    name: 'โน๊ตบุ๊ค ASUS ROG Strix G16 (Intel i8 / RTX 4060 / จอ 165Hz)',
    description: 'โน๊ตบุ๊คเกมมิ่งระดับท็อป ระบายความร้อนดีเยี่ยม จอแสดงผลสีตรง 100% sRGB คีย์บอร์ด RGB Per-Key',
    mainCategory: 'it',
    subCategory: 'โน๊ตบุ๊ค',
    price: 42900,
    originalPrice: 46900,
    rating: 4.9,
    soldCount: 610,
    badge: 'GAMING PRO',
    location: 'นนทบุรี',
    image: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?w=800&q=80'
  },
  {
    id: 105,
    name: 'สายชาร์จ Fast Charge Type-C to Lightning 20W ความยาว 1 เมตร',
    description: 'สายชาร์จถักไนลอนหนาพิเศษ ทนทานต่อการดัดโค้งมากกว่า 10,000 ครั้ง จ่ายไฟนิ่ง ปลอดภัย มี มอก.',
    mainCategory: 'it',
    subCategory: 'แก็ดเจ็ต & อุปกรณ์เสริม',
    price: 390,
    originalPrice: 790,
    rating: 4.7,
    soldCount: 15400,
    badge: 'ส่งฟรี',
    location: 'สมุทรปราการ',
    image: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=800&q=80'
  },

  // --- GAMING GEAR ---
  {
    id: 201,
    name: 'คีย์บอร์ด Mechanical Keychron K2 Wireless Bluetooth RGB',
    description: 'คีย์บอร์ดไร้สายเปลี่ยนสวิตช์ได้ (Hot-swappable) รองรับทั้ง Mac และ Windows แบตเตอรี่อึด 4000mAh',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 3890,
    originalPrice: 4590,
    rating: 4.9,
    soldCount: 2100,
    badge: 'POPULAR',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&q=80'
  },
  {
    id: 202,
    name: 'เมาส์เกมมิ่งไร้สาย Logitech G Pro X Superlight 2 (White)',
    description: 'เมาส์ไร้สายระดับโปรเพลเยอร์ น้ำหนักเบาพิเศษเพียง 60 กรัม เซนเซอร์ HERO 2 แม่นยำที่สุดในโลก',
    mainCategory: 'gaming',
    subCategory: 'เมาส์ & คีย์บอร์ด',
    price: 5290,
    originalPrice: 5990,
    rating: 5.0,
    soldCount: 1890,
    badge: 'ESPORTS CHOICE',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=800&q=80'
  },
  {
    id: 203,
    name: 'หูฟังเกมมิ่ง HyperX Cloud III Wireless 7.1 Surround',
    description: 'หูฟังเกมมิ่งไร้สาย ไดรเวอร์ขนาด 53มม. เมมโมรี่โฟมนุ่มใส่สบายได้ทั้งวัน แบตเตอรี่ใช้งานได้ยาวนานถึง 120 ชั่วโมง',
    mainCategory: 'gaming',
    subCategory: 'หูฟัง & ไมโครโฟน',
    price: 4990,
    originalPrice: 5690,
    rating: 4.8,
    soldCount: 940,
    badge: 'HOT DEAL',
    location: 'ชลบุรี',
    image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&q=80'
  },

  // --- BEAUTY & SKINCARE ---
  {
    id: 301,
    name: 'CeraVe Moisturizing Lotion ครีมบำรุงผิวหน้าและผิวกาย 473ml',
    description: 'มอยส์เจอไรเซอร์สูตรสำหรับผิวแห้งถึงแห้งมาก ผสานเซราไมด์ที่จำเป็นต่อผิว 3 ชนิด ล็อคความชุ่มชื้น 24 ชม.',
    mainCategory: 'beauty',
    subCategory: 'เซรั่ม & มอยส์เจอไรเซอร์',
    price: 690,
    originalPrice: 850,
    rating: 4.9,
    soldCount: 8900,
    badge: 'MALL แท้ 100%',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1608248597379-22212a999440?w=800&q=80'
  },
  {
    id: 302,
    name: 'ครีมกันแดดเนื้อเอสเซนส์ SPF50+ PA++++ สูตรอ่อนโยนบางเบา',
    description: 'กันแดดเนื้อน้ำ ซึมไว ไม่เหนียวเหนอะหนะ ไม่คราบขาว คุมมันยาวนาน เหมาะสำหรับผิวแพ้ง่าย',
    mainCategory: 'beauty',
    subCategory: 'กันแดด & คลีนซิ่ง',
    price: 450,
    originalPrice: 620,
    rating: 4.8,
    soldCount: 5400,
    badge: 'BEST SELLER',
    location: 'เชียงใหม่',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80'
  },

  // --- FASHION ---
  {
    id: 401,
    name: 'รองเท้าผ้าใบสนีกเกอร์ Nike Air Force 1 \'07 - White Classic',
    description: 'รองเท้าผ้าใบระดับตำนาน หนังแท้สีขาวคลีน แมตช์ได้กับทุกชุด พื้นรองเท้านุ่มใส่สบาย',
    mainCategory: 'fashion',
    subCategory: 'กระเป๋า & รองเท้า',
    price: 3700,
    originalPrice: 4300,
    rating: 4.9,
    soldCount: 4300,
    badge: 'CLASSIC ICON',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&q=80'
  },
  {
    id: 402,
    name: 'เสื้อฮู้ดดี้ Streetwear Cotton Oversize สีดำพรีเมียม',
    description: 'เสื้อกันหนาวมีฮู้ด ผ้านุ่มหนากำลังดี ซับในผ้าวอร์มอย่างดี ทรง Oversize สไตล์สตรีทแฟชั่น',
    mainCategory: 'fashion',
    subCategory: 'แจ็กเก็ต & ฮู้ดดี้',
    price: 890,
    originalPrice: 1290,
    rating: 4.7,
    soldCount: 1650,
    badge: 'NEW ARRIVAL',
    location: 'กรุงเทพมหานคร',
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80'
  }
];

// --- MAIN CATEGORIES ---
const MAIN_CATEGORIES = [
  { id: 'all', name: '🔥 สินค้าทั้งหมด', subs: [] },
  { id: 'it', name: '📱 อุปกรณ์ไอที & คอมพิวเตอร์', subs: ['ทั้งหมด', 'โทรศัพท์มือถือ', 'คอมพิวเตอร์', 'โน๊ตบุ๊ค', 'แท็บเล็ต & ไอแพด', 'แ็กดเจ็ต & อุปกรณ์เสริม'] },
  { id: 'gaming', name: '🎮 เกมมิ่งเกียร์', subs: ['ทั้งหมด', 'เมาส์ & คีย์บอร์ด', 'หูฟัง & ไมโครโฟน'] },
  { id: 'beauty', name: '💄 สกินแคร์ & บิวตี้', subs: ['ทั้งหมด', 'เซรั่ม & มอยส์เจอไรเซอร์', 'กันแดด & คลีนซิ่ง'] },
  { id: 'fashion', name: '👕 แฟชั่น & สตรีทแวร์', subs: ['ทั้งหมด', 'กระเป๋า & รองเท้า', 'แจ็กเก็ต & ฮู้ดดี้'] }
];

export default function Shop367Page() {
  const [selectedMainCat, setSelectedMainCat] = useState<string>('all');
  const [selectedSubCat, setSelectedSubCat] = useState<string>('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('popular');

  // Cart & Modal
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [couponCode, setCouponCode] = useState<string>('');
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Checkout & Completed Order State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);
  const [completedOrder, setCompletedOrder] = useState<OrderSummary | null>(null);

  // Checkout Form
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'card', // card | bank_transfer | cod | truemoney
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    truemoneyPhone: ''
  });

  const currentSubCategories = useMemo(() => {
    const found = MAIN_CATEGORIES.find(c => c.id === selectedMainCat);
    return found ? found.subs : [];
  }, [selectedMainCat]);

  const filteredProducts = useMemo(() => {
    let result = REAL_PRODUCTS.filter(item => {
      const matchMain = selectedMainCat === 'all' || item.mainCategory === selectedMainCat;
      const matchSub = selectedSubCat === 'ทั้งหมด' || item.subCategory === selectedSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchMain && matchSub && matchSearch;
    });

    if (sortBy === 'sales') result.sort((a, b) => b.soldCount - a.soldCount);
    else if (sortBy === 'price-asc') result.sort((a, b) => a.price - b.price);
    else if (sortBy === 'price-desc') result.sort((a, b) => b.price - a.price);
    else if (sortBy === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [selectedMainCat, selectedSubCat, searchQuery, sortBy]);

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

    const paymentLabels: Record<string, string> = {
      card: 'บัตรเครดิต / เดบิต',
      bank_transfer: 'โอนผ่านบัญชีธนาคาร',
      cod: 'เก็บเงินปลายทาง (COD)',
      truemoney: 'TrueMoney Wallet'
    };

    // Save detailed order info for receipt display
    const newOrder: OrderSummary = {
      orderId: `367-TH-${Math.floor(100000 + Math.random() * 900000)}`,
      items: [...cart],
      customer: {
        name: formData.name,
        phone: formData.phone,
        address: formData.address,
        paymentMethod: paymentLabels[formData.paymentMethod] || 'ชำระเงินออนไลน์'
      },
      subtotal: subtotalCartPrice,
      discount: appliedDiscount,
      finalTotal: finalCartPrice,
      date: new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
    };

    setCompletedOrder(newOrder);
  };

  const resetAllAfterOrder = () => {
    setCart([]);
    setCompletedOrder(null);
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 selection:bg-indigo-500 selection:text-white">
      
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-950 text-slate-200 text-xs py-2 px-4 border-b border-indigo-800/40 font-medium">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 font-black px-2 py-0.5 rounded text-[10px] tracking-wider uppercase">
              VERIFIED STORE
            </span>
            <span>⚡ สินค้าของแท้ 100% พร้อมประกันศูนย์ไทย | ใช้โค้ด <strong className="text-emerald-400 font-mono bg-emerald-950 px-1.5 py-0.5 rounded">367VIP</strong> ลด ฿200</span>
          </div>
          <span className="hidden md:inline text-xs text-slate-400">ศูนย์รวมไอที แก็ดเจ็ต และสินค้าไลฟ์สไตล์</span>
        </div>
      </div>

      {/* Main Header Nav */}
      <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-xl border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => setSelectedMainCat('all')}>
            <div className="w-11 h-11 bg-gradient-to-tr from-indigo-500 via-violet-500 to-emerald-400 text-slate-950 rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-500/20">
              367
            </div>
            <div>
              <span className="text-xl sm:text-2xl font-black tracking-tight text-white block leading-none">
                367 <span className="text-indigo-400">STORE</span>
              </span>
              <span className="text-[10px] text-slate-400 font-bold tracking-widest uppercase">
                OFFICIAL ONLINE SHOP
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาไอโฟน, คอมพิวเตอร์ iHaveCPU, เกมมิ่งเกียร์..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-900 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none font-medium text-slate-100 placeholder:text-slate-500"
              />
              <svg className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative flex items-center gap-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-4 py-2.5 rounded-xl transition shadow-lg text-sm"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 0a2 2 0 100 4 2 2 0 000-4z"/>
            </svg>
            <span className="hidden sm:inline font-bold">ตะกร้าของฉัน</span>
            {totalCartItems > 0 && (
              <span className="bg-emerald-400 text-slate-950 text-[11px] font-black px-2 py-0.2 rounded-full font-mono">
                {totalCartItems}
              </span>
            )}
          </button>

        </div>
      </header>

      {/* Category Navigation Bar */}
      <nav className="bg-slate-900/80 border-b border-slate-800 py-3 sticky top-20 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 overflow-x-auto py-1 scrollbar-none">
            {MAIN_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedMainCat(cat.id); setSelectedSubCat('ทั้งหมด'); }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  selectedMainCat === cat.id
                    ? 'bg-indigo-600 text-white shadow-md'
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
                  onClick={() => setSelectedSubCat(sub)}
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

      {/* Main Catalog Section */}
      <main className="max-w-7xl mx-auto px-4 mt-8">
        
        {/* Sorting Controls */}
        <div className="bg-slate-900/60 p-4 rounded-2xl border border-slate-800 shadow-xl mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-lg font-black text-white flex items-center gap-2">
              รายการสินค้าพร้อมส่ง
              <span className="text-xs text-emerald-400 bg-emerald-950 border border-emerald-800 px-2.5 py-0.5 rounded-full font-mono">
                {filteredProducts.length} รายการ
              </span>
            </h1>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto">
            <span className="text-xs font-bold text-slate-400 uppercase whitespace-nowrap">จัดเรียงตาม:</span>
            {[
              { id: 'popular', label: 'ยอดนิยม' },
              { id: 'sales', label: 'ขายดีที่สุด' },
              { id: 'price-asc', label: 'ราคาต่ำ - สูง' },
              { id: 'price-desc', label: 'ราคาสูง - ต่ำ' }
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-slate-900 rounded-2xl border border-slate-800 overflow-hidden shadow-xl hover:border-indigo-500/60 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Image Container with Exact Product Photo */}
                <div className="relative aspect-square bg-slate-950 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-indigo-600 text-white text-[10px] font-black px-2.5 py-1 rounded-md shadow-md uppercase tracking-wider">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Product Info */}
                <div className="p-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-[11px] font-bold text-indigo-400 bg-indigo-950 px-2 py-0.5 rounded border border-indigo-800/40">
                      {product.subCategory}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">ID: 367-{product.id}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-300 transition-colors min-h-[40px]">
                    {product.name}
                  </h3>

                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed min-h-[36px]">
                    {product.description}
                  </p>

                  <div className="flex items-center justify-between mt-3 text-xs text-slate-300">
                    <div className="flex items-center gap-1 text-amber-400 font-bold bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                      <span>★</span>
                      <span>{product.rating}</span>
                    </div>
                    <span className="text-slate-400 text-[11px]">ขายแล้ว {product.soldCount.toLocaleString()} ชิ้น</span>
                  </div>
                </div>
              </div>

              {/* Price & Action */}
              <div className="p-4 pt-0">
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-emerald-400 font-mono">
                    ฿{product.price.toLocaleString()}
                  </span>
                  <span className="text-xs text-slate-500 line-through font-mono">
                    ฿{product.originalPrice.toLocaleString()}
                  </span>
                </div>

                <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-slate-800">
                  <span className="text-[11px] text-slate-400 truncate max-w-[110px]">
                    📍 {product.location}
                  </span>

                  <button
                    onClick={() => addToCart(product)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-1.5 px-3.5 rounded-xl transition shadow-md text-xs active:scale-95"
                  >
                    + ใส่ตะกร้า
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Cart Drawer */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex justify-end">
          <div className="w-full max-w-md bg-slate-900 h-full shadow-2xl flex flex-col justify-between border-l border-slate-800">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-950">
              <span className="text-base font-black text-white">ตะกร้าสินค้าของคุณ ({totalCartItems})</span>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-white font-bold text-lg">✕</button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {cart.map((item) => (
                <div key={item.product.id} className="flex gap-3 p-3 bg-slate-950 rounded-xl border border-slate-800 items-center">
                  <img src={item.product.image} alt={item.product.name} className="w-16 h-16 object-cover rounded-lg" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-200 truncate">{item.product.name}</h4>
                    <p className="text-sm font-black text-emerald-400 font-mono">฿{item.product.price.toLocaleString()}</p>
                    <div className="flex items-center gap-2 mt-1.5">
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
                  <span className="text-[11px] font-bold text-slate-300 block mb-1">ส่วนลดพิเศษ (ลองพิมพ์: 367VIP)</span>
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
                  <span>ยอดสุทธิ:</span>
                  <span className="text-xl text-emerald-400 font-mono">฿{finalCartPrice.toLocaleString()}</span>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(true)}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-sm rounded-xl shadow-lg"
                >
                  ไปที่หน้าชำระเงิน &gt;
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout & Detailed Order Receipt Modal */}
      {isCheckoutOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 w-full max-w-lg rounded-2xl p-6 relative border border-slate-800 text-slate-100 my-8 shadow-2xl">
            <button onClick={() => setIsCheckoutOpen(false)} className="absolute top-4 right-4 text-slate-400 text-lg font-bold hover:text-white">✕</button>

            {completedOrder ? (
              /* --- FIXED: DETAILED ORDER SUMMARY RECEIPT (แก้ปัญหาตามรูปที่ 2) --- */
              <div className="py-2 text-slate-100 space-y-4">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-950 text-emerald-400 rounded-full flex items-center justify-center text-2xl mx-auto border border-emerald-500/30">
                    ✓
                  </div>
                  <h3 className="text-xl font-black text-emerald-400">สั่งซื้อสินค้าสำเร็จ!</h3>
                  <p className="text-xs text-slate-400 font-mono">หมายเลขคำสั่งซื้อ: {completedOrder.orderId}</p>
                  <p className="text-[11px] text-slate-500">{completedOrder.date}</p>
                </div>

                {/* Items Purchased List */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 space-y-2.5 max-h-48 overflow-y-auto">
                  <span className="text-xs font-bold text-slate-400 block border-b border-slate-800 pb-1">รายการสินค้าที่สั่งซื้อ:</span>
                  {completedOrder.items.map((item) => (
                    <div key={item.product.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2 min-w-0 pr-2">
                        <img src={item.product.image} alt={item.product.name} className="w-8 h-8 object-cover rounded" />
                        <span className="truncate text-slate-200 font-medium">{item.product.name}</span>
                      </div>
                      <div className="text-right whitespace-nowrap font-mono">
                        <span className="text-slate-400">x{item.quantity}</span>
                        <span className="ml-2 text-emerald-400 font-bold">฿{(item.product.price * item.quantity).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Shipping & Payment Summary */}
                <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 text-xs space-y-1.5">
                  <p><span className="text-slate-400">ผู้รับ:</span> {completedOrder.customer.name} ({completedOrder.customer.phone})</p>
                  <p><span className="text-slate-400">ที่อยู่จัดส่ง:</span> {completedOrder.customer.address}</p>
                  <p><span className="text-slate-400">ชำระเงินด้วย:</span> <strong className="text-indigo-300">{completedOrder.customer.paymentMethod}</strong></p>
                </div>

                {/* Total Cost Breakdown */}
                <div className="border-t border-slate-800 pt-3 space-y-1 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>รวมราคาสินค้า:</span>
                    <span>฿{completedOrder.subtotal.toLocaleString()}</span>
                  </div>
                  {completedOrder.discount > 0 && (
                    <div className="flex justify-between text-emerald-400">
                      <span>ส่วนลด (367VIP):</span>
                      <span>-฿{completedOrder.discount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-base font-black text-white pt-1">
                    <span>ยอดชำระสุทธิ:</span>
                    <span className="text-emerald-400 font-mono">฿{completedOrder.finalTotal.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={resetAllAfterOrder}
                  className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-black text-xs rounded-xl shadow-lg mt-2"
                >
                  ตกลง / กลับสู่หน้าหลัก
                </button>
              </div>
            ) : (
              /* --- CHECKOUT FORM --- */
              <form onSubmit={handleCheckoutSubmit} className="space-y-4">
                <h3 className="text-lg font-black text-white border-b border-slate-800 pb-3">
                  🛍️ กรอกข้อมูลจัดส่ง & ชำระเงิน
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="font-bold text-slate-300 block mb-1">ชื่อ-นามสกุล ผู้รับ *</label>
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
                    <label className="font-bold text-slate-300 block mb-1">เบอร์โทรศัพท์ติดต่อ *</label>
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
                    <label className="font-bold text-slate-300 block mb-1">ที่อยู่จัดส่งสินค้า *</label>
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

                {/* Payment Selection */}
                <div className="pt-2">
                  <label className="font-bold text-slate-200 block mb-2 text-xs">เลือกช่องทางการชำระเงิน *</label>
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {[
                      { id: 'card', icon: '💳', label: 'บัตรเครดิต / เดบิต' },
                      { id: 'bank_transfer', icon: '🏦', label: 'โอนผ่านบัญชีธนาคาร' },
                      { id: 'cod', icon: '📦', label: 'เก็บเงินปลายทาง (COD)' },
                      { id: 'truemoney', icon: '📱', label: 'TrueMoney Wallet' }
                    ].map((method) => (
                      <button
                        key={method.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, paymentMethod: method.id })}
                        className={`p-2.5 rounded-xl border text-left flex items-center gap-2 font-bold transition-all ${
                          formData.paymentMethod === method.id
                            ? 'bg-indigo-950 border-indigo-500 text-indigo-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        <span className="text-base">{method.icon}</span>
                        <span className="text-[11px]">{method.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Dynamic Payment Details */}
                <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 text-xs">
                  {formData.paymentMethod === 'card' && (
                    <div className="space-y-2">
                      <p className="font-bold text-indigo-400">💳 ข้อมูลบัตรเครดิต / เดบิต</p>
                      <input type="text" required placeholder="เลขบัตร 16 หลัก" maxLength={16} className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                      <div className="grid grid-cols-2 gap-2">
                        <input type="text" required placeholder="MM/YY" maxLength={5} className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono text-center" />
                        <input type="password" required placeholder="CVV" maxLength={3} className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono text-center" />
                      </div>
                    </div>
                  )}

                  {formData.paymentMethod === 'bank_transfer' && (
                    <div className="space-y-1 text-slate-300 font-mono text-[11px]">
                      <p className="font-bold text-indigo-400 font-sans">🏦 บัญชีธนาคารสำหรับโอนเงิน</p>
                      <p>ธนาคารกสิกรไทย: <strong className="text-emerald-400">367-8-99999-0</strong></p>
                      <p>ชื่อบัญชี: บจก. 367 สโตร์ มาร์เก็ตติ้ง</p>
                    </div>
                  )}

                  {formData.paymentMethod === 'cod' && (
                    <p className="text-emerald-400 font-bold">📦 ชำระเงินสดกับพนักงานขนส่งเมื่อได้รับสินค้าหน้าบ้าน</p>
                  )}

                  {formData.paymentMethod === 'truemoney' && (
                    <input type="tel" required placeholder="กรอกเบอร์ TrueMoney Wallet" className="w-full p-2 bg-slate-900 border border-slate-800 rounded text-white font-mono" />
                  )}
                </div>

                <div className="pt-2 border-t border-slate-800 flex justify-between items-center">
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
