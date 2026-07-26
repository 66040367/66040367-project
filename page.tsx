'use client';

import React, { useState } from 'react';
import { ShoppingCart, Search, Star, Plus, Trash2, X, CheckCircle2, Truck, ArrowLeft, Filter } from 'lucide-react';

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  sold: number;
  category: string;
  subCategory: string;
  image: string;
}

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

// ฐานข้อมูลสินค้าจำลอง (ปรับเป็นหมวดย่อยละ 50 รายการ!)
const GENERATE_PRODUCTS = (): Product[] => {
  const categories = [
    { main: 'clothing', subs: ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย', 'เสื้อผ้าเด็ก'] },
    { main: 'electronics', subs: ['หูฟัง & ลำโพง', 'สมาร์ตวอทช์', 'อุปกรณ์ไอที'] },
    { main: 'lifestyle', subs: ['กระเป๋า', 'รองเท้า', 'เครื่องประดับ'] },
  ];

  const images = [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=500&q=80',
    'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500&q=80',
    'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=500&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&q=80',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&q=80',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80',
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&q=80',
  ];

  let list: Product[] = [];
  let idCounter = 1;

  categories.forEach((cat) => {
    cat.subs.forEach((sub) => {
      // ปรับเป็น 50 ตัวเลือกต่อหมวดย่อย!
      for (let i = 1; i <= 50; i++) {
        list.push({
          id: idCounter,
          name: `${sub} LALANA Premium Collection (แบบที่ ${i})`,
          price: Math.floor(Math.random() * 1800) + 199,
          rating: Number((Math.random() * (5.0 - 4.2) + 4.2).toFixed(1)),
          sold: Math.floor(Math.random() * 3000) + 10,
          category: cat.main,
          subCategory: sub,
          image: images[idCounter % images.length],
        });
        idCounter++;
      }
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
  
  const [isCheckoutSuccess, setIsCheckoutSuccess] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<{ items: CartItem[]; total: number } | null>(null);

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { id: product.id, name: product.name, price: product.price, quantity: 1, image: product.image }];
    });
  };

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const filteredProducts = ALL_PRODUCTS.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase().trim());
    const matchesMainCat = selectedMainCategory === 'all' || product.category === selectedMainCategory;
    const matchesSubCat = selectedSubCategory === 'all' || product.subCategory === selectedSubCategory;
    return matchesSearch && matchesMainCat && matchesSubCat;
  });

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setCompletedOrder({ items: [...cart], total: totalPrice });
    setIsCheckoutSuccess(true);
    setCart([]);
  };

  const handleResetOrder = () => {
    setIsCheckoutSuccess(false);
    setCompletedOrder(null);
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 font-sans selection:bg-red-600 selection:text-white">
      <header className="bg-neutral-900 border-b border-red-900/40 sticky top-0 z-50 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setSearchTerm(''); setSelectedMainCategory('all'); setSelectedSubCategory('all'); }}>
            <div className="bg-red-600 text-black font-black px-3 py-1 rounded text-xl tracking-tighter transform -skew-x-12">
              LALANA
            </div>
            <span className="text-xl font-bold tracking-widest text-white">367</span>
          </div>

          <div className="flex-1 max-w-xl relative">
            <input
              type="text"
              placeholder="ค้นหาสินค้าแฟชั่น ไอที ไลฟ์สไตล์..."
              className="w-full py-2.5 pl-4 pr-10 rounded-lg bg-neutral-800 border border-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:border-red-500 transition"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm ? (
              <X className="absolute right-3 top-3 text-neutral-400 w-5 h-5 cursor-pointer hover:text-white" onClick={() => setSearchTerm('')} />
            ) : (
              <Search className="absolute right-3 top-3 text-neutral-400 w-5 h-5" />
            )}
          </div>

          <div className="relative cursor-pointer p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 transition">
            <ShoppingCart className="w-6 h-6 text-red-500" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-black rounded-full h-5 w-5 flex items-center justify-center animate-bounce">
                {cart.reduce((a, b) => a + b.quantity, 0)}
              </span>
            )}
          </div>
        </div>
      </header>

      {isCheckoutSuccess && completedOrder ? (
        <main className="max-w-3xl mx-auto px-4 py-12">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-2xl text-center space-y-6 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-red-500 to-black"></div>
            
            <div className="inline-flex p-4 bg-red-950/50 rounded-full border border-red-500/30 text-red-500 mb-2">
              <CheckCircle2 className="w-16 h-16 animate-pulse" />
            </div>

            <h2 className="text-3xl font-extrabold text-white">สั่งซื้อสินค้าสำเร็จ!</h2>
            
            <div className="bg-neutral-950 border border-neutral-800 p-4 rounded-xl flex items-center justify-center gap-3 text-red-400">
              <Truck className="w-6 h-6 animate-bounce" />
              <span className="font-semibold text-lg">สถานะ: กำลังจัดส่ง 🚚</span>
            </div>

            <div className="text-left space-y-4 pt-4 border-t border-neutral-800">
              <h3 className="font-bold text-neutral-300 text-lg">รายการสินค้าของคุณ:</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                {completedOrder.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between bg-neutral-950 p-3 rounded-lg border border-neutral-800">
                    <div className="flex items-center gap-3">
                      <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                      <div>
                        <p className="font-semibold text-sm text-neutral-200 line-clamp-1">{item.name}</p>
                        <p className="text-xs text-neutral-400">จำนวน: {item.quantity} ชิ้น</p>
                      </div>
                    </div>
                    <span className="font-bold text-red-500">฿{(item.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center text-xl font-black pt-4 border-t border-neutral-800 text-white">
                <span>ราคารวมทั้งหมด:</span>
                <span className="text-red-500">฿{completedOrder.total.toLocaleString()}</span>
              </div>
            </div>

            <button
              onClick={handleResetOrder}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-red-900/30"
            >
              <ArrowLeft className="w-5 h-5" /> กลับไปเลือกซื้อสินค้าต่อ
            </button>
          </div>
        </main>
      ) : (
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-wrap gap-2 mb-4 border-b border-neutral-800 pb-4">
            <button
              onClick={() => { setSelectedMainCategory('all'); setSelectedSubCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                selectedMainCategory === 'all'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              🔥 สินค้าทั้งหมด (450)
            </button>
            <button
              onClick={() => { setSelectedMainCategory('clothing'); setSelectedSubCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                selectedMainCategory === 'clothing'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              👕 หมวดเสื้อผ้า (150)
            </button>
            <button
              onClick={() => { setSelectedMainCategory('electronics'); setSelectedSubCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                selectedMainCategory === 'electronics'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              🎧 หมวดไอที & สมาร์ตไอเทม (150)
            </button>
            <button
              onClick={() => { setSelectedMainCategory('lifestyle'); setSelectedSubCategory('all'); }}
              className={`px-4 py-2 rounded-lg font-bold text-sm transition ${
                selectedMainCategory === 'lifestyle'
                  ? 'bg-red-600 text-white'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              👟 หมวดไลฟ์สไตล์ & แฟชั่น (150)
            </button>
          </div>

          {selectedMainCategory !== 'all' && (
            <div className="flex flex-wrap gap-2 mb-6 bg-neutral-900 p-3 rounded-xl border border-neutral-800 items-center">
              <span className="text-neutral-400 text-sm font-semibold flex items-center gap-1">
                <Filter className="w-4 h-4 text-red-500" /> หมวดย่อย:
              </span>
              <button
                onClick={() => setSelectedSubCategory('all')}
                className={`px-3 py-1 rounded text-xs font-bold transition ${
                  selectedSubCategory === 'all'
                    ? 'bg-red-950 text-red-400 border border-red-800'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                ทั้งหมด
              </button>
              {selectedMainCategory === 'clothing' &&
                ['เสื้อผ้าผู้หญิง', 'เสื้อผ้าผู้ชาย', 'เสื้อผ้าเด็ก'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      selectedSubCategory === sub
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sub} (50)
                  </button>
                ))}
              {selectedMainCategory === 'electronics' &&
                ['หูฟัง & ลำโพง', 'สมาร์ตวอทช์', 'อุปกรณ์ไอที'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      selectedSubCategory === sub
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sub} (50)
                  </button>
                ))}
              {selectedMainCategory === 'lifestyle' &&
                ['กระเป๋า', 'รองเท้า', 'เครื่องประดับ'].map((sub) => (
                  <button
                    key={sub}
                    onClick={() => setSelectedSubCategory(sub)}
                    className={`px-3 py-1 rounded text-xs font-bold transition ${
                      selectedSubCategory === sub
                        ? 'bg-red-950 text-red-400 border border-red-800'
                        : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    {sub} (50)
                  </button>
                ))}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <section className="lg:col-span-3">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-black text-white tracking-wide border-l-4 border-red-600 pl-3">
                  {searchTerm ? `ผลการค้นหา "${searchTerm}"` : 'รายการสินค้า'}
                </h2>
                <span className="text-neutral-400 text-sm">พบ {filteredProducts.length} รายการ</span>
              </div>

              {filteredProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
                  {filteredProducts.map((product) => (
                    <div
                      key={product.id}
                      className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden hover:border-red-900/60 transition group flex flex-col justify-between"
                    >
                      <div className="relative overflow-hidden h-48">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 bg-neutral-950/80 text-neutral-300 text-[10px] font-bold px-2 py-0.5 rounded border border-neutral-700">
                          {product.subCategory}
                        </span>
                      </div>
                      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                        <div>
                          <h3 className="font-semibold text-neutral-200 text-sm line-clamp-2">{product.name}</h3>
                          <div className="flex items-center gap-1 mt-2 text-yellow-500 text-xs">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            <span className="font-bold text-neutral-300">{product.rating}</span>
                            <span className="text-neutral-500 ml-2">ขายแล้ว {product.sold} ชิ้น</span>
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t border-neutral-800">
                          <span className="text-red-500 font-extrabold text-lg">฿{product.price.toLocaleString()}</span>
                          <button
                            onClick={() => addToCart(product)}
                            className="bg-red-600 hover:bg-red-700 text-white p-2 rounded-lg transition shadow-lg shadow-red-900/20"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="bg-neutral-900 border border-neutral-800 p-12 text-center rounded-2xl">
                  <p className="text-neutral-400 text-lg">ไม่พบสินค้าที่คุณกำลังมองหา</p>
                </div>
              )}
            </section>

            <aside className="bg-neutral-900 border border-neutral-800 p-5 rounded-2xl h-fit sticky top-24 space-y-4 shadow-xl">
              <h2 className="text-lg font-bold border-b border-neutral-800 pb-3 text-white flex items-center justify-between">
                <span>ตะกร้าของคุณ</span>
                <span className="text-xs text-red-500 font-semibold">{cart.length} รายการ</span>
              </h2>

              {cart.length === 0 ? (
                <p className="text-neutral-500 text-sm text-center py-8">ไม่มีสินค้าในตะกร้า</p>
              ) : (
                <div className="space-y-3">
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm border-b border-neutral-800 pb-2">
                        <div className="flex-1 pr-2">
                          <p className="font-medium text-neutral-200 truncate text-xs">{item.name}</p>
                          <p className="text-neutral-400 text-xs">฿{item.price} x {item.quantity}</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-neutral-500 hover:text-red-500 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="pt-3 border-t border-neutral-800 space-y-3">
                    <div className="flex justify-between font-extrabold text-white text-base">
                      <span>ราคารวม:</span>
                      <span className="text-red-500">฿{totalPrice.toLocaleString()}</span>
                    </div>
                    <button
                      onClick={handleCheckout}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-xl font-extrabold transition shadow-lg shadow-red-900/40"
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
    </div>
  );
}
