'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Trash2, Plus, Minus, X, CheckCircle2, 
  CreditCard, Truck, ArrowLeft, ChevronRight, Star, ShieldCheck, 
  QrCode, Banknote, Sparkles, Filter
} from 'lucide-react';

// ==========================================
// 1. Interfaces & Mock Data
// ==========================================
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  rating: number;
  reviews: number;
  badge: string;
  image: string;
}

interface CartItem extends Product {
  quantity: number;
}

const CATEGORIES = ['ทั้งหมด', 'สกินแคร์', 'ไอที & แก็ดเจ็ต', 'แฟชั่น & กระเป๋า', 'ของแต่งบ้าน'];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LUXE Hydrating Glow Serum 30ml',
    category: 'สกินแคร์',
    price: 1290,
    rating: 4.9,
    reviews: 184,
    badge: 'ขายดี',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Wireless Noise-Canceling Headphones',
    category: 'ไอที & แก็ดเจ็ต',
    price: 4590,
    rating: 4.8,
    reviews: 92,
    badge: 'แนะนำ',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Minimalist Leather Shoulder Bag',
    category: 'แฟชั่น & กระเป๋า',
    price: 2890,
    rating: 4.7,
    reviews: 65,
    badge: 'ใหม่',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Nordic Ceramic Coffee Set',
    category: 'ของแต่งบ้าน',
    price: 850,
    rating: 4.9,
    reviews: 110,
    badge: 'ยอดนิยม',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'Gentle Deep Cleansing Foam 150ml',
    category: 'สกินแคร์',
    price: 650,
    rating: 4.8,
    reviews: 230,
    badge: 'ลดราคา',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Smart Fitness Tracker Watch v2',
    category: 'ไอที & แก็ดเจ็ต',
    price: 3290,
    rating: 4.6,
    reviews: 78,
    badge: 'ฮิต',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 7,
    name: 'Classic Polarized Sunglasses',
    category: 'แฟชั่น & กระเป๋า',
    price: 1490,
    rating: 4.9,
    reviews: 142,
    badge: 'แนะนำ',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8,
    name: 'Aromatic Essential Oil Diffuser',
    category: 'ของแต่งบ้าน',
    price: 1190,
    rating: 4.7,
    reviews: 88,
    badge: 'ออร์แกนิก',
    image: 'https://images.unsplash.com/photo-1608248597263-0007999659b0?q=80&w=600&auto=format&fit=crop'
  }
];

// ==========================================
// 2. Main Component
// ==========================================
export default function StoreApp() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewState, setViewState] = useState<'shop' | 'checkout' | 'success'>('shop');

  // Checkout Form State
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'qr'
  });

  const [orderDetails, setOrderDetails] = useState<{ id: string; total: number; items: CartItem[] } | null>(null);

  // Filter Products
  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter((p) => {
      const matchCat = selectedCategory === 'ทั้งหมด' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  // Cart Functions
  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
    setIsCartOpen(true);
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

  const totalCartPrice = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [cart]);

  const totalCartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  // Handle Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    setOrderDetails({
      id: newOrderId,
      total: totalCartPrice + (totalCartPrice > 1000 ? 0 : 50),
      items: [...cart]
    });

    setCart([]);
    setViewState('success');
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] text-slate-800 font-sans antialiased">
      
      {/* Top Banner */}
      <div className="bg-slate-900 text-slate-200 text-xs py-2 text-center tracking-wider font-light">
        🎁 ต้อนรับสมาชิกร้านค้าใหม่! ช้อปครบ 1,000 บาท ส่งฟรีทั่วประเทศ
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-30 bg-[#FDFBF7]/90 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <button 
            onClick={() => setViewState('shop')}
            className="text-2xl font-serif font-bold tracking-widest text-slate-900 flex items-center gap-1"
          >
            NORDIC<span className="text-amber-700 font-light">STORE</span>
          </button>

          {/* Search Bar */}
          <div className="hidden md:flex relative w-80">
            <input 
              type="text" 
              placeholder="ค้นหาสินค้าที่ต้องการ..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs bg-slate-100 border border-slate-200 rounded-full focus:outline-none focus:border-amber-700 focus:bg-white transition"
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={15} />
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 bg-white border border-slate-200 rounded-full text-slate-800 hover:border-slate-400 transition shadow-sm"
            >
              <ShoppingBag size={18} />
              {totalCartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-amber-700 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                  {totalCartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* ========================================== */}
      {/* VIEW 1: SHOP / CATALOG                     */}
      {/* ========================================== */}
      {viewState === 'shop' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
          
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-slate-900 text-white p-8 md:p-14 shadow-2xl flex flex-col justify-center">
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30">
                <Sparkles size={13} /> คอลเลกชันใหม่ล่าสุด 2026
              </span>
              <h1 className="text-3xl md:text-5xl font-serif font-medium leading-tight">
                ดีไซน์พรีเมียม ตอบโจทย์ชีวิตสไตล์มินิมอล
              </h1>
              <p className="text-xs md:text-sm text-slate-300">
                คัดสรรสินค้าคุณภาพสูง ตั้งแต่สกินแคร์ แฟชั่น ไปจนถึงอุปกรณ์ไอทีสุดล้ำ
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-4 border-b border-slate-200 pb-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-medium whitespace-nowrap transition ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-white shadow-md'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              พบสินค้าทั้งหมด <strong className="text-slate-900">{filteredProducts.length}</strong> รายการ
            </span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <p className="text-slate-500 text-sm">ไม่พบสินค้าในหมวดหมู่นี้</p>
              <button 
                onClick={() => { setSelectedCategory('ทั้งหมด'); setSearchQuery(''); }}
                className="text-xs text-amber-700 underline font-medium"
              >
                ดูสินค้าทั้งหมด
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-2xl border border-slate-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <span className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm text-slate-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full shadow-sm">
                      {product.badge}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[11px] text-amber-800 font-medium">{product.category}</span>
                      <h3 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-800">{product.rating}</span>
                        <span className="text-[10px] text-slate-400">({product.reviews} รีวิว)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase">ราคา</span>
                        <span className="text-base font-bold text-slate-900">฿{product.price.toLocaleString()}</span>
                      </div>

                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-slate-900 hover:bg-amber-800 text-white text-xs px-3.5 py-2 rounded-xl flex items-center gap-1.5 transition active:scale-95 shadow-sm"
                      >
                        <Plus size={14} />
                        <span>ใส่ตะกร้า</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </main>
      )}

      {/* ========================================== */}
      {/* VIEW 2: CHECKOUT FORM                      */}
      {/* ========================================== */}
      {viewState === 'checkout' && (
        <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
          <button 
            onClick={() => setViewState('shop')}
            className="flex items-center gap-2 text-xs text-slate-500 hover:text-slate-900 mb-6 transition"
          >
            <ArrowLeft size={16} /> ย้อนกลับไปเลือกสินค้า
          </button>

          <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6">หน้าสั่งซื้อและชำระเงิน</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Details */}
            <div className="md:col-span-7 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-6">
              <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2">
                  1. ข้อมูลการจัดส่ง
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ชื่อ-นามสกุล ผู้รับ</label>
                    <input 
                      required
                      type="text" 
                      placeholder="สมชาย ใจดี"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">เบอร์โทรศัพท์</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="081-234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-700"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1 font-medium">ที่อยู่จัดส่งโดยละเอียด</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:outline-none focus:border-amber-700"
                    />
                  </div>
                </div>

                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-2 pt-4">
                  2. วิธีการชำระเงิน
                </h3>

                <div className="space-y-2 text-xs">
                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${formData.paymentMethod === 'qr' ? 'border-amber-700 bg-amber-50/50' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="qr" 
                      checked={formData.paymentMethod === 'qr'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'qr' })}
                    />
                    <QrCode size={18} className="text-slate-700" />
                    <div>
                      <span className="font-semibold block">สแกน QR Code (PromptPay)</span>
                      <span className="text-[10px] text-slate-400">ชำระสะดวก ไม่มีค่าธรรมเนียม</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-amber-700 bg-amber-50/50' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    />
                    <Banknote size={18} className="text-slate-700" />
                    <div>
                      <span className="font-semibold block">เก็บเงินปลายทาง (COD)</span>
                      <span className="text-[10px] text-slate-400">ชำระเงินเมื่อได้รับสินค้า</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-5 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 border-b border-slate-100 pb-3 mb-4">
                  สรุปรายการสั่งซื้อ
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-2">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-lg" />
                        <div>
                          <p className="font-semibold text-slate-800 line-clamp-1">{item.name}</p>
                          <p className="text-slate-400">x{item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-semibold text-slate-900">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>ราคาสินค้ารวม</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>ค่าจัดส่ง</span>
                    <span>{totalCartPrice > 1000 ? 'ฟรี' : '฿50'}</span>
                  </div>
                  <div className="flex justify-between font-bold text-sm text-slate-900 pt-2 border-t border-slate-100">
                    <span>ยอดรวมสุทธิ</span>
                    <span className="text-amber-800">฿{(totalCartPrice + (totalCartPrice > 1000 ? 0 : 50)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-slate-900 hover:bg-amber-800 text-white py-3 rounded-xl font-bold text-xs tracking-wider uppercase transition shadow-lg"
              >
                ยืนยันสั่งซื้อสินค้า
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* VIEW 3: ORDER SUCCESS                     */}
      {/* ========================================== */}
      {viewState === 'success' && orderDetails && (
        <main className="max-w-xl mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xl space-y-6">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-serif font-bold text-slate-900">การสั่งซื้อสำเร็จ!</h2>
              <p className="text-xs text-slate-500">ขอบคุณที่เลือกช้อปกับ NORDIC STORE</p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl text-left text-xs space-y-2 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">หมายเลขคำสั่งซื้อ:</span>
                <span className="font-bold text-slate-900">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ผู้รับ:</span>
                <span className="font-semibold text-slate-800">{formData.name} ({formData.phone})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ชำระโดย:</span>
                <span className="font-semibold text-slate-800 uppercase">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-slate-900">
                <span>ยอดเงินรวมที่ชำระ:</span>
                <span className="text-amber-800">฿{orderDetails.total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setViewState('shop')}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs py-3 rounded-xl font-bold transition"
            >
              กลับไปหน้าแรกเพื่อช้อปต่อ
            </button>
          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* CART DRAWER (SLIDE-OVER)                   */}
      {/* ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-amber-800" />
                <h3 className="font-bold text-slate-900 text-sm">ตะกร้าสินค้าของคุณ ({totalCartCount})</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-slate-400 hover:text-slate-900">
                <X size={20} />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-4">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-slate-400 text-xs space-y-2">
                  <ShoppingBag size={32} className="mx-auto text-slate-300" />
                  <p>ยังไม่มีสินค้าในตะกร้า</p>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-slate-50 p-3 rounded-xl border border-slate-100">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg" />
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-slate-800 line-clamp-1">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-bold text-slate-900">฿{(item.price * item.quantity).toLocaleString()}</span>
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-lg border border-slate-200">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-500 hover:text-slate-900">
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-500 hover:text-slate-900">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Checkout Button */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-4">
                <div className="flex justify-between text-sm font-bold text-slate-900">
                  <span>ราคารวมทั้งหมด:</span>
                  <span className="text-amber-800">฿{totalCartPrice.toLocaleString()}</span>
                </div>
                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setViewState('checkout');
                  }}
                  className="w-full bg-slate-900 hover:bg-amber-800 text-white text-xs py-3 rounded-xl font-bold tracking-wider uppercase transition shadow-md"
                >
                  ไปที่หน้าสั่งซื้อและชำระเงิน
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
