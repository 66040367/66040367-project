'use client';

import React, { useState, useMemo } from 'react';
import { 
  Search, ShoppingCart, Heart, Star, Zap, X, Plus, Trash2, ArrowLeft, CheckCircle2, Truck
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

// 1. หมวดหมู่หลักและหมวดย่อยตรงตามบรีฟ
const CATEGORY_STRUCTURE = [
  {
    id: 'fashion',
    name: '👗 เสื้อผ้า',
    subs: ['เสื้อผ้า ผญ', 'เสื้อผ้าผู้ชาย', 'เสื้อผ้าเด็ก', 'รองเท้า', 'กระเป๋า', 'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)']
  },
  {
    id: 'it',
    name: '💻 อุปกรณ์ ไอที',
    subs: ['โทรศัพท์', 'แท็บเล็ต (MacBook)', 'คอมพิวเตอร์', 'ไมค์เล่นเกม', 'หูฟังเล่นเกม', 'คีย์บอร์ดเล่นเกม', 'จอคอม', 'CPU', 'RAM', 'คอมประกอบ']
  },
  {
    id: 'beauty',
    name: '💄 เครื่องสำอาง',
    subs: ['บลัชออน', 'ลิป', 'รองพื้น', 'คอนซีลเลอร์', 'ครีมทาหน้าหรือเซรั่ม', 'ครีมทาผิว', 'ครีมกันแดดทั้งหน้าและตัว']
  },
  {
    id: 'food',
    name: '🍱 ของกิน',
    subs: ['มาม่า', 'ขนมที่สามารถส่งพัสดุได้', 'อาหารบรรจุภัณฑ์']
  },
  {
    id: 'toys',
    name: '🧸 ของเล่น',
    subs: ['ของเล่นรวม']
  },
  {
    id: 'decor',
    name: '🏠 ของตกแต่ง',
    subs: ['โต๊ะคอม', 'กระจก', 'ไฟ LED', 'ตุ๊กตา/พรม/ของแต่งห้อง']
  }
];

// รูปภาพจำลองสำหรับแต่ละหมวดย่อย
const SAMPLE_IMAGES: Record<string, string> = {
  'เสื้อผ้า ผญ': 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&q=80',
  'เสื้อผ้าผู้ชาย': 'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=600&q=80',
  'เสื้อผ้าเด็ก': 'https://images.unsplash.com/photo-1519238263530-99bdd11df2ea?w=600&q=80',
  'รองเท้า': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&q=80',
  'กระเป๋า': 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&q=80',
  'อุปกรณ์อื่นๆ (กำไล/สร้อย/แหวน)': 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=600&q=80',
  'โทรศัพท์': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=80',
  'แท็บเล็ต (MacBook)': 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80',
  'คอมพิวเตอร์': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
  'ไมค์เล่นเกม': 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600&q=80',
  'หูฟังเล่นเกม': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&q=80',
  'คีย์บอร์ดเล่นเกม': 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80',
  'จอคอม': 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=600&q=80',
  'CPU': 'https://images.unsplash.com/photo-1555680202-c86f0e12f086?w=600&q=80',
  'RAM': 'https://images.unsplash.com/photo-1562976540-1502c2145186?w=600&q=80',
  'คอมประกอบ': 'https://images.unsplash.com/photo-1587202372775-e229f172b9d7?w=600&q=80',
  'บลัชออน': 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=600&q=80',
  'ลิป': 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&q=80',
  'รองพื้น': 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&q=80',
  'คอนซีลเลอร์': 'https://images.unsplash.com/photo-1599733589046-10c005739ef9?w=600&q=80',
  'ครีมทาหน้าหรือเซรั่ม': 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80',
  'ครีมทาผิว': 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=600&q=80',
  'ครีมกันแดดทั้งหน้าและตัว': 'https://images.unsplash.com/photo-1608248597261-833250005a76?w=600&q=80',
  'มาม่า': 'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&q=80',
  'ขนมที่สามารถส่งพัสดุได้': 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&q=80',
  'อาหารบรรจุภัณฑ์': 'https://images.unsplash.com/photo-1582293041079-7814c2f12063?w=600&q=80',
  'ของเล่นรวม': 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=600&q=80',
  'โต๊ะคอม': 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&q=80',
  'กระจก': 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=600&q=80',
  'ไฟ LED': 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&q=80',
  'ตุ๊กตา/พรม/ของแต่งห้อง': 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=600&q=80',
};

// 2. Data Factory สร้างสินค้ามากกว่า 35 ชิ้น ต่อหมวดย่อย
const GENERATED_PRODUCTS: ProductItem[] = (() => {
  const list: ProductItem[] = [];
  let idCounter = 1;

  CATEGORY_STRUCTURE.forEach((cat) => {
    cat.subs.forEach((sub) => {
      const baseImg = SAMPLE_IMAGES[sub] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80';
      for (let i = 1; i <= 35; i++) {
        const price = Math.floor(190 + (i * 120) + (sub.length * 55));
        list.push({
          id: idCounter++,
          name: `${sub} Lalana367 Special Edition Vol.${i}`,
          mainCategory: cat.id,
          subCategory: sub,
          price: price,
          originalPrice: Math.floor(price * 1.3),
          rating: Number((4.2 + (i % 8) * 0.1).toFixed(1)),
          reviewsCount: 100 + i * 12,
          sold: 250 + i * 18,
          image: baseImg,
          badge: i % 4 === 0 ? 'HOT' : i % 6 === 0 ? 'SALE' : i % 9 === 0 ? 'NEW' : undefined,
          spec: `สินค้าแท้ 100% ประกันศูนย์ Lalana367 • Premium Quality #${i}`
        });
      }
    });
  });

  return list;
})();

export default function StorePage() {
  const [activeMainCat, setActiveMainCat] = useState<string>('fashion');
  const [activeSubCat, setActiveSubCat] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  const [cart, setCart] = useState<{ product: ProductItem; quantity: number }[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: { product: ProductItem; quantity: number }[]; total: number } | null>(null);

  const currentSubCategories = useMemo(() => {
    const found = CATEGORY_STRUCTURE.find(c => c.id === activeMainCat);
    return found ? found.subs : [];
  }, [activeMainCat]);

  const filteredProducts = useMemo(() => {
    return GENERATED_PRODUCTS.filter((item) => {
      const matchCat = item.mainCategory === activeMainCat;
      const matchSub = activeSubCat === 'all' || item.subCategory === activeSubCat;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.subCategory.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSub && matchSearch;
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

  // 🟢 หน้าจอเมื่อสั่งซื้อสำเร็จ (Success View)
  if (completedOrder) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 font-sans">
        <div className="max-w-2xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-500/30">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white">ชำระเงินเรียบร้อย สั่งซื้อสำเร็จ!</h1>
            <p className="text-emerald-400 text-sm font-semibold flex items-center justify-center gap-2">
              <Truck className="w-4 h-4" /> พนักงานกำลังจัดส่งพัสดุ ขอบคุณที่อุดหนุนร้าน Lalana367
            </p>
          </div>

          <div className="border-t border-b border-slate-800 py-4 max-h-60 overflow-y-auto space-y-3 pr-2">
            {completedOrder.items.map(({ product, quantity }) => (
              <div key={product.id} className="flex items-center justify-between gap-4 bg-slate-950/60 p-3 rounded-2xl border border-slate-800/80">
                <div className="flex items-center gap-3">
                  <img src={product.image} alt={product.name} className="w-12 h-12 rounded-xl object-cover" />
                  <div>
                    <h4 className="font-bold text-xs text-white line-clamp-1">{product.name}</h4>
                    <p className="text-[11px] text-slate-400">จำนวน: {quantity} ชิ้น</p>
                  </div>
                </div>
                <span className="font-black text-indigo-400 text-sm">฿{(product.price * quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center px-2">
            <span className="text-slate-400 text-sm font-bold">ยอดเงินที่ชำระทั้งหมด:</span>
            <span className="text-2xl font-black text-emerald-400">฿{completedOrder.total.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setCompletedOrder(null)}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3.5 rounded-2xl transition-all shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" /> ย้อนกลับไปเลือกซื้อสินค้า
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20">
      
      {/* 🟢 HEADER / NAVBAR */}
      <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between gap-4">
          
          {/* Logo ร้าน Lalana367 */}
          <div className="flex items-center gap-2.5 cursor-pointer" onClick={() => { setActiveSubCat('all'); setSearchQuery(''); }}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-rose-500 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-500/30">
              L
            </div>
            <div>
              <span className="text-xl font-black bg-gradient-to-r from-indigo-400 via-rose-400 to-pink-400 bg-clip-text text-transparent">
                Lalana367
              </span>
              <span className="text-[9px] font-bold text-slate-500 block tracking-widest -mt-1">PREMIUM STORE</span>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl relative hidden md:block">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ค้นหาสินค้า เสื้อผ้า, จอคอม, ลิป, มาม่า, โต๊ะคอม..."
              className="w-full bg-slate-800/80 text-slate-100 pl-11 pr-10 py-2.5 rounded-2xl text-xs border border-slate-700/60 focus:border-rose-500 focus:outline-none transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Cart Button */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700/60 transition-all active:scale-95"
          >
            <ShoppingCart className="w-5 h-5" />
            {totalCartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900 shadow-md">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* 🟢 MAIN STORE AREA */}
      <main className="max-w-7xl mx-auto px-4 pt-6">
        
        {/* หมวดหมู่หลักทั้ง 7 */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none border-b border-slate-800/80 mb-4">
          {CATEGORY_STRUCTURE.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { setActiveMainCat(cat.id); setActiveSubCat('all'); }}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                activeMainCat === cat.id
                  ? 'bg-gradient-to-r from-indigo-600 to-rose-600 text-white shadow-lg shadow-indigo-600/30 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        {/* หมวดย่อย */}
        <div className="flex items-center gap-2 overflow-x-auto pb-3 scrollbar-none mb-6">
          <button
            onClick={() => setActiveSubCat('all')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeSubCat === 'all'
                ? 'bg-white text-slate-950 font-bold'
                : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            ย่อยทั้งหมด ({filteredProducts.length})
          </button>
          {currentSubCategories.map((sub) => (
            <button
              key={sub}
              onClick={() => setActiveSubCat(sub)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeSubCat === sub
                  ? 'bg-rose-500 text-white font-bold'
                  : 'bg-slate-900/80 text-slate-400 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              {sub} (35+)
            </button>
          ))}
        </div>

        {/* ตารางแสดงสินค้า */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredProducts.map((product) => (
            <div
              key={product.id}
              onClick={() => setSelectedProduct(product)}
              className="bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden hover:border-rose-500/50 hover:shadow-xl hover:shadow-rose-500/10 transition-all duration-300 cursor-pointer group flex flex-col justify-between"
            >
              <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                />

                <div className="absolute top-2 left-2 flex gap-1 z-10">
                  <span className="bg-slate-950/80 backdrop-blur-md text-slate-300 text-[9px] font-bold px-2 py-0.5 rounded-md border border-slate-800">
                    {product.subCategory}
                  </span>
                  {product.badge && (
                    <span className={`text-[9px] font-black px-1.5 py-0.5 rounded-md text-white flex items-center gap-0.5 ${
                      product.badge === 'HOT' ? 'bg-rose-500' : product.badge === 'SALE' ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}>
                      <Zap className="w-2.5 h-2.5 fill-current" /> {product.badge}
                    </span>
                  )}
                </div>
              </div>

              <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                <div>
                  <h3 className="font-bold text-slate-200 text-xs line-clamp-2 leading-snug group-hover:text-rose-400 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-[10px] text-slate-500 line-clamp-1 mt-1">
                    {product.spec}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1 text-amber-400 text-[10px] mb-2">
                    <Star className="w-3 h-3 fill-current" />
                    <span className="font-bold text-slate-200">{product.rating}</span>
                    <span className="text-slate-500">({product.reviewsCount} รีวิว)</span>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                    <div>
                      <span className="text-rose-400 font-black text-sm block">
                        ฿{product.price.toLocaleString()}
                      </span>
                      <span className="text-slate-600 text-[9px] line-through block -mt-1">
                        ฿{product.originalPrice.toLocaleString()}
                      </span>
                    </div>
                    <button
                      onClick={(e) => addToCart(product, e)}
                      className="bg-rose-600 hover:bg-rose-500 text-white p-2 rounded-xl transition-all shadow-md active:scale-90"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* 🟢 MODAL รายละเอียดสินค้า */}
      {selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl relative border border-slate-800">
            <button
              onClick={() => setSelectedProduct(null)}
              className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white z-10"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="aspect-square w-full bg-slate-950 relative">
              <img src={selectedProduct.image} alt={selectedProduct.name} className="w-full h-full object-cover" />
            </div>

            <div className="p-6 space-y-4">
              <div>
                <span className="bg-rose-500/20 text-rose-400 text-xs font-bold px-2.5 py-1 rounded-lg border border-rose-500/30">
                  {selectedProduct.subCategory}
                </span>
                <h2 className="text-lg font-bold text-white mt-2">{selectedProduct.name}</h2>
                <p className="text-xs text-slate-400 mt-1">{selectedProduct.spec}</p>
              </div>

              <div className="flex items-center justify-between py-3 border-y border-slate-800">
                <div>
                  <span className="text-slate-500 text-xs">ราคาพิเศษ Lalana367</span>
                  <div className="text-2xl font-black text-rose-400">฿{selectedProduct.price.toLocaleString()}</div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-amber-400 text-xs font-bold">
                    <Star className="w-4 h-4 fill-current" /> {selectedProduct.rating} / 5.0
                  </div>
                  <span className="text-xs text-slate-500">ยอดขายแล้ว {selectedProduct.sold} ชิ้น</span>
                </div>
              </div>

              <button
                onClick={() => { addToCart(selectedProduct); setSelectedProduct(null); }}
                className="w-full bg-rose-600 hover:bg-rose-500 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-rose-600/30 transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-4 h-4" /> ใส่ตะกร้าสินค้า
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🟢 SIDEBAR ตะกร้าสินค้า */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border-l border-slate-800 w-full max-w-md h-full flex flex-col justify-between p-6 shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <h2 className="font-extrabold text-base text-white flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-rose-400" /> ตะกร้า Lalana367 ({totalCartCount})
                </h2>
                <button onClick={() => setIsCartOpen(false)} className="p-2 text-slate-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 space-y-3 overflow-y-auto max-h-[60vh] pr-1">
                {cart.length === 0 ? (
                  <p className="text-center text-slate-500 py-16 text-xs">ไม่มีสินค้าในตะกร้า</p>
                ) : (
                  cart.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center justify-between gap-3 p-3 bg-slate-950/80 rounded-2xl border border-slate-800">
                      <img src={product.image} className="w-12 h-12 rounded-xl object-cover" />
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-xs text-slate-200 truncate">{product.name}</h4>
                        <span className="text-rose-400 font-black text-xs">฿{(product.price * quantity).toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-400">x{quantity}</span>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1.5 text-slate-500 hover:text-rose-400 transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-400">ราคารวมทั้งหมด:</span>
                <span className="text-xl font-black text-rose-400">฿{totalCartPrice.toLocaleString()}</span>
              </div>
              <button
                disabled={cart.length === 0}
                onClick={handleCheckout}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-800 disabled:text-slate-600 text-white font-bold py-3.5 rounded-2xl shadow-lg shadow-emerald-600/20 transition-all"
              >
                ยืนยันการสั่งซื้อและชำระเงิน
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
