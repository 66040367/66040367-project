'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Star, Zap, X, Plus, Minus, Trash2, ArrowLeft, CheckCircle2, Truck, ShoppingBag, ShieldCheck, Heart, Sparkles, Filter, ChevronRight, Gift
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
}

const CATEGORY_STRUCTURE = [
  { id: 'fashion', name: 'เสื้อผ้าและแฟชั่น' },
  { id: 'it', name: 'อุปกรณ์ไอที & เกมมิ่ง' },
  { id: 'beauty', name: 'เครื่องสำอาง & สกินแคร์' },
  { id: 'home', name: 'ของแต่งบ้าน & ไลฟ์สไตล์' },
];

// 📸 คลังรูปภาพสินค้าจริง คัดสรรแบบ HD ตรงปก 100%
const REAL_PRODUCT_IMAGES: Record<string, string[]> = {
  fashion: [
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1489987707025-afc232f7ea0f?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600&auto=format&fit=crop&q=80',
  ],
  it: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80', // Smartphone
    'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80', // MacBook
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80', // Headphones
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80', // Keyboard
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&auto=format&fit=crop&q=80', // Monitor
    'https://images.unsplash.com/photo-1616588589676-62b3bd4ff6d2?w=600&auto=format&fit=crop&q=80', // Setup
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597261-83324467975b?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617897903246-719242758050?w=600&auto=format&fit=crop&q=80',
  ],
  home: [
    'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&auto=format&fit=crop&q=80',
  ]
};

// 📦 สร้างข้อมูลสินค้าตัวอย่างที่ดูเรียบหรูและสมจริง
const SAMPLE_PRODUCTS: ProductItem[] = [
  {
    id: 101,
    name: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    mainCategory: 'it',
    subCategory: 'โทรศัพท์',
    price: 48900,
    originalPrice: 52900,
    rating: 4.9,
    reviewsCount: 1280,
    sold: 3420,
    image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'ชิป A17 Pro ตัวเรือนไทเทเนียม น้ำหนักเบา กล้องซูม Optical 5 เท่า ปุ่ม Action Button ตอบสนองรวดเร็ว'
  },
  {
    id: 102,
    name: 'MacBook Air M3 15" - Space Grey 16GB / 512GB',
    mainCategory: 'it',
    subCategory: 'แท็บเล็ต (MacBook)',
    price: 54900,
    originalPrice: 58900,
    rating: 4.9,
    reviewsCount: 840,
    sold: 1950,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'หน้าจอ Liquid Retina 15.3 นิ้ว บางเบาพิเศษ แบตเตอรี่ใช้งานยาวนานสูงสุด 18 ชั่วโมง'
  },
  {
    id: 103,
    name: 'Sony WH-1000XM5 Wireless Noise Canceling Headphones',
    mainCategory: 'it',
    subCategory: 'หูฟัง',
    price: 13900,
    originalPrice: 15900,
    rating: 4.8,
    reviewsCount: 620,
    sold: 1200,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
    badge: 'SALE',
    spec: 'ระบบตัดเสียงรบกวนขั้นสูง พร้อมไมโครโฟน 8 ตัว เสียงคมชัดระดับ Hi-Res Audio'
  },
  {
    id: 104,
    name: 'Minimalist Mechanical Wireless Keyboard - Custom Edition',
    mainCategory: 'it',
    subCategory: 'คีย์บอร์ด',
    price: 3890,
    originalPrice: 4500,
    rating: 4.7,
    reviewsCount: 410,
    sold: 890,
    image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80',
    spec: 'คีย์บอร์ดไร้สายสวิตช์นุ่ม เสียงเงียบ สบายมือ ออกแบบมินิมอลสำหรับโต๊ะทำงานยุคใหม่'
  },
  {
    id: 201,
    name: 'Korean Style Silk Blouse - Soft Beige Collection',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้หญิง',
    price: 1290,
    originalPrice: 1890,
    rating: 4.8,
    reviewsCount: 530,
    sold: 2100,
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'เสื้อเชิ้ตผ้าไหมพรีเมียม สไตล์เกาหลี สวมใส่สบาย ระบายอากาศดี เหมาะกับทุกโอกาส'
  },
  {
    id: 202,
    name: 'Minimalist Pastel Summer Dress',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้หญิง',
    price: 1590,
    originalPrice: 2100,
    rating: 4.9,
    reviewsCount: 310,
    sold: 940,
    image: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=600&auto=format&fit=crop&q=80',
    badge: 'NEW',
    spec: 'ชุดเดรสสไตล์มินิมอล โทนสีพาสเทล ตัดเย็บประณีต ผ้าเนื้อนุ่ม ใส่สบายตลอดวัน'
  },
  {
    id: 203,
    name: 'Classic Urban Oversized Hoodie',
    mainCategory: 'fashion',
    subCategory: 'เสื้อผ้าผู้ชาย',
    price: 1890,
    originalPrice: 2400,
    rating: 4.7,
    reviewsCount: 780,
    sold: 3100,
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    spec: 'เสื้อฮู้ดดี้ทรงโอเวอร์ไซส์ ผ้าคอตตอนเกรดพรีเมียม นุ่ม อุ่น อบอุ่นสไตล์สตรีท'
  },
  {
    id: 301,
    name: 'Advanced Hydration Facial Serum 50ml',
    mainCategory: 'beauty',
    subCategory: 'เซรั่มบำรุงผิว',
    price: 2450,
    originalPrice: 3100,
    rating: 4.9,
    reviewsCount: 1560,
    sold: 4500,
    image: 'https://images.unsplash.com/photo-1608248597261-83324467975b?w=600&auto=format&fit=crop&q=80',
    badge: 'HOT',
    spec: 'เซรั่มฟื้นฟูผิวเข้มข้น เพิ่มความชุ่มชื้น ลดเลือนริ้วรอย ซึมซาบไว ไม่เหนียวเหนอะหนะ'
  },
  {
    id: 302,
    name: 'Velvet Matte Lipstick - Natural Rose Edition',
    mainCategory: 'beauty',
    subCategory: 'ลิปสติก',
    price: 890,
    originalPrice: 1200,
    rating: 4.8,
    reviewsCount: 920,
    sold: 2800,
    image: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
    spec: 'ลิปสติกเนื้อแมตต์กำมะหยี่ ติดทนนานตลอดวัน สีสวยชัด กลบสีปากมิด ชุ่มชื้นไม่แห้งตึง'
  },
  {
    id: 401,
    name: 'Warm LED Ambient Desk Lamp & Plant Setup',
    mainCategory: 'home',
    subCategory: 'ของตกแต่งห้อง',
    price: 1790,
    originalPrice: 2300,
    rating: 4.8,
    reviewsCount: 340,
    sold: 810,
    image: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?w=600&auto=format&fit=crop&q=80',
    spec: 'โคมไฟแต่งห้องอบอุ่น ปรับระดับความสว่างได้ ช่วยสร้างบรรยากาศผ่อนคลายและลดความเครียด'
  }
];

export default function StorePage() {
  const [activeMainCat, setActiveMainCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: { product: ProductItem; quantity: number }[]; total: number } | null>(null);

  const filteredProducts = useMemo(() => {
    return SAMPLE_PRODUCTS.filter((item) => {
      const matchMain = activeMainCat === 'all' || item.mainCategory === activeMainCat;
      const q = searchQuery.toLowerCase().trim();
      const matchSearch = !q || 
        item.name.toLowerCase().includes(q) ||
        item.spec.toLowerCase().includes(q) ||
        item.subCategory.toLowerCase().includes(q);

      return matchMain && matchSearch;
    });
  }, [activeMainCat, searchQuery]);

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
      <div className="min-h-screen bg-slate-50 text-slate-800 flex items-center justify-center p-4 sm:p-6 font-sans">
        <div className="max-w-xl w-full bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">สั่งซื้อสำเร็จ! (บำบัดความเครียดเรียบร้อย)</h1>
            <p className="text-slate-500 text-sm">
              คุณได้จำลองการสั่งซื้อสินค้าทั้งหมดนี้โดย <strong className="text-emerald-600">ไม่ต้องเสียเงินแม้แต่บาทเดียว</strong> 🎉
            </p>
          </div>

          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 space-y-3 max-h-60 overflow-y-auto">
            {completedOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-3 bg-white p-3 rounded-xl border border-slate-100">
                <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover border border-slate-200" />
                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{product.name}</h4>
                  <p className="text-xs text-slate-500">จำนวน: {quantity} ชิ้น</p>
                </div>
                <span className="font-extrabold text-slate-900 text-sm">฿0 (ปกติ ฿{(product.price * quantity).toLocaleString()})</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2 py-2 border-t border-slate-100">
            <span className="text-slate-600 font-medium">มูลค่าสินค้ารวมที่คุณประหยัดได้:</span>
            <span className="text-2xl font-black text-emerald-600">฿{completedOrder.total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold py-3.5 rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" /> กลับไปเลือกสินค้าต่อ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans pb-20">
      
      {/* 🔴 BANNER บอกจุดประสงค์เว็บไซต์ ( Shopping Therapy ) */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-slate-900 text-white py-2.5 px-4 text-center text-xs sm:text-sm font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-4 h-4 text-amber-300" />
        <span><strong>Lalana367 Shopping Therapy:</strong> สั่งซื้อสินค้าที่คุณอยากได้ฟรี 100% เพื่อความเพลิดเพลินและลดความเครียด</span>
      </div>

      {/* 🟢 HEADER */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => { setActiveMainCat('all'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black text-xl shadow-md">
              L
            </div>
            <div>
              <span className="text-xl font-black tracking-tight text-slate-900 block">
                Lalana367
              </span>
              <span className="text-[10px] font-bold text-slate-400 block -mt-1 tracking-wider uppercase">
                Free Shopping Store
              </span>
            </div>
          </div>

          {/* ค้นหา */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า เช่น iPhone, ชุดเดรส, เซรั่ม..."
              className="w-full bg-slate-100 text-slate-800 pl-10 pr-8 py-2.5 rounded-xl text-sm font-medium border border-slate-200 focus:outline-none focus:border-slate-400 transition-all placeholder:text-slate-400"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* ปุ่มตะกร้า */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2.5 rounded-xl font-bold text-sm shadow-md hover:bg-slate-800 transition-all cursor-pointer relative"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">ตะกร้าสินค้า</span>
            {totalCartCount > 0 && (
              <span className="bg-rose-500 text-white text-xs font-black px-2 py-0.5 rounded-full">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-8">
        
        {/* HERO BANNER - สไตล์คลีนเรียบหรู */}
        <div className="relative mb-10 rounded-3xl overflow-hidden bg-gradient-to-r from-slate-900 to-indigo-950 text-white p-8 sm:p-12 shadow-lg">
          <div className="max-w-xl space-y-4">
            <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 px-3 py-1 rounded-full text-xs font-bold">
              <Gift className="w-3.5 h-3.5" /> ช้อปฟรีไม่มีค่าใช้จ่าย
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
              เลือกซื้อสิ่งที่คุณปรารถนา เติมเต็มความสุขโดยไม่ต้องกังวล
            </h1>
            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              จำลองประสบการณ์การช้อปปิ้งแบบเรียลลิสติก ช่วยผ่อนคลายความเครียด เลือกหยิบสินค้าใส่ตะกร้าและกดสั่งซื้อได้ทันที
            </p>
          </div>
        </div>

        {/* 🏷️ หมวดหมู่สินค้าหลัก */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3 text-slate-500 text-xs font-bold uppercase tracking-wider">
            <Filter className="w-3.5 h-3.5" /> เลือกหมวดหมู่สินค้า
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            <button
              onClick={() => setActiveMainCat('all')}
              className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeMainCat === 'all'
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              สินค้าทั้งหมด
            </button>

            {CATEGORY_STRUCTURE.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveMainCat(cat.id)}
                className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeMainCat === cat.id
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* 🛍️ GRID ตารางสินค้า */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden hover:shadow-xl hover:border-slate-300 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-slate-100 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />

                {product.badge && (
                  <span className={`absolute top-3 left-3 text-[11px] font-extrabold px-2.5 py-1 rounded-md text-white shadow-sm ${
                    product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}>
                    {product.badge}
                  </span>
                )}
              </div>

              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <span className="text-[11px] font-bold text-slate-400 block mb-1 uppercase tracking-wider">
                    {product.subCategory}
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-amber-500 text-xs mb-2">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="font-bold text-slate-700">{product.rating}</span>
                    <span className="text-slate-400">({product.reviewsCount})</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div>
                      <span className="text-slate-900 font-extrabold text-base sm:text-lg block">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-slate-400 text-xs line-through block -mt-1">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="bg-slate-900 hover:bg-slate-800 text-white p-2 rounded-xl transition-all shadow-sm cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🟢 SIDEBAR ตะกร้าสินค้า */}
      <div 
        className={`fixed inset-0 z-50 flex justify-end bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsCartOpen(false)}
      >
        <div 
          onClick={(e) => e.stopPropagation()}
          className={`bg-white border-l border-slate-200 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl transition-transform duration-300 ${
            isCartOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h2 className="font-extrabold text-lg text-slate-900 flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-indigo-600" /> ตะกร้าสินค้าของคุณ ({totalCartCount})
              </h2>
              <button onClick={() => setIsCartOpen(false)} className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mt-4 space-y-3 overflow-y-auto max-h-[65vh] pr-1">
              {cart.length === 0 ? (
                <div className="text-center text-slate-400 py-20 text-sm space-y-2">
                  <ShoppingBag className="w-10 h-10 mx-auto text-slate-300" />
                  <p>ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                cart.map(({ product, quantity }) => (
                  <div key={product.id} className="flex items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200">
                    <img src={product.image} className="w-12 h-12 rounded-lg object-cover shrink-0 border border-slate-200" />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-xs text-slate-800 truncate">{product.name}</h4>
                      <span className="text-slate-900 font-extrabold text-sm block mt-0.5">฿{(product.price * quantity).toLocaleString()}</span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <div className="flex items-center bg-white rounded-lg border border-slate-200 p-1">
                        <button onClick={() => updateQuantity(product.id, -1)} className="p-0.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold text-slate-800">{quantity}</span>
                        <button onClick={() => updateQuantity(product.id, 1)} className="p-0.5 text-slate-500 hover:text-slate-800 cursor-pointer">
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <button onClick={() => removeFromCart(product.id)} className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold">
              <span className="text-slate-600">มูลค่าสินค้ารวม:</span>
              <span className="text-xl font-black text-slate-900">฿{totalCartPrice.toLocaleString()}</span>
            </div>
            <button
              disabled={cart.length === 0}
              onClick={handleCheckout}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold text-base py-3.5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-5 h-5" /> สั่งซื้อเลย (ช้อปฟรี 100%)
            </button>
          </div>
        </div>
      </div>

      {/* 🟢 POPUP รายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-100">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/80 backdrop-blur-md text-slate-500 hover:text-slate-800 z-10 cursor-pointer shadow-sm"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="aspect-square w-full bg-slate-100 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="bg-slate-100 text-slate-600 text-xs font-bold px-2.5 py-1 rounded-md">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-lg font-bold text-slate-900 mt-2 leading-snug">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-500 mt-2 leading-relaxed">{selectedProduct.spec}</p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-100">
                <div>
                  <span className="text-slate-400 text-[11px] font-semibold block">ราคาประเมิน</span>
                  <div className="text-2xl font-black text-slate-900">฿{selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-500 text-xs font-bold">
                    <Star className="w-3.5 h-3.5 fill-current" /> {selectedProduct.rating}
                  </div>
                  <span className="text-xs text-slate-400">ขายแล้ว {selectedProduct.sold} ชิ้น</span>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-base py-3.5 rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingCart className="w-5 h-5" /> หยิบใส่ตะกร้า
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
