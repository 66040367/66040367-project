'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Minus, Trash2, X, CheckCircle2, Truck, Eye, Filter, Flame, Zap, ShieldCheck } from 'lucide-react';

interface ReviewBreakdown {
  star5: number;
  star4: number;
  star3: number;
  star2: number;
  star1: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  sold: number;
  category: string;
  subCategory: string;
  badge?: 'HOT' | 'SALE' | 'NEW';
  images: string[];
  description: string;
  reviews: ReviewBreakdown;
  searchKeywords: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// 🎯 คลังรูปภาพแยกเฉพาะแบบเจาะจง 100% ไม่ซ้ำ ไม่วนมั่ว
const PRODUCT_DATA_SOURCE: Record<string, { name: string; images: string[] }[]> = {
  // --- อุปกรณ์คอมพิวเตอร์ ---
  'จอคอมพิวเตอร์': [
    { name: 'จอคอม Gaming 27" 165Hz IPS QHD', images: ['https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80'] },
    { name: 'จอคอม Curved Monitor 34" Ultrawide 4K', images: ['https://images.unsplash.com/photo-1585792180666-f7347c490ee2?w=600&q=80'] },
    { name: 'จอคอมพิวเตอร์สเปกทำงาน 24" Frameless', images: ['https://images.unsplash.com/photo-1547082299-de196ea013d6?w=600&q=80'] },
    { name: 'จอคอม Dual Monitor Setup Ready 27"', images: ['https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&q=80'] },
    { name: 'จอคอม Gaming OLED 240Hz Response 0.03ms', images: ['https://images.unsplash.com/photo-1551645120-d70bfe84c826?w=600&q=80'] },
  ],
  'เคสคอมพิวเตอร์': [
    { name: 'เคสคอม RGB Gaming Mid-Tower Glass Panel', images: ['https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80'] },
    { name: 'เคสคอมพิวเตอร์ Custom Water Cooling Ready', images: ['https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80'] },
    { name: 'เคสคอม Mini-ITX Compact Aluminum Build', images: ['https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&q=80'] },
    { name: 'เคสคอม White Edition tempered Glass RGB', images: ['https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600&q=80'] },
  ],
  'คีย์บอร์ด': [
    { name: 'คีย์บอร์ด Mechanical Wireless RGB Hotswap', images: ['https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80'] },
    { name: 'คีย์บอร์ด Custom Mechanical Wooden Base', images: ['https://images.unsplash.com/photo-1618384887929-16ec33fab9ef?w=600&q=80'] },
    { name: 'คีย์บอร์ด Gaming TKL Red Switch Ultra Fast', images: ['https://images.unsplash.com/photo-1595225476474-87563907a212?w=600&q=80'] },
    { name: 'คีย์บอร์ด Ergonomic Split Design', images: ['https://images.unsplash.com/photo-1541140134513-85a161dc4a00?w=600&q=80'] },
  ],
  'เมาส์': [
    { name: 'เมาส์ Gaming Wireless Lightweight 60g', images: ['https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?w=600&q=80'] },
    { name: 'เมาส์ไร้สาย Ergonomic Vertical Mouse', images: ['https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80'] },
    { name: 'เมาส์เกมมิ่ง RGB High Precision Sensor', images: ['https://images.unsplash.com/photo-1629429408209-1f912961dbd8?w=600&q=80'] },
  ],
  'ไมโครโฟน': [
    { name: 'ไมโครโฟน USB Condenser สำหรับสตรีมมิ่ง', images: ['https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80'] },
    { name: 'ไมโครโฟน XLR Studio Qualityพร้อมขาตั้ง', images: ['https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80'] },
    { name: 'ไมค์ตั้งโต๊ะ RGB สำหรับแคสเกมและพอดแคสต์', images: ['https://images.unsplash.com/photo-1614680376593-902f749f7051?w=600&q=80'] },
  ],

  // --- เสื้อผ้า ---
  'เสื้อผ้าผู้หญิง': [
    { name: 'เดรสยาวแฟชั่นเกาหลี พรีเมียมผ้านุ่ม', images: ['https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80'] },
    { name: 'เสื้อไหมพรมคอวี สไตล์มินิมอล', images: ['https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&q=80'] },
    { name: 'ชุดเซ็ตเสื้อกับกระโปรงแฟชั่นฤดูร้อน', images: ['https://images.unsplash.com/photo-1525507119028-ed4c629a60a3?w=600&q=80'] },
    { name: 'เสื้อสูทเบลเซอร์ผู้หญิงสไตล์ลำลอง', images: ['https://images.unsplash.com/photo-1581044777550-4cfa60707c03?w=600&q=80'] },
  ],
  'เสื้อผ้าผู้ชาย': [
    { name: 'เสื้อเชิ้ตแขนยาวคอตตอน พรีเมียมฟิต', images: ['https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=600&q=80'] },
    { name: 'เสื้อสูทสากลผู้ชาย สมาร์ทลุค Slim Fit', images: ['https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=600&q=80'] },
    { name: 'เสื้อแจ็กเก็ตยีนส์ คลาสสิกสตรีทแวร์', images: ['https://images.unsplash.com/photo-1618886614638-80e3c103d31a?w=600&q=80'] },
    { name: 'เสื้อยืดคอกลม Oversize Cotton 100%', images: ['https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&q=80'] },
  ],

  // --- รองเท้า ---
  'รองเท้าแฟชั่น': [
    { name: 'รองเท้า Sneaker หนังสีขาว พรีเมียม', images: ['https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80'] },
    { name: 'รองเท้าส้นสูงแฟชั่น หนังแท้', images: ['https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&q=80'] },
    { name: 'รองเท้าวิ่ง Running Sports Pro Cushion', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80'] },
  ],

  // --- ความงาม ---
  'เครื่องสำอาง': [
    { name: 'ชุดลิปสติก Matte Finish Long Lasting', images: ['https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80'] },
    { name: 'พาเลตต์อายแชโดว์ 12 เฉดสีธรรมชาติ', images: ['https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80'] },
  ],
  'น้ำหอม': [
    { name: 'น้ำหอม LALANA EDP Perfume Luxury Scent 100ml', images: ['https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=600&q=80'] },
    { name: 'น้ำหอมขวดแก้วพรีเมียม กลิ่นหอมนุ่มสดชื่น', images: ['https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80'] },
  ],
  'สกินแคร์': [
    { name: 'เซรั่มบำรุงผิวหน้าไฮยาบรูสท์ เข้มข้น 50ml', images: ['https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80'] },
    { name: 'มอยส์เจอไรเซอร์ครีมสูตรอ่อนโยนสำหรับผิวแพ้ง่าย', images: ['https://images.unsplash.com/photo-1608248597261-833250005a76?w=600&q=80'] },
  ]
};

const GENERATE_PRODUCTS = (): Product[] => {
  let list: Product[] = [];
  let idCounter = 1;

  const categories = [
    {
      main: 'electronics',
      subs: ['จอคอมพิวเตอร์', 'เคสคอมพิวเตอร์', 'คีย์บอร์ด', 'เมาส์', 'ไมโครโฟน']
    },
    {
      main: 'clothing',
      subs: ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย']
    },
    {
      main: 'shoes',
      subs: ['รองเท้าแฟชั่น']
    },
    {
      main: 'beauty',
      subs: ['เครื่องสำอาง', 'น้ำหอม', 'สกินแคร์']
    }
  ];

  categories.forEach((cat) => {
    cat.subs.forEach((subName) => {
      const sourceItems = PRODUCT_DATA_SOURCE[subName] || [];
      
      // สร้างสินค้าหลากหลายตามคลังรูป
      sourceItems.forEach((item, idx) => {
        const badges: ('HOT' | 'SALE' | 'NEW')[] = ['HOT', 'SALE', 'NEW'];
        const price = Math.floor(Math.random() * 8000) + 450;
        
        list.push({
          id: idCounter,
          name: `${item.name} - LALANA367`,
          price: price,
          originalPrice: Math.floor(price * 1.25),
          rating: Number((Math.random() * (5.0 - 4.5) + 4.5).toFixed(1)),
          sold: Math.floor(Math.random() * 500) + 50,
          category: cat.main,
          subCategory: subName,
          badge: badges[idx % badges.length],
          images: [item.images[0], item.images[0]],
          description: `สินค้าคุณภาพพรีเมียม ${item.name} ผ่านการ QC ทุกชิ้น ประกันศูนย์ไทย มีบริการดูแลหลังการขายโดย LALANA367`,
          reviews: { star5: 180, star4: 25, star3: 4, star2: 0, star1: 0 },
          searchKeywords: `${item.name} ${subName} lalana367`.toLowerCase(),
        });
        idCounter++;
      });
    });
  });

  return list;
};

const ALL_PRODUCTS = GENERATE_PRODUCTS();

export default function Home() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMainCategory, setSelectedMainCategory] = useState<string>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('all');
  
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: CartItem[]; total: number } | null>(null);

  const addToCart = (product: Product, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.images[0] }];
    });
  };

  const updateQuantity = (id: number, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      return product.name.toLowerCase().includes(term) || product.searchKeywords.includes(term);
    }
    const matchesMainCat = selectedMainCategory === 'all' || product.category === selectedMainCategory;
    const matchesSubCat = selectedSubCategory === 'all' || product.subCategory === selectedSubCategory;
    return matchesMainCat && matchesSubCat;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCompletedOrder({ items: [...cart], total: totalPrice });
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-800 font-sans antialiased">
      {/* Header Bar */}
      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          <div 
            className="flex items-center gap-2 cursor-pointer" 
            onClick={() => { setSearchTerm(''); setSelectedMainCategory('all'); setSelectedSubCategory('all'); }}
          >
            <div className="bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-black px-3.5 py-1.5 rounded-xl text-lg tracking-wider shadow-md shadow-indigo-200">
              LALANA
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-widest hidden sm:inline">367</span>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="ค้นหา จอคอม, คีย์บอร์ด, เสื้อผ้าผู้ชาย, น้ำหอม..."
              className="w-full py-2.5 pl-4 pr-10 rounded-2xl bg-slate-100 border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500 transition text-sm shadow-inner"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <X className="absolute right-3.5 top-3 text-slate-400 w-4 h-4 cursor-pointer hover:text-slate-600" onClick={() => setSearchTerm('')} />
            ) : (
              <Search className="absolute right-3.5 top-3 text-slate-400 w-4 h-4" />
            )}
          </div>

          <div className="relative p-2.5 rounded-2xl bg-indigo-50 text-indigo-600 font-bold text-xs flex items-center gap-2 border border-indigo-100">
            <ShoppingCart className="w-5 h-5" />
            <span className="hidden md:inline">ตะกร้าของคุณ</span>
            <span className="bg-indigo-600 text-white font-black rounded-full h-5 w-5 flex items-center justify-center text-[11px] shadow-sm">
              {cart.reduce((a, b) => a + b.quantity, 0)}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      {isCheckoutSuccess && completedOrder ? (
        <main className="max-w-xl mx-auto px-4 py-16">
          <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-xl text-center space-y-6">
            <div className="inline-flex p-4 bg-emerald-50 text-emerald-600 rounded-full">
              <CheckCircle2 className="w-16 h-16" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">สั่งซื้อสินค้าเรียบร้อยแล้ว!</h2>
            <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center justify-center gap-3 text-indigo-600">
              <Truck className="w-5 h-5 animate-bounce" />
              <span className="font-semibold text-sm">พร้อมจัดส่งด่วนโดย LALANA Express 🚛</span>
            </div>

            <div className="text-left space-y-3 pt-4 border-t border-slate-100">
              <h3 className="font-bold text-slate-700 text-sm">สรุปการสั่งซื้อ:</h3>
              <div className="space-y-2">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl text-xs border border-slate-100">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt="" className="w-10 h-10 object-cover rounded-xl" />
                      <div>
                        <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                        <p className="text-slate-500">จำนวน: {item.quantity} ชิ้น</p>
                      </div>
                    </div>
                    <span className="font-bold text-indigo-600">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center text-lg font-bold pt-3 border-t border-slate-100 text-slate-900">
                <span>ยอดชำระสุทธิ:</span>
                <span className="text-indigo-600 text-xl font-black">฿{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={() => { setIsCheckoutSuccess(false); setCompletedOrder(null); }}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-2xl transition shadow-lg shadow-indigo-100"
            >
              กลับไปเลือกซื้อสินค้าต่อ
            </button>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-6">
          {/* Banner Promo */}
          <div className="mb-6 rounded-3xl bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-500 p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="space-y-2 text-center md:text-left">
              <span className="bg-white/20 text-white text-xs font-bold px-3 py-1 rounded-full backdrop-blur-md inline-flex items-center gap-1">
                <Flame className="w-3.5 h-3.5 text-amber-300 fill-amber-300" /> MID-YEAR SALE 2026
              </span>
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ไอที & แฟชั่นแบรนด์เนม ลดสูงสุด 50%</h1>
              <p className="text-xs sm:text-sm text-indigo-100">สินค้าแท้ 100% พร้อมประกันศูนย์ไทย ส่งฟรีทั่วประเทศ</p>
            </div>
            <div className="flex gap-3">
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
                <ShieldCheck className="w-6 h-6 mx-auto mb-1 text-emerald-300" />
                <span className="text-[10px] font-semibold block">ของแท้ 100%</span>
              </div>
              <div className="bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl text-center border border-white/20">
                <Truck className="w-6 h-6 mx-auto mb-1 text-sky-300" />
                <span className="text-[10px] font-semibold block">ส่งฟรีด่วน</span>
              </div>
            </div>
          </div>

          {/* หมวดหมู่หลัก */}
          <div className="flex flex-wrap gap-2 mb-4 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-sm">
            {[
              { key: 'all', label: '⚡ สินค้าทั้งหมด' },
              { key: 'electronics', label: '🖥️ ไอที & คอมพิวเตอร์' },
              { key: 'clothing', label: '👔 เสื้อผ้าแฟชั่น' },
              { key: 'shoes', label: '👟 รองเท้า' },
              { key: 'beauty', label: '💄 ความงาม & สกินแคร์' },
            ].map((cat) => (
              <button
                key={cat.key}
                onClick={() => { setSelectedMainCategory(cat.key); setSelectedSubCategory('all'); setSearchTerm(''); }}
                className={`px-4 py-2 rounded-xl font-bold text-xs transition ${
                  selectedMainCategory === cat.key && !searchTerm
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-100'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* หมวดย่อย (ยืดหยุ่นตามหมวดหลัก) */}
          {selectedMainCategory !== 'all' && !searchTerm && (
            <div className="flex flex-wrap gap-2 mb-6 bg-indigo-50/50 p-3 rounded-2xl border border-indigo-100 items-center">
              <span className="text-indigo-900 text-xs font-bold flex items-center gap-1 mr-1">
                <Filter className="w-3.5 h-3.5 text-indigo-600" /> หมวดย่อย:
              </span>
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  selectedSubCategory === 'all'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                ทั้งหมด
              </button>

              {selectedMainCategory === 'electronics' && ['จอคอมพิวเตอร์', 'เคสคอมพิวเตอร์', 'คีย์บอร์ด', 'เมาส์', 'ไมโครโฟน'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
              {selectedMainCategory === 'clothing' && ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
              {selectedMainCategory === 'shoes' && ['รองเท้าแฟชั่น'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
              {selectedMainCategory === 'beauty' && ['เครื่องสำอาง', 'น้ำหอม', 'สกินแคร์'].map((sub) => (
                <button key={sub} onClick={() => setSelectedSubCategory(sub)} className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${selectedSubCategory === sub ? 'bg-indigo-600 text-white shadow-sm' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'}`}>{sub}</button>
              ))}
            </div>
          )}

          {/* รายการสินค้า + ตะกร้าด้านขวา */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <section className="lg:col-span-3">
              <div className="flex justify-between items-center mb-5">
                <h2 className="text-base font-bold text-slate-800 border-l-4 border-indigo-600 pl-3">
                  {searchTerm ? `ผลการค้นหา "${searchTerm}"` : 'คอลเลกชันสินค้าแนะนำ'}
                </h2>
                <span className="text-slate-500 text-xs">พบ {filteredProducts.length} รายการ</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      onClick={() => setSelectedProduct(product)}
                      className="bg-white border border-slate-200 rounded-3xl overflow-hidden hover:shadow-xl hover:border-indigo-300 transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="relative overflow-hidden h-52 bg-slate-50">
                        <img
                          src={product.images[0]}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                        {/* Tag Badge */}
                        <div className="absolute top-3 left-3 flex gap-1.5">
                          <span className="bg-slate-900/80 backdrop-blur-md text-white text-[10px] font-bold px-2.5 py-1 rounded-xl">
                            {product.subCategory}
                          </span>
                          {product.badge && (
                            <span className={`text-[10px] font-black px-2 py-1 rounded-xl text-white shadow-sm flex items-center gap-0.5 ${
                              product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                            }`}>
                              <Zap className="w-3 h-3 fill-current" /> {product.badge}
                            </span>
                          )}
                        </div>

                        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="bg-white text-slate-900 text-xs font-bold px-3.5 py-2 rounded-2xl shadow-xl flex items-center gap-1.5">
                            <Eye className="w-4 h-4 text-indigo-600" /> ดูรายละเอียด
                          </span>
                        </div>
                      </div>

                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-bold text-slate-800 text-sm line-clamp-2 leading-snug">{product.name}</h3>
                          <div className="flex items-center gap-1.5 mt-2 text-amber-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-slate-800">{product.rating}</span>
                            <span className="text-slate-400 text-[11px] ml-1">ขายแล้ว {product.sold} ชิ้น</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-3 border-t border-slate-100">
                          <div>
                            <span className="text-indigo-600 font-black text-base block">฿{product.price.toLocaleString()}</span>
                            {product.originalPrice && (
                              <span className="text-slate-400 text-[10px] line-through">฿{product.originalPrice.toLocaleString()}</span>
                            )}
                          </div>
                          <button
                            onClick={(e) => addToCart(product, e)}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2.5 rounded-2xl transition shadow-md shadow-indigo-100 hover:scale-105 active:scale-95"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-white border border-slate-200 p-12 text-center rounded-3xl shadow-sm">
                  <p className="text-slate-500 text-sm">ไม่พบสินค้าที่คุณต้องการ</p>
                </div>
              )}
            </section>

            {/* 🛒 ตะกร้าสินค้าด้านขวา (ดีไซน์คลีน ลบสินค้าได้ทันที) */}
            <aside className="bg-white border border-slate-200 p-5 rounded-3xl h-fit sticky top-20 space-y-4 shadow-sm">
              <h2 className="text-sm font-bold border-b border-slate-100 pb-3 text-slate-800 flex items-center justify-between">
                <span>ตะกร้าสินค้า</span>
                <span className="text-xs bg-indigo-50 text-indigo-600 font-bold px-2.5 py-0.5 rounded-full">{cart.length}</span>
              </h2>

              {cart.length === 0 ? (
                <p className="text-slate-400 text-xs text-center py-8">ไม่มีสินค้าในตะกร้า</p>
              ) : (
                <div className="space-y-4">
                  <div className="space-y-3 max-h-80 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="bg-slate-50 border border-slate-100 p-3 rounded-2xl flex items-center justify-between gap-3">
                        <img src={item.image} alt="" className="w-12 h-12 object-cover rounded-xl shrink-0" />
                        
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold text-slate-800 text-xs truncate">{item.name}</p>
                          <p className="text-indigo-600 font-bold text-xs mt-0.5">฿{(item.price * item.quantity).toLocaleString()}</p>
                          
                          <div className="flex items-center gap-2 mt-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="bg-white hover:bg-slate-200 p-1 rounded-md border border-slate-200 text-slate-600 transition">
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="text-xs font-bold text-slate-700 w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="bg-white hover:bg-slate-200 p-1 rounded-md border border-slate-200 text-slate-600 transition">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>

                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-slate-400 hover:text-red-500 p-2 rounded-xl hover:bg-red-50 transition shrink-0"
                          title="ลบออกจากตะกร้า"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-slate-100 space-y-3">
                    <div className="flex justify-between font-bold text-slate-800 text-sm">
                      <span>ราคารวมทั้งหมด:</span>
                      <span className="text-indigo-600 font-black text-base">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-indigo-100"
                    >
                      ยืนยันการสั่งซื้อ
                    </button>
                  </div>
                </div>
              )}
            </aside>
          </div>
        </main>
      )}

      {/* MODAL ดูรายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="h-64 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200">
                <img src={selectedProduct.images[0]} alt="" className="w-full h-full object-cover" />
              </div>

              <div className="space-y-4 flex flex-col justify-between">
                <div className="space-y-2">
                  <span className="text-[11px] bg-indigo-50 text-indigo-600 font-bold px-2.5 py-1 rounded-lg">
                    {selectedProduct.subCategory}
                  </span>
                  <h2 className="text-base font-bold text-slate-900 leading-snug">{selectedProduct.name}</h2>
                  <div className="flex items-center gap-2 text-amber-500 text-xs">
                    <Star className="w-4 h-4 fill-current" />
                    <span className="font-bold text-slate-800">{selectedProduct.rating}</span>
                    <span className="text-slate-400 ml-1">ขายแล้ว {selectedProduct.sold} ชิ้น</span>
                  </div>
                  <p className="text-2xl font-black text-indigo-600 pt-1">฿{selectedProduct.price.toLocaleString()}</p>
                </div>

                <p className="text-xs text-slate-500 leading-relaxed border-t border-slate-100 pt-2">{selectedProduct.description}</p>

                <button
                  onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-2xl font-bold text-xs transition shadow-md shadow-indigo-100 flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" /> เพิ่มลงตะกร้าสินค้า
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
