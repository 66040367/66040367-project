'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { 
  Search, ShoppingCart, Star, Zap, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Truck, ChevronLeft, ChevronRight, ShoppingBag, ShieldCheck, Sparkles, Filter, ChevronRight as ArrowRightIcon, Flame
} from 'lucide-react';

export interface ProductItem {
  id: number;
  name: string;
  mainCategory: string;
  subCategory: string;
  price: number;
  originalPrice: number;
  rating: number;
  reviewsCount: number;
  sold: number;
  image: string;
  badge?: 'HOT' | 'SALE' | 'NEW';
  spec: string;
  keywords: string[];
}

const CATEGORY_STRUCTURE = [
  {
    id: 'fashion',
    name: '👗 เสื้อผ้าแฟชั่น',
    subs: ['เสื้อผ้า ผญ', 'เสื้อผ้าผู้ชาย', 'เสื้อผ้าเด็ก', 'รองเท้า', 'กระเป๋า', 'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)']
  },
  {
    id: 'it',
    name: '💻 อุปกรณ์ไอที & เกมมิ่ง',
    subs: ['โทรศัพท์', 'แท็บเล็ต (MacBook)', 'คอมพิวเตอร์', 'ไมค์เล่นเกม', 'หูฟังเล่นเกม', 'คีย์บอร์ดเล่นเกม', 'จอคอม', 'CPU', 'RAM', 'คอมประกอบ']
  },
  {
    id: 'beauty',
    name: '💄 เครื่องสำอาง & บำรุงผิว',
    subs: ['บลัชออน', 'ลิป', 'รองพื้น', 'คอนซีลเลอร์', 'ครีมทาหน้าหรือเซรั่ม', 'ครีมทาผิว', 'ครีมกันแดดทั้งหน้าและตัว']
  },
  {
    id: 'food',
    name: '🍱 อาหาร & ขนม',
    subs: ['มาม่า', 'ขนมที่สามารถส่งพัสดุได้', 'อาหารบรรจุภัณฑ์']
  },
  {
    id: 'toys',
    name: '🧸 ของเล่น & กล่องสุ่ม',
    subs: ['ของเล่นรวม']
  },
  {
    id: 'decor',
    name: '🏠 ของตกแต่งบ้าน & ห้องนอน',
    subs: ['โต๊ะคอม', 'กระจก', 'ไฟ LED', 'ตุ๊กตา/พรม/ของแต่งห้อง']
  }
];

// 🎨 คีย์เวิร์ดภาษาอังกฤษสำหรับดึงรูปตรงหมวด 100%
const CATEGORY_KEYWORDS: Record<string, string> = {
  'เสื้อผ้า ผญ': 'dress,fashion',
  'เสื้อผ้าผู้ชาย': 'menswear,clothes',
  'เสื้อผ้าเด็ก': 'baby,kids',
  'รองเท้า': 'sneakers,shoes',
  'กระเป๋า': 'handbag,backpack',
  'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)': 'jewelry,ring',

  'โทรศัพท์': 'smartphone,iphone',
  'แท็บเล็ต (MacBook)': 'laptop,macbook',
  'คอมพิวเตอร์': 'computer,pc',
  'ไมค์เล่นเกม': 'microphone',
  'หูฟังเล่นเกม': 'headphones',
  'คีย์บอร์ดเล่นเกม': 'keyboard',
  'จอคอม': 'monitor',
  'CPU': 'processor,tech',
  'RAM': 'ram,tech',
  'คอมประกอบ': 'gamingpc',

  'บลัชออน': 'makeup,cosmetics',
  'ลิป': 'lipstick',
  'รองพื้น': 'makeup',
  'คอนซีลเลอร์': 'cosmetics',
  'ครีมทาหน้าหรือเซรั่ม': 'skincare,serum',
  'ครีมทาผิว': 'lotion',
  'ครีมกันแดดทั้งหน้าและตัว': 'sunscreen',

  'มาม่า': 'ramen,noodles',
  'ขนมที่สามารถส่งพัสดุได้': 'cookies,snack',
  'อาหารบรรจุภัณฑ์': 'food,canned',

  'ของเล่นรวม': 'toy,actionfigure',

  'โต๊ะคอม': 'desk,workspace',
  'กระจก': 'mirror',
  'ไฟ LED': 'neon,led',
  'ตุ๊กตา/พรม/ของแต่งห้อง': 'teddybear,decor'
};

const NAME_PREFIXES = ['พรีเมียม', 'รุ่นยอดฮิต', 'สไตล์เกาหลี', 'ยอดนิยม 2026', 'มินิมอล', 'Pro Max', 'Special Edition', 'คอลเลกชันพิเศษ', 'เกรดพรีเมียม'];
const NAME_SUFFIXES = ['สีพาสเทล', 'สีเบจ', 'สตรีทแฟชั่น', 'ทรงโอเวอร์ไซส์', 'เนื้อสัมผัสบางเบา', 'คุมมัน 24 ชม.', 'เชื่อมต่อไร้สาย', 'ชิปประมวลผลเร็วแรง', 'กันน้ำ IP68'];

const BANNERS = [
  {
    id: 1,
    title: 'MEGA MID-YEAR SALE 🛍️',
    subtitle: 'ขนทัพสินค้า IT & แฟชั่น ลดสูงสุด 70%',
    desc: 'ช้อป iPhone, MacBook และเสื้อผ้าเกาหลีราคาพิเศษที่สุดแห่งปี พร้อมโค้ดส่งฟรีทั่วไทย!',
    bg: 'from-purple-900 via-rose-900 to-indigo-950',
    tag: '⚡ โปรโมชันเด็ดประจำเดือน',
    btnText: 'ช้อปเลยตอนนี้'
  },
  {
    id: 2,
    title: 'BEAUTY & SKINCARE FEST 💄',
    subtitle: 'เซรั่ม & ลิปเคาน์เตอร์แบรนด์ แท้ 100%',
    desc: 'เซรั่มบำรุงล้ำลึก ลิปติดทนนาน ลดกระหน่ำ การันตีคุณภาพ คุ้มค่าทุกชิ้น!',
    bg: 'from-pink-900 via-rose-800 to-slate-950',
    tag: '✨ BEAUTY MUST-HAVE',
    btnText: 'ดูสินค้าสกินแคร์'
  }
];

// 🟢 GENERATOR ENGINE: สร้างรูปภาพโหลดชัวร์ 100% ด้วย LoremFlickr Dynamic Engine
const GENERATED_PRODUCTS: ProductItem[] = (() => {
  const list: ProductItem[] = [];
  let idCounter = 1;

  CATEGORY_STRUCTURE.forEach((mainCat) => {
    mainCat.subs.forEach((subCat) => {
      const keyword = CATEGORY_KEYWORDS[subCat] || 'product';

      for (let i = 1; i <= 52; i++) {
        const prefix = NAME_PREFIXES[i % NAME_PREFIXES.length];
        const suffix = NAME_SUFFIXES[(i * 3) % NAME_SUFFIXES.length];
        
        const name = `${subCat} ${prefix} ${suffix} (${subCat} รุ่นที่ ${i})`;

        // ใช้ LoremFlickr API + Unique Lock ID รับประกันรูปตรงหมวด และโหลดได้แน่นอน 100%
        const image = `https://loremflickr.com/600/600/${keyword}?lock=${idCounter}`;

        let spec = `สินค้าหมวด ${subCat} แท้ 100% คุณภาพสูง คัดสรรวัสดุอย่างดี ดีไซน์สวยงามทันสมัย ตรงตามมาตรฐานการผลิต การันตีคุณภาพพร้อมรับประกันสินค้า จัดส่งรวดเร็วทันใจ`;
        let price = 150 + (idCounter * 47) % 3500;

        if (mainCat.id === 'it') price += 4000;
        if (subCat === 'โทรศัพท์' || subCat === 'แท็บเล็ต (MacBook)' || subCat === 'คอมพิวเตอร์') price += 12000;

        list.push({
          id: idCounter++,
          name,
          mainCategory: mainCat.id,
          subCategory: subCat,
          price,
          originalPrice: Math.floor(price * 1.35),
          rating: Number((4.5 + (i % 5) * 0.1).toFixed(1)),
          reviewsCount: 50 + (i * 12),
          sold: 100 + (i * 23),
          image,
          badge: i % 4 === 0 ? 'HOT' : i % 6 === 0 ? 'SALE' : 'NEW',
          spec,
          keywords: [mainCat.name, subCat, prefix, suffix, 'พร้อมส่ง']
        });
      }
    });
  });

  return list;
})();

export default function StorePage() {
  const [activeMainCat, setActiveMainCat] = useState<string>('all');
  const [activeSubCat, setActiveSubCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [currentBanner, setCurrentBanner] = useState(0);

  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: { product: ProductItem; quantity: number }[]; total: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBanner((prev) => (prev + 1) % BANNERS.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const currentSubCategories = useMemo(() => {
    if (activeMainCat === 'all') return [];
    const found = CATEGORY_STRUCTURE.find(c => c.id === activeMainCat);
    return found ? found.subs : [];
  }, [activeMainCat]);

  const filteredProducts = useMemo(() => {
    return GENERATED_PRODUCTS.filter((item) => {
      const matchMain = activeMainCat === 'all' || item.mainCategory === activeMainCat;
      const matchSub = activeSubCat === 'all' || item.subCategory === activeSubCat;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.spec.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q) ||
        item.keywords.some(k => k.toLowerCase().includes(q));

      return matchMain && matchSub && matchSearch;
    });
  }, [activeMainCat, activeSubCat, searchQuery]);

  const addToCart = (product: ProductItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const exist = prev.find((i) => i.product.id === product.id);
      if (exist) {
        return prev.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { product, quantity: 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart((prev) => 
      prev.map((item) => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: number) => {
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    setCompletedOrder({ items: [...cart], total });
    setCart([]);
    setIsCartOpen(false);
  };

  const totalCartCount = cart.reduce((sum, i) => sum + i.quantity, 0);
  const totalCartPrice = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);

  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/40 shadow-lg">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">สั่งซื้อสินค้าสำเร็จ!</h1>
            <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-6 py-3 rounded-2xl text-lg font-extrabold">
              <Truck className="w-6 h-6 animate-bounce" />
              <span>พนักงานกำลังจัดส่งพัสดุของคุณ 🚚</span>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-2xl border border-slate-800 p-4 space-y-3 max-h-80 overflow-y-auto">
            <h3 className="text-base font-extrabold text-slate-300 uppercase tracking-wider mb-2 border-b border-slate-800 pb-2 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-rose-400" /> สรุปรายการสินค้าที่ชำระแล้ว
            </h3>
            {completedOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-4 bg-slate-900/90 p-3.5 rounded-xl border border-slate-800">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={product.image} alt={product.name} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800" />
                  <div className="min-w-0">
                    <h4 className="font-bold text-base text-white truncate">{product.name}</h4>
                    <p className="text-sm text-slate-400 mt-0.5">จำนวน: <span className="text-rose-400 font-bold">{quantity}</span> ชิ้น</p>
                  </div>
                </div>
                <span className="font-black text-indigo-400 text-lg shrink-0">฿{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2 py-2 border-t border-slate-800">
            <span className="text-slate-200 text-lg font-bold">ราคารวมที่ชำระทั้งหมด:</span>
            <span className="text-3xl font-black text-emerald-400">฿{completedOrder.total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="w-full bg-gradient-to-r from-indigo-600 to-rose-600 hover:from-indigo-500 hover:to-rose-500 text-white font-black text-lg py-4 rounded-2xl transition-all shadow-xl flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6" /> ย้อนกลับไปหน้าสั่งซื้อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-24 relative overflow-x-hidden">
      
      {/* 🟢 HEADER */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-6">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveMainCat('all'); setActiveSubCat('all'); setSearchQuery(''); }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-black text-2xl shadow-lg">
              L
            </div>
            <div>
              <span className="text-2xl sm:text-3xl font-black bg-gradient-to-r from-indigo-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                Lalana367
              </span>
              <span className="text-xs font-bold text-slate-400 block tracking-widest -mt-1 flex items-center gap-1">
                <ShieldCheck className="w-4 h-4 text-emerald-400" /> OFFICIAL STORE
              </span>
            </div>
          </div>

          <div className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า, รุ่น, สไตล์..."
              className="w-full bg-slate-800/90 text-slate-100 pl-12 pr-10 py-3.5 rounded-2xl text-base font-semibold border border-slate-700/80 focus:border-rose-500 focus:outline-none transition-all placeholder:text-slate-500"
            />
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-4" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-4 text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          <div className="w-10"></div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        
        {/* BANNER */}
        <div className="relative mb-8 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
          <div className={`bg-gradient-to-r ${BANNERS[currentBanner].bg} p-8 sm:p-12 transition-all duration-700 flex flex-col justify-between min-h-[260px] sm:min-h-[300px]`}>
            <div className="space-y-3 max-w-2xl">
              <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md text-amber-300 border border-amber-300/30 px-3.5 py-1 rounded-full text-xs font-black uppercase">
                <Flame className="w-4 h-4 text-amber-400" /> {BANNERS[currentBanner].tag}
              </span>
              <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
                {BANNERS[currentBanner].title}
              </h1>
              <p className="text-lg sm:text-xl font-bold text-rose-200">
                {BANNERS[currentBanner].subtitle}
              </p>
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
                {BANNERS[currentBanner].desc}
              </p>
            </div>

            <div className="pt-6 flex items-center justify-between">
              <button 
                onClick={() => setActiveMainCat('it')}
                className="bg-white hover:bg-slate-100 text-slate-950 font-black px-6 py-3 rounded-xl shadow-lg transition-all flex items-center gap-2 cursor-pointer"
              >
                {BANNERS[currentBanner].btnText} <ArrowRightIcon className="w-5 h-5" />
              </button>

              <div className="flex gap-2">
                {BANNERS.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentBanner(idx)}
                    className={`h-2.5 rounded-full transition-all ${
                      currentBanner === idx ? 'w-8 bg-rose-500' : 'w-2.5 bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 🔥 หมวดหมู่หลัก */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-3 text-rose-400 text-sm font-black uppercase">
            <Sparkles className="w-4 h-4" /> เลือกหมวดหมู่สินค้า
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-4 scrollbar-none border-b border-slate-800/80">
            <button
              onClick={() => { setActiveMainCat('all'); setActiveSubCat('all'); }}
              className={`px-7 py-3.5 rounded-2xl text-base sm:text-lg font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                activeMainCat === 'all'
                  ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-600 text-white shadow-lg scale-105 border border-amber-400/40'
                  : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              ✨ สินค้าทั้งหมด (คละหมวด)
            </button>

            {CATEGORY_STRUCTURE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => { setActiveMainCat(cat.id); setActiveSubCat('all'); }}
                className={`px-7 py-3.5 rounded-2xl text-base sm:text-lg font-black whitespace-nowrap transition-all cursor-pointer flex items-center gap-2 ${
                  activeMainCat === cat.id
                    ? 'bg-gradient-to-r from-indigo-600 via-rose-600 to-pink-600 text-white shadow-lg scale-105 border border-rose-400/40'
                    : 'bg-slate-900 text-slate-200 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🏷️ หมวดย่อย */}
        {currentSubCategories.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-3 overflow-x-auto pb-3 scrollbar-none">
              <button
                onClick={() => setActiveSubCat('all')}
                className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-extrabold whitespace-nowrap transition-all cursor-pointer ${
                  activeSubCat === 'all'
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
                }`}
              >
                ทั้งหมดในหมวดนี้
              </button>
              {currentSubCategories.map((sub) => (
                <button
                  key={sub}
                  onClick={() => setActiveSubCat(sub)}
                  className={`px-5 py-2.5 rounded-xl text-sm sm:text-base font-bold whitespace-nowrap transition-all cursor-pointer ${
                    activeSubCat === sub
                      ? 'bg-rose-500 text-white shadow-md border border-rose-400'
                      : 'bg-slate-900/90 text-slate-300 hover:bg-slate-800 border border-slate-800'
                  }`}
                >
                  {sub} (50+)
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl sm:text-2xl font-black text-white flex items-center gap-2">
            <Filter className="w-5 h-5 text-rose-400" />
            {activeMainCat === 'all' ? 'สินค้าแนะนำคละหมวดหมู่ทั้งหมด' : CATEGORY_STRUCTURE.find(c => c.id === activeMainCat)?.name}
            {activeSubCat !== 'all' && <span className="text-rose-400"> › {activeSubCat}</span>}
          </h2>
          <span className="text-sm font-bold text-slate-400">พบ {filteredProducts.length.toLocaleString()} รายการ</span>
        </div>

        {/* 🛍️ GRID ตารางสินค้า */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-slate-900 border border-slate-800/90 rounded-3xl overflow-hidden hover:border-rose-500/60 hover:shadow-2xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  onError={(e) => {
                    // หากรูปภาพโหลดไม่ผ่าน จะสลับไปใช้รูปกราฟิก SVG Dynamic ประจำหมวดหมู่ทันที รูปไม่มีวันแตก
                    const target = e.target as HTMLImageElement;
                    target.src = `https://placehold.co/600x600/1e293b/f43f5e?text=${encodeURIComponent(product.subCategory)}`;
                  }}
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />

                <div className="absolute top-2.5 left-2.5 flex gap-1 z-10">
                  <span className="bg-slate-950/80 backdrop-blur-md text-slate-200 text-xs font-bold px-2.5 py-1 rounded-lg border border-slate-800">
                    {product.subCategory}
                  </span>
                  {product.badge && (
                    <span className={`text-xs font-black px-2 py-1 rounded-lg text-white flex items-center gap-0.5 shadow-md ${
                      product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      <Zap className="w-3 h-3 fill-current" /> {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="font-black text-slate-100 text-base line-clamp-2 group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-400 line-clamp-2 mt-1.5 font-normal leading-relaxed">
                    {product.spec}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 text-amber-400 text-xs mb-3">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-200">{product.rating}</span>
                    <span className="text-slate-500">({product.reviewsCount})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-slate-800/80">
                    <div>
                      <span className="text-rose-400 font-black text-lg block">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-slate-500 text-xs line-through block -mt-1">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="bg-rose-600 hover:bg-rose-500 text-white p-2.5 rounded-xl transition-all shadow-md active:scale-90 cursor-pointer"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🔴 ตะกร้าสินค้า Floating Bar */}
      <div 
        className={`fixed top-1/3 right-0 z-50 flex items-center transition-all duration-300 ${
          isCartOpen ? 'translate-x-full' : 'translate-x-0'
        }`}
        onMouseEnter={() => setIsCartOpen(true)}
      >
        <button
          onClick={() => setIsCartOpen(true)}
          className="bg-slate-900/80 backdrop-blur-md border-l border-y border-rose-500/50 text-slate-200 p-4 rounded-l-2xl shadow-2xl flex items-center gap-2 hover:bg-slate-800 cursor-pointer"
        >
          <ChevronLeft className="w-6 h-6 text-rose-400 animate-pulse" />
          <div className="relative">
            <ShoppingCart className="w-7 h-7 text-slate-100" />
            {totalCartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-rose-500 text-white text-xs font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                {totalCartCount}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* 🟢 SIDEBAR ตะกร้าสินค้า */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`bg-slate-900/95 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl backdrop-blur-xl transition-transform duration-300 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <h2 className="font-black text-xl text-white flex items-center gap-2">
                <ShoppingCart className="w-6 h-6 text-rose-400" /> ตะกร้าสินค้า Lalana367 ({totalCartCount})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white cursor-pointer">
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-5 space-y-3.5 overflow-y-auto max-h-[62vh] pr-1">
              {cart.length === 0 ? (
                <div className="text-center text-slate-500 py-24 text-base space-y-3">
                  <ShoppingCart className="w-12 h-12 mx-auto text-slate-700" />
                  <p className="font-bold">ยังไม่มีสินค้าในตะกร้าของคุณ</p>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 p-3.5 bg-slate-950/80 rounded-2xl border border-slate-800">
                    <img src={product.image} className="w-14 h-14 rounded-xl object-cover shrink-0 border border-slate-800" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm text-slate-100 truncate">{product.name}</h4>
                      <span className="text-rose-400 font-black text-base block mt-0.5">฿{(product.price * quantity).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-slate-900 rounded-xl border border-slate-800 p-1">
                        <button onClick={() => updateQuantity(product.id, -1)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-2 text-sm font-black text-slate-200">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, 1)} className="p-1 text-slate-400 hover:text-white cursor-pointer">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(product.id)} className="p-2 text-slate-500 hover:text-rose-400 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-slate-300">ราคารวมทั้งหมด:</span>
              <span className="text-2xl font-black text-rose-400">฿{totalCartPrice.toLocaleString()}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-600 text-white font-black text-lg py-4 rounded-2xl shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-6 h-6" /> ชำระเงิน
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 MODAL POPUP รายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-800">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2.5 rounded-full bg-slate-800/80 backdrop-blur-md text-slate-400 hover:text-white z-10 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-square w-full bg-slate-950 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-5 max-h-[45vh] overflow-y-auto">
              <div>
                <span className="bg-rose-500/20 text-rose-400 text-xs font-black px-3 py-1 rounded-lg border border-rose-500/30">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-xl font-black text-white mt-2.5 leading-snug">{selectedProduct.name}</h2>
                <div className="mt-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
                  <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-1.5">รายละเอียดสินค้า</h4>
                  <p className="text-sm text-slate-300 leading-relaxed font-normal">{selectedProduct.spec}</p>
                </div>
              </div>

              <div className="flex items-center justify-between py-3.5 border-y border-slate-800">
                <div>
                  <span className="text-slate-400 text-xs font-semibold">ราคาพิเศษ</span>
                  <div className="text-3xl font-black text-rose-400">฿{selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-400 text-sm font-bold">
                    <Star className="w-4 h-4 fill-current" /> {selectedProduct.rating} / 5.0
                  </div>
                  <span className="text-xs text-slate-400">ขายแล้ว {selectedProduct.sold} ชิ้น</span>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-black text-lg py-4 rounded-2xl shadow-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-6 h-6" /> ใส่ตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
