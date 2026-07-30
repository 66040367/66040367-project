'use client';

import React, { useState, useMemo } from 'react';

// --- PRODUCT DATA TYPES ---
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviews: number;
  badge?: string;
  image: string;
}

// Custom product counts per category based on real-world availability
const CATEGORY_CONFIG: Record<string, { name: string; count: number; basePrice: number; imgKeyword: string; prefixes: string[]; items: string[] }> = {
  beauty: {
    name: 'สกินแคร์ & บิวตี้',
    count: 60, // สินค้าเยอะ
    basePrice: 320,
    imgKeyword: 'skincare,cosmetics',
    prefixes: ['Aura', 'Glow', 'Bio', 'Clear', 'Pure', 'Velvet', 'Silk', 'Hydra', 'Nutri', 'Luxe', 'Miracle', 'Radiance'],
    items: [
      'เซรั่มไฮยาลูรอนสูตรเข้มข้น', 'ครีมกันแดด SPF50+ PA++++', 'คลีนซิ่งออยล์ล้างหน้า',
      'มอยส์เจอไรเซอร์ล็อคความชุ่มชื้น', 'โทนเนอร์ปรับสภาพผิว', 'ลิปบาล์มบำรุงล้ำลึก',
      'มาสก์หน้าบำรุงผิวคืนเดียว', 'อายครีมลดรอยหมองคล้ำ', 'โฟมล้างหน้าสูตรอ่อนโยน',
      'สครับขัดผิวสมุนไพร natural', 'สเปรย์น้ำแร่ฉีดหน้า', 'น้ำหอม Eau De Parfum 50ml',
      'ลิปแมตต์เนื้อกำมะหยี่', 'บลัชออนเนื้อครีมติดทน', 'รองพื้นเนื้อบางเบาคุมมัน'
    ]
  },
  sports: {
    name: 'สปอร์ต & เอาต์ดอร์',
    count: 65, // สินค้าเยอะที่สุด
    basePrice: 680,
    imgKeyword: 'sports,fitness,camping',
    prefixes: ['Fit', 'Pro', 'Active', 'Run', 'Outdoor', 'Trek', 'Peak', 'Flex', 'Speed', 'Force', 'Apex', 'Titan'],
    items: [
      'เสื่อโยคะหนา 8mm กันลื่น', 'ดัมเบลปรับน้ำหนักได้ 10 kg', 'ยางยืดออกกำลังกาย Resistance Band',
      'เต็นท์สนามกันน้ำ พับเก็บง่าย 3-4 คน', 'รองเท้าวิ่งน้ำหนักเบารับแรงกระแทก', 'กระเป๋าเป้เดินป่า 40L จุของแน่น',
      'เชือกกระโดดความเร็วสูง ปรับความยาวได้', 'กระติกน้ำกีฬาพร้อมหลอดพกพา', 'ถุงมือฟิตเนสกันมือด้าน',
      'จักรยานพับได้ ล้อ 20 นิ้ว', 'ไฟฉายเดินป่า LED สว่างสู้มืด', 'ถุงนอนกันหนาวขนาดพกพา',
      'นาฬิกาจับเวลาออกกำลังกาย', 'สนับเข่าและข้อศอกซัพพอร์ต', 'ลูกฟุตบอลเย็บมือคุณภาพสูง'
    ]
  },
  gadget: {
    name: 'ไอที & แก็ดเจ็ต',
    count: 55, // สินค้าปานกลางค่อนข้างเยอะ
    basePrice: 1100,
    imgKeyword: 'gadget,technology',
    prefixes: ['Ultra', 'Pro', 'Max', 'Smart', 'Neo', 'Tech', 'Cyber', 'Air', 'Prime', 'Sonic', 'Vibe'],
    items: [
      'หูฟังไร้สาย Noise Cancelling', 'สมาร์ตวอทช์วัดสุขภาพ GPS', 'ลำโพงบลูทูธพกพา พลังเสียงเบส',
      'คีย์บอร์ดไร้สาย Ergonomic', 'เมาส์ไร้สายบลูทูธ Silent', 'แท่นชาร์จไร้สาย Fast Charge',
      'พาวเวอร์แบงก์ 20,000mAh', 'กล้องติดรถยนต์ความละเอียด 4K', 'ขาตั้งโทรศัพท์ปรับระดับได้',
      'หัวชาร์จเร็ว GaN 65W', 'สายชาร์จ Type-C ความเร็วสูง', 'แว่นตากรองแสงคอมพิวเตอร์'
    ]
  },
  fashion: {
    name: 'แฟชั่น & เครื่องแต่งกาย',
    count: 45, // สินค้าปานกลาง
    basePrice: 550,
    imgKeyword: 'fashion,clothing',
    prefixes: ['Urban', 'Street', 'Classic', 'Minimal', 'Vintage', 'Cozy', 'Chic', 'Modern', 'Elite'],
    items: [
      'เสื้อยืดคอตตอน 100% ทรง Oversize', 'กางเกงยีนส์ทรงกระบอกเล็ก', 'เสื้อแจ็กเก็ตกันหนาวผ้าร่ม',
      'เสื้อฮู้ดดี้สไตล์สตรีท', 'กระเป๋าสะพายข้างดีไซน์มินิมอล', 'รองเท้าผ้าใบสีกรอบยอดฮิต',
      'หมวกแก๊ปปักโลโก้สุดชิค', 'กระเป๋าเป้เดินทางจุของเยอะ', 'เข็มขัดหนังแท้แบบหัวเข็ม',
      'กางเกงสแล็คขายาวเข้ารูป', 'เสื้อเชิ้ตแขนยาวผ้าคอตตอน', 'กระเป๋าสตางค์หนังแท้ช่องเยอะ'
    ]
  },
  gaming: {
    name: 'เกมมิ่งเกียร์',
    count: 40, // สินค้าเจาะกลุ่มเฉพาะ
    basePrice: 1750,
    imgKeyword: 'gaming,esports',
    prefixes: ['Viper', 'Razer', 'Apex', 'Titan', 'Predator', 'Phantom', 'Ghost', 'Strix'],
    items: [
      'เมาส์เกมมิ่ง RGB 16,000 DPI', 'คีย์บอร์ดเกมมิ่ง Mechanical Blue Switch', 'หูฟังเกมมิ่ง ระบบเสียง 7.1 Surround',
      'แผ่นรองเมาส์ขนาดใหญ่ XXL แบบ Speed', 'เก้าอี้เกมมิ่งปรับนอน 180 องศา', 'จอมอนิเตอร์ 144Hz 1ms IPS',
      'ขาตั้งหูฟังพร้อมไฟ RGB และ USB Hub', 'จอยสติ๊กไร้สาย รองรับ PC และ Console', 'ไมโครโฟนตั้งโต๊ะสำหรับสตรีมเมอร์'
    ]
  },
  home: {
    name: 'ของแต่งบ้าน & ไลฟ์สไตล์',
    count: 35, // สินค้าเน้นๆ คัดสรร
    basePrice: 420,
    imgKeyword: 'homedecor,interior',
    prefixes: ['Cozy', 'Nordic', 'Minimal', 'Zen', 'Eco', 'Homey', 'Loft'],
    items: [
      'โคมไฟตั้งโต๊ะปรับแสงได้ 3 ระดับ', 'แก้วน้ำเก็บความเย็น สแตนเลส 304', 'หมอนหนุนเมมโมรี่โฟมเพื่อสุขภาพ',
      'เครื่องหอมปรับอากาศห้อง Aromatherapy', 'พรมแต่งห้องขนยาวสัมผัสนุ่ม', 'ต้นไม้ปลอมตกแต่งบ้านพร้อมกระถาง',
      'ชั้นวางของไม้สัก 3 ชั้น', 'ชุดผ้าปูที่นอนไร้ไรฝุ่น 6 ฟุต', 'นาฬิกาปลุกดิจิทัล LED minimal'
    ]
  }
};

// Generate total 300 products with dynamic counts per category
const ALL_PRODUCTS: Product[] = [];
let globalId = 1;

Object.entries(CATEGORY_CONFIG).forEach(([catKey, config]) => {
  for (let i = 0; i < config.count; i++) {
    const prefix = config.prefixes[i % config.prefixes.length];
    const baseItem = config.items[i % config.items.length];
    const variationNumber = Math.floor(i / config.items.length) + 1;
    const name = `${prefix} ${baseItem} ${variationNumber > 1 ? `รุ่น ${variationNumber}` : ''}`.trim();
    
    const price = config.basePrice + (i * 30) + ((i % 4) * 50);
    const originalPrice = Math.floor(price * 1.35);
    const rating = Number((4.1 + ((i % 10) * 0.1)).toFixed(1));
    const reviews = 12 + (i * 11);
    
    const badges = ['ขายดี', 'ลดราคาพิเศษ', 'แนะนำ', 'สินค้าใหม่', ''];
    const badge = badges[i % badges.length];

    ALL_PRODUCTS.push({
      id: globalId++,
      name,
      category: catKey,
      price,
      originalPrice,
      rating: rating > 5 ? 5.0 : rating,
      reviews,
      badge: badge !== '' ? badge : undefined,
      image: `https://images.unsplash.com/photo-${1500000000000 + (globalId * 987654) % 90000000}?auto=format&fit=crop&w=600&q=80`
    });
  }
});

// Category Tabs List
const CATEGORIES = [
  { id: 'all', name: `ทั้งหมด (${ALL_PRODUCTS.length})` },
  ...Object.entries(CATEGORY_CONFIG).map(([id, cfg]) => ({
    id,
    name: `${cfg.name} (${cfg.count})`
  }))
];

// Fallback images in case Unsplash connection fails
const fallbackImages: Record<string, string> = {
  beauty: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=600&q=80',
  sports: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=600&q=80',
  gadget: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80',
  fashion: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=600&q=80',
  gaming: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=600&q=80',
  home: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&w=600&q=80',
};

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 12;

  // Filter products by category and search term
  const filteredProducts = useMemo(() => {
    return ALL_PRODUCTS.filter(product => {
      const matchCat = selectedCategory === 'all' || product.category === selectedCategory;
      const matchSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const currentProducts = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredProducts.slice(start, start + itemsPerPage);
  }, [filteredProducts, currentPage]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setCurrentPage(1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-16">
      {/* 🌟 Top Navigation Bar */}
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-emerald-600 text-white rounded-xl flex items-center justify-center text-2xl font-black">
              S
            </div>
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Super<span className="text-emerald-600">Shop</span>
            </span>
          </div>

          {/* Search Input - Big & Clear */}
          <div className="flex-1 max-w-xl">
            <div className="relative">
              <input
                type="text"
                placeholder="ค้นหาสินค้าจาก 300 รายการ..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full pl-11 pr-4 py-3 text-base bg-slate-100 border border-transparent rounded-xl focus:bg-white focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200 transition-all placeholder:text-slate-400 font-medium"
              />
              <svg className="w-6 h-6 text-slate-400 absolute left-3.5 top-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
              </svg>
            </div>
          </div>

          <button className="hidden sm:flex items-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base rounded-xl transition shadow-md hover:shadow-lg">
            <span>ตระกร้าสินค้า</span>
            <span className="bg-white text-emerald-700 text-sm px-2.5 py-0.5 rounded-full font-black">3</span>
          </button>
        </div>
      </header>

      {/* 🏷️ Main Category Tabs (Dynamic Counts) */}
      <nav className="bg-white border-b border-slate-200 py-3 shadow-inner sticky top-20 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-base font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-600 text-white shadow-md scale-105'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 hover:text-slate-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* 🚀 Hero Banner */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-700 rounded-2xl p-8 md:p-10 text-white shadow-lg flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="bg-white/20 text-white text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider">
              สินค้าพร้อมส่ง 300 รายการเต็มเปี่ยม
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold mt-3 tracking-tight">
              ช้อปปิ้งออนไลน์ สะดวก ครบ จบที่เดียว
            </h1>
            <p className="text-emerald-100 text-lg md:text-xl mt-2 max-w-2xl">
              คัดสรรสินค้าคุณภาพตรงตามความต้องการ จัดหมวดหมู่อย่างสมดุล พร้อมโปรโมชั่นส่วนลดพิเศษ
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20 min-w-[220px]">
            <p className="text-base text-emerald-100 font-medium">รวมสินค้าทั้งหมด</p>
            <p className="text-4xl font-black text-white mt-1">300 ชิ้น</p>
            <p className="text-sm text-emerald-200 mt-1">6 หมวดหมู่ยอดฮิต</p>
          </div>
        </div>
      </div>

      {/* 🛍️ Product Grid Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900">
              {selectedCategory === 'all' 
                ? 'สินค้าทั้งหมด' 
                : CATEGORY_CONFIG[selectedCategory]?.name}
            </h2>
            <p className="text-slate-500 text-base mt-1 font-medium">
              พบสินค้า {filteredProducts.length} รายการ (แสดงหน้า {currentPage} จาก {totalPages})
            </p>
          </div>
        </div>

        {/* Products Grid */}
        {currentProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {currentProducts.map((product) => (
              <div
                key={product.id}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Image Container */}
                <div className="relative aspect-square bg-slate-100 overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = fallbackImages[product.category] || fallbackImages.beauty;
                    }}
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-red-500 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow-md">
                      {product.badge}
                    </span>
                  )}
                </div>

                {/* Content Container - Large Clear Fonts */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 line-clamp-2 hover:text-emerald-600 transition-colors leading-snug">
                      {product.name}
                    </h3>
                    
                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-2 mt-2.5">
                      <div className="flex text-amber-400 text-base">
                        {'★'.repeat(Math.floor(product.rating))}
                      </div>
                      <span className="text-base font-bold text-slate-700">{product.rating}</span>
                      <span className="text-sm text-slate-400 font-medium">({product.reviews} รีวิว)</span>
                    </div>
                  </div>

                  {/* Price & Action */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-end justify-between">
                    <div>
                      <p className="text-xs text-slate-400 line-through font-medium">
                        ฿{product.originalPrice.toLocaleString()}
                      </p>
                      <p className="text-2xl font-black text-emerald-600">
                        ฿{product.price.toLocaleString()}
                      </p>
                    </div>
                    <button className="bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-700 font-bold px-4 py-2.5 rounded-xl text-base transition-colors flex items-center gap-1.5 shadow-sm">
                      <span>สั่งซื้อ</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200">
            <p className="text-2xl font-bold text-slate-700">ไม่พบสินค้าที่คุณกำลังค้นหา</p>
            <p className="text-slate-500 text-base mt-2">ลองค้นหาด้วยคำอื่น หรือเลือกหมวดหมู่อื่นดูนะครับ</p>
            <button
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="mt-4 px-6 py-2.5 bg-emerald-600 text-white rounded-xl font-bold text-base hover:bg-emerald-700 transition"
            >
              ล้างการค้นหา
            </button>
          </div>
        )}

        {/* 📖 Pagination Navigation */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center items-center gap-2 flex-wrap">
            <button
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-4 py-2.5 rounded-xl font-bold text-base border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ย้อนกลับ
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-11 h-11 rounded-xl font-bold text-base transition ${
                  currentPage === page
                    ? 'bg-emerald-600 text-white shadow-md'
                    : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-4 py-2.5 rounded-xl font-bold text-base border border-slate-300 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ถัดไป
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
