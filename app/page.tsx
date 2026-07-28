'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Filter, ChevronRight, Star, Heart, 
  Menu, X, Check, SlidersHorizontal, Sparkles, ShieldCheck, RefreshCw 
} from 'lucide-react';

// ==========================================
// 1. ข้อมูลหมวดหมู่สินค้าแบบละเอียด (Category Data)
// ==========================================
const CATEGORIES = [
  {
    id: 'cleansing',
    name: 'คลีนซิ่ง & ทำความสะอาดผิวหน้า',
    totalCount: 142,
    subcategories: [
      { id: 'oil-balm', name: 'คลีนซิ่งออยล์ & บาล์ม', count: 45 },
      { id: 'micellar', name: 'คลีนซิ่งวอเตอร์ & ไมเซล่า', count: 38 },
      { id: 'foam-gel', name: 'โฟม & เจลล้างหน้า', count: 42 },
      { id: 'milk-cream', name: 'คลีนซิ่งครีม & นม', count: 17 },
    ]
  },
  {
    id: 'toner',
    name: 'เตรียมผิว & น้ำตบ & โทนเนอร์',
    totalCount: 98,
    subcategories: [
      { id: 'exfoliating', name: 'โทนเนอร์เช็ดทำความสะอาด & ผลัดเซลล์ผิว', count: 32 },
      { id: 'essence', name: 'น้ำตบ & เอสเซนส์บำรุงล้ำลึก', count: 35 },
      { id: 'mist', name: 'สเปรย์ฉีดผิวหน้า & มิสต์', count: 16 },
      { id: 'toner-pad', name: 'โทนเนอร์แพด (Toner Pads)', count: 15 },
    ]
  },
  {
    id: 'bodycare',
    name: 'ดูแลและทำความสะอาดผิวกาย',
    totalCount: 115,
    subcategories: [
      { id: 'body-wash', name: 'สบู่ก้อน & สบู่อาบน้ำเนื้อเจล', count: 48 },
      { id: 'body-lotion', name: 'โลชั่น & ครีมบำรุงผิวกาย', count: 38 },
      { id: 'body-scrub', name: 'สครับขัดผิวกาย', count: 15 },
      { id: 'hand-foot', name: 'ผลิตภัณฑ์ดูแลมือ & เท้า', count: 14 },
    ]
  },
  {
    id: 'serum-moist',
    name: 'เซรั่ม & มอยส์เจอไรเซอร์',
    totalCount: 160,
    subcategories: [
      { id: 'vit-c', name: 'เซรั่มวิตามินซี & ผิวกระจ่างใส', count: 42 },
      { id: 'hyaluron', name: 'เซรั่มไฮยาลูรอนเติมน้ำ', count: 39 },
      { id: 'retinol', name: 'เรตินอล & สกินแคร์ลดริ้วรอย', count: 30 },
      { id: 'moist-cream', name: 'มอยส์เจอไรเซอร์เนื้อเข้มข้น', count: 49 },
    ]
  },
  {
    id: 'sunscreen',
    name: 'ครีมกันแดด & ปกป้องผิว',
    totalCount: 74,
    subcategories: [
      { id: 'sun-fluid', name: 'กันแดดเนื้อเอสเซนส์ / ครีม', count: 35 },
      { id: 'sun-stick', name: 'กันแดดแบบสติ๊ก (Sun Stick)', count: 18 },
      { id: 'tone-up', name: 'กันแดดปรับสีผิว (Tone-Up)', count: 21 },
    ]
  }
];

// ==========================================
// 2. ข้อมูลสินค้าจำลอง (Mock Product Data)
// ==========================================
const PRODUCTS = [
  {
    id: 1,
    name: 'Gentle Deep Cleansing Oil',
    category: 'คลีนซิ่งออยล์ & บาล์ม',
    mainCat: 'cleansing',
    price: 890,
    rating: 4.9,
    reviews: 128,
    badge: 'Best Seller',
    skinType: 'ผิวแพ้ง่าย',
    image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Calming Hydrating Toner Pad (70 Sheets)',
    category: 'โทนเนอร์แพด (Toner Pads)',
    mainCat: 'toner',
    price: 650,
    rating: 4.8,
    reviews: 94,
    badge: 'New',
    skinType: 'ผิวมัน/เป็นสิวง่าย',
    image: 'https://images.unsplash.com/photo-1608248597263-0007999659b0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Botanical Shower Gel (Aroma Spa)',
    category: 'สบู่ก้อน & สบู่อาบน้ำเนื้อเจล',
    mainCat: 'bodycare',
    price: 420,
    rating: 4.7,
    reviews: 56,
    badge: 'Organic',
    skinType: 'ทุกสภาพผิว',
    image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Micro-Bubbling pH Balance Cleansing Foam',
    category: 'โฟม & เจลล้างหน้า',
    mainCat: 'cleansing',
    price: 550,
    rating: 4.9,
    reviews: 210,
    badge: 'Popular',
    skinType: 'ผิวมัน/เป็นสิวง่าย',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'First Care Treatment Essence',
    category: 'น้ำตบ & เอสเซนส์บำรุงล้ำลึก',
    mainCat: 'toner',
    price: 1250,
    rating: 5.0,
    reviews: 340,
    badge: 'Award Winner',
    skinType: 'ผิวแห้งขาดน้ำ',
    image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Nourishing Body Lotion With Shea Butter',
    category: 'โลชั่น & ครีมบำรุงผิวกาย',
    mainCat: 'bodycare',
    price: 680,
    rating: 4.6,
    reviews: 82,
    badge: 'Top Rated',
    skinType: 'ผิวแห้งขาดน้ำ',
    image: 'https://images.unsplash.com/photo-1526947425960-945c6e72858f?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 7,
    name: 'Pure Vitamin C Glow Serum 30ml',
    category: 'เซรั่มวิตามินซี & ผิวกระจ่างใส',
    mainCat: 'serum-moist',
    price: 990,
    rating: 4.8,
    reviews: 175,
    badge: 'Hot Item',
    skinType: 'ทุกสภาพผิว',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8,
    name: 'Invisible Watery Sunscreen SPF50+ PA++++',
    category: 'กันแดดเนื้อเอสเซนส์ / ครีม',
    mainCat: 'sunscreen',
    price: 750,
    rating: 4.9,
    reviews: 290,
    badge: 'Must Have',
    skinType: 'ผิวแพ้ง่าย',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop'
  }
];

// ==========================================
// 3. คอมโพเนนต์หลัก (Main Component)
// ==========================================
export default function EcommerceStore() {
  const [selectedSubCat, setSelectedSubCat] = useState('all');
  const [selectedSkinType, setSelectedSkinType] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [notification, setNotification] = useState('');

  // ฟังก์ชันแสดงข้อความแจ้งเตือนเมื่อเพิ่มสินค้า
  const showToast = (msg) => {
    setNotification(msg);
    setTimeout(() => setNotification(''), 2500);
  };

  // เพิ่มลงตะกร้า
  const addToCart = (product) => {
    setCart((prev) => [...prev, product]);
    showToast(`เพิ่ม "${product.name}" ลงในตะกร้าเรียบร้อย!`);
  };

  // สลับการถูกใจสินค้า
  const toggleFavorite = (productId) => {
    setFavorites((prev) => 
      prev.includes(productId) ? prev.filter(id => id !== productId) : [...prev, productId]
    );
  };

  // กรองสินค้าตามเงื่อนไขที่เลือก
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((product) => {
      const matchesSubCat = selectedSubCat === 'all' || product.category === selectedSubCat;
      const matchesSkin = selectedSkinType === 'all' || product.skinType === selectedSkinType;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            product.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesSubCat && matchesSkin && matchesSearch;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviews - a.reviews; // Popularity default
    });
  }, [selectedSubCat, selectedSkinType, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-[#FAF9F6] text-stone-800 font-sans antialiased selection:bg-amber-100">
      
      {/* Notification Toast */}
      {notification && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 text-white text-xs px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border border-stone-700 animate-bounce">
          <Check size={16} className="text-emerald-400" />
          <span>{notification}</span>
        </div>
      )}

      {/* Top Announcement Bar */}
      <div className="bg-stone-900 text-stone-300 text-[11px] py-2 text-center tracking-wider uppercase font-light">
        ✨ สั่งซื้อครบ 1,200 บาท ส่งฟรีทั่วประเทศ | รับฟรีของแถมทดลองทุกคำสั่งซื้อ
      </div>

      {/* Header & Navigation */}
      <header className="sticky top-0 z-40 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-6">
            <button 
              className="lg:hidden p-2 text-stone-700 hover:text-black"
              onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            >
              <Menu size={22} />
            </button>
            <a href="#" className="text-2xl font-serif font-bold tracking-widest text-stone-900 flex items-center gap-1">
              LUXE<span className="font-light text-amber-800">SKIN</span>
            </a>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-8 text-xs uppercase tracking-widest font-medium text-stone-600">
            <a href="#" className="hover:text-amber-800 transition">หน้าแรก</a>
            <a href="#" className="text-amber-900 font-bold border-b border-amber-900 pb-0.5">สินค้าทั้งหมด</a>
            <a href="#" className="hover:text-amber-800 transition">จัดเซ็ตสุดคุ้ม</a>
            <a href="#" className="hover:text-amber-800 transition">เกี่ยวกับแบรนด์</a>
          </nav>

          {/* Right Section: Search & Cart */}
          <div className="flex items-center gap-4">
            <div className="relative hidden sm:block">
              <input 
                type="text" 
                placeholder="ค้นหาสกินแคร์, คลีนซิ่ง..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-52 lg:w-64 pl-9 pr-4 py-2 text-xs bg-stone-100 border border-stone-200 rounded-full focus:outline-none focus:border-stone-400 focus:bg-white transition"
              />
              <Search className="absolute left-3 top-2.5 text-stone-400" size={14} />
            </div>

            {/* Cart Icon */}
            <button className="relative p-2.5 text-stone-800 hover:text-black transition bg-white rounded-full border border-stone-200 shadow-sm">
              <ShoppingBag size={18} />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-800 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cart.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Breadcrumb & Section Title */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-xs text-stone-400 mb-2">
            <span>หน้าแรก</span>
            <ChevronRight size={12} />
            <span className="text-stone-800 font-medium">หมวดหมู่ผลิตภัณฑ์</span>
          </div>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-serif font-medium text-stone-900">
                Skin & Body Care Collection
              </h1>
              <p className="text-xs text-stone-500 mt-1">
                คัดสรรผลิตภัณฑ์บำรุงผิวส่วนผสมบริสุทธิ์ เพื่อผิวสุขภาพดี ดูเป็นธรรมชาติ
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2 text-xs text-stone-600 bg-white px-4 py-2 rounded-xl border border-stone-200 shadow-sm">
              <SlidersHorizontal size={14} />
              <span>เรียงตาม:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent font-medium focus:outline-none cursor-pointer"
              >
                <option value="popular">ความนิยมสูงสุด</option>
                <option value="rating">คะแนนรีวิวสูงสุด</option>
                <option value="price-low">ราคา: ต่ำ -> สูง</option>
                <option value="price-high">ราคา: สูง -> ต่ำ</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content Layout: Sidebar + Product Grid */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">
          
          {/* Sidebar / Filters (Desktop & Mobile Drawer) */}
          <aside className={`
            fixed lg:relative inset-0 z-50 lg:z-auto bg-stone-900/50 lg:bg-transparent
            ${mobileFilterOpen ? 'block' : 'hidden lg:block'} lg:w-72 w-full flex-shrink-0
          `}>
            <div className="bg-white lg:bg-transparent h-full lg:h-auto w-80 lg:w-full p-6 lg:p-0 overflow-y-auto space-y-8">
              
              {/* Mobile Close Header */}
              <div className="flex lg:hidden justify-between items-center pb-4 border-b border-stone-200">
                <h3 className="font-serif font-bold text-lg">ตัวกรองสินค้า</h3>
                <button onClick={() => setMobileFilterOpen(false)}><X size={20} /></button>
              </div>

              {/* All Categories Filter */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900 flex items-center gap-2">
                    <Filter size={14} className="text-amber-800" /> หมวดหมู่ทั้งหมด
                  </h3>
                  {selectedSubCat !== 'all' && (
                    <button 
                      onClick={() => setSelectedSubCat('all')} 
                      className="text-[10px] text-amber-800 hover:underline"
                    >
                      ล้างค่า
                    </button>
                  )}
                </div>

                <div className="space-y-6 text-xs">
                  {CATEGORIES.map((cat) => (
                    <div key={cat.id} className="space-y-2">
                      <div className="font-semibold text-stone-900 pb-1 border-b border-stone-100 flex justify-between">
                        <span>{cat.name}</span>
                        <span className="text-stone-400 font-normal">({cat.totalCount})</span>
                      </div>
                      
                      <ul className="pl-2 space-y-1 text-stone-600">
                        {cat.subcategories.map((sub) => (
                          <li key={sub.id}>
                            <button
                              onClick={() => {
                                setSelectedSubCat(sub.name);
                                setMobileFilterOpen(false);
                              }}
                              className={`w-full text-left py-1 flex justify-between items-center hover:text-amber-800 transition ${
                                selectedSubCat === sub.name ? 'text-amber-900 font-bold' : ''
                              }`}
                            >
                              <span>{sub.name}</span>
                              <span className="text-stone-400 text-[10px]">({sub.count})</span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skin Type Filter */}
              <div className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-sm space-y-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-stone-900">
                  กรองตามสภาพผิว
                </h3>
                <div className="space-y-2 text-xs text-stone-600">
                  {['ทุกสภาพผิว', 'ผิวแพ้ง่าย', 'ผิวมัน/เป็นสิวง่าย', 'ผิวแห้งขาดน้ำ'].map((type) => (
                    <label key={type} className="flex items-center gap-2 cursor-pointer hover:text-stone-900">
                      <input 
                        type="radio" 
                        name="skinType"
                        checked={selectedSkinType === type}
                        onChange={() => setSelectedSkinType(type)}
                        className="text-amber-800 focus:ring-amber-800" 
                      />
                      <span>{type}</span>
                    </label>
                  ))}
                  {selectedSkinType !== 'all' && (
                    <button 
                      onClick={() => setSelectedSkinType('all')}
                      className="text-[11px] text-amber-800 pt-2 block hover:underline"
                    >
                      แสดงสภาพผิวทั้งหมด
                    </button>
                  )}
                </div>
              </div>

            </div>
          </aside>

          {/* Product Grid Area */}
          <div className="flex-1 w-full">
            
            {/* Active Filter Badges */}
            {(selectedSubCat !== 'all' || selectedSkinType !== 'all' || searchQuery) && (
              <div className="mb-6 flex flex-wrap items-center gap-2">
                <span className="text-xs text-stone-400">ตัวกรองที่เลือก:</span>
                {selectedSubCat !== 'all' && (
                  <span className="bg-amber-50 text-amber-900 text-xs px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    {selectedSubCat}
                    <X size={12} className="cursor-pointer" onClick={() => setSelectedSubCat('all')} />
                  </span>
                )}
                {selectedSkinType !== 'all' && (
                  <span className="bg-amber-50 text-amber-900 text-xs px-3 py-1 rounded-full border border-amber-200 flex items-center gap-1">
                    {selectedSkinType}
                    <X size={12} className="cursor-pointer" onClick={() => setSelectedSkinType('all')} />
                  </span>
                )}
                {searchQuery && (
                  <span className="bg-stone-100 text-stone-800 text-xs px-3 py-1 rounded-full border border-stone-300 flex items-center gap-1">
                    "{searchQuery}"
                    <X size={12} className="cursor-pointer" onClick={() => setSearchQuery('')} />
                  </span>
                )}
              </div>
            )}

            {/* Product Items Count */}
            {filteredProducts.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
                <p className="text-stone-500 text-sm mb-4">ไม่พบสินค้าที่ตรงกับเงื่อนไขที่คุณค้นหา</p>
                <button 
                  onClick={() => { setSelectedSubCat('all'); setSelectedSkinType('all'); setSearchQuery(''); }}
                  className="bg-stone-900 text-white text-xs px-6 py-2.5 rounded-xl hover:bg-stone-800 transition"
                >
                  ล้างตัวกรองทั้งหมด
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProducts.map((product) => (
                  <div 
                    key={product.id}
                    className="group bg-white rounded-2xl border border-stone-200/70 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                  >
                    {/* Image Box */}
                    <div className="relative aspect-square bg-stone-100 overflow-hidden">
                      <img 
                        src={product.image} 
                        alt={product.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                      />
                      
                      {/* Badge */}
                      <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-stone-900 text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full border border-stone-200/60 shadow-sm">
                        {product.badge}
                      </span>

                      {/* Favorite Button */}
                      <button 
                        onClick={() => toggleFavorite(product.id)}
                        className="absolute top-3 right-3 p-2 bg-white/80 backdrop-blur-sm rounded-full text-stone-600 hover:text-red-500 transition shadow-sm"
                      >
                        <Heart 
                          size={15} 
                          className={favorites.includes(product.id) ? "fill-red-500 text-red-500" : ""} 
                        />
                      </button>
                    </div>

                    {/* Info Box */}
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between text-[11px] text-stone-400 mb-1">
                          <span>{product.category}</span>
                          <span className="text-amber-800 font-medium">{product.skinType}</span>
                        </div>
                        
                        <h3 className="text-sm font-medium text-stone-900 line-clamp-2 leading-snug group-hover:text-amber-900 transition">
                          {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1 mt-2">
                          <Star size={12} className="fill-amber-400 text-amber-400" />
                          <span className="text-xs font-semibold text-stone-800">{product.rating}</span>
                          <span className="text-[10px] text-stone-400">({product.reviews} รีวิว)</span>
                        </div>
                      </div>

                      {/* Price & Action */}
                      <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block uppercase tracking-wider">ราคา</span>
                          <span className="text-base font-semibold text-stone-900">฿{product.price.toLocaleString()}</span>
                        </div>

                        <button 
                          onClick={() => addToCart(product)}
                          className="bg-stone-900 hover:bg-amber-900 text-white text-xs px-4 py-2.5 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                        >
                          <ShoppingBag size={13} />
                          <span>ใส่ตะกร้า</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

          </div>

        </div>

        {/* Feature Highlights */}
        <section className="mt-20 border-t border-stone-200/80 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white rounded-full border border-stone-200 text-amber-800">
              <Sparkles size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">ส่วนผสมออร์แกนิก 100%</h4>
            <p className="text-xs text-stone-500 max-w-xs">ผ่านการทดสอบโดยผู้เชี่ยวชาญด้านผิวหนัง อ่อนโยน ปลอดภัยไร้สารเคมีอันตราย</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white rounded-full border border-stone-200 text-amber-800">
              <ShieldCheck size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">ของแท้การันตีรับประกัน</h4>
            <p className="text-xs text-stone-500 max-w-xs">สินค้าส่งตรงจากแบรนด์ผู้ผลิตอย่างเป็นทางการ เชื่อถือได้ 100%</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="p-3 bg-white rounded-full border border-stone-200 text-amber-800">
              <RefreshCw size={20} />
            </div>
            <h4 className="text-xs font-bold uppercase tracking-wider">เปลี่ยนคืนง่ายภายใน 14 วัน</h4>
            <p className="text-xs text-stone-500 max-w-xs">หากแพ้หรือสินค้ามีปัญหา สามารถแจ้งเปลี่ยนหรือขอคืนเงินได้สะดวกสบาย</p>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="bg-stone-900 text-stone-400 text-xs mt-24 border-t border-stone-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-3">
            <span className="text-white text-lg font-serif font-bold tracking-widest block">LUXESKIN</span>
            <p className="leading-relaxed text-stone-400">
              แบรนด์ผลิตภัณฑ์ดูแลผิวพรีเมียม ตอบโจทย์ทุกความต้องการของผิว ด้วยสารสกัดธรรมชาติและนวัตกรรมชั้นสูง
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-4">หมวดหมู่ยอดนิยม</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition">คลีนซิ่งและทำความสะอาด</a></li>
              <li><a href="#" className="hover:text-white transition">น้ำตบและโทนเนอร์แพด</a></li>
              <li><a href="#" className="hover:text-white transition">เซรั่มบำรุงเข้มข้น</a></li>
              <li><a href="#" className="hover:text-white transition">สบู่อาบน้ำและสครับผิวกาย</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-4">ช่วยเหลือ & บริการ</h4>
            <ul className="space-y-2.5">
              <li><a href="#" className="hover:text-white transition">ตรวจสอบสถานะพัสดุ</a></li>
              <li><a href="#" className="hover:text-white transition">นโยบายการจัดส่งสินค้า</a></li>
              <li><a href="#" className="hover:text-white transition">การรับประกันและคืนสินค้า</a></li>
              <li><a href="#" className="hover:text-white transition">คำถามที่พบบ่อย (FAQ)</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold uppercase tracking-wider mb-4">รับสิทธิพิเศษก่อนใคร</h4>
            <p className="mb-3 text-stone-400">สมัครสมาชิกเพื่อรับข่าวสารและส่วนลด 10% สำหรับออเดอร์แรก</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="กรอกอีเมลของคุณ" 
                className="bg-stone-800 text-white px-3.5 py-2.5 rounded-xl w-full text-xs focus:outline-none focus:ring-1 focus:ring-amber-500" 
              />
              <button className="bg-amber-800 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-amber-700 transition flex-shrink-0">
                สมัคร
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-stone-800 text-center py-6 text-stone-500 text-[11px]">
          © {new Date().getFullYear()} LUXESKIN Official Store. All rights reserved.
        </div>
      </footer>

    </div>
  );
}
