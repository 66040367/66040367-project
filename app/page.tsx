'use client';

import React, { useState, useMemo } from 'react';
import { 
  ShoppingBag, Search, Trash2, Plus, Minus, X, CheckCircle2, 
  CreditCard, Truck, ArrowLeft, Star, Sparkles, QrCode, 
  Banknote, Tag, ShieldCheck, Zap, Heart
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

const CATEGORIES = ['ทั้งหมด', 'สกินแคร์ & บิวตี้', 'ไอที & แก็ดเจ็ต', 'แฟชั่น & ไลฟ์สไตล์', 'ของแต่งบ้าน', 'อุปกรณ์เกมมิ่ง'];

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'LLN367 Hydrating Glow Serum 30ml',
    category: 'สกินแคร์ & บิวตี้',
    price: 1290,
    rating: 4.9,
    reviews: 210,
    badge: 'BESTSELLER',
    image: 'https://images.unsplash.com/photo-1617897903246-719242758050?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 2,
    name: 'Pro Wireless ANC Headphones',
    category: 'ไอที & แก็ดเจ็ต',
    price: 4590,
    rating: 4.8,
    reviews: 145,
    badge: 'HOT',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 3,
    name: 'Minimalist Leather Tote Bag',
    category: 'แฟชั่น & ไลฟ์สไตล์',
    price: 2890,
    rating: 4.7,
    reviews: 89,
    badge: 'NEW',
    image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 4,
    name: 'Nordic Ceramic Coffee Set',
    category: 'ของแต่งบ้าน',
    price: 850,
    rating: 4.9,
    reviews: 112,
    badge: 'POPULAR',
    image: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 5,
    name: 'RGB Mechanical Gaming Keyboard',
    category: 'อุปกรณ์เกมมิ่ง',
    price: 3490,
    rating: 4.9,
    reviews: 178,
    badge: 'GAMER CHICE',
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 6,
    name: 'Gentle Deep Cleansing Foam 150ml',
    category: 'สกินแคร์ & บิวตี้',
    price: 650,
    rating: 4.8,
    reviews: 320,
    badge: 'SALE',
    image: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 7,
    name: 'Smart Watch Fitness Tracker Pro',
    category: 'ไอที & แก็ดเจ็ต',
    price: 3290,
    rating: 4.6,
    reviews: 95,
    badge: 'RECOMMENDED',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 8,
    name: 'Classic Polarized Sunglasses',
    category: 'แฟชั่น & ไลฟ์สไตล์',
    price: 1490,
    rating: 4.9,
    reviews: 164,
    badge: 'MUST HAVE',
    image: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 9,
    name: 'Ultrasonic Aroma Diffuser 500ml',
    category: 'ของแต่งบ้าน',
    price: 1190,
    rating: 4.7,
    reviews: 104,
    badge: 'ORGANIC',
    image: 'https://images.unsplash.com/photo-1608248597263-0007999659b0?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 10,
    name: 'Ultra-Precision Wireless Gaming Mouse',
    category: 'อุปกรณ์เกมมิ่ง',
    price: 2190,
    rating: 4.8,
    reviews: 86,
    badge: 'FAST',
    image: 'https://images.unsplash.com/photo-1615663245857-ac93bb7c39e7?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 11,
    name: 'Rosewater Facial Mist Spray 100ml',
    category: 'สกินแคร์ & บิวตี้',
    price: 490,
    rating: 4.7,
    reviews: 73,
    badge: 'FRESH',
    image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?q=80&w=600&auto=format&fit=crop'
  },
  {
    id: 12,
    name: 'Portable Bluetooth Speaker HD Sound',
    category: 'ไอที & แก็ดเจ็ต',
    price: 1890,
    rating: 4.8,
    reviews: 210,
    badge: 'BEST BASS',
    image: 'https://images.unsplash.com/photo-1545454675-3531b543be5d?q=80&w=600&auto=format&fit=crop'
  }
];

const FREE_SHIPPING_THRESHOLD = 1000;

// ==========================================
// 2. Main Component
// ==========================================
export default function StoreApp() {
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [viewState, setViewState] = useState<'shop' | 'checkout' | 'success'>('shop');

  // Discount Code State
  const [couponCode, setCouponCode] = useState('');
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState('');

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

  // Apply Coupon
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (couponCode.toUpperCase() === 'LLN367') {
      setDiscountAmount(100);
      setCouponError('');
    } else {
      setCouponError('โค้ดไม่ถูกต้อง (ลองใช้โค้ด: LLN367)');
    }
  };

  // Shipping Fee Logic
  const shippingFee = totalCartPrice >= FREE_SHIPPING_THRESHOLD || totalCartPrice === 0 ? 0 : 50;
  const finalTotalPrice = Math.max(0, totalCartPrice - discountAmount + shippingFee);

  // Free shipping progress calculation
  const freeShippingProgress = Math.min(100, (totalCartPrice / FREE_SHIPPING_THRESHOLD) * 100);
  const remainingForFreeShipping = FREE_SHIPPING_THRESHOLD - totalCartPrice;

  // Handle Checkout Submit
  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrderId = 'LLN-' + Math.floor(100000 + Math.random() * 900000);
    setOrderDetails({
      id: newOrderId,
      total: finalTotalPrice,
      items: [...cart]
    });

    setCart([]);
    setDiscountAmount(0);
    setCouponCode('');
    setViewState('success');
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-900 font-sans antialiased">
      
      {/* Top Banner */}
      <div className="bg-slate-950 text-amber-400 text-xs py-2 px-4 text-center font-medium tracking-wide flex items-center justify-center gap-2">
        <Sparkles size={14} /> 
        <span>ฉลองเปิดร้านใหม่ **LLN367** ใส่โค้ด <strong className="underline bg-amber-400/20 px-1.5 py-0.5 rounded text-amber-300">LLN367</strong> ลดทันที ฿100!</span>
      </div>

      {/* Header / Navbar */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Logo */}
          <button 
            onClick={() => setViewState('shop')}
            className="text-2xl font-extrabold tracking-tighter text-slate-900 flex items-center gap-1.5"
          >
            <div className="w-9 h-9 bg-slate-900 text-amber-400 font-black flex items-center justify-center rounded-xl shadow-md">
              L
            </div>
            <span>LLN<span className="text-amber-600 font-light">367</span></span>
          </button>

          {/* Search Bar */}
          <div className="flex-1 max-w-md relative">
            <input 
              type="text" 
              placeholder="ค้นหาสินค้า เช่น สกินแคร์, หูฟัง, เกมมิ่ง..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-100/80 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-600 focus:bg-white transition-all shadow-inner"
            />
            <Search className="absolute left-3.5 top-3 text-slate-400" size={16} />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                <X size={14} />
              </button>
            )}
          </div>

          {/* Cart Icon Button */}
          <button 
            onClick={() => setIsCartOpen(true)}
            className="relative p-3 bg-slate-900 text-white rounded-2xl hover:bg-amber-700 transition shadow-md active:scale-95 flex items-center gap-2"
          >
            <ShoppingBag size={18} />
            <span className="text-xs font-bold hidden sm:inline">ตะกร้า</span>
            {totalCartCount > 0 && (
              <span className="bg-amber-500 text-slate-950 text-[11px] font-black w-5 h-5 rounded-full flex items-center justify-center border-2 border-slate-900">
                {totalCartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ========================================== */}
      {/* VIEW 1: SHOP CATALOG                      */}
      {/* ========================================== */}
      {viewState === 'shop' && (
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Hero Banner */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-slate-950 via-slate-900 to-amber-950 text-white p-8 md:p-12 shadow-xl flex flex-col justify-center">
            <div className="relative z-10 max-w-xl space-y-4">
              <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 text-xs px-3 py-1 rounded-full border border-amber-500/30 font-medium">
                <Zap size={13} className="text-amber-400" /> Official Store
              </span>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight leading-tight">
                LLN367 SELECTS<br/>
                <span className="text-amber-400 font-light">สินค้าคัดสรร คุณภาพพรีเมียม</span>
              </h1>
              <p className="text-xs md:text-sm text-slate-300 font-light leading-relaxed">
                ยกระดับไลฟ์สไตล์ด้วยสินค้าแก็ดเจ็ต สกินแคร์ และของแต่งบ้านที่ตอบโจทย์ชีวิตยุคใหม่
              </p>
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 overflow-x-auto pb-2 w-full sm:w-auto scrollbar-none">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat
                      ? 'bg-slate-900 text-amber-400 shadow-md scale-105'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <span className="text-xs text-slate-500">
              พบทั้งหมด <strong className="text-slate-900 font-bold">{filteredProducts.length}</strong> รายการ
            </span>
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-3xl p-16 text-center border border-slate-200 space-y-3 shadow-sm">
              <Search size={40} className="mx-auto text-slate-300" />
              <p className="text-slate-600 font-semibold text-sm">ไม่พบสินค้าที่คุณกำลังค้นหา "{searchQuery}"</p>
              <button 
                onClick={() => { setSelectedCategory('ทั้งหมด'); setSearchQuery(''); }}
                className="text-xs bg-slate-900 text-white px-4 py-2 rounded-xl font-medium"
              >
                ล้างการค้นหา
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.id}
                  className="group bg-white rounded-3xl border border-slate-200/80 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-square bg-slate-100 overflow-hidden">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                    />
                    <span className="absolute top-3 left-3 bg-slate-950/80 backdrop-blur-md text-amber-400 text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-full shadow-md">
                      {product.badge}
                    </span>
                  </div>

                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] uppercase font-bold text-amber-700 tracking-wider">{product.category}</span>
                      <h3 className="text-sm font-bold text-slate-900 line-clamp-2 leading-snug">
                        {product.name}
                      </h3>

                      <div className="flex items-center gap-1 pt-1">
                        <Star size={13} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-slate-900">{product.rating}</span>
                        <span className="text-[10px] text-slate-400">({product.reviews} รีวิว)</span>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                      <div>
                        <span className="text-[10px] text-slate-400 block uppercase font-medium">ราคา</span>
                        <span className="text-base font-extrabold text-slate-900">฿{product.price.toLocaleString()}</span>
                      </div>

                      <button 
                        onClick={() => addToCart(product)}
                        className="bg-slate-900 hover:bg-amber-600 text-white hover:text-slate-950 text-xs px-3.5 py-2.5 rounded-2xl flex items-center gap-1.5 font-bold transition active:scale-90 shadow-sm"
                      >
                        <Plus size={15} />
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
            className="flex items-center gap-2 text-xs font-bold text-slate-600 hover:text-slate-900 mb-6 transition"
          >
            <ArrowLeft size={16} /> กลับไปเลือกสินค้าเพิ่มเติม
          </button>

          <h2 className="text-2xl font-black text-slate-900 mb-6">หน้าสั่งซื้อและชำระเงิน (LLN367)</h2>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            
            {/* Form Details */}
            <div className="md:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
              <form onSubmit={handleCheckoutSubmit} id="checkout-form" className="space-y-4">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2">
                  1. ข้อมูลการจัดส่งสินค้า
                </h3>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">ชื่อ-นามสกุล ผู้รับ</label>
                    <input 
                      required
                      type="text" 
                      placeholder="สมชาย ใจดี"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">เบอร์โทรศัพท์ติดต่อ</label>
                    <input 
                      required
                      type="tel" 
                      placeholder="081-234-5678"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-600"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 mb-1 font-bold">ที่อยู่จัดส่งโดยละเอียด</label>
                    <textarea 
                      required
                      rows={3}
                      placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล, เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="w-full px-4 py-3 border border-slate-200 rounded-2xl focus:outline-none focus:border-amber-600"
                    />
                  </div>
                </div>

                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-2 pt-4">
                  2. เลือกช่องทางชำระเงิน
                </h3>

                <div className="space-y-2 text-xs">
                  <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${formData.paymentMethod === 'qr' ? 'border-amber-600 bg-amber-50/50 font-bold' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="qr" 
                      checked={formData.paymentMethod === 'qr'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'qr' })}
                    />
                    <QrCode size={20} className="text-slate-800" />
                    <div>
                      <span className="block text-slate-900">สแกน QR Code (PromptPay)</span>
                      <span className="text-[10px] text-slate-400 font-normal">ไม่มีค่าธรรมเนียม อนุมัติทันที</span>
                    </div>
                  </label>

                  <label className={`flex items-center gap-3 p-3.5 rounded-2xl border cursor-pointer transition ${formData.paymentMethod === 'cod' ? 'border-amber-600 bg-amber-50/50 font-bold' : 'border-slate-200'}`}>
                    <input 
                      type="radio" 
                      name="payment" 
                      value="cod" 
                      checked={formData.paymentMethod === 'cod'} 
                      onChange={() => setFormData({ ...formData, paymentMethod: 'cod' })}
                    />
                    <Banknote size={20} className="text-slate-800" />
                    <div>
                      <span className="block text-slate-900">เก็บเงินปลายทาง (COD)</span>
                      <span className="text-[10px] text-slate-400 font-normal">ชำระเงินสดเมื่อได้รับสินค้า</span>
                    </div>
                  </label>
                </div>
              </form>
            </div>

            {/* Order Summary */}
            <div className="md:col-span-5 bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col justify-between space-y-6">
              <div>
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 border-b border-slate-100 pb-3 mb-4">
                  สรุปรายการสั่งซื้อ
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
                  {cart.map((item) => (
                    <div key={item.id} className="flex justify-between items-center text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image} alt={item.name} className="w-10 h-10 object-cover rounded-xl" />
                        <div>
                          <p className="font-bold text-slate-900 line-clamp-1">{item.name}</p>
                          <p className="text-slate-400">จำนวน: {item.quantity}</p>
                        </div>
                      </div>
                      <span className="font-bold text-slate-900">฿{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-slate-100 pt-4 mt-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>ราคาสินค้า</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>ส่วนลด (โค้ด LLN367)</span>
                      <span>-฿{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-slate-600">
                    <span>ค่าจัดส่ง</span>
                    <span>{shippingFee === 0 ? 'ฟรี (ส่งฟรี)' : '฿50'}</span>
                  </div>
                  <div className="flex justify-between font-black text-base text-slate-900 pt-3 border-t border-slate-100">
                    <span>ยอดรวมสุทธิ</span>
                    <span className="text-amber-700">฿{finalTotalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                form="checkout-form"
                className="w-full bg-slate-950 hover:bg-amber-600 text-white hover:text-slate-950 py-3.5 rounded-2xl font-black text-xs tracking-wider uppercase transition active:scale-95 shadow-xl"
              >
                ชำระเงินและยืนยันคำสั่งซื้อ
              </button>
            </div>

          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* VIEW 3: ORDER SUCCESS                     */}
      {/* ========================================== */}
      {viewState === 'success' && orderDetails && (
        <main className="max-w-md mx-auto px-4 py-16 text-center">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-2xl space-y-6">
            <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 size={44} />
            </div>

            <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900">สั่งซื้อสำเร็จ!</h2>
              <p className="text-xs text-slate-500">ขอบคุณที่ร่วมช้อปกับ **LLN367 Official Store**</p>
            </div>

            <div className="bg-slate-50 p-5 rounded-2xl text-left text-xs space-y-2.5 border border-slate-100">
              <div className="flex justify-between">
                <span className="text-slate-500">รหัสการสั่งซื้อ:</span>
                <span className="font-extrabold text-slate-900">{orderDetails.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">ชื่อผู้รับ:</span>
                <span className="font-bold text-slate-800">{formData.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">วิธีการชำระ:</span>
                <span className="font-bold text-slate-800 uppercase">{formData.paymentMethod}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 pt-2 font-black text-sm text-slate-900">
                <span>ยอดเงินสุทธิ:</span>
                <span className="text-amber-700">฿{orderDetails.total.toLocaleString()}</span>
              </div>
            </div>

            <button 
              onClick={() => setViewState('shop')}
              className="w-full bg-slate-950 hover:bg-slate-800 text-white text-xs py-3.5 rounded-2xl font-bold transition"
            >
              กลับไปหน้าแรกเพื่อช้อปต่อ
            </button>
          </div>
        </main>
      )}

      {/* ========================================== */}
      {/* ULTRA-LUXURY CART DRAWER                   */}
      {/* ========================================== */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 animate-in slide-in-from-right duration-300">
            
            {/* Header */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-slate-900 text-amber-400 rounded-xl flex items-center justify-center font-black text-xs">
                    L
                  </div>
                  <h3 className="font-black text-slate-900 text-sm">ตะกร้าสินค้า LLN367 ({totalCartCount})</h3>
                </div>
                <button 
                  onClick={() => setIsCartOpen(false)} 
                  className="p-1 text-slate-400 hover:text-slate-900 rounded-lg transition"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Free Shipping Progress Bar */}
              <div className="bg-amber-50 p-3.5 rounded-2xl border border-amber-200/60 mt-4 space-y-2">
                <div className="flex justify-between items-center text-[11px] font-bold text-slate-800">
                  <span className="flex items-center gap-1">
                    <Truck size={14} className="text-amber-700" />
                    {remainingForFreeShipping <= 0 ? (
                      <span className="text-emerald-700 font-extrabold">🎉 คุณได้รับสิทธิ์ส่งฟรีแล้ว!</span>
                    ) : (
                      <span>ซื้ออีก <strong className="text-amber-800">฿{remainingForFreeShipping.toLocaleString()}</strong> เพื่อส่งฟรี</span>
                    )}
                  </span>
                  <span className="text-amber-800 font-black">{Math.round(freeShippingProgress)}%</span>
                </div>
                <div className="w-full bg-amber-200/60 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-amber-600 h-full transition-all duration-500 rounded-full"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Cart Items List */}
            <div className="flex-1 overflow-y-auto py-4 space-y-3 my-2 pr-1">
              {cart.length === 0 ? (
                <div className="text-center py-16 text-slate-400 text-xs space-y-3">
                  <ShoppingBag size={48} className="mx-auto text-slate-200" />
                  <p className="font-medium text-slate-500">ตะกร้าของคุณยังว่างอยู่</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="bg-slate-900 text-white text-[11px] px-4 py-2 rounded-xl font-bold"
                  >
                    เลือกซื้อสินค้าเลย
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3 bg-slate-50 p-3.5 rounded-2xl border border-slate-100/80 hover:border-slate-300 transition">
                    <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-xl shadow-sm" />
                    <div className="flex-1 flex flex-col justify-between text-xs">
                      <div className="flex justify-between items-start gap-1">
                        <h4 className="font-bold text-slate-900 line-clamp-1">{item.name}</h4>
                        <button onClick={() => removeFromCart(item.id)} className="text-slate-400 hover:text-red-500 transition">
                          <Trash2 size={14} />
                        </button>
                      </div>

                      <div className="flex justify-between items-center mt-2">
                        <span className="font-extrabold text-slate-900">฿{(item.price * item.quantity).toLocaleString()}</span>
                        
                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-slate-200 shadow-sm">
                          <button onClick={() => updateQuantity(item.id, -1)} className="text-slate-600 hover:text-slate-900">
                            <Minus size={12} />
                          </button>
                          <span className="font-bold text-xs w-4 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="text-slate-600 hover:text-slate-900">
                            <Plus size={12} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer Summary & Coupon & Checkout */}
            {cart.length > 0 && (
              <div className="border-t border-slate-100 pt-4 space-y-3">
                
                {/* Coupon Code Input */}
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <div className="relative flex-1">
                    <input 
                      type="text" 
                      placeholder="โค้ดส่วนลด (เช่น LLN367)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-none focus:border-amber-600 uppercase font-mono"
                    />
                    <Tag size={13} className="absolute left-2.5 top-2.5 text-slate-400" />
                  </div>
                  <button 
                    type="submit"
                    className="bg-slate-900 hover:bg-slate-800 text-white text-xs px-3.5 py-2 rounded-xl font-bold transition"
                  >
                    ใช้โค้ด
                  </button>
                </form>

                {couponError && <p className="text-[10px] text-red-500 font-medium">{couponError}</p>}
                {discountAmount > 0 && <p className="text-[10px] text-emerald-600 font-bold">✓ ใช้โค้ดสำเร็จ! ลดทันที ฿100</p>}

                {/* Pricing Summary */}
                <div className="space-y-1.5 text-xs text-slate-600 pt-1">
                  <div className="flex justify-between">
                    <span>ราคาสินค้ารวม:</span>
                    <span>฿{totalCartPrice.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-emerald-600 font-bold">
                      <span>ส่วนลด:</span>
                      <span>-฿{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>ค่าจัดส่ง:</span>
                    <span>{shippingFee === 0 ? <strong className="text-emerald-600">ฟรี</strong> : `฿${shippingFee}`}</span>
                  </div>
                  <div className="flex justify-between font-black text-base text-slate-900 pt-2 border-t border-slate-100">
                    <span>ยอดรวมทั้งหมด:</span>
                    <span className="text-amber-700">฿{finalTotalPrice.toLocaleString()}</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setIsCartOpen(false);
                    setViewState('checkout');
                  }}
                  className="w-full bg-slate-950 hover:bg-amber-600 text-white hover:text-slate-950 text-xs py-3.5 rounded-2xl font-black tracking-wider uppercase transition shadow-lg active:scale-95"
                >
                  ชำระเงิน (฿{finalTotalPrice.toLocaleString()})
                </button>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
